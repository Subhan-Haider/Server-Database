"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookService = void 0;
const JobQueue_1 = require("./JobQueue");
const Project_1 = __importDefault(require("../models/Project"));
class WebhookService {
    static async trigger(projectId, event, payload) {
        try {
            const project = await Project_1.default.findById(projectId);
            if (!project || !project.webhooks)
                return;
            const activeWebhooks = project.webhooks.filter((w) => w.enabled && w.events.includes(event));
            for (const hook of activeWebhooks) {
                await JobQueue_1.JobQueue.addJob('trigger_webhook', {
                    url: hook.url,
                    payload: {
                        event,
                        projectId,
                        timestamp: new Date().toISOString(),
                        data: payload
                    },
                    headers: hook.secret ? { 'X-Aether-Secret': hook.secret } : {}
                });
            }
        }
        catch (err) {
            console.error('Error triggering webhooks:', err);
        }
    }
}
exports.WebhookService = WebhookService;
