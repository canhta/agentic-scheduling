import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request,
  Param,
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
import { CalendarService } from '../services/calendar.service';
import { AuthenticatedRequest, GetCalendarDto } from '../dto';
import { UserRole, BookingType } from 'generated/prisma';

@ApiTags('calendar')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('organizations/:organizationId/calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get()
  @Roles(
    UserRole.ADMIN,
    UserRole.ORGANIZATION_ADMIN,
    UserRole.STAFF,
    UserRole.MEMBER,
  )
  @ApiOperation({ summary: 'Get calendar events for the organization' })
  @ApiResponse({
    status: 200,
    description: 'Calendar events retrieved successfully',
  })
  async getCalendarEvents(
    @Param('organizationId', ParseUUIDPipe) organizationId: string,
    @Request() req: AuthenticatedRequest,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('staffId') staffId?: string,
    @Query('memberId') memberId?: string,
    @Query('serviceId') serviceId?: string,
    @Query('resourceId') resourceId?: string,
    @Query('type') type?: BookingType,
  ) {
    if (!startDate || !endDate) {
      throw new BadRequestException('Start date and end date are required');
    }

    const dto: GetCalendarDto = {
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      staffId,
      memberId,
      serviceId,
      resourceId,
      type,
    };

    return this.calendarService.getCalendarEvents(dto);
  }

  @Get('/staff/:staffId')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZATION_ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'Get staff calendar' })
  @ApiResponse({
    status: 200,
    description: 'Staff calendar retrieved successfully',
  })
  async getStaffCalendar(
    @Param('organizationId', ParseUUIDPipe) organizationId: string,
    @Param('staffId', ParseUUIDPipe) staffId: string,
    @Request() req: AuthenticatedRequest,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    if (!startDate || !endDate) {
      throw new BadRequestException('Start date and end date are required');
    }

    // Staff can only view their own calendar unless they have higher privileges
    if (req.user.role === UserRole.STAFF && staffId !== req.user.id) {
      throw new BadRequestException('Access denied');
    }

    return this.calendarService.getStaffCalendar(
      organizationId,
      staffId,
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('/member/:memberId')
  @Roles(
    UserRole.ADMIN,
    UserRole.ORGANIZATION_ADMIN,
    UserRole.STAFF,
    UserRole.MEMBER,
  )
  @ApiOperation({ summary: 'Get member calendar' })
  @ApiResponse({
    status: 200,
    description: 'Member calendar retrieved successfully',
  })
  async getMemberCalendar(
    @Param('organizationId', ParseUUIDPipe) organizationId: string,
    @Param('memberId', ParseUUIDPipe) memberId: string,
    @Request() req: AuthenticatedRequest,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    if (!startDate || !endDate) {
      throw new BadRequestException('Start date and end date are required');
    }

    // Members can only view their own calendar unless they have higher privileges
    if (req.user.role === UserRole.MEMBER && memberId !== req.user.id) {
      throw new BadRequestException('Access denied');
    }

    return this.calendarService.getMemberCalendar(
      organizationId,
      memberId,
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('/resource/:resourceId')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZATION_ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'Get resource calendar' })
  @ApiResponse({
    status: 200,
    description: 'Resource calendar retrieved successfully',
  })
  async getResourceCalendar(
    @Param('organizationId', ParseUUIDPipe) organizationId: string,
    @Param('resourceId', ParseUUIDPipe) resourceId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    if (!startDate || !endDate) {
      throw new BadRequestException('Start date and end date are required');
    }

    return this.calendarService.getResourceCalendar(
      organizationId,
      resourceId,
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('/service/:serviceId/schedule')
  @Roles(
    UserRole.ADMIN,
    UserRole.ORGANIZATION_ADMIN,
    UserRole.STAFF,
    UserRole.MEMBER,
  )
  @ApiOperation({
    summary: 'Get service schedule including recurring schedules',
  })
  @ApiResponse({
    status: 200,
    description: 'Service schedule retrieved successfully',
  })
  async getServiceSchedule(
    @Param('organizationId', ParseUUIDPipe) organizationId: string,
    @Param('serviceId', ParseUUIDPipe) serviceId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    if (!startDate || !endDate) {
      throw new BadRequestException('Start date and end date are required');
    }

    return this.calendarService.getServiceSchedule(
      organizationId,
      serviceId,
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('/day')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZATION_ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'Get detailed day view with time slots' })
  @ApiResponse({ status: 200, description: 'Day view retrieved successfully' })
  async getDayView(
    @Param('organizationId', ParseUUIDPipe) organizationId: string,
    @Query('date') date: string,
    @Query('staffId') staffId?: string,
    @Query('resourceId') resourceId?: string,
    @Query('serviceId') serviceId?: string,
  ) {
    if (!date) {
      throw new BadRequestException('Date is required');
    }

    const filters: {
      staffId?: string;
      resourceId?: string;
      serviceId?: string;
    } = {};
    if (staffId) filters.staffId = staffId;
    if (resourceId) filters.resourceId = resourceId;
    if (serviceId) filters.serviceId = serviceId;

    return this.calendarService.getDayView(
      organizationId,
      new Date(date),
      filters,
    );
  }

  @Get('/week')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZATION_ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'Get week view with daily summaries' })
  @ApiResponse({ status: 200, description: 'Week view retrieved successfully' })
  async getWeekView(
    @Param('organizationId', ParseUUIDPipe) organizationId: string,
    @Query('startOfWeek') startOfWeek: string,
    @Query('staffId') staffId?: string,
    @Query('resourceId') resourceId?: string,
    @Query('serviceId') serviceId?: string,
  ) {
    if (!startOfWeek) {
      throw new BadRequestException('Start of week date is required');
    }

    const filters: {
      staffId?: string;
      resourceId?: string;
      serviceId?: string;
    } = {};
    if (staffId) filters.staffId = staffId;
    if (resourceId) filters.resourceId = resourceId;
    if (serviceId) filters.serviceId = serviceId;

    return this.calendarService.getWeekView(
      organizationId,
      new Date(startOfWeek),
      filters,
    );
  }

  @Get('/my-calendar')
  @Roles(UserRole.STAFF, UserRole.MEMBER)
  @ApiOperation({ summary: 'Get current user personal calendar' })
  @ApiResponse({
    status: 200,
    description: 'Personal calendar retrieved successfully',
  })
  async getMyCalendar(
    @Param('organizationId', ParseUUIDPipe) organizationId: string,
    @Request() req: AuthenticatedRequest,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('type') type?: BookingType,
  ) {
    if (!startDate || !endDate) {
      throw new BadRequestException('Start date and end date are required');
    }

    if (req.user.role === UserRole.MEMBER) {
      return this.calendarService.getMemberCalendar(
        organizationId,
        req.user.id,
        new Date(startDate),
        new Date(endDate),
      );
    } else if (req.user.role === UserRole.STAFF) {
      return this.calendarService.getStaffCalendar(
        organizationId,
        req.user.id,
        new Date(startDate),
        new Date(endDate),
      );
    }

    throw new BadRequestException('Invalid user role for personal calendar');
  }

  @Get('/availability-overview')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZATION_ADMIN, UserRole.STAFF)
  @ApiOperation({
    summary: 'Get availability overview for resources and staff',
  })
  @ApiResponse({
    status: 200,
    description: 'Availability overview retrieved successfully',
  })
  async getAvailabilityOverview(
    @Param('organizationId', ParseUUIDPipe) organizationId: string,
    @Query('date') date: string,
  ) {
    if (!date) {
      throw new BadRequestException('Date is required');
    }

    const targetDate = new Date(date);
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Get all staff in the organization
    const staff = await this.calendarService['prisma'].user.findMany({
      where: {
        organizationId,
        role: UserRole.STAFF,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    });

    // Get all resources in the organization
    const resources = await this.calendarService['prisma'].resource.findMany({
      where: {
        organizationId,
      },
      select: {
        id: true,
        name: true,
        type: true,
      },
    });

    // Get staff calendars
    const staffCalendars = await Promise.all(
      staff.map(async (staffMember) => {
        const events = await this.calendarService.getStaffCalendar(
          organizationId,
          staffMember.id,
          startOfDay,
          endOfDay,
        );

        return {
          staffId: staffMember.id,
          staffName: `${staffMember.firstName} ${staffMember.lastName}`,
          bookingCount: events.length,
          events,
        };
      }),
    );

    // Get resource calendars
    const resourceCalendars = await Promise.all(
      resources.map(async (resource) => {
        const events = await this.calendarService.getResourceCalendar(
          organizationId,
          resource.id,
          startOfDay,
          endOfDay,
        );

        return {
          resourceId: resource.id,
          resourceName: resource.name,
          resourceType: resource.type,
          bookingCount: events.length,
          events,
        };
      }),
    );

    return {
      date: targetDate,
      staff: staffCalendars,
      resources: resourceCalendars,
      summary: {
        totalStaff: staff.length,
        busyStaff: staffCalendars.filter((s) => s.bookingCount > 0).length,
        totalResources: resources.length,
        busyResources: resourceCalendars.filter((r) => r.bookingCount > 0)
          .length,
      },
    };
  }
}
