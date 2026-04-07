"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRules = exports.getProjects = exports.createProject = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const Project_1 = __importDefault(require("../models/Project"));
const crypto_1 = __importDefault(require("crypto"));
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-12345';
const register = async (req, reply) => {
    try {
        const { email, password, metadata } = req.body;
        const project = req.project;
        const user = new User_1.default({
            email,
            password,
            projectId: project?._id || null,
            metadata: metadata || {}
        });
        await user.save();
        reply.code(201).send({ id: user._id, email: user.email });
    }
    catch (err) {
        reply.code(400).send({ error: err.message });
    }
};
exports.register = register;
const login = async (req, reply) => {
    try {
        const { email, password } = req.body;
        const project = req.project;
        const user = await User_1.default.findOne({ email, projectId: project?._id || null });
        if (!user)
            return reply.code(401).send({ error: 'Invalid credentials' });
        const isMatch = await user.comparePassword(password);
        if (!isMatch)
            return reply.code(401).send({ error: 'Invalid credentials' });
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.roles }, JWT_SECRET, { expiresIn: '1d' });
        reply.send({ token, user: { id: user._id, email: user.email, roles: user.roles } });
    }
    catch (err) {
        reply.code(500).send({ error: err.message });
    }
};
exports.login = login;
const createProject = async (req, reply) => {
    try {
        const { name } = req.body;
        const user = req.user;
        if (!user)
            return reply.code(401).send({ error: 'Unauthorized' });
        const apiKey = crypto_1.default.randomBytes(32).toString('hex');
        const project = new Project_1.default({
            name,
            apiKey,
            ownerId: user._id
        });
        await project.save();
        reply.code(201).send(project);
    }
    catch (err) {
        reply.code(400).send({ error: err.message });
    }
};
exports.createProject = createProject;
const getProjects = async (req, reply) => {
    try {
        const user = req.user;
        const projects = await Project_1.default.find({ ownerId: user._id });
        reply.send(projects);
    }
    catch (err) {
        reply.code(500).send({ error: err.message });
    }
};
exports.getProjects = getProjects;
const updateRules = async (req, reply) => {
    try {
        const { collection, rules } = req.body;
        const project = req.project;
        const user = req.user;
        if (!project || String(project.ownerId) !== String(user?._id)) {
            return reply.code(403).send({ error: 'Unauthorized project management' });
        }
        project.rules.set(collection, rules);
        await project.save();
        reply.send({ success: true, project });
    }
    catch (err) {
        reply.code(400).send({ error: err.message });
    }
};
exports.updateRules = updateRules;
