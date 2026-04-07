"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobQueue = void 0;
const bullmq_1 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
const EmailService_1 = require("./EmailService");
const axios_1 = __importDefault(require("axios"));
const redisConnection = new ioredis_1.default(process.env.REDIS_URL || 'redis://localhost:6379');
class JobQueue {
    static initialize() {
        this.queue = new bullmq_1.Queue('aether_jobs', { connection: redisConnection });
        this.worker = new bullmq_1.Worker('aether_jobs', async (job) => {
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
    static async addJob(name, data, options = {}) {
        await this.queue.add(name, data, {
            attempts: 3,
            backoff: { type: 'exponential', delay: 1000 },
            ...options
        });
    }
    static async handleWebhook(url, payload, headers = {}) {
        try {
            await axios_1.default.post(url, payload, {
                headers: {
                    'User-Agent': 'AetherBase/1.1 Webhook Engine',
                    'Content-Type': 'application/json',
                    ...headers
                },
                timeout: 10000
            });
        }
        catch (err) {
            console.error(`Webhook delivery failed to ${url}: ${err.message}`);
            throw err; // Allow BullMQ to retry based on attempts config
        }
    }
}
exports.JobQueue = JobQueue;
JobQueue.emailService = new EmailService_1.EmailService();
