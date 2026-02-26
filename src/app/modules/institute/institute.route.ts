import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import InstituteController from './institute.controller';
import InstituteValidation from './institute.validation';

const router = express.Router();

router.post(
  '/create',
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(InstituteValidation.createInstituteZodSchema),
  InstituteController.createInstitute
);

router.get(
  '/get-all',
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  InstituteController.getAllInstitutes
);

router.get(
  '/get-single/:id',
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  InstituteController.getSingleInstitute
);

router.patch(
  '/update/:id',
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(InstituteValidation.updateInstituteZodSchema),
  InstituteController.updateInstitute
);

router.delete(
  '/delete/:id',
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  InstituteController.deleteInstitute
);

export const instituteRoutes = router;
