"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsageTracker = void 0;
const Usage_1 = __importDefault(require("../models/Usage"));
class UsageTracker {
    static async record(projectId, type, amount = 1) {
        try {
            const month = new Date().toISOString().slice(0, 7);
            await Usage_1.default.updateOne({ projectId, month }, { $inc: { [type === 'read' ? 'reads' : 'writes']: amount } }, { upsert: true });
        }
        catch (err) {
            console.error('Usage recording error:', err);
        }
    }
    static async recordStorage(projectId, bytes) {
        try {
            const month = new Date().toISOString().slice(0, 7);
            await Usage_1.default.updateOne({ projectId, month }, { $inc: { storageBytes: bytes } }, { upsert: true });
        }
        catch (err) {
            console.error('Storage usage recording error:', err);
        }
    }
}
exports.UsageTracker = UsageTracker;
