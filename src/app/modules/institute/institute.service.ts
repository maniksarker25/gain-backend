import { Institute, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import AppError from '../../error/appError';
import { prisma } from '../../utils/prisma';

interface QueryParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
}

const createInstitute = async (payload: Prisma.InstituteCreateInput) => {
  const isExist = await prisma.institute.findFirst({
    where: {
      name: {
        equals: payload.name,
        mode: 'insensitive',
      },
    },
  });

  if (isExist) {
    throw new AppError(httpStatus.CONFLICT, 'Institute already exists');
  }

  const result = await prisma.institute.create({
    data: payload,
  });

  return result;
};

const getAllInstitutes = async (query: QueryParams) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const filters: Prisma.InstituteWhereInput = {};

  if (query.searchTerm) {
    filters.OR = [
      {
        name: {
          contains: query.searchTerm,
          mode: 'insensitive',
        },
      },
      {
        address: {
          contains: query.searchTerm,
          mode: 'insensitive',
        },
      },
    ];
  }

  const [total, data] = await Promise.all([
    prisma.institute.count({
      where: filters,
    }),

    prisma.institute.findMany({
      where: filters,
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },

      include: {
        _count: {
          select: {
            students: true,
            results: true,
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

const getSingleInstitute = async (id: string) => {
  const result = await prisma.institute.findUnique({
    where: { id },

    include: {
      students: {
        select: {
          id: true,
          name: true,
          createdAt: true,
        },
      },

      _count: {
        select: {
          students: true,
          results: true,
        },
      },
    },
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Institute not found');
  }

  return result;
};

const updateInstitute = async (id: string, payload: Partial<Institute>) => {
  const isExist = await prisma.institute.findUnique({
    where: { id },
  });

  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Institute not found');
  }

  const result = await prisma.institute.update({
    where: { id },
    data: payload,
  });

  return result;
};

const deleteInstitute = async (id: string) => {
  const isExist = await prisma.institute.findUnique({
    where: { id },
  });

  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Institute not found');
  }

  const result = await prisma.institute.delete({
    where: { id },
  });

  return result;
};

const InstituteService = {
  createInstitute,
  getAllInstitutes,
  getSingleInstitute,
  updateInstitute,
  deleteInstitute,
};

export default InstituteService;
