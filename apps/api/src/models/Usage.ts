import mongoose, { Schema, Document } from 'mongoose';

export interface IUsage extends Document {
  projectId: mongoose.Types.ObjectId;
  reads: number;
  writes: number;
  storageBytes: number;
  month: string; // e.g. "2023-07"
}

const UsageSchema: Schema = new Schema({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  reads: { type: Number, default: 0 },
  writes: { type: Number, default: 0 },
  storageBytes: { type: Number, default: 0 },
  month: { type: String, required: true },
}, { timestamps: true });

UsageSchema.index({ projectId: 1, month: 1 }, { unique: true });

export default mongoose.model<IUsage>('Usage', UsageSchema);
