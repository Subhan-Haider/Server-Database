import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Project from '../models/Project';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-12345';

export const register = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const { email, password, metadata } = req.body as any;
        const project = (req as any).project;

        const user = new User({
            email,
            password,
            projectId: project?._id || null,
            metadata: metadata || {}
        });

        await user.save();
        reply.code(201).send({ id: user._id, email: user.email });
    } catch (err: any) {
        reply.code(400).send({ error: err.message });
    }
};

export const login = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const { email, password } = req.body as any;
        const project = (req as any).project;

        const user = await User.findOne({ email, projectId: project?._id || null });
        if (!user) return reply.code(401).send({ error: 'Invalid credentials' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return reply.code(401).send({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.roles }, JWT_SECRET, { expiresIn: '1d' });
        reply.send({ token, user: { id: user._id, email: user.email, roles: user.roles } });
    } catch (err: any) {
        reply.code(500).send({ error: err.message });
    }
};

export const createProject = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const { name } = req.body as any;
        const user = (req as any).user;

        if (!user) return reply.code(401).send({ error: 'Unauthorized' });

        const apiKey = crypto.randomBytes(32).toString('hex');
        
        const project = new Project({
            name,
            apiKey,
            ownerId: user._id
        });

        await project.save();
        reply.code(201).send(project);
    } catch (err: any) {
        reply.code(400).send({ error: err.message });
    }
};

export const getProjects = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const user = (req as any).user;
        const projects = await Project.find({ ownerId: user._id });
        reply.send(projects);
    } catch (err: any) {
        reply.code(500).send({ error: err.message });
    }
};

export const updateRules = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const { collection, rules } = req.body as any;
        const project = (req as any).project;
        const user = (req as any).user;

        if (!project || String(project.ownerId) !== String(user?._id)) {
            return reply.code(403).send({ error: 'Unauthorized project management' });
        }

        project.rules.set(collection, rules);
        await project.save();

        reply.send({ success: true, project });
    } catch (err: any) {
        reply.code(400).send({ error: err.message });
    }
};
