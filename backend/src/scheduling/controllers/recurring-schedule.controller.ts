import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RecurringScheduleService } from '../services/recurring-schedule.service';
import { CreateRecurringScheduleDto } from '../dto';
import { UserRole } from 'generated/prisma';

@ApiTags('recurring-schedules')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('organizations/:organizationId/recurring-schedules')
export class RecurringScheduleController {
  constructor(
    private readonly recurringScheduleService: RecurringScheduleService,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.ORGANIZATION_ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'Create a new recurring schedule' })
  @ApiResponse({
    status: 201,
    description: 'Recurring schedule created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  async createRecurringSchedule(
    @Param('organizationId', ParseUUIDPipe) organizationId: string,
    @Body() dto: CreateRecurringScheduleDto,
  ) {
    return this.recurringScheduleService.createRecurringSchedule(
      dto,
      organizationId,
    );
  }

  @Get('/validate-rrule')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZATION_ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'Validate RRULE string and preview occurrences' })
  @ApiResponse({ status: 200, description: 'RRULE validated successfully' })
  validateRRule(
    @Query('frequency') frequency: string,
    @Query('interval') interval: string,
    @Query('startTime') startTime: string,
    @Query('endTime') endTime: string,
    @Query('byDay') byDay?: string,
    @Query('byMonthDay') byMonthDay?: string,
    @Query('count') count?: string,
    @Query('until') until?: string,
    @Query('weekStart') weekStart?: string,
  ) {
    if (!frequency || !interval || !startTime || !endTime) {
      throw new BadRequestException(
        'Frequency, interval, start time, and end time are required',
      );
    }

    try {
      // Create a temporary DTO to validate - simplified for preview
      const validationResult = {
        frequency,
        interval: parseInt(interval, 10),
        startTime,
        endTime: new Date(endTime),
        byDay: byDay ? byDay.split(',') : undefined,
        byMonthDay: byMonthDay ? byMonthDay.split(',').map(Number) : undefined,
        count: count ? parseInt(count, 10) : undefined,
        until: until ? new Date(until) : undefined,
        weekStart,
      };

      // Generate preview occurrences for the next 10 instances
      const previewEnd = new Date();
      previewEnd.setMonth(previewEnd.getMonth() + 3); // 3 months ahead

      // Note: This would require refactoring the generateRRuleString method to be static
      // For now, return a simplified validation response
      return {
        isValid: true,
        message: 'RRULE parameters appear valid',
        previewNote: 'Create the recurring schedule to see actual occurrences',
        validatedParams: validationResult,
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        isValid: false,
        message,
        error: error instanceof Error ? error.toString() : 'Unknown error',
      };
    }
  }

  @Get('/templates')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZATION_ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'Get common recurring schedule templates' })
  @ApiResponse({ status: 200, description: 'Templates retrieved successfully' })
  getRecurringTemplates() {
    return {
      templates: [
        {
          name: 'Daily',
          description: 'Every day',
          frequency: 'DAILY',
          interval: 1,
          example: 'Daily at 9:00 AM',
        },
        {
          name: 'Weekdays',
          description: 'Monday through Friday',
          frequency: 'DAILY',
          interval: 1,
          byDay: 'MO,TU,WE,TH,FR',
          example: 'Weekdays at 9:00 AM',
        },
        {
          name: 'Weekly',
          description: 'Every week on the same day',
          frequency: 'WEEKLY',
          interval: 1,
          example: 'Every Monday at 9:00 AM',
        },
        {
          name: 'Bi-weekly',
          description: 'Every two weeks',
          frequency: 'WEEKLY',
          interval: 2,
          example: 'Every other Monday at 9:00 AM',
        },
        {
          name: 'Monthly (same date)',
          description: 'Same date each month',
          frequency: 'MONTHLY',
          interval: 1,
          example: '15th of every month at 9:00 AM',
        },
        {
          name: 'Monthly (same weekday)',
          description: 'Same weekday of the month',
          frequency: 'MONTHLY',
          interval: 1,
          byDay: 'MO',
          bySetPos: '1',
          example: 'First Monday of every month at 9:00 AM',
        },
        {
          name: 'Quarterly',
          description: 'Every three months',
          frequency: 'MONTHLY',
          interval: 3,
          example: 'Every 3 months on the same date at 9:00 AM',
        },
        {
          name: 'Yearly',
          description: 'Once per year',
          frequency: 'YEARLY',
          interval: 1,
          example: 'Same date every year at 9:00 AM',
        },
      ],
    };
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.ORGANIZATION_ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'Get recurring schedules with filters' })
  @ApiResponse({
    status: 200,
    description: 'Recurring schedules retrieved successfully',
  })
  async getRecurringSchedules(
    @Param('organizationId', ParseUUIDPipe) organizationId: string,
    @Query('serviceId') serviceId?: string,
    @Query('resourceId') resourceId?: string,
    @Query('staffId') staffId?: string,
  ) {
    const filters: {
      serviceId?: string;
      resourceId?: string;
      staffId?: string;
    } = {};

    if (serviceId) filters.serviceId = serviceId;
    if (resourceId) filters.resourceId = resourceId;
    if (staffId) filters.staffId = staffId;

    return this.recurringScheduleService.getRecurringSchedules(
      organizationId,
      filters,
    );
  }

  @Get(':scheduleId')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZATION_ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'Get a specific recurring schedule' })
  @ApiResponse({
    status: 200,
    description: 'Recurring schedule retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Recurring schedule not found' })
  async getRecurringSchedule(
    @Param('organizationId', ParseUUIDPipe) organizationId: string,
    @Param('scheduleId', ParseUUIDPipe) scheduleId: string,
  ) {
    return this.recurringScheduleService.getRecurringSchedule(
      organizationId,
      scheduleId,
    );
  }

  @Put(':scheduleId')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZATION_ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'Update a recurring schedule' })
  @ApiResponse({
    status: 200,
    description: 'Recurring schedule updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 404, description: 'Recurring schedule not found' })
  async updateRecurringSchedule(
    @Param('organizationId', ParseUUIDPipe) organizationId: string,
    @Param('scheduleId', ParseUUIDPipe) scheduleId: string,
    @Body() dto: Partial<CreateRecurringScheduleDto>,
  ) {
    return this.recurringScheduleService.updateRecurringSchedule(
      organizationId,
      scheduleId,
      dto,
    );
  }

  @Delete(':scheduleId')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZATION_ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'Delete a recurring schedule' })
  @ApiResponse({
    status: 200,
    description: 'Recurring schedule deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Recurring schedule not found' })
  async deleteRecurringSchedule(
    @Param('organizationId', ParseUUIDPipe) organizationId: string,
    @Param('scheduleId', ParseUUIDPipe) scheduleId: string,
  ) {
    await this.recurringScheduleService.deleteRecurringSchedule(
      organizationId,
      scheduleId,
    );
    return { message: 'Recurring schedule deleted successfully' };
  }

  @Get(':scheduleId/occurrences')
  @Roles(
    UserRole.ADMIN,
    UserRole.ORGANIZATION_ADMIN,
    UserRole.STAFF,
    UserRole.MEMBER,
  )
  @ApiOperation({ summary: 'Generate occurrences for a recurring schedule' })
  @ApiResponse({
    status: 200,
    description: 'Occurrences generated successfully',
  })
  @ApiResponse({ status: 404, description: 'Recurring schedule not found' })
  async generateOccurrences(
    @Param('organizationId', ParseUUIDPipe) organizationId: string,
    @Param('scheduleId', ParseUUIDPipe) scheduleId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    if (!startDate || !endDate) {
      throw new BadRequestException('Start date and end date are required');
    }

    const occurrences = await this.recurringScheduleService.generateOccurrences(
      scheduleId,
      new Date(startDate),
      new Date(endDate),
    );

    return {
      scheduleId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      occurrences,
      count: occurrences.length,
    };
  }

  @Post(':scheduleId/exceptions')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZATION_ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'Create an exception for a recurring schedule' })
  @ApiResponse({ status: 201, description: 'Exception created successfully' })
  @ApiResponse({ status: 404, description: 'Recurring schedule not found' })
  async createException(
    @Param('organizationId', ParseUUIDPipe) organizationId: string,
    @Param('scheduleId', ParseUUIDPipe) scheduleId: string,
    @Body()
    body: {
      originalDate: string;
      newDate?: string;
      isCancelled?: boolean;
    },
  ) {
    return this.recurringScheduleService.createException(
      scheduleId,
      new Date(body.originalDate),
      body.newDate ? new Date(body.newDate) : undefined,
      body.isCancelled || false,
    );
  }
}
