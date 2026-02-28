import { Prisma, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
import httpStatus from 'http-status';
import AppError from '../../error/appError';
import { prisma } from '../../utils/prisma';

interface CreateStudentPayload {
  name: string;
  email: string;
  password: string;
  instituteId: string;
}

interface QueryParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  instituteId?: string;
}

const createStudent = async (payload: CreateStudentPayload) => {
  const isUserExist = await prisma.user.findFirst({
    where: { email: payload.email },
  });

  if (isUserExist) {
    throw new AppError(httpStatus.CONFLICT, 'Student already exists with this email');
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const result = await prisma.$transaction(async (tx) => {
    // create user
    const user = await tx.user.create({
      data: {
        email: payload.email,
        password: hashedPassword,
        role: UserRole.STUDENT,
        profileId: '',
      },
    });

    // create student
    const student = await tx.student.create({
      data: {
        name: payload.name,
        instituteId: payload.instituteId,
        userId: user.id,
        email: payload.email,
      },
    });

    await tx.user.update({
      where: { id: user.id },
      data: { profileId: student.id },
    });

    return student;
  });

  return result;
};

const getAllStudents = async (query: QueryParams) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const filters: Prisma.StudentWhereInput = {};

  if (query.searchTerm) {
    filters.OR = [
      {
        name: {
          contains: query.searchTerm,
          mode: 'insensitive',
        },
      },
      {
        user: {
          email: {
            contains: query.searchTerm,
            mode: 'insensitive',
          },
        },
      },
    ];
  }

  if (query.instituteId) {
    filters.instituteId = query.instituteId;
  }

  const [total, data] = await Promise.all([
    prisma.student.count({ where: filters }),

    prisma.student.findMany({
      where: filters,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },

      include: {
        institute: true,
        user: {
          select: {
            email: true,
            role: true,
            isActive: true,
            isBlocked: true,
          },
        },
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

const getSingleStudent = async (id: string) => {
  const student = await prisma.student.findUnique({
    where: { id },

    include: {
      institute: true,
      user: {
        select: {
          email: true,
          role: true,
          isActive: true,
          isBlocked: true,
        },
      },
    },
  });

  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student not found');
  }

  return student;
};

const updateStudent = async (id: string, payload: Partial<Prisma.StudentUpdateInput>) => {
  const isExist = await prisma.student.findUnique({
    where: { id },
  });

  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student not found');
  }

  const result = await prisma.student.update({
    where: { id },
    data: payload,
  });

  return result;
};

const deleteStudent = async (id: string) => {
  const student = await prisma.student.findUnique({
    where: { id },
    include: { user: true },
  });

  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student not found');
  }

  const deletedUser = await prisma.user.delete({
    where: { id: student.userId },
  });

  return deletedUser;
};
const StudentService = {
  createStudent,
  getAllStudents,
  getSingleStudent,
  updateStudent,
  deleteStudent,
};

export default StudentService;
