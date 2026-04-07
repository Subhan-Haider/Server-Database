"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = router;
const auth = __importStar(require("../controllers/authController"));
const db = __importStar(require("../controllers/dbController"));
const storage = __importStar(require("../controllers/storageController"));
const setup = __importStar(require("../controllers/setupController"));
const auth_1 = require("../middleware/auth");
async function router(fastify) {
    fastify.addHook('onRequest', auth_1.authenticate);
    // One-time setup
    fastify.get('/system/setup', setup.setup);
    // Auth routes (Project users)
    fastify.post('/auth/register', auth.register);
    fastify.post('/auth/login', auth.login);
    // Project management (Platform admins)
    fastify.post('/projects', { preHandler: [auth_1.requireAuth] }, auth.createProject);
    fastify.get('/projects', { preHandler: [auth_1.requireAuth] }, auth.getProjects);
    fastify.post('/projects/rules', { preHandler: [auth_1.requireAuth, auth_1.requireProject] }, auth.updateRules);
    // Database routes
    fastify.post('/db/:collection', { preHandler: [auth_1.requireProject] }, db.createDocument);
    fastify.get('/db/:collection', { preHandler: [auth_1.requireProject] }, db.queryDocuments);
    fastify.post('/db/:collection/query', { preHandler: [auth_1.requireProject] }, db.queryDocuments); // support both
    fastify.get('/db/:collection/:id', { preHandler: [auth_1.requireProject] }, db.getDocument);
    fastify.patch('/db/:collection/:id', { preHandler: [auth_1.requireProject] }, db.updateDocument);
    fastify.delete('/db/:collection/:id', { preHandler: [auth_1.requireProject] }, db.deleteDocument);
    // Storage routes
    fastify.post('/storage', { preHandler: [auth_1.requireProject] }, storage.uploadFile);
    fastify.get('/storage', { preHandler: [auth_1.requireProject] }, storage.listFiles);
}
