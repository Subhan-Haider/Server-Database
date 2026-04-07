import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import Project from '../models/Project';
import User from '../models/User';

export const authenticate = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const apiKey = req.headers['x-api-key'] as string;
        const authHeader = req.headers.authorization;

        if (apiKey) {
            const project = await Project.findOne({ apiKey });
            if (project) {
                (req as any).project = project;
            }
        }

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super-secret-key-12345') as any;
                const user = await User.findById(decoded.id);
                if (user) {
                    (req as any).user = user;
                    if (user.projectId && !(req as any).project) {
                        const project = await Project.findById(user.projectId);
                        if (project) (req as any).project = project;
                    }
                }
            } catch (err) {
                // Ignore invalid tokens for general authentication; let controllers handle it
            }
        }
    } catch (err) {
        // Log error and let it proceed
        console.error('Auth Middleware Error:', err);
    }
};

export const requireAuth = async (req: FastifyRequest, reply: FastifyReply) => {
    if (!(req as any).user) {
        reply.code(401).send({ error: 'Unauthorized: Authentication required' });
        // NOTE: Throwing error or using reply.send terminates the request in a preHandler hook
        throw new Error('Unauthorized');
    }
};

export const requireProject = async (req: FastifyRequest, reply: FastifyReply) => {
    if (!(req as any).project) {
        reply.code(400).send({ error: 'Project context required' });
        throw new Error('Project context required');
    }
};
