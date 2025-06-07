-- AlterTable
ALTER TABLE "organization_settings" ADD COLUMN     "allowGuestBookings" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "customDomain" TEXT,
ADD COLUMN     "dateFormat" TEXT NOT NULL DEFAULT 'MM/DD/YYYY',
ADD COLUMN     "defaultTimeZone" TEXT NOT NULL DEFAULT 'UTC',
ADD COLUMN     "emailProvider" TEXT DEFAULT 'sendgrid',
ADD COLUMN     "enableAnalytics" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "enableCheckIn" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "enablePayments" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "enableRecurringBookings" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "enableReviews" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "enableWaitlist" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "faviconUrl" TEXT,
ADD COLUMN     "firstDayOfWeek" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "logoUrl" TEXT,
ADD COLUMN     "maximumAdvanceBooking" INTEGER NOT NULL DEFAULT 43200,
ADD COLUMN     "minimumAdvanceBooking" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "paymentGateway" TEXT,
ADD COLUMN     "primaryColor" TEXT DEFAULT '#007bff',
ADD COLUMN     "requireMembershipForBooking" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "secondaryColor" TEXT DEFAULT '#6c757d',
ADD COLUMN     "smsProvider" TEXT,
ADD COLUMN     "timeFormat" TEXT NOT NULL DEFAULT '12h';

-- AlterTable
ALTER TABLE "resources" ADD COLUMN     "allowMultipleBookings" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "area" DECIMAL(8,2),
ADD COLUMN     "availableHours" JSONB,
ADD COLUMN     "blockedDates" TIMESTAMP(3)[],
ADD COLUMN     "bookingDuration" INTEGER,
ADD COLUMN     "bufferTime" INTEGER DEFAULT 0,
ADD COLUMN     "category" TEXT,
ADD COLUMN     "hourlyRate" DECIMAL(10,2),
ADD COLUMN     "lastMaintenanceDate" TIMESTAMP(3),
ADD COLUMN     "maintenanceNotes" TEXT,
ADD COLUMN     "maintenanceStatus" TEXT DEFAULT 'operational',
ADD COLUMN     "manufacturer" TEXT,
ADD COLUMN     "maxOccupancy" INTEGER,
ADD COLUMN     "model" TEXT,
ADD COLUMN     "monthlyMaintenance" DECIMAL(10,2),
ADD COLUMN     "nextMaintenanceDate" TIMESTAMP(3),
ADD COLUMN     "purchaseDate" TIMESTAMP(3),
ADD COLUMN     "requiresStaffSupervision" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "serialNumber" TEXT,
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "warrantyExpiry" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "resources_organizationId_type_idx" ON "resources"("organizationId", "type");

-- CreateIndex
CREATE INDEX "resources_organizationId_isActive_idx" ON "resources"("organizationId", "isActive");
