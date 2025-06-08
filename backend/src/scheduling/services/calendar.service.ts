import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GetCalendarDto } from '../dto';
import { CalendarEvent } from '../types';
import {
  Booking,
  RecurringSchedule,
  User,
  Service,
  Resource,
  BookingStatus,
  BookingType,
  Prisma,
} from 'generated/prisma';

// Type for Booking with all necessary relations
type BookingWithRelations = Booking & {
  user?: User | null;
  staff?: User | null;
  service: Service;
  resource?: Resource | null;
  recurringSchedule?: RecurringSchedule | null;
};

@Injectable()
export class CalendarService {
  constructor(private readonly prisma: PrismaService) {}

  async getCalendarEvents(dto: GetCalendarDto): Promise<CalendarEvent[]> {
    const whereClause = this.buildWhereClause(dto);

    // Get regular bookings
    const bookings = await this.prisma.booking.findMany({
      where: whereClause,
      include: {
        user: true,
        staff: true,
        service: true,
        resource: true,
        recurringSchedule: true,
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    // Transform bookings to calendar events
    return bookings.map((booking) => this.transformToCalendarEvent(booking));
  }

  private buildWhereClause(dto: GetCalendarDto): Prisma.BookingWhereInput {
    const where: Prisma.BookingWhereInput = {
      startTime: {
        gte: dto.startDate,
        lte: dto.endDate,
      },
    };

    // Use memberId from DTO for userId in booking
    if (dto.memberId) {
      where.userId = dto.memberId;
    }

    if (dto.staffId) {
      where.staffId = dto.staffId;
    }

    if (dto.serviceId) {
      where.serviceId = dto.serviceId;
    }

    if (dto.resourceId) {
      where.resourceId = dto.resourceId;
    }

    return where;
  }

  private transformToCalendarEvent(
    booking: BookingWithRelations,
  ): CalendarEvent {
    // Create user display name
    const memberName = booking.user
      ? `${booking.user.firstName} ${booking.user.lastName}`.trim()
      : 'Unknown Member';

    const staffName = booking.staff
      ? `${booking.staff.firstName} ${booking.staff.lastName}`.trim()
      : undefined;

    return {
      id: booking.id,
      title: booking.service.name,
      start: booking.startTime,
      end: booking.endTime,
      status: booking.status,
      type: 'APPOINTMENT' as BookingType, // Default type, could be enhanced based on service type
      memberId: booking.userId || '',
      memberName,
      staffId: booking.staffId || undefined,
      staffName,
      serviceId: booking.serviceId,
      serviceName: booking.service.name,
      resourceId: booking.resourceId || undefined,
      resourceName: booking.resource?.name || undefined,
      notes: booking.notes || undefined,
      isRecurring: !!booking.recurringScheduleId,
      recurringScheduleId: booking.recurringScheduleId || undefined,
      allDay: booking.allDay || false,
    };
  }

  async getBookingById(id: string): Promise<CalendarEvent | null> {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        user: true,
        staff: true,
        service: true,
        resource: true,
        recurringSchedule: true,
      },
    });

    if (!booking) {
      return null;
    }

    return this.transformToCalendarEvent(booking);
  }

  async getUpcomingBookings(
    userId: string,
    limit: number = 10,
  ): Promise<CalendarEvent[]> {
    const bookings = await this.prisma.booking.findMany({
      where: {
        userId,
        startTime: {
          gte: new Date(),
        },
        status: {
          not: BookingStatus.CANCELLED_BY_MEMBER,
        },
      },
      include: {
        user: true,
        staff: true,
        service: true,
        resource: true,
        recurringSchedule: true,
      },
      orderBy: {
        startTime: 'asc',
      },
      take: limit,
    });

    return bookings.map((booking) => this.transformToCalendarEvent(booking));
  }

  async getStaffCalendar(
    organizationId: string,
    staffId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<CalendarEvent[]> {
    const bookings = await this.prisma.booking.findMany({
      where: {
        organizationId,
        staffId,
        startTime: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        user: true,
        staff: true,
        service: true,
        resource: true,
        recurringSchedule: true,
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    return bookings.map((booking) => this.transformToCalendarEvent(booking));
  }

  async getMemberCalendar(
    organizationId: string,
    memberId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<CalendarEvent[]> {
    const bookings = await this.prisma.booking.findMany({
      where: {
        organizationId,
        userId: memberId,
        startTime: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        user: true,
        staff: true,
        service: true,
        resource: true,
        recurringSchedule: true,
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    return bookings.map((booking) => this.transformToCalendarEvent(booking));
  }

  async getResourceCalendar(
    organizationId: string,
    resourceId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<CalendarEvent[]> {
    const bookings = await this.prisma.booking.findMany({
      where: {
        organizationId,
        resourceId,
        startTime: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        user: true,
        staff: true,
        service: true,
        resource: true,
        recurringSchedule: true,
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    return bookings.map((booking) => this.transformToCalendarEvent(booking));
  }

  async getServiceSchedule(
    organizationId: string,
    serviceId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<CalendarEvent[]> {
    const bookings = await this.prisma.booking.findMany({
      where: {
        organizationId,
        serviceId,
        startTime: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        user: true,
        staff: true,
        service: true,
        resource: true,
        recurringSchedule: true,
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    return bookings.map((booking) => this.transformToCalendarEvent(booking));
  }

  async getDayView(
    organizationId: string,
    date: Date,
    filters: { staffId?: string; resourceId?: string; serviceId?: string },
  ): Promise<CalendarEvent[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const whereClause: Prisma.BookingWhereInput = {
      organizationId,
      startTime: {
        gte: startOfDay,
        lte: endOfDay,
      },
    };

    if (filters.staffId) {
      whereClause.staffId = filters.staffId;
    }

    if (filters.resourceId) {
      whereClause.resourceId = filters.resourceId;
    }

    if (filters.serviceId) {
      whereClause.serviceId = filters.serviceId;
    }

    const bookings = await this.prisma.booking.findMany({
      where: whereClause,
      include: {
        user: true,
        staff: true,
        service: true,
        resource: true,
        recurringSchedule: true,
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    return bookings.map((booking) => this.transformToCalendarEvent(booking));
  }

  async getWeekView(
    organizationId: string,
    startOfWeek: Date,
    filters: { staffId?: string; resourceId?: string; serviceId?: string },
  ): Promise<CalendarEvent[]> {
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    const whereClause: Prisma.BookingWhereInput = {
      organizationId,
      startTime: {
        gte: startOfWeek,
        lt: endOfWeek,
      },
    };

    if (filters.staffId) {
      whereClause.staffId = filters.staffId;
    }

    if (filters.resourceId) {
      whereClause.resourceId = filters.resourceId;
    }

    if (filters.serviceId) {
      whereClause.serviceId = filters.serviceId;
    }

    const bookings = await this.prisma.booking.findMany({
      where: whereClause,
      include: {
        user: true,
        staff: true,
        service: true,
        resource: true,
        recurringSchedule: true,
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    return bookings.map((booking) => this.transformToCalendarEvent(booking));
  }
}
