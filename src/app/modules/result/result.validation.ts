import { z } from 'zod';

const createResultSchema = z.object({
  body: z.object({
    studentId: z.string({ required_error: 'Student ID is required' }),
    courseId: z.string({ required_error: 'Course ID is required' }),
    instituteId: z.string({ required_error: 'Institute ID is required' }),
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
