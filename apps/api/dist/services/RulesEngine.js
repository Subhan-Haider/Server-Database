"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RulesEngine = void 0;
const vm_1 = __importDefault(require("vm"));
class RulesEngine {
    static evaluate(ruleString, operation, context) {
        try {
            // Basic parsing of Firestore-like rules
            // allow read, write: if <condition>;
            const lines = ruleString.split(';').map(l => l.trim()).filter(Boolean);
            for (const line of lines) {
                const match = line.match(/allow\s+([\w\s,]+):\s*if\s+(.*)/i);
                if (!match)
                    continue;
                const operations = match[1].split(',').map(o => o.trim().toLowerCase());
                const condition = match[2];
                // Check if this rule applies to the current operation
                const mappedOps = this.mapOperation(operation);
                const applies = operations.some(op => mappedOps.includes(op) || op === 'write' && ['create', 'update', 'delete'].includes(operation));
                if (applies) {
                    // Evaluate condition
                    const sandbox = {
                        auth: context.auth,
                        resource: context.resource,
                        request: context.request,
                        true: true,
                        false: false
                    };
                    const result = vm_1.default.runInNewContext(condition, sandbox, { timeout: 100 });
                    if (result === true)
                        return true;
                }
            }
            return false; // Default deny
        }
        catch (error) {
            console.error('Rules evaluation error:', error);
            return false;
        }
    }
    static mapOperation(op) {
        if (op === 'read')
            return ['read'];
        if (op === 'create')
            return ['create', 'write'];
        if (op === 'update')
            return ['update', 'write'];
        if (op === 'delete')
            return ['delete', 'write'];
        if (op === 'write')
            return ['write', 'create', 'update', 'delete'];
        return [];
    }
}
exports.RulesEngine = RulesEngine;
