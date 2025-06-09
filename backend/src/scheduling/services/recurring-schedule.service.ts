import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRecurringScheduleDto } from '../dto';
import { RRule, RRuleSet, rrulestr, Weekday } from 'rrule';
import { Prisma, Frequency } from 'generated/prisma';

@Injectable()
export class RecurringScheduleService {
  constructor(private prisma: PrismaService) {}

  async createRecurringSchedule(
    dto: CreateRecurringScheduleDto,
    organizationId: string,
  ): Promise<any> {
    // Validate the recurrence data and generate RRULE string
    const rruleString = this.generateRRuleString(dto);

    // Validate that the service belongs to the organization
    await this.validateRecurringScheduleData(dto, organizationId);

    // Create the recurring schedule
    const recurringScheduleData: Prisma.RecurringScheduleCreateInput = {
      service: { connect: { id: dto.serviceId } },
      rrule: rruleString,
      dtstart: dto.dtstart,
      dtend: dto.dtend,
      timezone: dto.timezone || 'UTC',
      frequency: dto.frequency as Frequency,
      interval: dto.interval || 1,
      byDay: dto.byDay || [],
      byMonthDay: dto.byMonthDay || [],
      byMonth: dto.byMonth || [],
      bySetPos: dto.bySetPos || [],
      count: dto.count,
      startTime: dto.startTime,
      duration: dto.duration,
      exdates: dto.exdates || [],
      description: dto.description,
    };

    const recurringSchedule = await this.prisma.recurringSchedule.create({
      data: recurringScheduleData,
      include: {
        service: {
          select: { id: true, name: true, duration: true },
        },
      },
    });

    // Generate individual booking instances for the near future (e.g., next 3 months)
    this.generateBookingInstances(recurringSchedule.id);

    return recurringSchedule;
  }

  async updateRecurringSchedule(
    organizationId: string,
    scheduleId: string,
    dto: Partial<CreateRecurringScheduleDto>,
  ): Promise<any> {
    const existingSchedule = await this.prisma.recurringSchedule.findUnique({
      where: { id: scheduleId },
    });

    if (!existingSchedule) {
      throw new NotFoundException('Recurring schedule not found');
    }

    // If recurrence rules are being updated, regenerate RRULE string
    let rruleString = existingSchedule.rrule;
    if (this.hasRecurrenceChanges(dto)) {
      const mergedData = { ...existingSchedule, ...dto };
      rruleString = this.generateRRuleString(
        mergedData as CreateRecurringScheduleDto,
      );
    }

    const updateData: Prisma.RecurringScheduleUpdateInput = {};

    if (dto.serviceId !== undefined) {
      updateData.service = { connect: { id: dto.serviceId } };
    }

    if (dto.startTime) updateData.startTime = dto.startTime;
    if (dto.frequency) updateData.frequency = dto.frequency as Frequency;
    if (dto.interval) updateData.interval = dto.interval;
    if (dto.byDay !== undefined) updateData.byDay = dto.byDay;
    if (dto.byMonthDay !== undefined) updateData.byMonthDay = dto.byMonthDay;
    if (dto.byMonth !== undefined) updateData.byMonth = dto.byMonth;
    if (dto.bySetPos !== undefined) updateData.bySetPos = dto.bySetPos;
    if (dto.count !== undefined) updateData.count = dto.count;
    if (dto.dtstart !== undefined) updateData.dtstart = dto.dtstart;
    if (dto.dtend !== undefined) updateData.dtend = dto.dtend;
    if (dto.timezone !== undefined) updateData.timezone = dto.timezone;
    if (dto.duration !== undefined) updateData.duration = dto.duration;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.exdates !== undefined) updateData.exdates = dto.exdates;

    updateData.rrule = rruleString;

    const updatedSchedule = await this.prisma.recurringSchedule.update({
      where: { id: scheduleId },
      data: updateData,
      include: {
        service: {
          select: { id: true, name: true, duration: true },
        },
      },
    });

    // If recurrence rules changed, regenerate booking instances
    if (this.hasRecurrenceChanges(dto)) {
      await this.regenerateBookingInstances(scheduleId);
    }

    return updatedSchedule;
  }

  async deleteRecurringSchedule(
    organizationId: string,
    scheduleId: string,
  ): Promise<void> {
    const schedule = await this.prisma.recurringSchedule.findUnique({
      where: { id: scheduleId },
    });

    if (!schedule) {
      throw new NotFoundException('Recurring schedule not found');
    }

    // Delete all future booking instances
    await this.prisma.booking.deleteMany({
      where: {
        recurringScheduleId: scheduleId,
        startTime: { gte: new Date() },
      },
    });

    // Delete the recurring schedule
    await this.prisma.recurringSchedule.delete({
      where: { id: scheduleId },
    });
  }

  async getRecurringSchedule(
    organizationId: string,
    scheduleId: string,
  ): Promise<any> {
    const schedule = await this.prisma.recurringSchedule.findUnique({
      where: { id: scheduleId },
      include: {
        service: {
          select: { id: true, name: true, duration: true },
        },
        bookings: {
          where: { startTime: { gte: new Date() } },
          orderBy: { startTime: 'asc' },
          take: 10,
        },
        recurrenceExceptions: {
          orderBy: { originalDateTime: 'asc' },
        },
      },
    });

    if (!schedule) {
      throw new NotFoundException('Recurring schedule not found');
    }

    return schedule;
  }

  async getRecurringSchedules(
    organizationId: string,
    filters: {
      serviceId?: string;
      resourceId?: string;
      staffId?: string;
    },
  ): Promise<any[]> {
    const where: Prisma.RecurringScheduleWhereInput = {
      service: { organizationId },
    };

    if (filters.serviceId) where.serviceId = filters.serviceId;

    return this.prisma.recurringSchedule.findMany({
      where,
      include: {
        service: {
          select: { id: true, name: true, duration: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async generateOccurrences(
    scheduleId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Date[]> {
    const schedule = await this.prisma.recurringSchedule.findUnique({
      where: { id: scheduleId },
      include: { recurrenceExceptions: true },
    });

    if (!schedule) {
      throw new NotFoundException('Recurring schedule not found');
    }

    try {
      const rule = rrulestr(schedule.rrule);
      const occurrences = rule.between(startDate, endDate);

      // Filter out exceptions
      const exceptionDates = new Set(
        schedule.recurrenceExceptions.map((ex) =>
          ex.originalDateTime.toISOString(),
        ),
      );

      return occurrences.filter(
        (occurrence) => !exceptionDates.has(occurrence.toISOString()),
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Invalid RRULE: ${message}`);
    }
  }

  async createException(
    scheduleId: string,
    originalDateTime: Date,
    newStartTime?: Date,
    isCancelled: boolean = false,
  ): Promise<any> {
    const schedule = await this.prisma.recurringSchedule.findUnique({
      where: { id: scheduleId },
    });

    if (!schedule) {
      throw new NotFoundException('Recurring schedule not found');
    }

    return this.prisma.recurrenceException.create({
      data: {
        recurringSchedule: { connect: { id: scheduleId } },
        originalDateTime,
        exceptionType: isCancelled ? 'CANCELLED' : 'RESCHEDULED',
        newStartTime,
      },
    });
  }

  private generateRRuleString(dto: CreateRecurringScheduleDto): string {
    try {
      const options: Partial<RRule['options']> = {
        freq: this.mapFrequencyToRRule(dto.frequency as Frequency),
        interval: dto.interval,
        dtstart: new Date(dto.startTime),
      };

      if (dto.byDay && dto.byDay.length > 0) {
        options.byweekday = this.parseByDay(dto.byDay);
      }
      if (dto.byMonthDay && dto.byMonthDay.length > 0) {
        options.bymonthday = this.parseNumberList(dto.byMonthDay);
      }
      if (dto.byYearDay && dto.byYearDay.length > 0) {
        options.byyearday = this.parseNumberList(dto.byYearDay);
      }
      if (dto.byWeekNo && dto.byWeekNo.length > 0) {
        options.byweekno = this.parseNumberList(dto.byWeekNo);
      }
      if (dto.byMonth && dto.byMonth.length > 0) {
        options.bymonth = this.parseNumberList(dto.byMonth);
      }
      if (dto.bySetPos && dto.bySetPos.length > 0) {
        options.bysetpos = this.parseNumberList(dto.bySetPos);
      }
      if (dto.count) options.count = dto.count;
      if (dto.until) options.until = dto.until;
      if (dto.weekStart) options.wkst = this.parseWeekStart(dto.weekStart);

      const rule = new RRule(options as any);
      return rule.toString();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Invalid recurrence rule: ${message}`);
    }
  }

  private mapFrequencyToRRule(frequency: Frequency): number {
    switch (frequency) {
      case 'DAILY':
        return 3; // RRule.DAILY
      case 'WEEKLY':
        return 2; // RRule.WEEKLY
      case 'MONTHLY':
        return 1; // RRule.MONTHLY
      case 'YEARLY':
        return 0; // RRule.YEARLY
      default:
        throw new BadRequestException(
          `Invalid frequency: ${frequency as string}`,
        );
    }
  }

  private parseByDay(byDay: string[]): number[] {
    const dayMapping: Record<string, number> = {
      MO: 0,
      TU: 1,
      WE: 2,
      TH: 3,
      FR: 4,
      SA: 5,
      SU: 6,
    };

    return byDay.map((day) => {
      const trimmedDay = day.trim().toUpperCase();
      if (dayMapping[trimmedDay] !== undefined) {
        return dayMapping[trimmedDay];
      }
      throw new BadRequestException(`Invalid day: ${day}`);
    });
  }

  private parseNumberList(numberList: number[]): number[] {
    return numberList;
  }

  private parseWeekStart(weekStart: string): number {
    const mapping: Record<string, number> = {
      MO: 0,
      TU: 1,
      WE: 2,
      TH: 3,
      FR: 4,
      SA: 5,
      SU: 6,
    };

    const day = mapping[weekStart.toUpperCase()];
    if (day === undefined) {
      throw new BadRequestException(`Invalid week start: ${weekStart}`);
    }
    return day;
  }

  private hasRecurrenceChanges(
    dto: Partial<CreateRecurringScheduleDto>,
  ): boolean {
    return !!(
      dto.frequency ||
      dto.interval ||
      dto.byDay !== undefined ||
      dto.byMonthDay !== undefined ||
      dto.byYearDay !== undefined ||
      dto.byWeekNo !== undefined ||
      dto.byMonth !== undefined ||
      dto.bySetPos !== undefined ||
      dto.count !== undefined ||
      dto.until !== undefined ||
      dto.weekStart !== undefined
    );
  }

  private async validateRecurringScheduleData(
    dto: CreateRecurringScheduleDto,
    organizationId: string,
  ): Promise<void> {
    // Validate service
    const service = await this.prisma.service.findFirst({
      where: {
        id: dto.serviceId,
        location: { organizationId: organizationId },
      },
    });
    if (!service) {
      throw new BadRequestException('Service not found in organization');
    }

    // Validate time range
    const startTime = new Date(`1970-01-01T${dto.startTime}`);
    const endTime = new Date(`1970-01-01T${dto.startTime}`);
    endTime.setMinutes(endTime.getMinutes() + dto.duration);

    if (startTime >= endTime) {
      throw new BadRequestException('Start time must be before end time');
    }
  }

  private generateBookingInstances(scheduleId: string): void {
    // This method would generate booking instances from recurring schedules
    // For now, we'll skip the implementation as it requires user bookings
    // In a real implementation, this would be triggered when users book recurring classes
    return;
  }

  private async regenerateBookingInstances(scheduleId: string): Promise<void> {
    // Delete future booking instances
    await this.prisma.booking.deleteMany({
      where: {
        recurringScheduleId: scheduleId,
        startTime: { gte: new Date() },
      },
    });

    // Generate new instances
    this.generateBookingInstances(scheduleId);
  }
}
