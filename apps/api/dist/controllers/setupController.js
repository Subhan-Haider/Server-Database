"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setup = void 0;
const User_1 = __importDefault(require("../models/User"));
const setup = async (req, reply) => {
    try {
        const count = await User_1.default.countDocuments({ projectId: null });
        if (count > 0)
            return reply.code(400).send({ error: 'System already setup' });
        const user = new User_1.default({
            email: 'admin@aetherbase.com',
            password: 'password123',
            projectId: null,
            roles: ['platform-owner']
        });
        await user.save();
        reply.code(201).send({ success: true, message: 'Platform admin created', user: { email: user.email } });
    }
    catch (err) {
        reply.code(500).send({ error: err.message });
    }
};
exports.setup = setup;
