"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listFiles = exports.uploadFile = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const util_1 = require("util");
const stream_1 = require("stream");
const RulesEngine_1 = require("../services/RulesEngine");
const WebhookService_1 = require("../services/WebhookService");
const AuditLogger_1 = require("../utils/AuditLogger");
const mongoose_1 = __importDefault(require("mongoose"));
const pump = (0, util_1.promisify)(stream_1.pipeline);
const storageDir = process.env.STORAGE_PATH || './uploads';
const uploadFile = async (req, reply) => {
    try {
        const project = req.project;
        if (!project)
            return reply.code(400).send({ error: 'Project context required' });
        const parts = req.parts();
        let uploadedFile = null;
        for await (const part of parts) {
            if (part.type === 'file') {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const filename = uniqueSuffix + '-' + part.filename;
                const pPath = path_1.default.join(storageDir, String(project._id));
                if (!fs_1.default.existsSync(pPath))
                    fs_1.default.mkdirSync(pPath, { recursive: true });
                const filePath = path_1.default.join(pPath, filename);
                await pump(part.file, fs_1.default.createWriteStream(filePath));
                const stats = fs_1.default.statSync(filePath);
                uploadedFile = { filename, path: filePath, size: stats.size };
                break; // Handle one file for now
            }
        }
        if (!uploadedFile) {
            return reply.code(400).send({ error: 'No file uploaded' });
        }
        // Rules check
        const rules = project.rules?.get('storage') || 'allow read, write: if true;';
        const allowed = RulesEngine_1.RulesEngine.evaluate(rules, 'write', {
            auth: req.user || null,
            resource: {},
            request: { data: { filename: uploadedFile.filename }, auth: req.user || null, path: `/storage/${uploadedFile.filename}`, method: 'POST' }
        });
        if (!allowed) {
            fs_1.default.unlinkSync(uploadedFile.path);
            return reply.code(403).send({ error: 'Permission denied' });
        }
        const url = `/storage/${project._id}/${uploadedFile.filename}`;
        // Record Usage
        if (project.billing?.usage) {
            await mongoose_1.default.model('Project').updateOne({ _id: project._id }, { $inc: { 'billing.usage.storageBytes': uploadedFile.size, 'billing.usage.writes': 1 } });
        }
        // Audit Logging
        if (project.auditLogs) {
            await AuditLogger_1.AuditLogger.log({
                projectId: project._id,
                userId: req.user?._id,
                action: 'create',
                resource: `storage:${uploadedFile.filename}`,
                newData: { url, size: uploadedFile.size }
            });
        }
        // Trigger Webhooks
        WebhookService_1.WebhookService.trigger(project._id.toString(), 'file.uploaded', { url, filename: uploadedFile.filename, size: uploadedFile.size });
        reply.send({ url, filename: uploadedFile.filename, size: uploadedFile.size });
    }
    catch (err) {
        reply.code(500).send({ error: err.message });
    }
};
exports.uploadFile = uploadFile;
const listFiles = async (req, reply) => {
    try {
        const project = req.project;
        if (!project)
            return reply.code(400).send({ error: 'Project context required' });
        const pPath = path_1.default.join(storageDir, String(project._id));
        if (!fs_1.default.existsSync(pPath))
            return reply.send([]);
        const rules = project.rules?.get('storage') || 'allow read, write: if true;';
        const allowed = RulesEngine_1.RulesEngine.evaluate(rules, 'read', {
            auth: req.user || null,
            resource: {},
            request: { data: {}, auth: req.user || null, path: `/storage`, method: 'GET' }
        });
        if (!allowed) {
            return reply.code(403).send({ error: 'Permission denied' });
        }
        if (project.billing?.usage) {
            await mongoose_1.default.model('Project').updateOne({ _id: project._id }, { $inc: { 'billing.usage.reads': 1 } });
        }
        const files = fs_1.default.readdirSync(pPath).map(f => ({
            name: f,
            url: `/storage/${project._id}/${f}`
        }));
        reply.send(files);
    }
    catch (err) {
        reply.code(500).send({ error: err.message });
    }
};
exports.listFiles = listFiles;
