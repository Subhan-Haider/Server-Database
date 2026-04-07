import { z } from 'zod';

export interface ISchema {
  fields: Record<string, { type: 'string' | 'number' | 'boolean' | 'date'; required?: boolean; min?: number; max?: number }>;
}

export class SchemaValidator {
  static validate(schema: ISchema, data: any): { success: boolean; data?: any; error?: string } {
    try {
      const shape: any = {};

      Object.entries(schema.fields).forEach(([key, config]) => {
        let field: any;
        
        switch (config.type) {
          case 'string': field = z.string(); break;
          case 'number': field = z.number(); break;
          case 'boolean': field = z.boolean(); break;
          case 'date': field = z.date(); break;
        }

        if (config.required) {
            field = field.nonempty ? field.nonempty() : field;
        } else {
            field = field.optional();
        }

        if (config.min !== undefined && config.type === 'number') field = field.min(config.min);
        if (config.max !== undefined && config.type === 'number') field = field.max(config.max);
        
        shape[key] = field;
      });

      const validator = z.object(shape);
      const result = validator.safeParse(data);
      
      if (!result.success) {
        return { success: false, error: result.error.message };
      }

      return { success: true, data: result.data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }
}
