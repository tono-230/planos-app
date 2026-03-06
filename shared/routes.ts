import { z } from 'zod';
import { insertLocationSchema, insertProductSchema, insertPlanSchema, insertScanSchema, locations, products, plans, scans } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

const locationSchema = z.custom<typeof locations.$inferSelect>();
const productSchema = z.custom<typeof products.$inferSelect>();
const planSchema = z.custom<typeof plans.$inferSelect>();
const scanSchema = z.custom<typeof scans.$inferSelect>();

const analysisResultSchema = z.object({
  product: productSchema,
  status: z.enum(['correct', 'wrong_location', 'missing', 'extra']),
  expectedLocation: locationSchema.optional(),
  actualLocation: locationSchema.optional(),
});

export const api = {
  locations: {
    list: {
      method: 'GET' as const,
      path: '/api/locations' as const,
      responses: {
        200: z.array(locationSchema),
      }
    }
  },
  products: {
    list: {
      method: 'GET' as const,
      path: '/api/products' as const,
      responses: {
        200: z.array(productSchema),
      }
    }
  },
  plans: {
    list: {
      method: 'GET' as const,
      path: '/api/plans' as const,
      responses: {
        200: z.array(planSchema),
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/plans' as const,
      input: insertPlanSchema,
      responses: {
        201: planSchema,
        400: errorSchemas.validation,
      }
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/plans/:id' as const,
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      }
    }
  },
  scans: {
    list: {
      method: 'GET' as const,
      path: '/api/scans' as const,
      responses: {
        200: z.array(scanSchema),
      }
    },
    submit: {
      method: 'POST' as const,
      path: '/api/scans/submit' as const,
      input: z.object({ scans: z.array(insertScanSchema) }),
      responses: {
        201: z.object({ message: z.string(), count: z.number() }),
        400: errorSchemas.validation,
      }
    },
    clear: {
      method: 'POST' as const,
      path: '/api/scans/clear' as const,
      responses: {
        200: z.object({ message: z.string() })
      }
    }
  },
  analysis: {
    get: {
      method: 'GET' as const,
      path: '/api/analysis' as const,
      responses: {
        200: z.array(analysisResultSchema),
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
