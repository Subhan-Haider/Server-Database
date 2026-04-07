import vm from 'vm';

export type Operation = 'read' | 'write' | 'create' | 'update' | 'delete';

interface RuleContext {
    auth: any;
    resource: any;
    request: {
        data: any;
        auth: any;
        path: string;
        method: string;
    };
}

export class RulesEngine {
    static evaluate(ruleString: string, operation: Operation, context: RuleContext): boolean {
        try {
            // Basic parsing of Firestore-like rules
            // allow read, write: if <condition>;
            const lines = ruleString.split(';').map(l => l.trim()).filter(Boolean);
            
            for (const line of lines) {
                const match = line.match(/allow\s+([\w\s,]+):\s*if\s+(.*)/i);
                if (!match) continue;

                const operations = match[1].split(',').map(o => o.trim().toLowerCase());
                const condition = match[2];

                // Check if this rule applies to the current operation
                const mappedOps = this.mapOperation(operation);
                const applies = operations.some(op => mappedOps.includes(op as any) || op === 'write' && ['create', 'update', 'delete'].includes(operation));

                if (applies) {
                    // Evaluate condition
                    const sandbox = {
                        auth: context.auth,
                        resource: context.resource,
                        request: context.request,
                        true: true,
                        false: false
                    };

                    const result = vm.runInNewContext(condition, sandbox, { timeout: 100 });
                    if (result === true) return true;
                }
            }

            return false; // Default deny
        } catch (error) {
            console.error('Rules evaluation error:', error);
            return false;
        }
    }

    private static mapOperation(op: Operation): string[] {
        if (op === 'read') return ['read'];
        if (op === 'create') return ['create', 'write'];
        if (op === 'update') return ['update', 'write'];
        if (op === 'delete') return ['delete', 'write'];
        if (op === 'write') return ['write', 'create', 'update', 'delete'];
        return [];
    }
}
