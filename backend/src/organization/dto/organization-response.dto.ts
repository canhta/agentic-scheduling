import { ApiProperty } from '@nestjs/swagger';

export class OrganizationResponseDto {
  @ApiProperty({ description: 'Organization ID' })
  id: string;

  @ApiProperty({ description: 'Organization name' })
  name: string;

  @ApiProperty({ description: 'Unique slug for URL identification' })
  slug: string;

  @ApiProperty({ description: 'Organization description', required: false })
  description?: string;

  @ApiProperty({ description: 'Organization website', required: false })
  website?: string;

  @ApiProperty({ description: 'Primary contact phone', required: false })
  phone?: string;

  @ApiProperty({ description: 'Primary contact email', required: false })
  email?: string;

  @ApiProperty({ description: 'Street address', required: false })
  address?: string;

  @ApiProperty({ description: 'City', required: false })
  city?: string;

  @ApiProperty({ description: 'State', required: false })
  state?: string;

  @ApiProperty({ description: 'ZIP code', required: false })
  zipCode?: string;

  @ApiProperty({ description: 'Country' })
  country: string;

  @ApiProperty({ description: 'Timezone' })
  timezone: string;

  @ApiProperty({ description: 'Currency' })
  currency: string;

  @ApiProperty({ description: 'Business type' })
  businessType: string;

  @ApiProperty({ description: 'Active status' })
  isActive: boolean;

  @ApiProperty({ description: 'Subscription tier' })
  subscriptionTier: string;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt: Date;
}

export class LocationResponseDto {
  @ApiProperty({ description: 'Location ID' })
  id: string;

  @ApiProperty({ description: 'Location name' })
  name: string;

  @ApiProperty({ description: 'Location description', required: false })
  description?: string;

  @ApiProperty({ description: 'Street address' })
  address: string;

  @ApiProperty({ description: 'City' })
  city: string;

  @ApiProperty({ description: 'State' })
  state: string;

  @ApiProperty({ description: 'ZIP code' })
  zipCode: string;

  @ApiProperty({ description: 'Country' })
  country: string;

  @ApiProperty({ description: 'Phone number', required: false })
  phone?: string;

  @ApiProperty({ description: 'Email address', required: false })
  email?: string;

  @ApiProperty({ description: 'Is primary location' })
  isPrimary: boolean;

  @ApiProperty({ description: 'Active status' })
  isActive: boolean;

  @ApiProperty({ description: 'Organization ID' })
  organizationId: string;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt: Date;
}

export class ResourceResponseDto {
  @ApiProperty({ description: 'Resource ID' })
  id: string;

  @ApiProperty({ description: 'Resource name' })
  name: string;

  @ApiProperty({ description: 'Resource type' })
  type: string;

  @ApiProperty({ description: 'Resource description', required: false })
  description?: string;

  @ApiProperty({ description: 'Capacity (for rooms/spaces)', required: false })
  capacity?: number;

  @ApiProperty({ description: 'Is bookable' })
  isBookable: boolean;

  @ApiProperty({ description: 'Active status' })
  isActive: boolean;

  @ApiProperty({ description: 'Organization ID' })
  organizationId: string;

  @ApiProperty({ description: 'Location ID', required: false })
  locationId?: string;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt: Date;
}

export class OrganizationSettingsResponseDto {
  @ApiProperty({ description: 'Settings ID' })
  id: string;

  @ApiProperty({ description: 'Organization ID' })
  organizationId: string;

  @ApiProperty({ description: 'Booking window in days' })
  bookingWindowDays: number;

  @ApiProperty({ description: 'Cancellation window in hours' })
  cancellationWindowHours: number;

  @ApiProperty({ description: 'Late cancel penalty enabled' })
  lateCancelPenalty: boolean;

  @ApiProperty({ description: 'No show penalty enabled' })
  noShowPenalty: boolean;

  @ApiProperty({ description: 'Waitlist enabled' })
  waitlistEnabled: boolean;

  @ApiProperty({ description: 'Maximum waitlist size', required: false })
  maxWaitlistSize?: number;

  @ApiProperty({ description: 'Default class duration in minutes' })
  defaultClassDuration: number;

  @ApiProperty({ description: 'Allow recurring bookings' })
  allowRecurringBookings: boolean;

  @ApiProperty({ description: 'Max bookings per member', required: false })
  maxBookingsPerMember?: number;

  @ApiProperty({ description: 'Send confirmation emails' })
  sendConfirmationEmails: boolean;

  @ApiProperty({ description: 'Send reminder emails' })
  sendReminderEmails: boolean;

  @ApiProperty({ description: 'Reminder hours before class' })
  reminderHours: number;

  @ApiProperty({ description: 'Primary brand color', required: false })
  primaryColor?: string;

  @ApiProperty({ description: 'Secondary brand color', required: false })
  secondaryColor?: string;

  @ApiProperty({ description: 'Logo URL', required: false })
  logoUrl?: string;

  @ApiProperty({ description: 'Favicon URL', required: false })
  faviconUrl?: string;

  @ApiProperty({ description: 'Custom domain', required: false })
  customDomain?: string;

  @ApiProperty({ description: 'Require membership for booking' })
  requireMembershipForBooking: boolean;

  @ApiProperty({ description: 'Allow guest bookings' })
  allowGuestBookings: boolean;

  @ApiProperty({ description: 'Minimum advance booking in minutes' })
  minimumAdvanceBooking: number;

  @ApiProperty({ description: 'Maximum advance booking in minutes' })
  maximumAdvanceBooking: number;

  @ApiProperty({ description: 'Business hours configuration', required: false })
  businessHours?: any;
}
