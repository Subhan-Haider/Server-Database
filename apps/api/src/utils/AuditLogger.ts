import AuditLog from '../models/AuditLog';
import mongoose from 'mongoose';

export class AuditLogger {
  static async log(params: {
    projectId: string | mongoose.Types.ObjectId;
    userId?: string | mongoose.Types.ObjectId;
    action: string;
    resource: string;
    previousData?: any;
    newData?: any;
    ipAddress?: string;
    userAgent?: string;
  }) {
    try {
      const log = new AuditLog({
        ...params,
        timestamp: new Date()
      });
      await log.save();
    } catch (err) {
      console.error('Audit logging failed:', err);
      // In production, we might want to log to an external service or a local file as fallback
    }
  }
}
