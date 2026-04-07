"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaValidator = void 0;
const zod_1 = require("zod");
class SchemaValidator {
    static validate(schema, data) {
        try {
            const shape = {};
            Object.entries(schema.fields).forEach(([key, config]) => {
                let field;
                switch (config.type) {
                    case 'string':
                        field = zod_1.z.string();
                        break;
                    case 'number':
                        field = zod_1.z.number();
                        break;
                    case 'boolean':
                        field = zod_1.z.boolean();
                        break;
                    case 'date':
                        field = zod_1.z.date();
                        break;
                }
                if (config.required) {
                    field = field.nonempty ? field.nonempty() : field;
                }
                else {
                    field = field.optional();
                }
                if (config.min !== undefined && config.type === 'number')
                    field = field.min(config.min);
                if (config.max !== undefined && config.type === 'number')
                    field = field.max(config.max);
                shape[key] = field;
            });
            const validator = zod_1.z.object(shape);
            const result = validator.safeParse(data);
            if (!result.success) {
                return { success: false, error: result.error.message };
            }
            return { success: true, data: result.data };
        }
        catch (err) {
            return { success: false, error: err.message };
        }
    }
}
exports.SchemaValidator = SchemaValidator;
