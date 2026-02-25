/*
  Warnings:

  - Added the required column `gender` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `Trainer` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female');

-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "gender" "Gender" NOT NULL;

-- AlterTable
ALTER TABLE "Trainer" ADD COLUMN     "gender" "Gender" NOT NULL;
