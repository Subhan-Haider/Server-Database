"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireProject = exports.requireAuth = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Project_1 = __importDefault(require("../models/Project"));
const User_1 = __importDefault(require("../models/User"));
const authenticate = async (req, reply) => {
    try {
        const apiKey = req.headers['x-api-key'];
        const authHeader = req.headers.authorization;
        if (apiKey) {
            const project = await Project_1.default.findOne({ apiKey });
            if (project) {
                req.project = project;
            }
        }
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            try {
                const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'super-secret-key-12345');
                const user = await User_1.default.findById(decoded.id);
                if (user) {
                    req.user = user;
                    if (user.projectId && !req.project) {
                        const project = await Project_1.default.findById(user.projectId);
                        if (project)
                            req.project = project;
                    }
                }
            }
            catch (err) {
                // Ignore invalid tokens for general authentication; let controllers handle it
            }
        }
    }
    catch (err) {
        // Log error and let it proceed
        console.error('Auth Middleware Error:', err);
    }
};
exports.authenticate = authenticate;
const requireAuth = async (req, reply) => {
    if (!req.user) {
        reply.code(401).send({ error: 'Unauthorized: Authentication required' });
        // NOTE: Throwing error or using reply.send terminates the request in a preHandler hook
        throw new Error('Unauthorized');
    }
};
exports.requireAuth = requireAuth;
const requireProject = async (req, reply) => {
    if (!req.project) {
        reply.code(400).send({ error: 'Project context required' });
        throw new Error('Project context required');
    }
};
exports.requireProject = requireProject;
