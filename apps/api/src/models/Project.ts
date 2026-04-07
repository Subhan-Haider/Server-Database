import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  name: string;
  projectId: string;
  ownerId: string;
  provider: 'supabase' | 'firebase';
  config: {
    url: string;
    apiKey: string;
    serviceAccount?: string;
  };
  rules: Map<string, string>;
  schemas: Map<string, any>;
  webhooks: {
    id: string;
    url: string;
    events: string[];
    secret?: string;
    enabled: boolean;
  }[];
  billing: {
    tier: 'free' | 'pro';
    usage: {
      reads: number;
      writes: number;
      storageBytes: number;
    };
  };
  auditLogs: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>({
  name: { type: String, required: true },
  projectId: { type: String, required: true, unique: true },
  ownerId: { type: String, required: true },
  provider: { type: String, enum: ['supabase', 'firebase'], required: true },
  config: {
    url: { type: String, required: true },
    apiKey: { type: String, required: true },
    serviceAccount: { type: String }, // For Firebase
  },
  rules: { type: Map, of: String, default: { '*': 'allow read, write: if true;' } } as any,
  schemas: { type: Map, of: Object, default: {} } as any, // Collection -> Zod schema JSON
  webhooks: {
    type: [{
      id: { type: String, required: true },
      url: { type: String, required: true },
      events: { type: [String], default: [] },
      secret: { type: String },
      enabled: { type: Boolean, default: true }
    }],
    default: []
  },
  billing: {
    tier: { type: String, enum: ['free', 'pro'], default: 'free' },
    usage: {
      reads: { type: Number, default: 0 },
      writes: { type: Number, default: 0 },
      storageBytes: { type: Number, default: 0 }
    }
  },
  auditLogs: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model<IProject>('Project', ProjectSchema);
