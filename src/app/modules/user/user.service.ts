/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client, UserRoles } from "@prisma/client";
import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import cron from "node-cron";
import config from "../../config";
import registrationSuccessEmailBody from "../../emailBody/registerSuccessEmail";
import AppError from "../../error/appError";
import { prisma } from "../../utils/prisma";
import sendEmail from "../../utils/sendEmail";
import { USER_ROLE } from "./user.constant";
import { TUserRole } from "./user.interface";
import { createToken } from "./user.utils";

const generateVerifyCode = (): number => {
  return Math.floor(100000 + Math.random() * 900000);
};

const registerUser = async (
  payload: Client & { password: string; confirmPassword: string; role: UserRoles }
) => {
  const { password, confirmPassword, ...userData } = payload;

  if (password !== confirmPassword) {
    throw new AppError(httpStatus.BAD_REQUEST, "Password and confirm password doesn't match");
  }

  const isUserExists = await prisma.user.findUnique({ where: { email: userData.email } });
  if (isUserExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "This email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const verifyCode = generateVerifyCode();

  // Transaction: create User + NormalUser + RecommendedUsers
  if (payload.role == UserRoles.client) {
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: userData.email,
          password: hashedPassword,
          role: UserRoles.client,
          verifyCode,
          codeExpireIn: new Date(Date.now() + 5 * 60 * 1000),
        },
      });

      const client = await tx.client.create({
        data: {
          userId: user.id,
          name: userData.name,
          email: userData.email,
          phone: userData.phone || "",
        },
      });

      await tx.user.update({
        where: { id: user.id },
        data: { profileId: client.id },
      });

      return client;
    });

    // Send email outside transaction
    sendEmail({
      email: payload.email,
      subject: "Activate Your Account",
      html: registrationSuccessEmailBody(result.name, verifyCode),
    });

    return result;
  } else {
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: userData.email,
          password: hashedPassword,
          role: UserRoles.client,
          verifyCode,
          codeExpireIn: new Date(Date.now() + 5 * 60 * 1000),
        },
      });

      const normalUser = await tx.trainer.create({
        data: {
          userId: user.id,
          name: userData.name,
          email: userData.email,
          phone: userData.phone || "",
        },
      });

      await tx.user.update({
        where: { id: user.id },
        data: { profileId: normalUser.id },
      });

      return normalUser;
    });

    // Send email outside transaction
    sendEmail({
      email: payload.email,
      subject: "Activate Your Account",
      html: registrationSuccessEmailBody(result.name, verifyCode),
    });

    return result;
  }
};

const verifyCode = async (email: string, verifyCode: number) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");
  if (!user.codeExpireIn || user.codeExpireIn < new Date())
    throw new AppError(httpStatus.BAD_REQUEST, "Verify code is expired");
  if (user.verifyCode !== verifyCode)
    throw new AppError(httpStatus.BAD_REQUEST, "Code doesn't match");

  const updatedUser = await prisma.user.update({
    where: { email },
    data: { isVerified: true },
  });

  const jwtPayload = {
    id: updatedUser.id,
    profileId: updatedUser.profileId as string,
    email: updatedUser.email,
    role: updatedUser.role as TUserRole,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );

  return { accessToken, refreshToken };
};

const resendVerifyCode = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");

  const verifyCode = generateVerifyCode();

  await prisma.user.update({
    where: { email },
    data: { verifyCode, codeExpireIn: new Date(Date.now() + 5 * 60 * 1000) },
  });

  await sendEmail({
    email,
    subject: "Activate Your Account",
    html: registrationSuccessEmailBody("Dear", verifyCode),
  });

  return null;
};

const deleteUserAccount = async (userPayload: JwtPayload, password: string) => {
  const user = await prisma.user.findUnique({ where: { id: userPayload.id } });
  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError(httpStatus.FORBIDDEN, "Password do not match");

  await prisma.$transaction(async (tx) => {
    if (user.profileId) {
      await tx.client.delete({ where: { id: user.profileId } });
    }
    await tx.user.delete({ where: { id: user.id } });
  });

  return null;
};

const getMyProfile = async (userData: JwtPayload) => {
  if (userData.role === UserRoles.client) {
    return prisma.client.findUnique({ where: { email: userData.email } });
  }
  if (userData.role === UserRoles.trainer) {
    return prisma.trainer.findUnique({ where: { email: userData.email } });
  }
  if (userData.role === USER_ROLE.superAdmin) {
    return prisma.superAdmin.findFirst({ where: { email: userData.email } });
  }
  return null;
};

const changeUserStatus = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");

  const updatedUser = await prisma.user.update({
    where: { id },
    data: { isBlocked: !user.isBlocked },
  });

  return updatedUser;
};

cron.schedule("*/2 * * * *", async () => {
  try {
    const now = new Date();

    // Find expired, unverified users
    const expiredUsers = await prisma.user.findMany({
      where: {
        isVerified: false,
        codeExpireIn: {
          lte: now,
        },
      },
      select: {
        id: true,
      },
    });

    if (expiredUsers.length === 0) return;

    const expiredUserIds = expiredUsers.map((user) => user.id);

    //  Delete related Customer records
    const clientDeleteResult = await prisma.client.deleteMany({
      where: {
        userId: {
          in: expiredUserIds,
        },
      },
    });

    //  Delete related Provider records
    const trainerDeleteResult = await prisma.trainer.deleteMany({
      where: {
        userId: {
          in: expiredUserIds,
        },
      },
    });

    // Delete expired users
    const userDeleteResult = await prisma.user.deleteMany({
      where: {
        id: {
          in: expiredUserIds,
        },
      },
    });

    console.log(`Deleted ${userDeleteResult.count} expired inactive users`);
    console.log(`Deleted ${clientDeleteResult.count} associated Client documents`);
    console.log(`Deleted ${trainerDeleteResult.count} associated Trainer documents`);
  } catch (error) {
    console.error("Error deleting expired users and associated data:", error);
  }
});

export const userServices = {
  registerUser,
  verifyCode,
  resendVerifyCode,
  deleteUserAccount,
  getMyProfile,
  changeUserStatus,
};
