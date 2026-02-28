/*
  Warnings:

  - You are about to drop the column `profileId` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "profileId",
ADD COLUMN     "codeExpireIn" TIMESTAMP(3),
ADD COLUMN     "isResetVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "passwordChangedAt" TIMESTAMP(3),
ADD COLUMN     "resetCode" INTEGER,
ADD COLUMN     "verifyCode" INTEGER;
