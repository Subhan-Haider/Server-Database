import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import fmultipart from '@fastify/multipart';
import path from 'path';
import fs from 'fs';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import router from './routes/index';
import { JobQueue } from './services/JobQueue';

dotenv.config();

const app = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
    },
  },
});

app.register(cors, {
  origin: process.env.CORS_ORIGIN || '*'
});

app.register(fmultipart);

const storageDir = path.resolve(process.env.STORAGE_PATH || './uploads');
if (!fs.existsSync(storageDir)) fs.mkdirSync(storageDir, { recursive: true });
app.register(fastifyStatic, {
  root: storageDir,
  prefix: '/storage/',
});

app.register(router, { prefix: '/api' });

app.get('/', async (request, reply) => {
  return { name: 'AetherBase API', status: 'running' };
});

export const io = new Server(app.server, {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
  }
});

io.on('connection', (socket) => {
  app.log.info(`Client connected: ${socket.id}`);
  
  socket.on('subscribe', (params) => {
    const { projectId, collection, docId } = params;
    const room = docId ? `${projectId}:${collection}:${docId}` : `${projectId}:${collection}`;
    socket.join(room);
    app.log.info(`Socket ${socket.id} subscribed to ${room}`);
  });

  socket.on('disconnect', () => {
    app.log.info(`Client disconnected: ${socket.id}`);
  });
});

export const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/aetherbase';
    await mongoose.connect(uri);
    app.log.info('MongoDB Connected');
    
    // Initialize Job Queue Workers
    JobQueue.initialize();
  } catch (err: any) {
    app.log.error(err, 'MongoDB connection error');
    process.exit(1);
  }
};

export { app };
