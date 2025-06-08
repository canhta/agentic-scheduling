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
  Request,
  BadRequestException,
  ParseUUIDPipe,
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
import { BookingService } from '../services/booking.service';
import { ConflictDetectionService } from '../services/conflict-detection.service';
import { WaitlistService } from '../services/waitlist.service';
import {
  CreateBookingDto,
  UpdateBookingDto,
  CheckAvailabilityDto,
  AddToWaitlistDto,
  BookingFilters,
  AuthenticatedRequest,
  WaitlistFiltersDto,
  UpdateWaitlistPositionDto,
} from '../dto';
import { UserRole, BookingStatus, BookingType } from 'generated/prisma';

@ApiTags('bookings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('organizations/:organizationId/bookings')
export class BookingController {
  constructor(
    private readonly bookingService: BookingService,
    private readonly conflictDetectionService: ConflictDetectionService,
    private readonly waitlistService: WaitlistService,
  ) {}

  @Post()
  @Roles(
    UserRole.ADMIN,
    UserRole.ORGANIZATION_ADMIN,
    UserRole.STAFF,
    UserRole.MEMBER,
  )
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({ status: 201, description: 'Booking created successfully' })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation error or conflicts',
  })
  async createBooking(
    @Param('organizationId', ParseUUIDPipe) organizationId: string,
    @Body() dto: CreateBookingDto,
    @Request() req: AuthenticatedRequest,
  ) {
    // Members can only book for themselves unless they have higher privileges
    if (req.user.role === UserRole.MEMBER && dto.userId !== req.user.id) {
      throw new BadRequestException(
        'Members can only create bookings for themselves',
      );
    }

    return this.bookingService.createBooking(organizationId, dto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.ORGANIZATION_ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'Get bookings with filters' })
  @ApiResponse({ status: 200, description: 'Bookings retrieved successfully' })
  async getBookings(
    @Param('organizationId', ParseUUIDPipe) organizationId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('memberId') memberId?: string,
    @Query('staffId') staffId?: string,
    @Query('serviceId') serviceId?: string,
    @Query('resourceId') resourceId?: string,
    @Query('status') status?: BookingStatus,
    @Query('type') type?: BookingType,
  ) {
    const filters: BookingFilters = {};

    if (startDate) filters.startDate = new Date(startDate);
    if (endDate) filters.endDate = new Date(endDate);
    if (memberId) filters.memberId = memberId;
    if (staffId) filters.staffId = staffId;
    if (serviceId) filters.serviceId = serviceId;
    if (resourceId) filters.resourceId = resourceId;
    if (status) filters.status = status;
    if (type) filters.type = type;

    return this.bookingService.getBookings(organizationId, filters);
  }

  @Get('/my-bookings')
  @Roles(UserRole.MEMBER, UserRole.STAFF)
  @ApiOperation({ summary: 'Get current user bookings' })
  @ApiResponse({
    status: 200,
    description: 'User bookings retrieved successfully',
  })
  async getMyBookings(
    @Param('organizationId', ParseUUIDPipe) organizationId: string,
    @Request() req: AuthenticatedRequest,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('status') status?: BookingStatus,
    @Query('type') type?: BookingType,
  ) {
    const filters: BookingFilters = {};

    if (startDate) filters.startDate = new Date(startDate);
    if (endDate) filters.endDate = new Date(endDate);
    if (status) filters.status = status;
    if (type) filters.type = type;

    // Filter by user role
    if (req.user.role === UserRole.MEMBER) {
      filters.memberId = req.user.id;
    } else if (req.user.role === UserRole.STAFF) {
      filters.staffId = req.user.id;
    }

    return this.bookingService.getBookings(organizationId, filters);
  }

  @Get(':bookingId')
  @Roles(
    UserRole.ADMIN,
    UserRole.ORGANIZATION_ADMIN,
    UserRole.STAFF,
    UserRole.MEMBER,
  )
  @ApiOperation({ summary: 'Get a specific booking' })
  @ApiResponse({ status: 200, description: 'Booking retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async getBooking(
    @Param('organizationId', ParseUUIDPipe) organizationId: string,
    @Param('bookingId', ParseUUIDPipe) bookingId: string,
    @Request() req: AuthenticatedRequest,
  ) {
    const booking = await this.bookingService.getBooking(
      organizationId,
      bookingId,
    );

    // Members can only view their own bookings
    if (req.user.role === UserRole.MEMBER && booking?.userId !== req.user.id) {
      throw new BadRequestException('Access denied');
    }

    return booking;
  }

  @Put(':bookingId')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZATION_ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'Update a booking' })
  @ApiResponse({ status: 200, description: 'Booking updated successfully' })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation error or conflicts',
  })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async updateBooking(
    @Param('organizationId', ParseUUIDPipe) organizationId: string,
    @Param('bookingId', ParseUUIDPipe) bookingId: string,
    @Body() dto: UpdateBookingDto,
  ) {
    return this.bookingService.updateBooking(organizationId, bookingId, dto);
  }

  @Delete(':bookingId')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZATION_ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'Cancel a booking' })
  @ApiResponse({ status: 200, description: 'Booking cancelled successfully' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async cancelBooking(
    @Param('organizationId', ParseUUIDPipe) organizationId: string,
    @Param('bookingId', ParseUUIDPipe) bookingId: string,
  ) {
    return this.bookingService.cancelBooking(organizationId, bookingId);
  }

  @Post('/check-availability')
  @Roles(
    UserRole.ADMIN,
    UserRole.ORGANIZATION_ADMIN,
    UserRole.STAFF,
    UserRole.MEMBER,
  )
  @ApiOperation({ summary: 'Check availability for booking' })
  @ApiResponse({
    status: 200,
    description: 'Availability checked successfully',
  })
  async checkAvailability(
    @Param('organizationId', ParseUUIDPipe) organizationId: string,
    @Body() dto: CheckAvailabilityDto,
  ) {
    return this.conflictDetectionService.checkBookingConflicts({
      organizationId,
      startTime: dto.startTime,
      endTime: dto.endTime,
      serviceId: dto.serviceId,
      resourceId: dto.resourceId,
      staffId: dto.staffId,
      userId: dto.userId || '',
      excludeBookingId: dto.excludeBookingId,
    });
  }

  @Get('/availability/slots')
  @Roles(
    UserRole.ADMIN,
    UserRole.ORGANIZATION_ADMIN,
    UserRole.STAFF,
    UserRole.MEMBER,
  )
  @ApiOperation({ summary: 'Get available time slots for a specific date' })
  @ApiResponse({
    status: 200,
    description: 'Available slots retrieved successfully',
  })
  async getAvailableSlots(
    @Param('organizationId', ParseUUIDPipe) organizationId: string,
    @Query('date') date: string,
    @Query('serviceId') serviceId?: string,
    @Query('resourceId') resourceId?: string,
    @Query('staffId') staffId?: string,
    @Query('duration') duration: string = '60',
  ) {
    if (!date) {
      throw new BadRequestException('Date is required');
    }

    return this.conflictDetectionService.getAvailableTimeSlots({
      organizationId,
      date: new Date(date),
      serviceId,
      resourceId,
      staffId,
      duration: parseInt(duration, 10),
    });
  }

  // Waitlist endpoints
  @Post('/waitlist')
  @Roles(
    UserRole.ADMIN,
    UserRole.ORGANIZATION_ADMIN,
    UserRole.STAFF,
    UserRole.MEMBER,
  )
  @ApiOperation({ summary: 'Add member to waitlist' })
  @ApiResponse({ status: 201, description: 'Added to waitlist successfully' })
  async addToWaitlist(
    @Param('organizationId', ParseUUIDPipe) organizationId: string,
    @Body() dto: AddToWaitlistDto,
    @Request() req: AuthenticatedRequest,
  ) {
    // Members can only add themselves to waitlist
    if (req.user.role === UserRole.MEMBER && dto.userId !== req.user.id) {
      throw new BadRequestException(
        'Members can only add themselves to waitlist',
      );
    }

    return this.waitlistService.addToWaitlist(organizationId, dto);
  }

  @Get('/waitlist')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZATION_ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'Get waitlist entries' })
  @ApiResponse({
    status: 200,
    description: 'Waitlist entries retrieved successfully',
  })
  async getWaitlistEntries(
    @Param('organizationId', ParseUUIDPipe) organizationId: string,
    @Query('serviceId') serviceId?: string,
    @Query('resourceId') resourceId?: string,
    @Query('memberId') memberId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const filters: WaitlistFiltersDto = {};

    if (serviceId) filters.serviceId = serviceId;
    if (memberId) filters.userId = memberId; // Map memberId from API to userId for database

    return this.waitlistService.getWaitlistEntries(organizationId, filters);
  }

  @Get('/waitlist/my-entries')
  @Roles(UserRole.MEMBER)
  @ApiOperation({ summary: 'Get current user waitlist entries' })
  @ApiResponse({
    status: 200,
    description: 'User waitlist entries retrieved successfully',
  })
  async getMyWaitlistEntries(
    @Param('organizationId', ParseUUIDPipe) organizationId: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.waitlistService.getWaitlistEntries(organizationId, {
      userId: req.user.id,
    });
  }

  @Delete('/waitlist/:waitlistId')
  @Roles(
    UserRole.ADMIN,
    UserRole.ORGANIZATION_ADMIN,
    UserRole.STAFF,
    UserRole.MEMBER,
  )
  @ApiOperation({ summary: 'Remove from waitlist' })
  @ApiResponse({
    status: 200,
    description: 'Removed from waitlist successfully',
  })
  async removeFromWaitlist(
    @Param('organizationId', ParseUUIDPipe) organizationId: string,
    @Param('waitlistId', ParseUUIDPipe) waitlistId: string,
    @Request() req: AuthenticatedRequest,
  ) {
    // For members, add validation to ensure they can only remove their own entries
    if (req.user.role === UserRole.MEMBER) {
      const waitlistEntries = await this.waitlistService.getWaitlistEntries(
        organizationId,
        {
          userId: req.user.id,
        },
      );

      const hasAccess = waitlistEntries.some(
        (entry) => entry.id === waitlistId,
      );
      if (!hasAccess) {
        throw new BadRequestException('Access denied');
      }
    }

    return this.waitlistService.removeFromWaitlist(organizationId, waitlistId);
  }

  @Put('/waitlist/:waitlistId/priority')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZATION_ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'Update waitlist entry priority' })
  @ApiResponse({
    status: 200,
    description: 'Waitlist priority updated successfully',
  })
  async updateWaitlistPriority(
    @Param('organizationId', ParseUUIDPipe) organizationId: string,
    @Param('waitlistId', ParseUUIDPipe) waitlistId: string,
    @Body() dto: UpdateWaitlistPositionDto,
  ) {
    return await this.waitlistService.updateWaitlistPosition(
      organizationId,
      waitlistId,
      dto,
    );
  }

  @Get('/waitlist/position')
  @Roles(
    UserRole.MEMBER,
    UserRole.STAFF,
    UserRole.ADMIN,
    UserRole.ORGANIZATION_ADMIN,
  )
  @ApiOperation({ summary: 'Get waitlist position for a member' })
  @ApiResponse({
    status: 200,
    description: 'Waitlist position retrieved successfully',
  })
  async getWaitlistPosition(
    @Param('organizationId', ParseUUIDPipe) organizationId: string,
    @Query('memberId', ParseUUIDPipe) memberId: string,
    @Query('serviceId', ParseUUIDPipe) serviceId: string,
    @Request() req: AuthenticatedRequest,
  ) {
    // Members can only check their own position
    if (req.user.role === UserRole.MEMBER && memberId !== req.user.id) {
      throw new BadRequestException('Access denied');
    }

    const position = await this.waitlistService.getWaitlistPosition(
      organizationId,
      memberId,
      serviceId,
    );

    return { position };
  }
}
