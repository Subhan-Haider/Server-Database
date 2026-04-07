"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryDocuments = exports.deleteDocument = exports.updateDocument = exports.getDocument = exports.createDocument = void 0;
const DataDocument_1 = __importDefault(require("../models/DataDocument"));
const RulesEngine_1 = require("../services/RulesEngine");
const app_1 = require("../app");
const SchemaValidator_1 = require("../services/SchemaValidator");
const AuditLogger_1 = require("../utils/AuditLogger");
const WebhookService_1 = require("../services/WebhookService");
const mongoose_1 = __importDefault(require("mongoose"));
const evaluateRules = async (req, operation, params) => {
    const project = req.project;
    if (!project)
        throw new Error('Project context missing');
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
    const allowed = RulesEngine_1.RulesEngine.evaluate(rules, operation, context);
    if (!allowed)
        throw new Error('Permission denied by security rules');
};
const createDocument = async (req, reply) => {
    try {
        const { collection } = req.params;
        const data = req.body;
        const project = req.project;
        await evaluateRules(req, 'create', { collection, newData: data });
        const schema = project.schemas instanceof Map ? project.schemas.get(collection) : project.schemas[collection];
        if (schema) {
            const validation = SchemaValidator_1.SchemaValidator.validate(schema, data);
            if (!validation.success)
                throw new Error(`Schema validation failed: ${validation.error}`);
        }
        const doc = new DataDocument_1.default({
            projectId: project._id,
            collectionName: collection,
            data
        });
        await doc.save();
        if (project.billing?.usage) {
            await mongoose_1.default.model('Project').updateOne({ _id: project._id }, { $inc: { 'billing.usage.writes': 1 } });
        }
        if (project.auditLogs) {
            await AuditLogger_1.AuditLogger.log({
                projectId: project._id,
                userId: req.user?._id,
                action: 'create',
                resource: `db:${collection}`,
                newData: data
            });
        }
        app_1.io.to(`${project._id}:${collection}`).emit(`${collection}:created`, doc);
        WebhookService_1.WebhookService.trigger(project._id.toString(), 'document.created', { collection, data: doc });
        reply.code(201).send(doc);
    }
    catch (err) {
        reply.code(403).send({ error: err.message });
    }
};
exports.createDocument = createDocument;
const getDocument = async (req, reply) => {
    try {
        const { collection, id } = req.params;
        const project = req.project;
        const doc = await DataDocument_1.default.findOne({ _id: id, projectId: project._id, collectionName: collection });
        if (!doc)
            return reply.code(404).send({ error: 'Document not found' });
        await evaluateRules(req, 'read', { collection, docId: id, currentData: doc.data });
        if (project.billing?.usage) {
            await mongoose_1.default.model('Project').updateOne({ _id: project._id }, { $inc: { 'billing.usage.reads': 1 } });
        }
        reply.send(doc);
    }
    catch (err) {
        reply.code(403).send({ error: err.message });
    }
};
exports.getDocument = getDocument;
const updateDocument = async (req, reply) => {
    try {
        const { collection, id } = req.params;
        const newData = req.body;
        const project = req.project;
        const doc = await DataDocument_1.default.findOne({ _id: id, projectId: project._id, collectionName: collection });
        if (!doc)
            return reply.code(404).send({ error: 'Document not found' });
        await evaluateRules(req, 'update', { collection, docId: id, currentData: doc.data, newData });
        const previousData = JSON.parse(JSON.stringify(doc.data));
        const schema = project.schemas instanceof Map ? project.schemas.get(collection) : project.schemas[collection];
        if (schema) {
            const validation = SchemaValidator_1.SchemaValidator.validate(schema, { ...doc.data, ...newData });
            if (!validation.success)
                throw new Error(`Schema validation failed: ${validation.error}`);
        }
        doc.data = { ...doc.data, ...newData };
        await doc.save();
        if (project.billing?.usage) {
            await mongoose_1.default.model('Project').updateOne({ _id: project._id }, { $inc: { 'billing.usage.writes': 1 } });
        }
        if (project.auditLogs) {
            await AuditLogger_1.AuditLogger.log({
                projectId: project._id,
                userId: req.user?._id,
                action: 'update',
                resource: `db:${collection}/${id}`,
                previousData,
                newData: doc.data
            });
        }
        app_1.io.to(`${project._id}:${collection}`).emit(`${collection}:updated`, doc);
        app_1.io.to(`${project._id}:${collection}:${id}`).emit('updated', doc);
        WebhookService_1.WebhookService.trigger(project._id.toString(), 'document.updated', { collection, id, data: doc });
        reply.send(doc);
    }
    catch (err) {
        reply.code(403).send({ error: err.message });
    }
};
exports.updateDocument = updateDocument;
const deleteDocument = async (req, reply) => {
    try {
        const { collection, id } = req.params;
        const project = req.project;
        const doc = await DataDocument_1.default.findOne({ _id: id, projectId: project._id, collectionName: collection });
        if (!doc)
            return reply.code(404).send({ error: 'Document not found' });
        await evaluateRules(req, 'delete', { collection, docId: id, currentData: doc.data });
        await DataDocument_1.default.deleteOne({ _id: id });
        if (project.billing?.usage) {
            await mongoose_1.default.model('Project').updateOne({ _id: project._id }, { $inc: { 'billing.usage.writes': 1 } });
        }
        app_1.io.to(`${project._id}:${collection}`).emit(`${collection}:deleted`, { id });
        app_1.io.to(`${project._id}:${collection}:${id}`).emit('updated', { id, deleted: true });
        WebhookService_1.WebhookService.trigger(project._id.toString(), 'document.deleted', { collection, id });
        reply.send({ success: true });
    }
    catch (err) {
        reply.code(403).send({ error: err.message });
    }
};
exports.deleteDocument = deleteDocument;
const queryDocuments = async (req, reply) => {
    try {
        const { collection } = req.params;
        const query = (req.method === 'POST' ? req.body : req.query) || {};
        const project = req.project;
        query.projectId = project._id;
        query.collectionName = collection;
        let limit = 100;
        let offset = 0;
        if (query.limit) {
            limit = parseInt(query.limit);
            delete query.limit;
        }
        if (query.offset) {
            offset = parseInt(query.offset);
            delete query.offset;
        }
        await evaluateRules(req, 'read', { collection });
        if (project.billing?.usage) {
            await mongoose_1.default.model('Project').updateOne({ _id: project._id }, { $inc: { 'billing.usage.reads': 1 } });
        }
        const docs = await DataDocument_1.default.find(query)
            .limit(limit)
            .skip(offset);
        reply.send(docs);
    }
    catch (err) {
        reply.code(403).send({ error: err.message });
    }
};
exports.queryDocuments = queryDocuments;
