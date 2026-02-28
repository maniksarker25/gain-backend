import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import StudentController from './student.controller';
import StudentValidation from './student.validation';

const router = express.Router();

router.post(
  '/create',
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(StudentValidation.createStudentZodSchema),
  StudentController.createStudent
);

router.get('/get-all', StudentController.getAllStudents);

router.get('/get-single/:id', StudentController.getSingleStudent);

router.patch(
  '/update/:id',
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(StudentValidation.updateStudentZodSchema),
  StudentController.updateStudent
);

router.delete(
  '/delete/:id',
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  StudentController.deleteStudent
);

export const studentRoutes = router;
