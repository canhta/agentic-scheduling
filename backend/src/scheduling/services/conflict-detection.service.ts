import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BookingStatus, DayOfWeek } from '../../../generated/prisma';
import { ConflictCheckResult, ConflictDetail } from '../types';

@Injectable()
export class ConflictDetectionService {
  constructor(private prisma: PrismaService) {}

  async checkBookingConflicts(data: {
    organizationId: string;
    startTime: Date;
    endTime: Date;
    serviceId?: string;
    resourceId?: string;
    staffId?: string;
    userId: string;
    excludeBookingId?: string;
  }): Promise<ConflictCheckResult> {
    const conflicts: ConflictDetail[] = [];

    // Check staff conflicts
    if (data.staffId) {
      const staffConflicts = await this.getStaffConflicts({
        ...data,
        staffId: data.staffId,
      });
      conflicts.push(...staffConflicts);
    }

    // Check resource conflicts
    if (data.resourceId) {
      const resourceConflicts = await this.getResourceConflicts({
        ...data,
        resourceId: data.resourceId,
      });
      conflicts.push(...resourceConflicts);
    }

    // Check member conflicts
    const memberConflicts = await this.getMemberConflicts(data);
    conflicts.push(...memberConflicts);

    // Check staff availability
    if (data.staffId) {
      const availabilityConflicts = await this.checkStaffAvailability({
        ...data,
        staffId: data.staffId,
      });
      conflicts.push(...availabilityConflicts);
    }

    // Check service capacity
    if (data.serviceId) {
      const capacityConflicts = await this.checkServiceCapacity({
        ...data,
        serviceId: data.serviceId,
      });
      conflicts.push(...capacityConflicts);
    }

    return {
      hasConflict: conflicts.length > 0,
      conflicts,
    };
  }

  private async getStaffConflicts(data: {
    organizationId: string;
    startTime: Date;
    endTime: Date;
    staffId: string;
    excludeBookingId?: string;
  }): Promise<ConflictDetail[]> {
    const conflictingBookings = await this.prisma.booking.findMany({
      where: {
        organizationId: data.organizationId,
        staffId: data.staffId,
        id: data.excludeBookingId ? { not: data.excludeBookingId } : undefined,
        OR: [
          {
            startTime: { lt: data.endTime },
            endTime: { gt: data.startTime },
          },
        ],
        status: {
          notIn: [
            BookingStatus.CANCELLED_BY_MEMBER,
            BookingStatus.CANCELLED_BY_STAFF,
            BookingStatus.NO_SHOW,
          ],
        },
      },
      include: {
        staff: { select: { firstName: true, lastName: true } },
        service: { select: { name: true } },
      },
    });

    return conflictingBookings.map((booking) => {
      const staffName = booking.staff
        ? `${booking.staff.firstName} ${booking.staff.lastName}`
        : 'Unknown Staff';
      const serviceName = booking.service?.name || 'another service';

      return {
        type: 'staff' as const,
        conflictingBookingId: booking.id,
        message: `Staff ${staffName} is already booked for ${serviceName}`,
        details: {
          startTime: booking.startTime,
          endTime: booking.endTime,
        },
      };
    });
  }

  private async getResourceConflicts(data: {
    organizationId: string;
    startTime: Date;
    endTime: Date;
    resourceId: string;
    excludeBookingId?: string;
  }): Promise<ConflictDetail[]> {
    const conflictingBookings = await this.prisma.booking.findMany({
      where: {
        organizationId: data.organizationId,
        resourceId: data.resourceId,
        id: data.excludeBookingId ? { not: data.excludeBookingId } : undefined,
        OR: [
          {
            startTime: { lt: data.endTime },
            endTime: { gt: data.startTime },
          },
        ],
        status: {
          notIn: [
            BookingStatus.CANCELLED_BY_MEMBER,
            BookingStatus.CANCELLED_BY_STAFF,
            BookingStatus.NO_SHOW,
          ],
        },
      },
      include: {
        resource: { select: { name: true, type: true } },
        service: { select: { name: true } },
      },
    });

    return conflictingBookings.map((booking) => ({
      type: 'resource' as const,
      conflictingBookingId: booking.id,
      message: `Resource ${booking.resource?.name} (${booking.resource?.type}) is already booked for ${booking.service?.name || 'another service'}`,
      details: {
        startTime: booking.startTime,
        endTime: booking.endTime,
      },
    }));
  }

  private async getMemberConflicts(data: {
    organizationId: string;
    startTime: Date;
    endTime: Date;
    userId: string;
    excludeBookingId?: string;
  }): Promise<ConflictDetail[]> {
    if (!data.userId) return [];

    const memberConflicts = await this.prisma.booking.findMany({
      where: {
        organizationId: data.organizationId,
        userId: data.userId,
        id: data.excludeBookingId ? { not: data.excludeBookingId } : undefined,
        OR: [
          {
            startTime: { lt: data.endTime },
            endTime: { gt: data.startTime },
          },
        ],
        status: {
          notIn: [
            BookingStatus.CANCELLED_BY_MEMBER,
            BookingStatus.CANCELLED_BY_STAFF,
            BookingStatus.NO_SHOW,
          ],
        },
      },
      include: {
        user: { select: { firstName: true, lastName: true } },
        service: { select: { name: true } },
      },
    });

    return memberConflicts.map((booking) => ({
      type: 'member' as const,
      conflictingBookingId: booking.id,
      message: `Member ${booking.user?.firstName} ${booking.user?.lastName} already has a booking for ${booking.service?.name || 'another service'}`,
      details: {
        startTime: booking.startTime,
        endTime: booking.endTime,
      },
    }));
  }

  private async checkStaffAvailability(data: {
    organizationId: string;
    startTime: Date;
    endTime: Date;
    staffId: string;
  }): Promise<ConflictDetail[]> {
    const dayOfWeek = data.startTime.getDay();
    const startTimeStr = data.startTime.toTimeString().substring(0, 8);
    const endTimeStr = data.endTime.toTimeString().substring(0, 8);

    // Convert JavaScript day (0=Sunday) to Prisma DayOfWeek enum
    const dayOfWeekEnum = this.convertToDayOfWeek(dayOfWeek);

    const availability = await this.prisma.staffAvailability.findFirst({
      where: {
        userId: data.staffId,
        dayOfWeek: dayOfWeekEnum,
        startTime: { lte: startTimeStr },
        endTime: { gte: endTimeStr },
      },
    });

    if (!availability) {
      return [
        {
          type: 'availability' as const,
          message: `Staff is not available during the requested time`,
          details: {
            startTime: data.startTime,
            endTime: data.endTime,
          },
        },
      ];
    }

    return [];
  }

  private async checkServiceCapacity(data: {
    organizationId: string;
    startTime: Date;
    endTime: Date;
    serviceId: string;
    excludeBookingId?: string;
  }): Promise<ConflictDetail[]> {
    const service = await this.prisma.service.findUnique({
      where: { id: data.serviceId },
      select: { capacity: true, name: true },
    });

    if (!service?.capacity) {
      return []; // No capacity limit
    }

    const existingBookings = await this.prisma.booking.count({
      where: {
        organizationId: data.organizationId,
        serviceId: data.serviceId,
        id: data.excludeBookingId ? { not: data.excludeBookingId } : undefined,
        OR: [
          {
            startTime: { lt: data.endTime },
            endTime: { gt: data.startTime },
          },
        ],
        status: {
          notIn: [
            BookingStatus.CANCELLED_BY_MEMBER,
            BookingStatus.CANCELLED_BY_STAFF,
            BookingStatus.NO_SHOW,
          ],
        },
      },
    });

    if (existingBookings >= service.capacity) {
      return [
        {
          type: 'capacity' as const,
          message: `Service ${service.name} is at full capacity (${service.capacity}/${service.capacity})`,
          details: {
            startTime: data.startTime,
            endTime: data.endTime,
          },
        },
      ];
    }

    return [];
  }

  async getAvailableTimeSlots(data: {
    organizationId: string;
    date: Date;
    serviceId?: string;
    resourceId?: string;
    staffId?: string;
    duration: number; // in minutes
  }): Promise<{ startTime: Date; endTime: Date }[]> {
    const startOfDay = new Date(data.date);
    startOfDay.setHours(6, 0, 0, 0); // Start checking from 6 AM
    const endOfDay = new Date(data.date);
    endOfDay.setHours(22, 0, 0, 0); // End checking at 10 PM

    const slots: { startTime: Date; endTime: Date }[] = [];

    for (
      let time = new Date(startOfDay);
      time < endOfDay;
      time.setMinutes(time.getMinutes() + 30) // 30-minute intervals
    ) {
      const slotEnd = new Date(time.getTime() + data.duration * 60000);

      // Check if this slot has conflicts
      const conflictResult = await this.checkBookingConflicts({
        organizationId: data.organizationId,
        startTime: time,
        endTime: slotEnd,
        serviceId: data.serviceId,
        resourceId: data.resourceId,
        staffId: data.staffId,
        userId: '', // No user ID for availability check
      });

      if (!conflictResult.hasConflict) {
        slots.push({
          startTime: new Date(time),
          endTime: new Date(slotEnd),
        });
      }
    }

    return slots;
  }

  private convertToDayOfWeek(jsDay: number): DayOfWeek {
    // JavaScript: 0=Sunday, 1=Monday, ..., 6=Saturday
    // Prisma: MONDAY, TUESDAY, ..., SUNDAY
    const dayMap: Record<number, DayOfWeek> = {
      0: DayOfWeek.SUNDAY,
      1: DayOfWeek.MONDAY,
      2: DayOfWeek.TUESDAY,
      3: DayOfWeek.WEDNESDAY,
      4: DayOfWeek.THURSDAY,
      5: DayOfWeek.FRIDAY,
      6: DayOfWeek.SATURDAY,
    };

    return dayMap[jsDay];
  }
}
