import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  AddToWaitlistDto,
  WaitlistEntryResponseDto,
  UpdateWaitlistPositionDto,
  WaitlistFiltersDto,
} from '../dto';
import { BookingStatus, BookingType } from 'generated/prisma';

@Injectable()
export class WaitlistService {
  constructor(private prisma: PrismaService) {}

  async addToWaitlist(
    organizationId: string,
    dto: AddToWaitlistDto,
  ): Promise<WaitlistEntryResponseDto> {
    // Validate that the user belongs to the organization
    const user = await this.prisma.user.findFirst({
      where: { id: dto.userId, organizationId },
    });

    if (!user) {
      throw new BadRequestException('User not found in organization');
    }

    // Validate service belongs to organization
    const service = await this.prisma.service.findFirst({
      where: { id: dto.serviceId, organizationId },
    });

    if (!service) {
      throw new BadRequestException('Service not found in organization');
    }

    // Check if user is already on waitlist for this service
    const existingWaitlistEntry = await this.prisma.waitlist.findUnique({
      where: {
        serviceId_userId: {
          serviceId: dto.serviceId,
          userId: dto.userId,
        },
      },
    });

    if (existingWaitlistEntry) {
      throw new BadRequestException(
        'User is already on waitlist for this service',
      );
    }

    // Get the next position in the waitlist
    const lastPosition = await this.prisma.waitlist.findFirst({
      where: { serviceId: dto.serviceId },
      orderBy: { position: 'desc' },
      select: { position: true },
    });

    const nextPosition = (lastPosition?.position || 0) + 1;

    // Create waitlist entry
    const waitlistEntry = await this.prisma.waitlist.create({
      data: {
        serviceId: dto.serviceId,
        userId: dto.userId,
        position: nextPosition,
        notifyByEmail: dto.notifyByEmail ?? true,
        notifyBySms: dto.notifyBySms ?? false,
      },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        service: {
          select: { id: true, name: true, capacity: true },
        },
      },
    });

    return {
      id: waitlistEntry.id,
      userId: waitlistEntry.userId,
      serviceId: waitlistEntry.serviceId,
      position: waitlistEntry.position,
      joinedAt: waitlistEntry.joinedAt,
      notifiedAt: waitlistEntry.notifiedAt,
      expiresAt: waitlistEntry.expiresAt,
      notifyByEmail: waitlistEntry.notifyByEmail,
      notifyBySms: waitlistEntry.notifyBySms,
      isActive: waitlistEntry.isActive,
      user: waitlistEntry.user,
      service: waitlistEntry.service,
    };
  }

  async removeFromWaitlist(
    organizationId: string,
    waitlistId: string,
  ): Promise<void> {
    const waitlistEntry = await this.prisma.waitlist.findFirst({
      where: {
        id: waitlistId,
        service: { organizationId },
      },
    });

    if (!waitlistEntry) {
      throw new NotFoundException('Waitlist entry not found');
    }

    // Remove the entry and reorder positions
    await this.prisma.$transaction(async (tx) => {
      // Delete the entry
      await tx.waitlist.delete({
        where: { id: waitlistId },
      });

      // Reorder remaining entries
      await tx.waitlist.updateMany({
        where: {
          serviceId: waitlistEntry.serviceId,
          position: { gt: waitlistEntry.position },
        },
        data: {
          position: { decrement: 1 },
        },
      });
    });
  }

  async getWaitlistEntries(
    organizationId: string,
    filters: WaitlistFiltersDto,
  ): Promise<WaitlistEntryResponseDto[]> {
    const where: {
      service: { organizationId: string };
      serviceId?: string;
      userId?: string;
      isActive?: boolean;
    } = {
      service: { organizationId },
    };

    if (filters.serviceId) where.serviceId = filters.serviceId;
    if (filters.userId) where.userId = filters.userId;
    if (filters.isActive !== undefined) where.isActive = filters.isActive;

    const entries = await this.prisma.waitlist.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        service: {
          select: { id: true, name: true, capacity: true },
        },
      },
      orderBy: [{ position: 'asc' }],
    });

    return entries.map((entry) => ({
      id: entry.id,
      userId: entry.userId,
      serviceId: entry.serviceId,
      position: entry.position,
      joinedAt: entry.joinedAt,
      notifiedAt: entry.notifiedAt,
      expiresAt: entry.expiresAt,
      notifyByEmail: entry.notifyByEmail,
      notifyBySms: entry.notifyBySms,
      isActive: entry.isActive,
      user: entry.user,
      service: entry.service,
    }));
  }

  async processWaitlistAfterCancellation(
    organizationId: string,
    serviceId: string,
    startTime: Date,
  ): Promise<any[]> {
    // Find active waitlist entries for this service
    const waitlistEntries = await this.prisma.waitlist.findMany({
      where: {
        serviceId,
        isActive: true,
        service: { organizationId },
      },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        service: {
          select: { id: true, name: true, capacity: true },
        },
      },
      orderBy: [{ position: 'asc' }],
    });

    if (waitlistEntries.length === 0) {
      return [];
    }

    // Check current capacity for the service at this time
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
      select: { capacity: true },
    });

    if (!service?.capacity) {
      return []; // No capacity management needed
    }

    // Count current bookings
    const currentBookings = await this.prisma.booking.count({
      where: {
        organizationId,
        serviceId,
        startTime: {
          gte: new Date(startTime.getTime() - 30 * 60000), // 30 minutes before
          lte: new Date(startTime.getTime() + 30 * 60000), // 30 minutes after
        },
        status: {
          notIn: [
            BookingStatus.CANCELLED_BY_MEMBER,
            BookingStatus.CANCELLED_BY_STAFF,
            BookingStatus.NO_SHOW,
          ],
        },
      },
    });

    const availableSpots = service.capacity - currentBookings;
    if (availableSpots <= 0) {
      return [];
    }

    // Auto-book the next person(s) on the waitlist
    const autoBookedEntries: any[] = [];
    const entriesToProcess = waitlistEntries.slice(0, availableSpots);

    for (const entry of entriesToProcess) {
      try {
        // Create booking for the waitlisted user
        const booking = await this.prisma.booking.create({
          data: {
            organizationId,
            userId: entry.userId,
            serviceId,
            startTime,
            endTime: new Date(startTime.getTime() + 60 * 60000), // Assume 1 hour duration
            type: BookingType.CLASS,
            status: BookingStatus.CONFIRMED,
            notes: `Auto-booked from waitlist`,
          },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
            service: {
              select: { name: true },
            },
          },
        });

        // Remove from waitlist
        await this.removeFromWaitlist(organizationId, entry.id);

        autoBookedEntries.push(booking);

        // TODO: Send notification to user about their auto-booking
        // This would integrate with a notification service
      } catch (error) {
        console.error(`Failed to auto-book waitlist entry ${entry.id}:`, error);
      }
    }

    return autoBookedEntries;
  }

  async processWaitlistAfterBooking(
    organizationId: string,
    serviceId: string,
    startTime: Date,
  ): Promise<boolean> {
    // Check if the service is now at capacity
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
      select: { capacity: true },
    });

    if (!service?.capacity) {
      return false; // No capacity management needed
    }

    // Count current bookings
    const currentBookings = await this.prisma.booking.count({
      where: {
        organizationId,
        serviceId,
        startTime: {
          gte: new Date(startTime.getTime() - 30 * 60000), // 30 minutes before
          lte: new Date(startTime.getTime() + 30 * 60000), // 30 minutes after
        },
        status: {
          notIn: [
            BookingStatus.CANCELLED_BY_MEMBER,
            BookingStatus.CANCELLED_BY_STAFF,
            BookingStatus.NO_SHOW,
          ],
        },
      },
    });

    const isAtCapacity = currentBookings >= service.capacity;

    if (isAtCapacity) {
      // Notify waitlisted users that the class is full
      const waitlistEntries = await this.prisma.waitlist.findMany({
        where: {
          serviceId,
          isActive: true,
          service: { organizationId },
        },
        include: {
          user: {
            select: { email: true, firstName: true, lastName: true },
          },
        },
      });

      // TODO: Send notifications to waitlisted users
      // This would integrate with a notification service
    }

    return isAtCapacity;
  }

  async updateWaitlistPosition(
    organizationId: string,
    waitlistId: string,
    dto: UpdateWaitlistPositionDto,
  ): Promise<WaitlistEntryResponseDto> {
    const waitlistEntry = await this.prisma.waitlist.findFirst({
      where: {
        id: waitlistId,
        service: { organizationId },
      },
    });

    if (!waitlistEntry) {
      throw new NotFoundException('Waitlist entry not found');
    }

    // Validate new position
    const maxPosition = await this.prisma.waitlist.count({
      where: { serviceId: waitlistEntry.serviceId },
    });

    if (dto.position < 1 || dto.position > maxPosition) {
      throw new BadRequestException(
        `Position must be between 1 and ${maxPosition}`,
      );
    }

    if (dto.position === waitlistEntry.position) {
      // No change needed
      const entry = await this.prisma.waitlist.findUnique({
        where: { id: waitlistId },
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
          service: {
            select: { id: true, name: true, capacity: true },
          },
        },
      });

      return {
        id: entry!.id,
        userId: entry!.userId,
        serviceId: entry!.serviceId,
        position: entry!.position,
        joinedAt: entry!.joinedAt,
        notifiedAt: entry!.notifiedAt,
        expiresAt: entry!.expiresAt,
        notifyByEmail: entry!.notifyByEmail,
        notifyBySms: entry!.notifyBySms,
        isActive: entry!.isActive,
        user: entry!.user,
        service: entry!.service,
      };
    }

    // Reorder positions
    const updatedEntry = await this.prisma.$transaction(async (tx) => {
      const oldPosition = waitlistEntry.position;
      const newPosition = dto.position;

      if (newPosition < oldPosition) {
        // Moving up: increment positions of entries between new and old position
        await tx.waitlist.updateMany({
          where: {
            serviceId: waitlistEntry.serviceId,
            position: {
              gte: newPosition,
              lt: oldPosition,
            },
          },
          data: {
            position: { increment: 1 },
          },
        });
      } else {
        // Moving down: decrement positions of entries between old and new position
        await tx.waitlist.updateMany({
          where: {
            serviceId: waitlistEntry.serviceId,
            position: {
              gt: oldPosition,
              lte: newPosition,
            },
          },
          data: {
            position: { decrement: 1 },
          },
        });
      }

      // Update the target entry's position
      return tx.waitlist.update({
        where: { id: waitlistId },
        data: { position: newPosition },
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
          service: {
            select: { id: true, name: true, capacity: true },
          },
        },
      });
    });

    return {
      id: updatedEntry.id,
      userId: updatedEntry.userId,
      serviceId: updatedEntry.serviceId,
      position: updatedEntry.position,
      joinedAt: updatedEntry.joinedAt,
      notifiedAt: updatedEntry.notifiedAt,
      expiresAt: updatedEntry.expiresAt,
      notifyByEmail: updatedEntry.notifyByEmail,
      notifyBySms: updatedEntry.notifyBySms,
      isActive: updatedEntry.isActive,
      user: updatedEntry.user,
      service: updatedEntry.service,
    };
  }

  async getWaitlistPosition(
    organizationId: string,
    userId: string,
    serviceId: string,
  ): Promise<number> {
    // Find the user's waitlist entry for this service
    const waitlistEntry = await this.prisma.waitlist.findUnique({
      where: {
        serviceId_userId: {
          serviceId,
          userId,
        },
        service: { organizationId },
      },
      select: { position: true },
    });

    return waitlistEntry?.position || 0; // Return 0 if not found
  }

  async notifyWaitlistEntry(
    organizationId: string,
    waitlistId: string,
    expiresAt?: Date,
  ): Promise<WaitlistEntryResponseDto> {
    const waitlistEntry = await this.prisma.waitlist.findFirst({
      where: {
        id: waitlistId,
        service: { organizationId },
      },
    });

    if (!waitlistEntry) {
      throw new NotFoundException('Waitlist entry not found');
    }

    const updatedEntry = await this.prisma.waitlist.update({
      where: { id: waitlistId },
      data: {
        notifiedAt: new Date(),
        expiresAt: expiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours default
      },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        service: {
          select: { id: true, name: true, capacity: true },
        },
      },
    });

    return {
      id: updatedEntry.id,
      userId: updatedEntry.userId,
      serviceId: updatedEntry.serviceId,
      position: updatedEntry.position,
      joinedAt: updatedEntry.joinedAt,
      notifiedAt: updatedEntry.notifiedAt,
      expiresAt: updatedEntry.expiresAt,
      notifyByEmail: updatedEntry.notifyByEmail,
      notifyBySms: updatedEntry.notifyBySms,
      isActive: updatedEntry.isActive,
      user: updatedEntry.user,
      service: updatedEntry.service,
    };
  }
}
