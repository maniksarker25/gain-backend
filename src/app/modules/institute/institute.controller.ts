import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import InstituteService from './institute.service';

const createInstitute = catchAsync(async (req, res) => {
  const result = await InstituteService.createInstitute(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Institute created successfully',
    data: result,
  });
});

const getAllInstitutes = catchAsync(async (req, res) => {
  const result = await InstituteService.getAllInstitutes(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Institutes fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleInstitute = catchAsync(async (req, res) => {
  const result = await InstituteService.getSingleInstitute(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Institute fetched successfully',
    data: result,
  });
});

const updateInstitute = catchAsync(async (req, res) => {
  const result = await InstituteService.updateInstitute(req.params.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Institute updated successfully',
    data: result,
  });
});

const deleteInstitute = catchAsync(async (req, res) => {
  const result = await InstituteService.deleteInstitute(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Institute deleted successfully',
    data: result,
  });
});

const InstituteController = {
  createInstitute,
  getAllInstitutes,
  getSingleInstitute,
  updateInstitute,
  deleteInstitute,
};

export default InstituteController;
