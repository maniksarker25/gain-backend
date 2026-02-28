import { z } from 'zod';

const createCourseZodSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Course name is required' }),
  }),
});

const updateCourseZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
  }),
});

const CourseValidation = {
  createCourseZodSchema,
  updateCourseZodSchema,
};

export default CourseValidation;
