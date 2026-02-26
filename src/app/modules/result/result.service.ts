import { Prisma, Result } from '@prisma/client';
import httpStatus from 'http-status';
import AppError from '../../error/appError';
import { prisma } from '../../utils/prisma';

interface QueryParams {
  page?: number;
  limit?: number;
  instituteId?: string;
  studentId?: string;
  courseId?: string;
  year?: number;
}

// CREATE RESULT
const createResult = async (payload: Prisma.ResultCreateInput) => {
  const result = await prisma.result.create({
    data: payload,
    include: {
      student: true,
      course: true,
      institute: true,
    },
  });

  return result;
};

// GET ALL RESULTS
const getAllResults = async (query: QueryParams) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const filters: Prisma.ResultWhereInput = {};

  if (query.instituteId) filters.instituteId = query.instituteId;
  if (query.studentId) filters.studentId = query.studentId;
  if (query.courseId) filters.courseId = query.courseId;
  if (query.year) filters.year = Number(query.year);

  const [total, data] = await Promise.all([
    prisma.result.count({ where: filters }),

    prisma.result.findMany({
      where: filters,
      skip,
      take: limit,
      orderBy: { marks: 'desc' },
      include: {
        student: true,
        course: true,
        institute: true,
      },
    }),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data,
  };
};

// GET SINGLE RESULT
const getSingleResult = async (id: string) => {
  const result = await prisma.result.findUnique({
    where: { id },
    include: {
      student: true,
      course: true,
      institute: true,
    },
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Result not found');
  }

  return result;
};

// UPDATE RESULT
const updateResult = async (id: string, payload: Partial<Result>) => {
  const existing = await prisma.result.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new AppError(httpStatus.NOT_FOUND, 'Result not found');
  }

  const result = await prisma.result.update({
    where: { id },
    data: payload,
  });

  return result;
};

// DELETE RESULT
const deleteResult = async (id: string) => {
  const existing = await prisma.result.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new AppError(httpStatus.NOT_FOUND, 'Result not found');
  }

  const result = await prisma.result.delete({
    where: { id },
  });

  return result;
};

// RESULTS PER INSTITUTE
const getResultsByInstitute = async (instituteId: string) => {
  const results = await prisma.result.findMany({
    where: { instituteId },
    orderBy: { marks: 'desc' },
    include: {
      student: true,
      course: true,
    },
  });

  return results;
};

// TOP COURSES PER YEAR
const getTopCoursesByYear = async (year: number) => {
  const results = await prisma.result.groupBy({
    by: ['courseId'],
    where: { year },
    _count: {
      courseId: true,
    },
    orderBy: {
      _count: {
        courseId: 'desc',
      },
    },
    take: 5,
  });

  const courseIds = results.map((r) => r.courseId);

  const courses = await prisma.course.findMany({
    where: { id: { in: courseIds } },
  });

  return courses;
};

// TOP STUDENTS BY HIGHEST RESULTS
const getTopStudents = async () => {
  const results = await prisma.result.groupBy({
    by: ['studentId'],
    _avg: {
      marks: true,
    },
    orderBy: {
      _avg: {
        marks: 'desc',
      },
    },
    take: 10,
  });

  const studentIds = results.map((r) => r.studentId);

  const students = await prisma.student.findMany({
    where: { id: { in: studentIds } },
    include: {
      institute: true,
    },
  });

  return students;
};

// STUDENT RESULTS
const getStudentResults = async (studentId: string) => {
  const results = await prisma.result.findMany({
    where: { studentId },
    orderBy: { year: 'desc' },
    include: {
      course: true,
      institute: true,
    },
  });

  return results;
};

const ResultService = {
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

export default ResultService;
