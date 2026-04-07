import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password?: string;
  projectId?: mongoose.Types.ObjectId; // Null means platform admin
  roles: string[];
  metadata: Record<string, any>;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', default: null },
  roles: { type: [String], default: ['user'] },
  metadata: { type: Object, default: {} },
}, { timestamps: true });

// Hash password
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password as string, 10);
  next();
});

// Compare password
UserSchema.methods.comparePassword = async function(password: string) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);
