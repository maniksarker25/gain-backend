-- AlterTable
ALTER TABLE "Trainer" ADD COLUMN     "isCertificateProvided" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPersonalInfoProvided" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isSpecializationProvided" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isTrainingLocationProvided" BOOLEAN NOT NULL DEFAULT false;
