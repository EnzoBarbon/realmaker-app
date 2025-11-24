-- AlterTable
ALTER TABLE "Company" ADD COLUMN "onboardingData" JSONB;
ALTER TABLE "Company" ADD COLUMN "onboardingCompletedAt" TIMESTAMP(3);
