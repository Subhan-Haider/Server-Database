import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  projectId: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  action: string;
  resource: string;
  previousData?: any;
  newData?: any;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

const AuditLogSchema: Schema = new Schema({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, required: true },
  resource: { type: String, required: true },
  previousData: { type: Object },
  newData: { type: Object },
  ipAddress: { type: String },
  userAgent: { type: String },
  timestamp: { type: Date, default: Date.now },
}, { timestamps: false, collection: 'audit_logs' });

// Immutable: no updates or deletes should be allowed at the database level for audit logs
AuditLogSchema.index({ projectId: 1, timestamp: -1 });

export default mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
