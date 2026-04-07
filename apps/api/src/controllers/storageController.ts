import { FastifyRequest, FastifyReply } from 'fastify';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import { pipeline } from 'stream';
import { RulesEngine } from '../services/RulesEngine';
import { WebhookService } from '../services/WebhookService';
import { AuditLogger } from '../utils/AuditLogger';
import { IProject } from '../models/Project';
import mongoose from 'mongoose';

const pump = promisify(pipeline);
const storageDir = process.env.STORAGE_PATH || './uploads';

export const uploadFile = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const project = (req as any).project as IProject;
        if (!project) return reply.code(400).send({ error: 'Project context required' });

        const parts = req.parts();
        let uploadedFile: any = null;

        for await (const part of parts) {
            if (part.type === 'file') {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const filename = uniqueSuffix + '-' + part.filename;
                
                const pPath = path.join(storageDir, String(project._id));
                if (!fs.existsSync(pPath)) fs.mkdirSync(pPath, { recursive: true });
                
                const filePath = path.join(pPath, filename);
                await pump(part.file, fs.createWriteStream(filePath));
                
                const stats = fs.statSync(filePath);
                uploadedFile = { filename, path: filePath, size: stats.size };
                break; // Handle one file for now
            }
        }

        if (!uploadedFile) {
            return reply.code(400).send({ error: 'No file uploaded' });
        }

        // Rules check
        const rules = project.rules?.get('storage') || 'allow read, write: if true;';
        const allowed = RulesEngine.evaluate(rules, 'write', {
            auth: (req as any).user || null,
            resource: {},
            request: { data: { filename: uploadedFile.filename }, auth: (req as any).user || null, path: `/storage/${uploadedFile.filename}`, method: 'POST' }
        });

        if (!allowed) {
            fs.unlinkSync(uploadedFile.path);
            return reply.code(403).send({ error: 'Permission denied' });
        }

        const url = `/storage/${project._id}/${uploadedFile.filename}`;
        
        // Record Usage
        if (project.billing?.usage) {
            await mongoose.model('Project').updateOne(
                { _id: project._id },
                { $inc: { 'billing.usage.storageBytes': uploadedFile.size, 'billing.usage.writes': 1 } }
            );
        }

        // Audit Logging
        if (project.auditLogs) {
            await AuditLogger.log({
                projectId: project._id as string,
                userId: (req as any).user?._id,
                action: 'create',
                resource: `storage:${uploadedFile.filename}`,
                newData: { url, size: uploadedFile.size }
            });
        }

        // Trigger Webhooks
        WebhookService.trigger(project._id.toString(), 'file.uploaded', { url, filename: uploadedFile.filename, size: uploadedFile.size });

        reply.send({ url, filename: uploadedFile.filename, size: uploadedFile.size });
    } catch (err: any) {
        reply.code(500).send({ error: err.message });
    }
};

export const listFiles = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const project = (req as any).project as IProject;
        if (!project) return reply.code(400).send({ error: 'Project context required' });

        const pPath = path.join(storageDir, String(project._id));
        if (!fs.existsSync(pPath)) return reply.send([]);

        const rules = project.rules?.get('storage') || 'allow read, write: if true;';
        const allowed = RulesEngine.evaluate(rules, 'read', {
            auth: (req as any).user || null,
            resource: {},
            request: { data: {}, auth: (req as any).user || null, path: `/storage`, method: 'GET' }
        });

        if (!allowed) {
            return reply.code(403).send({ error: 'Permission denied' });
        }

        if (project.billing?.usage) {
            await mongoose.model('Project').updateOne(
                { _id: project._id },
                { $inc: { 'billing.usage.reads': 1 } }
            );
        }

        const files = fs.readdirSync(pPath).map(f => ({
            name: f,
            url: `/storage/${project._id}/${f}`
        }));

        reply.send(files);
    } catch (err: any) {
        reply.code(500).send({ error: err.message });
    }
};
