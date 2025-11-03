-- AlterTable
ALTER TABLE "properties" ADD COLUMN "geocodingAccuracy" TEXT,
ADD COLUMN "geocodingFailed" BOOLEAN NOT NULL DEFAULT false;
