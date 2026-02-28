import express from 'express';
import { authRoutes } from '../modules/auth/auth.routes';
import { courseRoutes } from '../modules/course/course.route';
import { instituteRoutes } from '../modules/institute/institute.route';
import { resultRoutes } from '../modules/result/result.route';
import { studentRoutes } from '../modules/student/student.route';
import { userRoutes } from '../modules/user/user.routes';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/user',
    route: userRoutes,
  },
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/student',
    route: studentRoutes,
  },
  {
    path: '/institute',
    route: instituteRoutes,
  },
  {
    path: '/result',
    route: resultRoutes,
  },
  {
    path: '/course',
    route: courseRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
