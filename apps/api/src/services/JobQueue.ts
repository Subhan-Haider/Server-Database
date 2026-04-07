import { Queue, Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import { EmailService } from './EmailService';
import axios from 'axios';

const redisConnection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379');

export class JobQueue {
    public static queue: Queue;
    private static worker: Worker;
    private static emailService = new EmailService();

    static initialize() {
        this.queue = new Queue('aether_jobs', { connection: redisConnection });

        this.worker = new Worker('aether_jobs', async (job: Job) => {
            console.log(`Processing job ${job.id} (${job.name})`);
            
            switch (job.name) {
                case 'send_email':
                    await this.emailService.sendEmail(job.data.to, job.data.subject, job.data.template, job.data.context);
                    break;
                case 'trigger_webhook':
                    await this.handleWebhook(job.data.url, job.data.payload, job.data.headers);
                    break;
                default:
                    console.warn(`Unhandled job type: ${job.name}`);
            }
        }, { connection: redisConnection });

        this.worker.on('failed', (job, err) => {
            console.error(`Job ${job?.id} failed with error: ${err.message}`);
        });

        console.log('Job Queue System Ready');
    }

    static async addJob(name: string, data: any, options: any = {}) {
        await this.queue.add(name, data, {
            attempts: 3,
            backoff: { type: 'exponential', delay: 1000 },
            ...options
        });
    }

    private static async handleWebhook(url: string, payload: any, headers: any = {}) {
        try {
            await axios.post(url, payload, {
                headers: {
                    'User-Agent': 'AetherBase/1.1 Webhook Engine',
                    'Content-Type': 'application/json',
                    ...headers
                },
                timeout: 10000
            });
        } catch (err: any) {
            console.error(`Webhook delivery failed to ${url}: ${err.message}`);
            throw err; // Allow BullMQ to retry based on attempts config
        }
    }
}
