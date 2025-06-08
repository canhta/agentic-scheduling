-- AlterTable
ALTER TABLE "locations" ADD COLUMN     "description" TEXT,
ADD COLUMN     "isPrimary" BOOLEAN NOT NULL DEFAULT false;
