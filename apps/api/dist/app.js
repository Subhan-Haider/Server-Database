"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = exports.connectDB = exports.io = void 0;
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const static_1 = __importDefault(require("@fastify/static"));
const multipart_1 = __importDefault(require("@fastify/multipart"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const socket_io_1 = require("socket.io");
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const index_1 = __importDefault(require("./routes/index"));
const JobQueue_1 = require("./services/JobQueue");
dotenv_1.default.config();
const app = (0, fastify_1.default)({
    logger: {
        transport: {
            target: 'pino-pretty',
        },
    },
});
exports.app = app;
app.register(cors_1.default, {
    origin: process.env.CORS_ORIGIN || '*'
});
app.register(multipart_1.default);
const storageDir = path_1.default.resolve(process.env.STORAGE_PATH || './uploads');
if (!fs_1.default.existsSync(storageDir))
    fs_1.default.mkdirSync(storageDir, { recursive: true });
app.register(static_1.default, {
    root: storageDir,
    prefix: '/storage/',
});
app.register(index_1.default, { prefix: '/api' });
app.get('/', async (request, reply) => {
    return { name: 'AetherBase API', status: 'running' };
});
exports.io = new socket_io_1.Server(app.server, {
    cors: {
        origin: process.env.CORS_ORIGIN || '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
    }
});
exports.io.on('connection', (socket) => {
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
const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/aetherbase';
        await mongoose_1.default.connect(uri);
        app.log.info('MongoDB Connected');
        // Initialize Job Queue Workers
        JobQueue_1.JobQueue.initialize();
    }
    catch (err) {
        app.log.error(err, 'MongoDB connection error');
        process.exit(1);
    }
};
exports.connectDB = connectDB;
