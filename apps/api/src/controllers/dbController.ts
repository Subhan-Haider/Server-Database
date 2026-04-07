import { FastifyRequest, FastifyReply } from 'fastify';
import DataDocument from '../models/DataDocument';
import { RulesEngine, Operation } from '../services/RulesEngine';
import { io } from '../app';
import { UsageTracker } from '../services/UsageTracker';
import { SchemaValidator } from '../services/SchemaValidator';
import { AuditLogger } from '../utils/AuditLogger';
import { WebhookService } from '../services/WebhookService';
import { IProject } from '../models/Project';
import mongoose from 'mongoose';

const evaluateRules = async (req: any, operation: Operation, params: { collection: string, docId?: string, currentData?: any, newData?: any }) => {
    const project = req.project;
    if (!project) throw new Error('Project context missing');

    const rules = project.rules?.get(params.collection) || project.rules?.get('*') || 'allow read, write: if false;';
    
    const context = {
        auth: req.user || null,
        resource: { data: params.currentData || {} },
        request: {
            data: params.newData || {},
            auth: req.user || null,
            path: `/${params.collection}${params.docId ? `/${params.docId}` : ''}`,
            method: req.method
        }
    };

    const allowed = RulesEngine.evaluate(rules, operation, context);
    if (!allowed) throw new Error('Permission denied by security rules');
};

export const createDocument = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const { collection } = req.params as any;
        const data = req.body as any;
        const project = (req as any).project as IProject;

        await evaluateRules(req, 'create', { collection, newData: data });

        const schema = project.schemas instanceof Map ? project.schemas.get(collection) : (project.schemas as any)[collection];
        if (schema) {
            const validation = SchemaValidator.validate(schema, data);
            if (!validation.success) throw new Error(`Schema validation failed: ${validation.error}`);
        }

        const doc = new DataDocument({
            projectId: project._id,
            collectionName: collection,
            data
        });

        await doc.save();

        if (project.billing?.usage) {
            await mongoose.model('Project').updateOne(
                { _id: project._id },
                { $inc: { 'billing.usage.writes': 1 } }
            );
        }

        if (project.auditLogs) {
            await AuditLogger.log({
                projectId: project._id as string,
                userId: (req as any).user?._id,
                action: 'create',
                resource: `db:${collection}`,
                newData: data
            });
        }

        io.to(`${project._id}:${collection}`).emit(`${collection}:created`, doc);
        WebhookService.trigger(project._id.toString(), 'document.created', { collection, data: doc });

        reply.code(201).send(doc);
    } catch (err: any) {
        reply.code(403).send({ error: err.message });
    }
};

export const getDocument = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const { collection, id } = req.params as any;
        const project = (req as any).project as IProject;

        const doc = await DataDocument.findOne({ _id: id, projectId: project._id, collectionName: collection });
        if (!doc) return reply.code(404).send({ error: 'Document not found' });

        await evaluateRules(req, 'read', { collection, docId: id, currentData: doc.data });

        if (project.billing?.usage) {
            await mongoose.model('Project').updateOne(
                { _id: project._id },
                { $inc: { 'billing.usage.reads': 1 } }
            );
        }

        reply.send(doc);
    } catch (err: any) {
        reply.code(403).send({ error: err.message });
    }
};

export const updateDocument = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const { collection, id } = req.params as any;
        const newData = req.body as any;
        const project = (req as any).project as IProject;

        const doc = await DataDocument.findOne({ _id: id, projectId: project._id, collectionName: collection });
        if (!doc) return reply.code(404).send({ error: 'Document not found' });

        await evaluateRules(req, 'update', { collection, docId: id, currentData: doc.data, newData });

        const previousData = JSON.parse(JSON.stringify(doc.data));
        
        const schema = project.schemas instanceof Map ? project.schemas.get(collection) : (project.schemas as any)[collection];
        if (schema) {
            const validation = SchemaValidator.validate(schema, { ...(doc.data as object), ...newData });
            if (!validation.success) throw new Error(`Schema validation failed: ${validation.error}`);
        }

        doc.data = { ...(doc.data as object), ...newData };
        await doc.save();

        if (project.billing?.usage) {
            await mongoose.model('Project').updateOne(
                { _id: project._id },
                { $inc: { 'billing.usage.writes': 1 } }
            );
        }

        if (project.auditLogs) {
            await AuditLogger.log({
                projectId: project._id as string,
                userId: (req as any).user?._id,
                action: 'update',
                resource: `db:${collection}/${id}`,
                previousData,
                newData: doc.data
            });
        }

        io.to(`${project._id}:${collection}`).emit(`${collection}:updated`, doc);
        io.to(`${project._id}:${collection}:${id}`).emit('updated', doc);
        WebhookService.trigger(project._id.toString(), 'document.updated', { collection, id, data: doc });

        reply.send(doc);
    } catch (err: any) {
        reply.code(403).send({ error: err.message });
    }
};

export const deleteDocument = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const { collection, id } = req.params as any;
        const project = (req as any).project as IProject;

        const doc = await DataDocument.findOne({ _id: id, projectId: project._id, collectionName: collection });
        if (!doc) return reply.code(404).send({ error: 'Document not found' });

        await evaluateRules(req, 'delete', { collection, docId: id, currentData: doc.data });

        await DataDocument.deleteOne({ _id: id });

        if (project.billing?.usage) {
            await mongoose.model('Project').updateOne(
                { _id: project._id },
                { $inc: { 'billing.usage.writes': 1 } }
            );
        }

        io.to(`${project._id}:${collection}`).emit(`${collection}:deleted`, { id });
        io.to(`${project._id}:${collection}:${id}`).emit('updated', { id, deleted: true });
        WebhookService.trigger(project._id.toString(), 'document.deleted', { collection, id });

        reply.send({ success: true });
    } catch (err: any) {
        reply.code(403).send({ error: err.message });
    }
};

export const queryDocuments = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const { collection } = req.params as any;
        const query = (req.method === 'POST' ? req.body : req.query) as any || {};
        const project = (req as any).project as IProject;

        query.projectId = project._id;
        query.collectionName = collection;
        
        let limit = 100;
        let offset = 0;
        if (query.limit) {
            limit = parseInt(query.limit as string);
            delete query.limit;
        }
        if (query.offset) {
            offset = parseInt(query.offset as string);
            delete query.offset;
        }

        await evaluateRules(req, 'read', { collection });

        if (project.billing?.usage) {
            await mongoose.model('Project').updateOne(
                { _id: project._id },
                { $inc: { 'billing.usage.reads': 1 } }
            );
        }

        const docs = await DataDocument.find(query)
            .limit(limit)
            .skip(offset);
        
        reply.send(docs);
    } catch (err: any) {
        reply.code(403).send({ error: err.message });
    }
};
