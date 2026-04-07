import mongoose, { Schema, Document } from 'mongoose';

export interface IDataDocument extends Document {
  projectId: mongoose.Types.ObjectId;
  collectionName: string;
  data: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const DataDocumentSchema: Schema = new Schema({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  collectionName: { type: String, required: true },
  data: { type: Object, required: true },
}, { timestamps: true });

// Multi-index for efficient collection-based queries
DataDocumentSchema.index({ projectId: 1, collectionName: 1 });
// Index data fields dynamically if needed, but for now we'll rely on MongoDB's flexible querying
DataDocumentSchema.index({ "data.$**": 1 });

export default mongoose.model<IDataDocument>('DataDocument', DataDocumentSchema);
