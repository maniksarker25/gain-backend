/*
  Warnings:

  - The `verifyCode` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "verifyCode",
ADD COLUMN     "verifyCode" INTEGER;

-- AlterTable
ALTER TABLE "clients" ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "city" DROP NOT NULL,
ALTER COLUMN "postalCode" DROP NOT NULL,
ALTER COLUMN "country" DROP NOT NULL,
ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "gender" DROP NOT NULL;
