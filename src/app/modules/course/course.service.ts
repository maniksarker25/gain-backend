import { Course } from '@prisma/client';
import httpStatus from 'http-status';
import AppError from '../../error/appError';
import { prisma } from '../../utils/prisma';

interface QueryParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
}

const createCourse = async (payload: Course) => {
  const isExist = await prisma.course.findFirst({ where: { name: payload.name } });
  if (isExist) {
    throw new AppError(httpStatus.CONFLICT, 'Course already exists with this name');
  }

  const result = await prisma.course.create({ data: payload });
  return result;
};

const getAllCourses = async (query: QueryParams) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const filters: any = {};
  if (query.searchTerm) {
    filters.name = { contains: query.searchTerm, mode: 'insensitive' };
  }

  const [total, data] = await Promise.all([
    prisma.course.count({ where: filters }),
    prisma.course.findMany({
      where: filters,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return {
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    data,
  };
};

const getSingleCourse = async (id: string) => {
  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) throw new AppError(httpStatus.NOT_FOUND, 'Course not found');
  return course;
};

const updateCourse = async (id: string, payload: Partial<Course>) => {
  const existing = await prisma.course.findUnique({ where: { id } });
  if (!existing) throw new AppError(httpStatus.NOT_FOUND, 'Course not found');

  const updated = await prisma.course.update({ where: { id }, data: payload });
  return updated;
};

const deleteCourse = async (id: string) => {
  const existing = await prisma.course.findUnique({ where: { id } });
  if (!existing) throw new AppError(httpStatus.NOT_FOUND, 'Course not found');

  const deleted = await prisma.course.delete({ where: { id } });
  return deleted;
};

const CourseService = {
  createCourse,
  getAllCourses,
  getSingleCourse,
  updateCourse,
  deleteCourse,
};

export default CourseService;
