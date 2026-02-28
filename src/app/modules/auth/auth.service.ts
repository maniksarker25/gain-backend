/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import resetPasswordEmailBody from '../../emailBody/resetPasswordEmailBody';
import AppError from '../../error/appError';
import { prisma } from '../../utils/prisma';
import sendEmail from '../../utils/sendEmail';
import { TUserRole } from '../user/user.interface';
import { createToken, verifyToken } from '../user/user.utils';
import { TLoginUser } from './auth.interface';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateVerifyCode = (): number => Math.floor(100000 + Math.random() * 900000);

const loginUserIntoDB = async (payload: TLoginUser) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'This user does not exist');
  if (user.isBlocked) throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked');

  const isMatched = await bcrypt.compare(payload.password, user.password);
  if (!isMatched) throw new AppError(httpStatus.FORBIDDEN, 'Password do not match');

  const jwtPayload = {
    id: user.id,
    profileId: user.profileId as string,
    email: user.email,
    role: user.role as TUserRole,
  };

  return {
    accessToken: createToken(jwtPayload, config.jwt_access_secret!, config.jwt_access_expires_in!),
    refreshToken: createToken(
      jwtPayload,
      config.jwt_refresh_secret!,
      config.jwt_refresh_expires_in!
    ),
  };
};

const changePasswordIntoDB = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string; confirmNewPassword: string }
) => {
  if (payload.newPassword !== payload.confirmNewPassword)
    throw new AppError(httpStatus.BAD_REQUEST, 'Password mismatch');

  const user = await prisma.user.findUnique({ where: { id: userData.id } });
  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');

  const isMatched = await bcrypt.compare(payload.oldPassword, user.password);
  if (!isMatched) throw new AppError(httpStatus.FORBIDDEN, 'Password do not match');

  const hashed = await bcrypt.hash(payload.newPassword, Number(config.bcrypt_salt_rounds));

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashed,
      passwordChangedAt: new Date(),
    },
  });

  const jwtPayload = {
    id: user.id,
    profileId: user.profileId as string,
    email: user.email,
    role: user.role as TUserRole,
  };

  return {
    accessToken: createToken(jwtPayload, config.jwt_access_secret!, config.jwt_access_expires_in!),
    refreshToken: createToken(
      jwtPayload,
      config.jwt_refresh_secret!,
      config.jwt_refresh_expires_in!
    ),
  };
};

const refreshToken = async (token: string) => {
  const decoded = verifyToken(token, config.jwt_refresh_secret!);
  const user = await prisma.user.findUnique({ where: { id: decoded.id } });

  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');

  const jwtPayload = {
    id: user.id,
    profileId: user.profileId as string,
    email: user.email,
    role: user.role as TUserRole,
  };

  return {
    accessToken: createToken(jwtPayload, config.jwt_access_secret!, config.jwt_access_expires_in!),
  };
};

const forgetPassword = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');

  const resetCode = generateVerifyCode();

  await prisma.user.update({
    where: { email },
    data: {
      resetCode,
      isResetVerified: false,
      codeExpireIn: new Date(Date.now() + 5 * 60000),
    },
  });

  await sendEmail({
    email,
    subject: 'Reset password code',
    html: resetPasswordEmailBody('Dear', resetCode),
  });

  return null;
};

const verifyResetOtp = async (email: string, resetCode: number) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');

  if (!user.codeExpireIn || user.codeExpireIn < new Date())
    throw new AppError(httpStatus.BAD_REQUEST, 'Reset code expired');

  if (user.resetCode !== resetCode)
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid reset code');

  await prisma.user.update({
    where: { email },
    data: { isResetVerified: true },
  });

  return null;
};

const resetPassword = async (payload: {
  email: string;
  password: string;
  confirmPassword: string;
}) => {
  if (payload.password !== payload.confirmPassword)
    throw new AppError(httpStatus.BAD_REQUEST, 'Password mismatch');

  const user = await prisma.user.findUnique({ where: { email: payload.email } });
  if (!user || !user.isResetVerified)
    throw new AppError(httpStatus.BAD_REQUEST, 'OTP not verified');

  const hashed = await bcrypt.hash(payload.password, Number(config.bcrypt_salt_rounds));

  await prisma.user.update({
    where: { email: payload.email },
    data: {
      password: hashed,
      passwordChangedAt: new Date(),
    },
  });

  const jwtPayload = {
    id: user.id,
    profileId: user.profileId as string,
    email: user.email,
    role: user.role as TUserRole,
  };

  return {
    accessToken: createToken(jwtPayload, config.jwt_access_secret!, config.jwt_access_expires_in!),
    refreshToken: createToken(
      jwtPayload,
      config.jwt_refresh_secret!,
      config.jwt_refresh_expires_in!
    ),
  };
};

const resendResetCode = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user does not exist');
  }
  if (user.isBlocked) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked');
  }

  const resetCode = generateVerifyCode();

  await prisma.user.update({
    where: { email },
    data: {
      resetCode,
      isResetVerified: false,
      codeExpireIn: new Date(Date.now() + 5 * 60 * 1000),
    },
  });

  await sendEmail({
    email: user.email,
    subject: 'Reset password code',
    html: resetPasswordEmailBody('Dear', resetCode),
  });

  return null;
};

const resendVerifyCode = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user does not exist');
  }
  if (user.isBlocked) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked');
  }

  const verifyCode = generateVerifyCode();

  await prisma.user.update({
    where: { email },
    data: {
      verifyCode,
      isVerified: false,
      codeExpireIn: new Date(Date.now() + 5 * 60 * 1000),
    },
  });

  await sendEmail({
    email: user.email,
    subject: 'Verify your account',
    html: resetPasswordEmailBody('Dear', verifyCode),
  });

  return null;
};

export default {
  loginUserIntoDB,
  changePasswordIntoDB,
  refreshToken,
  forgetPassword,
  verifyResetOtp,
  resetPassword,
  resendVerifyCode,
  resendResetCode,
};
