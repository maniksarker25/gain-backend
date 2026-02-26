import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import ResultController from './result.controller';
import resultValidation from './result.validation';

const router = express.Router();

router.post(
  '/create',
  validateRequest(resultValidation.createResultSchema),
  ResultController.createResult
);

router.get('/get-all', ResultController.getAllResults);

router.get('/get-single/:id', ResultController.getSingleResult);

router.patch(
  '/update/:id',
  validateRequest(resultValidation.updateResultSchema),
  ResultController.updateResult
);

router.delete('/delete/:id', ResultController.deleteResult);

router.get('/institute/:instituteId', ResultController.getResultsByInstitute);

router.get('/top-courses/:year', ResultController.getTopCoursesByYear);

router.get('/top-students', ResultController.getTopStudents);

router.get('/student/:studentId', ResultController.getStudentResults);

export const resultRoutes = router;
