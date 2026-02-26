import { z } from 'zod';

const createStudentZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
    }),

    email: z
      .string({
        required_error: 'Email is required',
      })
      .email(),

    password: z
      .string({
        required_error: 'Password is required',
      })
      .min(6),

    instituteId: z.string({
      required_error: 'Institute ID is required',
    }),
  }),
});

const updateStudentZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    instituteId: z.string().optional(),
  }),
});

const StudentValidation = {
  createStudentZodSchema,
  updateStudentZodSchema,
};

export default StudentValidation;
