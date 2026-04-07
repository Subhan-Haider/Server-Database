import Usage from '../models/Usage';
import mongoose from 'mongoose';

export class UsageTracker {
    static async record(projectId: string | mongoose.Types.ObjectId, type: 'read' | 'write', amount: number = 1) {
        try {
            const month = new Date().toISOString().slice(0, 7);
            await Usage.updateOne(
                { projectId, month },
                { $inc: { [type === 'read' ? 'reads' : 'writes']: amount } },
                { upsert: true }
            );
        } catch (err) {
            console.error('Usage recording error:', err);
        }
    }

    static async recordStorage(projectId: string | mongoose.Types.ObjectId, bytes: number) {
        try {
            const month = new Date().toISOString().slice(0, 7);
            await Usage.updateOne(
                { projectId, month },
                { $inc: { storageBytes: bytes } },
                { upsert: true }
            );
        } catch (err) {
            console.error('Storage usage recording error:', err);
        }
    }
}
