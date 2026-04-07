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
const mongoose_1 = __importStar(require("mongoose"));
const ProjectSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    projectId: { type: String, required: true, unique: true },
    ownerId: { type: String, required: true },
    provider: { type: String, enum: ['supabase', 'firebase'], required: true },
    config: {
        url: { type: String, required: true },
        apiKey: { type: String, required: true },
        serviceAccount: { type: String }, // For Firebase
    },
    rules: { type: Map, of: String, default: { '*': 'allow read, write: if true;' } },
    schemas: { type: Map, of: Object, default: {} }, // Collection -> Zod schema JSON
    webhooks: {
        type: [{
                id: { type: String, required: true },
                url: { type: String, required: true },
                events: { type: [String], default: [] },
                secret: { type: String },
                enabled: { type: Boolean, default: true }
            }],
        default: []
    },
    billing: {
        tier: { type: String, enum: ['free', 'pro'], default: 'free' },
        usage: {
            reads: { type: Number, default: 0 },
            writes: { type: Number, default: 0 },
            storageBytes: { type: Number, default: 0 }
        }
    },
    auditLogs: { type: Boolean, default: false }
}, { timestamps: true });
exports.default = mongoose_1.default.model('Project', ProjectSchema);
