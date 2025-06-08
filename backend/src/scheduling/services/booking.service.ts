import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBookingDto, UpdateBookingDto } from '../dto';

import { BookingStatus, Prisma, ServiceType } from 'generated/prisma';
import { ConflictCheckResult, ConflictDetail } from '../types';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  async createBooking(
    organizationId: string,
    dto: CreateBookingDto,
  ): Promise<any> {
    // Validate that the user, service, and resource belong to the organization
    await this.validateBookingData(organizationId, dto);

    // Check for conflicts before creating
    const conflictCheck = await this.checkConflicts({
      organizationId,
      startTime: dto.startTime,
      endTime: dto.endTime,
      serviceId: dto.serviceId,
      resourceId: dto.resourceId,
      excludeBookingId: undefined,
    });

    if (conflictCheck.hasConflict) {
      throw new BadRequestException({
        message: 'Booking conflicts detected',
        conflicts: conflictCheck.conflicts,
      });
    }

    // Create the booking
    const bookingData: Prisma.BookingCreateInput = {
      organization: { connect: { id: organizationId } },
      user: { connect: { id: dto.userId } },
      service: { connect: { id: dto.serviceId } },
      startTime: dto.startTime,
      endTime: dto.endTime,
      allDay: dto.allDay || false,
      status: dto.status || BookingStatus.CONFIRMED,
      notes: dto.notes,
      privateNotes: dto.privateNotes,
      price: dto.price,
      creditsUsed: dto.creditsUsed,
    };

    if (dto.locationId) {
      bookingData.location = { connect: { id: dto.locationId } };
    }

    if (dto.resourceId) {
      bookingData.resource = { connect: { id: dto.resourceId } };
    }

    if (dto.recurringScheduleId) {
      bookingData.recurringSchedule = {
        connect: { id: dto.recurringScheduleId },
      };
      bookingData.instanceDate = dto.instanceDate;
    }

    const booking = await this.prisma.booking.create({
      data: bookingData,
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        service: {
          select: {
            id: true,
            name: true,
            duration: true,
            capacity: true,
            type: true,
            primaryInstructor: {
              select: { id: true, firstName: true, lastName: true },
            },
          },
        },
        resource: {
          select: { id: true, name: true, type: true },
        },
        location: {
          select: { id: true, name: true },
        },
        organization: {
          select: { id: true, name: true },
        },
      },
    });

    // If this is a class booking, check if we need to process waitlist
    if (
      booking.service?.type === ServiceType.CLASS &&
      booking.service?.capacity
    ) {
      await this.processWaitlistAfterBooking(booking.serviceId, dto.startTime);
    }

    return booking;
  }

  async updateBooking(
    organizationId: string,
    bookingId: string,
    dto: UpdateBookingDto,
  ): Promise<any> {
    const existingBooking = await this.prisma.booking.findFirst({
      where: { id: bookingId, organizationId },
      include: { recurringSchedule: true, service: true },
    });

    if (!existingBooking) {
      throw new NotFoundException('Booking not found');
    }

    // If updating time, check for conflicts
    if (dto.startTime || dto.endTime) {
      const conflictCheck = await this.checkConflicts({
        organizationId,
        startTime: dto.startTime || existingBooking.startTime,
        endTime: dto.endTime || existingBooking.endTime,
        serviceId: existingBooking.serviceId,
        resourceId: existingBooking.resourceId ?? undefined,
        excludeBookingId: bookingId,
      });

      if (conflictCheck.hasConflict) {
        throw new BadRequestException({
          message: 'Booking conflicts detected',
          conflicts: conflictCheck.conflicts,
        });
      }
    }

    const updateData: Prisma.BookingUpdateInput = {};

    if (dto.startTime) updateData.startTime = dto.startTime;
    if (dto.endTime) updateData.endTime = dto.endTime;
    if (dto.status) updateData.status = dto.status;
    if (dto.notes !== undefined) updateData.notes = dto.notes;
    if (dto.privateNotes !== undefined)
      updateData.privateNotes = dto.privateNotes;
    if (dto.price !== undefined) updateData.price = dto.price;
    if (dto.creditsUsed !== undefined) updateData.creditsUsed = dto.creditsUsed;

    return this.prisma.booking.update({
      where: { id: bookingId },
      data: updateData,
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        service: {
          select: {
            id: true,
            name: true,
            duration: true,
            capacity: true,
            type: true,
            primaryInstructor: {
              select: { id: true, firstName: true, lastName: true },
            },
          },
        },
        resource: {
          select: { id: true, name: true, type: true },
        },
        location: {
          select: { id: true, name: true },
        },
      },
    });
  }

  async cancelBooking(organizationId: string, bookingId: string): Promise<any> {
    const booking = await this.prisma.booking.findFirst({
      where: { id: bookingId, organizationId },
      include: { service: true },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const updatedBooking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: BookingStatus.CANCELLED_BY_MEMBER },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        service: {
          select: { id: true, name: true, capacity: true, type: true },
        },
      },
    });

    // If this was a class booking, process waitlist
    if (booking.service?.type === ServiceType.CLASS && booking.serviceId) {
      await this.processWaitlistAfterCancellation(
        booking.serviceId,
        booking.startTime,
      );
    }

    return updatedBooking;
  }

  async getBooking(organizationId: string, bookingId: string): Promise<any> {
    const booking = await this.prisma.booking.findFirst({
      where: { id: bookingId, organizationId },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        service: {
          select: {
            id: true,
            name: true,
            duration: true,
            capacity: true,
            type: true,
            primaryInstructor: {
              select: { id: true, firstName: true, lastName: true },
            },
          },
        },
        resource: {
          select: { id: true, name: true, type: true },
        },
        location: {
          select: { id: true, name: true },
        },
        recurringSchedule: {
          select: { id: true, rrule: true, description: true },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  async getBookings(
    organizationId: string,
    filters: {
      startDate?: Date;
      endDate?: Date;
      memberId?: string; // Maps to userId in database
      staffId?: string;
      serviceId?: string;
      resourceId?: string;
      status?: BookingStatus;
      type?: any; // BookingType from the controller
    },
  ): Promise<any[]> {
    const where: Prisma.BookingWhereInput = {
      organizationId,
    };

    // Date range filtering
    if (filters.startDate || filters.endDate) {
      where.startTime = {};
      if (filters.startDate) where.startTime.gte = filters.startDate;
      if (filters.endDate) where.startTime.lte = filters.endDate;
    }

    // User filtering (memberId maps to userId in database)
    if (filters.memberId) {
      where.userId = filters.memberId;
    }

    // Staff filtering
    if (filters.staffId) {
      where.staffId = filters.staffId;
    }

    // Service filtering
    if (filters.serviceId) {
      where.serviceId = filters.serviceId;
    }

    // Resource filtering
    if (filters.resourceId) {
      where.resourceId = filters.resourceId;
    }

    // Status filtering
    if (filters.status) {
      where.status = filters.status;
    }

    // Type filtering (if provided)
    if (filters.type) {
      where.service = {
        type: filters.type,
      };
    }

    return this.prisma.booking.findMany({
      where,
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        service: {
          select: {
            id: true,
            name: true,
            duration: true,
            capacity: true,
            type: true,
            primaryInstructor: {
              select: { id: true, firstName: true, lastName: true },
            },
          },
        },
        resource: {
          select: { id: true, name: true, type: true },
        },
        location: {
          select: { id: true, name: true },
        },
        recurringSchedule: {
          select: { id: true, rrule: true, description: true },
        },
      },
      orderBy: { startTime: 'asc' },
    });
  }

  async getUserBookings(
    organizationId: string,
    userId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<any[]> {
    const where: Prisma.BookingWhereInput = {
      organizationId,
      userId,
    };

    if (startDate || endDate) {
      where.startTime = {};
      if (startDate) where.startTime.gte = startDate;
      if (endDate) where.startTime.lte = endDate;
    }

    return this.prisma.booking.findMany({
      where,
      include: {
        service: {
          select: {
            id: true,
            name: true,
            duration: true,
            type: true,
            primaryInstructor: {
              select: { id: true, firstName: true, lastName: true },
            },
          },
        },
        resource: {
          select: { id: true, name: true, type: true },
        },
        location: {
          select: { id: true, name: true },
        },
      },
      orderBy: { startTime: 'asc' },
    });
  }

  async getServiceBookings(
    organizationId: string,
    serviceId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<any[]> {
    const where: Prisma.BookingWhereInput = {
      organizationId,
      serviceId,
      status: { not: BookingStatus.CANCELLED_BY_MEMBER },
    };

    if (startDate || endDate) {
      where.startTime = {};
      if (startDate) where.startTime.gte = startDate;
      if (endDate) where.startTime.lte = endDate;
    }

    return this.prisma.booking.findMany({
      where,
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        resource: {
          select: { id: true, name: true, type: true },
        },
        location: {
          select: { id: true, name: true },
        },
      },
      orderBy: { startTime: 'asc' },
    });
  }

  async checkConflicts(data: {
    organizationId: string;
    startTime: Date;
    endTime: Date;
    serviceId?: string;
    resourceId?: string;
    excludeBookingId?: string;
  }): Promise<ConflictCheckResult> {
    const conflicts: ConflictDetail[] = [];

    // Check resource conflicts
    if (data.resourceId) {
      const resourceConflicts = await this.prisma.booking.findMany({
        where: {
          organizationId: data.organizationId,
          resourceId: data.resourceId,
          id: data.excludeBookingId
            ? { not: data.excludeBookingId }
            : undefined,
          status: { not: BookingStatus.CANCELLED_BY_MEMBER },
          OR: [
            {
              startTime: { lt: data.endTime },
              endTime: { gt: data.startTime },
            },
          ],
        },
        include: {
          user: { select: { firstName: true, lastName: true } },
          resource: { select: { name: true } },
        },
      });

      resourceConflicts.forEach((booking) => {
        conflicts.push({
          type: 'resource' as const,
          conflictingBookingId: booking.id,
          message: `Resource ${booking.resource?.name} is already booked`,
          details: {
            startTime: booking.startTime,
            endTime: booking.endTime,
          },
        });
      });
    }

    // Check member conflicts (if they're trying to book at the same time)
    const memberConflicts = await this.prisma.booking.findMany({
      where: {
        organizationId: data.organizationId,
        id: data.excludeBookingId ? { not: data.excludeBookingId } : undefined,
        status: { not: BookingStatus.CANCELLED_BY_MEMBER },
        startTime: { lt: data.endTime },
        endTime: { gt: data.startTime },
      },
      include: {
        user: { select: { firstName: true, lastName: true } },
      },
    });

    memberConflicts.forEach((booking) => {
      conflicts.push({
        type: 'member' as const,
        conflictingBookingId: booking.id,
        message: `Member ${booking.user?.firstName} ${booking.user?.lastName} already has a booking`,
        details: {
          startTime: booking.startTime,
          endTime: booking.endTime,
        },
      });
    });

    return {
      hasConflict: conflicts.length > 0,
      conflicts,
    };
  }

  private async validateBookingData(
    organizationId: string,
    dto: CreateBookingDto,
  ): Promise<void> {
    // Validate user belongs to organization
    const user = await this.prisma.user.findFirst({
      where: { id: dto.userId, organizationId },
    });
    if (!user) {
      throw new BadRequestException('User not found in this organization');
    }

    // Validate service belongs to organization
    const service = await this.prisma.service.findFirst({
      where: { id: dto.serviceId, organizationId },
    });
    if (!service) {
      throw new BadRequestException('Service not found in this organization');
    }

    // Validate resource if provided
    if (dto.resourceId) {
      const resource = await this.prisma.resource.findFirst({
        where: { id: dto.resourceId, organizationId },
      });
      if (!resource) {
        throw new BadRequestException(
          'Resource not found in this organization',
        );
      }
    }

    // Validate location if provided
    if (dto.locationId) {
      const location = await this.prisma.location.findFirst({
        where: { id: dto.locationId, organizationId },
      });
      if (!location) {
        throw new BadRequestException(
          'Location not found in this organization',
        );
      }
    }

    // Validate time range
    if (dto.startTime >= dto.endTime) {
      throw new BadRequestException('Start time must be before end time');
    }

    // Validate that the booking is not in the past
    if (dto.startTime < new Date()) {
      throw new BadRequestException('Cannot create booking in the past');
    }
  }

  private async processWaitlistAfterBooking(
    serviceId: string,
    startTime: Date,
  ): Promise<void> {
    // TODO: Implement waitlist processing after booking
    // This would check if the class is full and add people to waitlist
  }

  private async processWaitlistAfterCancellation(
    serviceId: string,
    startTime: Date,
  ): Promise<void> {
    // TODO: Implement waitlist processing after cancellation
    // This would check if there are people on waitlist and offer the spot
  }
}
