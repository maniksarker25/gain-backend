import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import CourseController from './course.controller';
import CourseValidation from './course.validation';

const router = express.Router();

router.post(
  '/create',
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(CourseValidation.createCourseZodSchema),
  CourseController.createCourse
);

router.get('/get-all', CourseController.getAllCourses);

router.get('/get-single/:id', CourseController.getSingleCourse);

router.patch(
  '/update/:id',
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(CourseValidation.updateCourseZodSchema),
  CourseController.updateCourse
);

router.delete(
  '/delete/:id',
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  CourseController.deleteCourse
);

export const courseRoutes = router;
