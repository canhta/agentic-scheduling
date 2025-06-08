import {
  IsString,
  IsOptional,
  IsEnum,
  IsDate,
  IsBoolean,
  IsUUID,
  IsNumber,
  Min,
  Max,
  IsArray,
  IsNotEmpty,
  IsDateString,
  IsInt,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  BookingStatus,
  DayOfWeek,
  ServiceType,
  BookingType,
} from 'generated/prisma';

export class CreateBookingDto {
  @ApiProperty()
  @IsUUID()
  serviceId: string;

  @ApiProperty()
  @IsUUID()
  userId: string; // Member who is booking

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  locationId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  resourceId?: string;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  startTime: Date;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  endTime: Date;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  allDay?: boolean;

  @ApiPropertyOptional({
    enum: BookingStatus,
    default: BookingStatus.CONFIRMED,
  })
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  privateNotes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  recurringScheduleId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  instanceDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  creditsUsed?: number;
}

export class UpdateBookingDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startTime?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endTime?: Date;

  @ApiPropertyOptional({ enum: BookingStatus })
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  privateNotes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  creditsUsed?: number;
}

export class CreateRecurringScheduleDto {
  @ApiProperty()
  @IsUUID()
  serviceId: string;

  @ApiProperty()
  @IsUUID()
  organizationId: string;

  @ApiProperty()
  @IsString()
  rrule: string;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  dtstart: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dtend?: Date;

  @ApiPropertyOptional({ default: 'UTC' })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiProperty()
  @IsString()
  frequency: string; // DAILY, WEEKLY, MONTHLY, YEARLY

  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  interval?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  byDay?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  byMonthDay?: number[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  byMonth?: number[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  bySetPos?: number[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  byYearDay?: number[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  byWeekNo?: number[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(1)
  count?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  until?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  weekStart?: string;

  @ApiProperty()
  @IsString()
  startTime: string; // HH:MM format

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  endTime: Date;

  @ApiProperty({ minimum: 1 })
  @IsNumber()
  @Min(1)
  duration: number; // Duration in minutes

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @Type(() => Date)
  @IsDate({ each: true })
  exdates?: Date[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  resourceId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  staffId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class GetCalendarDto {
  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  viewType?: string; // 'day', 'week', 'month', 'staff', 'member', 'resource', 'service'

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  locationId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  staffId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  memberId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  serviceId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  resourceId?: string;

  @ApiPropertyOptional({ enum: ServiceType })
  @IsOptional()
  @IsEnum(ServiceType)
  serviceType?: ServiceType;

  @ApiPropertyOptional({ enum: BookingType })
  @IsOptional()
  @IsEnum(BookingType)
  type?: BookingType;
}

export class AddToWaitlistDto {
  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiProperty()
  @IsUUID()
  serviceId: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  notifyByEmail?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  notifyBySms?: boolean;
}

export class WaitlistEntryResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  serviceId: string;

  @ApiProperty()
  position: number;

  @ApiProperty()
  joinedAt: Date;

  @ApiPropertyOptional()
  notifiedAt?: Date | null;

  @ApiPropertyOptional()
  expiresAt?: Date | null;

  @ApiProperty()
  notifyByEmail: boolean;

  @ApiProperty()
  notifyBySms: boolean;

  @ApiProperty()
  isActive: boolean;

  @ApiPropertyOptional()
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };

  @ApiPropertyOptional()
  service?: {
    id: string;
    name: string;
    capacity?: number | null;
  };
}

export class UpdateWaitlistPositionDto {
  @ApiProperty()
  @IsNumber()
  @Min(1)
  position: number;
}

export class WaitlistFiltersDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  serviceId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class CheckAvailabilityDto {
  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  startTime: Date;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  endTime: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  serviceId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  resourceId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  staffId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  excludeBookingId?: string;
}

export class CreateStaffAvailabilityDto {
  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiProperty({ enum: DayOfWeek })
  @IsEnum(DayOfWeek)
  dayOfWeek: DayOfWeek;

  @ApiProperty()
  @IsString()
  startTime: string; // HH:MM format

  @ApiProperty()
  @IsString()
  endTime: string; // HH:MM format

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  specificDate?: Date;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

// Conflict Detection DTOs
export class ConflictCheckRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Organization ID' })
  organizationId: string;

  @IsDateString()
  @ApiProperty({ description: 'Start time of the booking' })
  startTime: string;

  @IsDateString()
  @ApiProperty({ description: 'End time of the booking' })
  endTime: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Service ID', required: false })
  serviceId?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Resource ID', required: false })
  resourceId?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Staff ID', required: false })
  staffId?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'User ID of the member making the booking' })
  userId: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Booking ID to exclude from conflict check (for updates)',
    required: false,
  })
  excludeBookingId?: string;
}

export class ConflictDetailResponseDto {
  @ApiProperty({
    description: 'Type of conflict',
    enum: ['staff', 'resource', 'member', 'availability', 'capacity'],
  })
  type: 'staff' | 'resource' | 'member' | 'availability' | 'capacity';

  @ApiProperty({ description: 'Conflict description message' })
  message: string;

  @ApiProperty({ description: 'Conflicting booking ID', required: false })
  conflictingBookingId?: string;

  @ApiProperty({ description: 'Additional conflict details', required: false })
  details?: {
    startTime: Date;
    endTime: Date;
    [key: string]: any;
  };
}

export class ConflictCheckResponseDto {
  @ApiProperty({ description: 'Whether any conflicts were found' })
  hasConflict: boolean;

  @ApiProperty({
    description: 'List of conflicts found',
    type: [ConflictDetailResponseDto],
  })
  conflicts: ConflictDetailResponseDto[];

  @ApiProperty({ description: 'Overall conflict message', required: false })
  message?: string;
}

export class AvailableTimeSlotsRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Organization ID' })
  organizationId: string;

  @IsDateString()
  @ApiProperty({ description: 'Date to check availability for' })
  date: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Service ID', required: false })
  serviceId?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Resource ID', required: false })
  resourceId?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Staff ID', required: false })
  staffId?: string;

  @IsInt()
  @Min(1)
  @Max(480) // Max 8 hours
  @ApiProperty({
    description: 'Duration of the booking in minutes',
    minimum: 1,
    maximum: 480,
  })
  duration: number;
}

export class TimeSlotResponseDto {
  @ApiProperty({ description: 'Start time of the available slot' })
  startTime: Date;

  @ApiProperty({ description: 'End time of the available slot' })
  endTime: Date;
}

export class AvailableTimeSlotsResponseDto {
  @ApiProperty({
    description: 'List of available time slots',
    type: [TimeSlotResponseDto],
  })
  slots: TimeSlotResponseDto[];

  @ApiProperty({ description: 'Date for which slots were calculated' })
  date: Date;

  @ApiProperty({ description: 'Duration for each slot in minutes' })
  duration: number;

  @ApiProperty({ description: 'Total number of available slots' })
  totalSlots: number;
}

// Booking Response DTOs
export class BookingUserDto {
  @ApiProperty({ description: 'User ID' })
  id: string;

  @ApiProperty({ description: 'First name' })
  firstName: string;

  @ApiProperty({ description: 'Last name' })
  lastName: string;

  @ApiProperty({ description: 'Email address' })
  email: string;
}

export class BookingServiceDto {
  @ApiProperty({ description: 'Service ID' })
  id: string;

  @ApiProperty({ description: 'Service name' })
  name: string;

  @ApiProperty({ description: 'Duration in minutes' })
  duration: number;

  @ApiProperty({ description: 'Service capacity', required: false })
  capacity?: number;

  @ApiProperty({ description: 'Service type', enum: ServiceType })
  type: ServiceType;

  @ApiPropertyOptional({ description: 'Primary instructor details' })
  primaryInstructor?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export class BookingResourceDto {
  @ApiProperty({ description: 'Resource ID' })
  id: string;

  @ApiProperty({ description: 'Resource name' })
  name: string;

  @ApiProperty({ description: 'Resource type' })
  type: string;
}

export class BookingLocationDto {
  @ApiProperty({ description: 'Location ID' })
  id: string;

  @ApiProperty({ description: 'Location name' })
  name: string;
}

export class BookingOrganizationDto {
  @ApiProperty({ description: 'Organization ID' })
  id: string;

  @ApiProperty({ description: 'Organization name' })
  name: string;
}

export class BookingRecurringScheduleDto {
  @ApiProperty({ description: 'Recurring schedule ID' })
  id: string;

  @ApiProperty({ description: 'RRULE string' })
  rrule: string;

  @ApiProperty({ description: 'Schedule description', required: false })
  description?: string;
}

export class BookingResponseDto {
  @ApiProperty({ description: 'Booking ID' })
  id: string;

  @ApiProperty({ description: 'Organization ID' })
  organizationId: string;

  @ApiProperty({ description: 'Service ID' })
  serviceId: string;

  @ApiProperty({ description: 'User ID' })
  userId: string;

  @ApiProperty({ description: 'Location ID', required: false })
  locationId?: string;

  @ApiProperty({ description: 'Resource ID', required: false })
  resourceId?: string;

  @ApiProperty({ description: 'Booking start time' })
  startTime: Date;

  @ApiProperty({ description: 'Booking end time' })
  endTime: Date;

  @ApiProperty({ description: 'Is all day booking' })
  allDay: boolean;

  @ApiProperty({ description: 'Booking status', enum: BookingStatus })
  status: BookingStatus;

  @ApiProperty({ description: 'Booking type', enum: BookingType })
  type: BookingType;

  @ApiProperty({ description: 'Public notes', required: false })
  notes?: string;

  @ApiProperty({ description: 'Private notes', required: false })
  privateNotes?: string;

  @ApiProperty({ description: 'Booking price', required: false })
  price?: number;

  @ApiProperty({ description: 'Credits used', required: false })
  creditsUsed?: number;

  @ApiProperty({ description: 'Recurring schedule ID', required: false })
  recurringScheduleId?: string;

  @ApiProperty({
    description: 'Instance date for recurring bookings',
    required: false,
  })
  instanceDate?: Date;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;

  @ApiProperty({
    description: 'User details',
    type: BookingUserDto,
  })
  user: BookingUserDto;

  @ApiProperty({
    description: 'Service details',
    type: BookingServiceDto,
  })
  service: BookingServiceDto;

  @ApiPropertyOptional({
    description: 'Resource details',
    type: BookingResourceDto,
  })
  resource?: BookingResourceDto;

  @ApiPropertyOptional({
    description: 'Location details',
    type: BookingLocationDto,
  })
  location?: BookingLocationDto;

  @ApiPropertyOptional({
    description: 'Organization details',
    type: BookingOrganizationDto,
  })
  organization?: BookingOrganizationDto;

  @ApiPropertyOptional({
    description: 'Recurring schedule details',
    type: BookingRecurringScheduleDto,
  })
  recurringSchedule?: BookingRecurringScheduleDto;
}

export class BookingListResponseDto {
  @ApiProperty({ description: 'List of bookings', type: [BookingResponseDto] })
  bookings: BookingResponseDto[];

  @ApiProperty({ description: 'Total number of bookings' })
  total: number;

  @ApiProperty({ description: 'Current page number' })
  page: number;

  @ApiProperty({ description: 'Number of items per page' })
  limit: number;

  @ApiProperty({ description: 'Total number of pages' })
  totalPages: number;

  @ApiProperty({ description: 'Filter criteria used', required: false })
  filters?: {
    startDate?: Date;
    endDate?: Date;
    status?: BookingStatus;
    type?: BookingType;
    serviceId?: string;
    resourceId?: string;
    userId?: string;
  };
}

export class BookingStatsResponseDto {
  @ApiProperty({ description: 'Total number of bookings' })
  totalBookings: number;

  @ApiProperty({ description: 'Number of confirmed bookings' })
  confirmedBookings: number;

  @ApiProperty({ description: 'Number of pending bookings' })
  pendingBookings: number;

  @ApiProperty({ description: 'Number of cancelled bookings' })
  cancelledBookings: number;

  @ApiProperty({ description: 'Number of completed bookings' })
  completedBookings: number;

  @ApiProperty({ description: 'Number of no-show bookings' })
  noShowBookings: number;

  @ApiProperty({ description: 'Total revenue from bookings' })
  totalRevenue: number;

  @ApiProperty({ description: 'Total credits used' })
  totalCreditsUsed: number;

  @ApiProperty({ description: 'Most popular service ID', required: false })
  mostPopularServiceId?: string;

  @ApiProperty({ description: 'Most popular service name', required: false })
  mostPopularServiceName?: string;

  @ApiProperty({ description: 'Peak booking hour (0-23)' })
  peakBookingHour: number;

  @ApiProperty({ description: 'Average booking duration in minutes' })
  averageBookingDuration: number;

  @ApiProperty({ description: 'Booking stats by status' })
  statusBreakdown: Record<BookingStatus, number>;

  @ApiProperty({ description: 'Booking stats by type' })
  typeBreakdown: Record<BookingType, number>;

  @ApiProperty({ description: 'Date range for stats' })
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
}

export class BookingCreatedResponseDto extends BookingResponseDto {
  @ApiProperty({ description: 'Success message' })
  message: string;

  @ApiPropertyOptional({
    description: 'Waitlist information if applicable',
  })
  waitlistInfo?: {
    position: number;
    estimatedAvailabilityDate?: Date;
  };
}

export class BookingUpdatedResponseDto extends BookingResponseDto {
  @ApiProperty({ description: 'Success message' })
  message: string;

  @ApiProperty({ description: 'List of updated fields' })
  updatedFields: string[];
}

export class BookingCancelledResponseDto {
  @ApiProperty({ description: 'Booking ID' })
  id: string;

  @ApiProperty({ description: 'Previous status', enum: BookingStatus })
  previousStatus: BookingStatus;

  @ApiProperty({ description: 'Current status', enum: BookingStatus })
  currentStatus: BookingStatus;

  @ApiProperty({ description: 'Cancellation timestamp' })
  cancelledAt: Date;

  @ApiProperty({ description: 'Success message' })
  message: string;

  @ApiProperty({ description: 'Refund information', required: false })
  refundInfo?: {
    amount: number;
    creditsRefunded: number;
    refundMethod: string;
  };

  @ApiProperty({ description: 'Waitlist processing info', required: false })
  waitlistProcessed?: {
    notifiedCount: number;
    newBookingCreated: boolean;
  };
}

// Interfaces for proper typing
export interface BookingFilters {
  startDate?: Date;
  endDate?: Date;
  memberId?: string; // Maps to userId in database
  staffId?: string;
  serviceId?: string;
  resourceId?: string;
  status?: BookingStatus;
  type?: BookingType;
}

export interface AuthenticatedRequest {
  user: {
    id: string;
    role: string;
  };
}
