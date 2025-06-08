/*
  Warnings:

  - Changed the type of `frequency` on the `recurring_schedules` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "BookingType" AS ENUM ('INDIVIDUAL', 'CLASS', 'APPOINTMENT', 'EVENT');

-- CreateEnum
CREATE TYPE "Frequency" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY');

-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "type" "BookingType" NOT NULL DEFAULT 'CLASS';

-- AlterTable
ALTER TABLE "recurring_schedules" DROP COLUMN "frequency",
ADD COLUMN     "frequency" "Frequency" NOT NULL;
