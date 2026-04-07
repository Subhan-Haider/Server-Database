import { FastifyRequest, FastifyReply } from 'fastify';
import User from '../models/User';

export const setup = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const count = await User.countDocuments({ projectId: null });
        if (count > 0) return reply.code(400).send({ error: 'System already setup' });

        const user = new User({
            email: 'admin@aetherbase.com',
            password: 'password123',
            projectId: null,
            roles: ['platform-owner']
        });

        await user.save();
        reply.code(201).send({ success: true, message: 'Platform admin created', user: { email: user.email } });
    } catch (err: any) {
        reply.code(500).send({ error: err.message });
    }
};
