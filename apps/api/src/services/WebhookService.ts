import { JobQueue } from './JobQueue';
import Project from '../models/Project';

export class WebhookService {
    static async trigger(projectId: string, event: string, payload: any) {
        try {
            const project = await Project.findById(projectId);
            if (!project || !project.webhooks) return;

            const activeWebhooks = (project.webhooks as any[]).filter((w: any) => w.enabled && w.events.includes(event));

            for (const hook of activeWebhooks) {
                await JobQueue.addJob('trigger_webhook', {
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
        } catch (err) {
            console.error('Error triggering webhooks:', err);
        }
    }
}
