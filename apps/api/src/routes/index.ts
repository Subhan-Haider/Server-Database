import { FastifyInstance } from 'fastify';
import * as auth from '../controllers/authController';
import * as db from '../controllers/dbController';
import * as storage from '../controllers/storageController';
import * as setup from '../controllers/setupController';
import { authenticate, requireAuth, requireProject } from '../middleware/auth';

export default async function router(fastify: FastifyInstance) {
    fastify.addHook('onRequest', authenticate);

    // One-time setup
    fastify.get('/system/setup', setup.setup);

    // Auth routes (Project users)
    fastify.post('/auth/register', auth.register);
    fastify.post('/auth/login', auth.login);

    // Project management (Platform admins)
    fastify.post('/projects', { preHandler: [requireAuth] }, auth.createProject);
    fastify.get('/projects', { preHandler: [requireAuth] }, auth.getProjects);
    fastify.post('/projects/rules', { preHandler: [requireAuth, requireProject] }, auth.updateRules);

    // Database routes
    fastify.post('/db/:collection', { preHandler: [requireProject] }, db.createDocument);
    fastify.get('/db/:collection', { preHandler: [requireProject] }, db.queryDocuments);
    fastify.post('/db/:collection/query', { preHandler: [requireProject] }, db.queryDocuments); // support both
    fastify.get('/db/:collection/:id', { preHandler: [requireProject] }, db.getDocument);
    fastify.patch('/db/:collection/:id', { preHandler: [requireProject] }, db.updateDocument);
    fastify.delete('/db/:collection/:id', { preHandler: [requireProject] }, db.deleteDocument);

    // Storage routes
    fastify.post('/storage', { preHandler: [requireProject] }, storage.uploadFile);
    fastify.get('/storage', { preHandler: [requireProject] }, storage.listFiles);
}
