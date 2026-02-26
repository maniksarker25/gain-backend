import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import ResultService from './result.service';

const createResult = catchAsync(async (req, res) => {
  const result = await ResultService.createResult(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Result created successfully',
    data: result,
  });
});

const getAllResults = catchAsync(async (req, res) => {
  const result = await ResultService.getAllResults(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Results fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleResult = catchAsync(async (req, res) => {
  const result = await ResultService.getSingleResult(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Result fetched successfully',
    data: result,
  });
});

const updateResult = catchAsync(async (req, res) => {
  const result = await ResultService.updateResult(req.params.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Result updated successfully',
    data: result,
  });
});

const deleteResult = catchAsync(async (req, res) => {
  const result = await ResultService.deleteResult(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Result deleted successfully',
    data: result,
  });
});

const getResultsByInstitute = catchAsync(async (req, res) => {
  const result = await ResultService.getResultsByInstitute(req.params.instituteId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Institute results fetched successfully',
    data: result,
  });
});

const getTopCoursesByYear = catchAsync(async (req, res) => {
  const result = await ResultService.getTopCoursesByYear(Number(req.params.year));

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Top courses fetched successfully',
    data: result,
  });
});

const getTopStudents = catchAsync(async (req, res) => {
  const result = await ResultService.getTopStudents();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Top students fetched successfully',
    data: result,
  });
});

const getStudentResults = catchAsync(async (req, res) => {
  const result = await ResultService.getStudentResults(req.params.studentId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student results fetched successfully',
    data: result,
  });
});

export default {
  createResult,
  getAllResults,
  getSingleResult,
  updateResult,
  deleteResult,
  getResultsByInstitute,
  getTopCoursesByYear,
  getTopStudents,
  getStudentResults,
};
