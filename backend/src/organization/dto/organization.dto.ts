import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  IsUrl,
  IsEmail,
  IsEnum,
  IsNumber,
  IsArray,
  IsUUID,
  Min,
  Max,
} from 'class-validator';

export class CreateOrganizationDto {
  @ApiProperty({ description: 'Organization name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Unique slug for URL identification' })
  @IsString()
  slug: string;

  @ApiPropertyOptional({ description: 'Organization description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Organization website' })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiPropertyOptional({ description: 'Primary contact phone' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'Primary contact email' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'Street address' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'City' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'State' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ description: 'ZIP code' })
  @IsOptional()
  @IsString()
  zipCode?: string;

  @ApiPropertyOptional({ description: 'Country', default: 'US' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ description: 'Timezone', default: 'UTC' })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional({ description: 'Currency', default: 'USD' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ description: 'Business type', default: 'gym' })
  @IsOptional()
  @IsString()
  businessType?: string;
}

export class UpdateOrganizationDto {
  @ApiPropertyOptional({ description: 'Organization name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Organization description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Organization website' })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiPropertyOptional({ description: 'Primary contact phone' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'Primary contact email' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'Street address' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'City' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'State' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ description: 'ZIP code' })
  @IsOptional()
  @IsString()
  zipCode?: string;

  @ApiPropertyOptional({ description: 'Country' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ description: 'Timezone' })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional({ description: 'Currency' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ description: 'Business type' })
  @IsOptional()
  @IsString()
  businessType?: string;

  @ApiPropertyOptional({ description: 'Active status' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class CreateLocationDto {
  @ApiProperty({ description: 'Location name' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Location description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Street address' })
  @IsString()
  address: string;

  @ApiProperty({ description: 'City' })
  @IsString()
  city: string;

  @ApiProperty({ description: 'State' })
  @IsString()
  state: string;

  @ApiProperty({ description: 'ZIP code' })
  @IsString()
  zipCode: string;

  @ApiPropertyOptional({ description: 'Country', default: 'US' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ description: 'Phone number' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'Email address' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'Is primary location', default: false })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}

export class UpdateLocationDto {
  @ApiPropertyOptional({ description: 'Location name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Location description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Street address' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'City' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'State' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ description: 'ZIP code' })
  @IsOptional()
  @IsString()
  zipCode?: string;

  @ApiPropertyOptional({ description: 'Country' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ description: 'Phone number' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'Email address' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'Is primary location' })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  @ApiPropertyOptional({ description: 'Active status' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export enum ResourceType {
  ROOM = 'ROOM',
  EQUIPMENT = 'EQUIPMENT',
}

export class CreateResourceDto {
  @ApiProperty({ description: 'Resource name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Resource type', enum: ResourceType })
  @IsEnum(ResourceType)
  type: ResourceType;

  @ApiPropertyOptional({ description: 'Resource description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Capacity (for rooms/spaces)',
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  capacity?: number;

  @ApiPropertyOptional({ description: 'Location ID' })
  @IsOptional()
  @IsString()
  locationId?: string;

  @ApiPropertyOptional({ description: 'Is bookable', default: true })
  @IsOptional()
  @IsBoolean()
  isBookable?: boolean;
}

export class UpdateResourceDto {
  @ApiPropertyOptional({ description: 'Resource name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Resource type', enum: ResourceType })
  @IsOptional()
  @IsEnum(ResourceType)
  type?: ResourceType;

  @ApiPropertyOptional({ description: 'Resource description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Capacity (for rooms/spaces)',
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  capacity?: number;

  @ApiPropertyOptional({ description: 'Location ID' })
  @IsOptional()
  @IsString()
  locationId?: string;

  @ApiPropertyOptional({ description: 'Is bookable' })
  @IsOptional()
  @IsBoolean()
  isBookable?: boolean;

  @ApiPropertyOptional({ description: 'Active status' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class BusinessHoursDto {
  @ApiProperty({ description: 'Day of week (0-6, Sunday=0)' })
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek: number;

  @ApiProperty({ description: 'Opening time (HH:mm format)' })
  @IsString()
  openTime: string;

  @ApiProperty({ description: 'Closing time (HH:mm format)' })
  @IsString()
  closeTime: string;

  @ApiProperty({ description: 'Is open on this day' })
  @IsBoolean()
  isOpen: boolean;
}

export class UpdateOrganizationSettingsDto {
  @ApiPropertyOptional({ description: 'Booking window in days', minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  bookingWindowDays?: number;

  @ApiPropertyOptional({
    description: 'Cancellation window in hours',
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  cancellationWindowHours?: number;

  @ApiPropertyOptional({ description: 'Late cancel penalty enabled' })
  @IsOptional()
  @IsBoolean()
  lateCancelPenalty?: boolean;

  @ApiPropertyOptional({ description: 'No show penalty enabled' })
  @IsOptional()
  @IsBoolean()
  noShowPenalty?: boolean;

  @ApiPropertyOptional({ description: 'Waitlist enabled' })
  @IsOptional()
  @IsBoolean()
  waitlistEnabled?: boolean;

  @ApiPropertyOptional({ description: 'Maximum waitlist size', minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  maxWaitlistSize?: number;

  @ApiPropertyOptional({
    description: 'Default class duration in minutes',
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  defaultClassDuration?: number;

  @ApiPropertyOptional({ description: 'Allow recurring bookings' })
  @IsOptional()
  @IsBoolean()
  allowRecurringBookings?: boolean;

  @ApiPropertyOptional({ description: 'Max bookings per member', minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  maxBookingsPerMember?: number;

  @ApiPropertyOptional({ description: 'Send confirmation emails' })
  @IsOptional()
  @IsBoolean()
  sendConfirmationEmails?: boolean;

  @ApiPropertyOptional({ description: 'Send reminder emails' })
  @IsOptional()
  @IsBoolean()
  sendReminderEmails?: boolean;

  @ApiPropertyOptional({
    description: 'Reminder hours before class',
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  reminderHours?: number;

  @ApiPropertyOptional({ description: 'Primary brand color' })
  @IsOptional()
  @IsString()
  primaryColor?: string;

  @ApiPropertyOptional({ description: 'Secondary brand color' })
  @IsOptional()
  @IsString()
  secondaryColor?: string;

  @ApiPropertyOptional({ description: 'Logo URL' })
  @IsOptional()
  @IsUrl()
  logoUrl?: string;

  @ApiPropertyOptional({ description: 'Favicon URL' })
  @IsOptional()
  @IsUrl()
  faviconUrl?: string;

  @ApiPropertyOptional({ description: 'Custom domain' })
  @IsOptional()
  @IsString()
  customDomain?: string;

  @ApiPropertyOptional({ description: 'Require membership for booking' })
  @IsOptional()
  @IsBoolean()
  requireMembershipForBooking?: boolean;

  @ApiPropertyOptional({ description: 'Allow guest bookings' })
  @IsOptional()
  @IsBoolean()
  allowGuestBookings?: boolean;

  @ApiPropertyOptional({
    description: 'Minimum advance booking in minutes',
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  minimumAdvanceBooking?: number;

  @ApiPropertyOptional({
    description: 'Maximum advance booking in minutes',
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  maximumAdvanceBooking?: number;

  @ApiPropertyOptional({
    description: 'Business hours',
    type: [BusinessHoursDto],
  })
  @IsOptional()
  businessHours?: BusinessHoursDto[];
}

export enum ServiceType {
  CLASS = 'CLASS',
  APPOINTMENT = 'APPOINTMENT',
  WORKSHOP = 'WORKSHOP',
  PERSONAL_TRAINING = 'PERSONAL_TRAINING',
}

export class CreateServiceDto {
  @ApiProperty({ description: 'Service/Class name' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Service description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Service type', enum: ServiceType })
  @IsEnum(ServiceType)
  type: ServiceType;

  @ApiProperty({
    description: 'Default duration in minutes',
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  duration: number;

  @ApiPropertyOptional({
    description: 'Maximum capacity',
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  capacity?: number;

  @ApiPropertyOptional({ description: 'Service price' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({
    description: 'Is bookable by members',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  bookable?: boolean;

  @ApiPropertyOptional({
    description: 'Requires approval for booking',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  requiresApproval?: boolean;

  @ApiPropertyOptional({
    description: 'Allow waitlist',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  allowWaitlist?: boolean;

  @ApiPropertyOptional({ description: 'Location ID' })
  @IsOptional()
  @IsUUID('4')
  locationId?: string;

  @ApiPropertyOptional({ description: 'Primary instructor ID' })
  @IsOptional()
  @IsUUID('4')
  primaryInstructorId?: string;

  @ApiPropertyOptional({ description: 'Assistant instructor ID' })
  @IsOptional()
  @IsUUID('4')
  assistantInstructorId?: string;

  @ApiPropertyOptional({
    description: 'Resource IDs this service can use',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  resourceIds?: string[];

  @ApiPropertyOptional({ description: 'Calendar display color' })
  @IsOptional()
  @IsString()
  color?: string;
}

export class UpdateServiceDto {
  @ApiPropertyOptional({ description: 'Service/Class name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Service description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Service type', enum: ServiceType })
  @IsOptional()
  @IsEnum(ServiceType)
  type?: ServiceType;

  @ApiPropertyOptional({
    description: 'Default duration in minutes',
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  duration?: number;

  @ApiPropertyOptional({
    description: 'Maximum capacity',
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  capacity?: number;

  @ApiPropertyOptional({ description: 'Service price' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ description: 'Is bookable by members' })
  @IsOptional()
  @IsBoolean()
  bookable?: boolean;

  @ApiPropertyOptional({ description: 'Requires approval for booking' })
  @IsOptional()
  @IsBoolean()
  requiresApproval?: boolean;

  @ApiPropertyOptional({ description: 'Allow waitlist' })
  @IsOptional()
  @IsBoolean()
  allowWaitlist?: boolean;

  @ApiPropertyOptional({ description: 'Location ID' })
  @IsOptional()
  @IsUUID('4')
  locationId?: string;

  @ApiPropertyOptional({ description: 'Primary instructor ID' })
  @IsOptional()
  @IsUUID('4')
  primaryInstructorId?: string;

  @ApiPropertyOptional({ description: 'Assistant instructor ID' })
  @IsOptional()
  @IsUUID('4')
  assistantInstructorId?: string;

  @ApiPropertyOptional({
    description: 'Resource IDs this service can use',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  resourceIds?: string[];

  @ApiPropertyOptional({ description: 'Calendar display color' })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiPropertyOptional({ description: 'Active status' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
