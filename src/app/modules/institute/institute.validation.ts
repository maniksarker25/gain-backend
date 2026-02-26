import { z } from 'zod';

const createInstituteZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
    }),

    address: z.string({
      required_error: 'Address is required',
    }),
  }),
});

const updateInstituteZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    address: z.string().optional(),
  }),
});

const InstituteValidation = {
  createInstituteZodSchema,
  updateInstituteZodSchema,
};

export default InstituteValidation;
