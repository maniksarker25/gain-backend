import { z } from 'zod';

const createResultSchema = z.object({
  body: z.object({
    student: z.object({
      connect: z.object({
        id: z.string(),
      }),
    }),
    course: z.object({
      connect: z.object({
        id: z.string(),
      }),
    }),
    institute: z.object({
      connect: z.object({
        id: z.string(),
      }),
    }),
    marks: z.number().min(0).max(100),
    year: z.number(),
  }),
});

const updateResultSchema = z.object({
  body: z.object({
    marks: z.number().min(0).max(100).optional(),
    year: z.number().optional(),
  }),
});

export default {
  createResultSchema,
  updateResultSchema,
};
