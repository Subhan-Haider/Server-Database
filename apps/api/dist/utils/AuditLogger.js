"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogger = void 0;
const AuditLog_1 = __importDefault(require("../models/AuditLog"));
class AuditLogger {
    static async log(params) {
        try {
            const log = new AuditLog_1.default({
                ...params,
                timestamp: new Date()
            });
            await log.save();
        }
        catch (err) {
            console.error('Audit logging failed:', err);
            // In production, we might want to log to an external service or a local file as fallback
        }
    }
}
exports.AuditLogger = AuditLogger;
