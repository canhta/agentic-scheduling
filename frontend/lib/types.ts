/**
 * Type definitions extracted from the auto-generated schema.d.ts
 * This file contains all DTOs, interfaces, and types used throughout the application.
 */

import type { paths, components, operations } from './schema.d';

// =============================================================================
// RE-EXPORT MAIN TYPES FROM SCHEMA
// =============================================================================

export type { paths, components, operations };

// =============================================================================
// AUTH TYPES
// =============================================================================

export type LoginDto = components['schemas']['LoginDto'];
export type RegisterDto = components['schemas']['RegisterDto'];
export type ForgotPasswordDto = components['schemas']['ForgotPasswordDto'];
export type ResetPasswordDto = components['schemas']['ResetPasswordDto'];
export type RefreshTokenDto = components['schemas']['RefreshTokenDto'];
export type OAuthCallbackDto = components['schemas']['OAuthCallbackDto'];

// Auth Response Types
export type LoginResponseDto = components['schemas']['LoginResponseDto'];
export type RegisterResponseDto = components['schemas']['RegisterResponseDto'];
export type RefreshTokenResponseDto = components['schemas']['RefreshTokenResponseDto'];
export type MessageResponseDto = components['schemas']['MessageResponseDto'];
export type OAuthUrlResponseDto = components['schemas']['OAuthUrlResponseDto'];

// User Types
export type AuthUserDto = components['schemas']['AuthUserDto'];
export type User = AuthUserDto; // Alias for backward compatibility
export type UserResponseDto = components['schemas']['UserResponseDto'];
export type CreateUserDto = components['schemas']['CreateUserDto'];
export type UpdateUserDto = components['schemas']['UpdateUserDto'];

// User Role Type
export type UserRole = AuthUserDto['role'];

// UserRole enum for runtime usage
export const UserRole = {
  SUPER_ADMIN: 'SUPER_ADMIN' as const,
  ORGANIZATION_ADMIN: 'ORGANIZATION_ADMIN' as const,
  ADMIN: 'ADMIN' as const,
  STAFF: 'STAFF' as const,
  MEMBER: 'MEMBER' as const,
} as const;

// User Notes
export type CreateUserNoteDto = components['schemas']['CreateUserNoteDto'];
export type UserNoteResponseDto = components['schemas']['UserNoteResponseDto'];
export type UpdateUserNoteDto = components['schemas']['UpdateUserNoteDto'];

// User Statistics and Analytics
export type OrganizationStatsResponseDto = components['schemas']['OrganizationStatsResponseDto'];
export type OrganizationActivityResponseDto = components['schemas']['OrganizationActivityResponseDto'];
export type AttentionUsersResponseDto = components['schemas']['AttentionUsersResponseDto'];
export type UserWithAlertsResponseDto = components['schemas']['UserWithAlertsResponseDto'];
export type NotesStatsResponseDto = components['schemas']['NotesStatsResponseDto'];
export type PaginatedUsersResponseDto = components['schemas']['PaginatedUsersResponseDto'];

// User Management
export type ChangePasswordDto = components['schemas']['ChangePasswordDto'];
export type BulkUserOperationDto = components['schemas']['BulkUserOperationDto'];
export type BulkOperationResponseDto = components['schemas']['BulkOperationResponseDto'];

// =============================================================================
// ORGANIZATION TYPES
// =============================================================================

export type OrganizationResponseDto = components['schemas']['OrganizationResponseDto'];
export type CreateOrganizationDto = components['schemas']['CreateOrganizationDto'];
export type UpdateOrganizationDto = components['schemas']['UpdateOrganizationDto'];
export type Organization = OrganizationResponseDto; // Alias for backward compatibility

// Locations
export type CreateLocationDto = components['schemas']['CreateLocationDto'];
export type UpdateLocationDto = components['schemas']['UpdateLocationDto'];

// Location response type (not in schema, defined manually)
export type LocationResponse = {
  id: string;
  name: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
  email?: string;
  isPrimary: boolean;
  isActive: boolean;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
};
export type LocationResponseDto = LocationResponse; // Alias

// Resources
export type CreateResourceDto = components['schemas']['CreateResourceDto'];
export type UpdateResourceDto = components['schemas']['UpdateResourceDto'];

// Resource response type (not in schema, defined manually)
export type ResourceResponse = {
  id: string;
  name: string;
  type: "ROOM" | "EQUIPMENT";
  description?: string;
  capacity?: number;
  locationId?: string;
  isBookable: boolean;
  isActive: boolean;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
};
export type ResourceResponseDto = ResourceResponse; // Alias

// Services
export type CreateServiceDto = components['schemas']['CreateServiceDto'];
export type UpdateServiceDto = components['schemas']['UpdateServiceDto'];

// Service response type (not in schema, defined manually)
export type ServiceResponse = {
  id: string;
  name: string;
  description?: string;
  type: "CLASS" | "APPOINTMENT" | "WORKSHOP" | "PERSONAL_TRAINING";
  duration: number;
  capacity?: number;
  price?: number;
  currency?: string;
  bookable: boolean;
  requiresApproval: boolean;
  allowWaitlist: boolean;
  isActive: boolean;
  organizationId: string;
  locationId?: string;
  primaryInstructorId?: string;
  assistantInstructorId?: string;
  resourceIds?: string[];
  color?: string;
  createdAt: string;
  updatedAt: string;
};
export type ServiceResponseDto = ServiceResponse; // Alias

// Organization Settings
export type UpdateOrganizationSettingsDto = components['schemas']['UpdateOrganizationSettingsDto'];
export type BusinessHoursDto = components['schemas']['BusinessHoursDto'];

// Organization settings response type (not in schema, defined manually)
export type OrganizationSettingsResponse = {
  id: string;
  organizationId: string;
  bookingWindowDays: number;
  cancellationWindowHours: number;
  lateCancelPenalty: boolean;
  noShowPenalty: boolean;
  waitlistEnabled: boolean;
  maxWaitlistSize: number;
  defaultClassDuration: number;
  allowRecurringBookings: boolean;
  maxBookingsPerMember: number;
  sendConfirmationEmails: boolean;
  sendReminderEmails: boolean;
  reminderHours: number;
  primaryColor?: string;
  secondaryColor?: string;
  logoUrl?: string;
  faviconUrl?: string;
  customDomain?: string;
  requireMembershipForBooking: boolean;
  allowGuestBookings: boolean;
  minimumAdvanceBooking: number;
  maximumAdvanceBooking: number;
  businessHours: BusinessHoursDto[];
  createdAt: string;
  updatedAt: string;
};
export type OrganizationSettingsResponseDto = OrganizationSettingsResponse; // Alias

// =============================================================================
// BOOKING TYPES
// =============================================================================

export type CreateBookingDto = components['schemas']['CreateBookingDto'];
export type UpdateBookingDto = components['schemas']['UpdateBookingDto'];
export type CheckAvailabilityDto = components['schemas']['CheckAvailabilityDto'];

// Booking response type (not in schema, defined manually)
export type BookingResponse = {
  id: string;
  serviceId: string;
  userId: string;
  locationId?: string;
  resourceId?: string;
  startTime: string;
  endTime: string;
  allDay: boolean;
  status: "CONFIRMED" | "PENDING" | "CANCELLED_BY_MEMBER" | "CANCELLED_BY_STAFF" | "NO_SHOW" | "ATTENDED" | "LATE_CANCELLED";
  notes?: string;
  privateNotes?: string;
  recurringScheduleId?: string;
  instanceDate?: string;
  price?: number;
  creditsUsed?: number;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
};
export type BookingResponseDto = BookingResponse; // Alias

// Waitlist Types
export type AddToWaitlistDto = components['schemas']['AddToWaitlistDto'];
export type UpdateWaitlistPositionDto = components['schemas']['UpdateWaitlistPositionDto'];

// Waitlist response type (not in schema, defined manually)
export type WaitlistResponse = {
  id: string;
  userId: string;
  serviceId: string;
  position: number;
  notifyByEmail: boolean;
  notifyBySms: boolean;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
};
export type WaitlistResponseDto = WaitlistResponse; // Alias

// =============================================================================
// RECURRING SCHEDULE TYPES
// =============================================================================

export type CreateRecurringScheduleDto = components['schemas']['CreateRecurringScheduleDto'];

// Recurring schedule response type (not in schema, defined manually)
export type RecurringScheduleResponse = {
  id: string;
  serviceId: string;
  organizationId: string;
  rrule: string;
  dtstart: string;
  dtend?: string;
  timezone: string;
  frequency: string;
  interval: number;
  byDay?: string[];
  byMonthDay?: string[];
  byMonth?: string[];
  bySetPos?: string[];
  byYearDay?: string[];
  byWeekNo?: string[];
  count?: number;
  until?: string;
  weekStart?: string;
  startTime: string;
  endTime: string;
  duration: number;
  exdates?: string[];
  description?: string;
  resourceId?: string;
  staffId?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
export type RecurringScheduleResponseDto = RecurringScheduleResponse; // Alias

// =============================================================================
// CALENDAR TYPES
// =============================================================================

// Calendar event type (not in schema, defined manually)
export type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  serviceId?: string;
  bookingId?: string;
  recurringScheduleId?: string;
  type: 'booking' | 'recurring' | 'exception' | 'availability';
  status?: string;
  location?: string;
  resource?: string;
  instructor?: string;
  capacity?: number;
  booked?: number;
  color?: string;
};

// Day view response type (not in schema, defined manually)
export type DayViewResponse = {
  date: string;
  events: CalendarEvent[];
  timeSlots: {
    time: string;
    available: boolean;
    capacity?: number;
    booked?: number;
  }[];
};

// Week view response type (not in schema, defined manually)
export type WeekViewResponse = {
  startDate: string;
  endDate: string;
  days: {
    date: string;
    events: CalendarEvent[];
    summary: {
      totalEvents: number;
      totalCapacity: number;
      totalBooked: number;
    };
  }[];
};

// =============================================================================
// UTILITY TYPES (Not in schema but needed for app state)
// =============================================================================

// Auth context state
export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
}

// Auth error types
export interface AuthError {
  message: string;
  code?: string;
}

// Generic API error
export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

// =============================================================================
// OPERATION TYPES (for type-safe API calls)
// =============================================================================

// Auth Operations
export type LoginOperation = operations['AuthController_login'];
export type RegisterOperation = operations['AuthController_register'];
export type LogoutOperation = operations['AuthController_logout'];
export type RefreshOperation = operations['AuthController_refresh'];
export type ForgotPasswordOperation = operations['AuthController_forgotPassword'];
export type ResetPasswordOperation = operations['AuthController_resetPassword'];
export type GetProfileOperation = operations['AuthController_getProfile'];
export type GoogleAuthOperation = operations['AuthController_googleAuth'];
export type GoogleCallbackOperation = operations['AuthController_googleCallback'];
export type CreateDevTokenOperation = operations['AuthController_createDevToken'];

// User Operations  
export type GetUsersOperation = operations['UsersController_findAll'];
export type CreateUserOperation = operations['UsersController_create'];
export type GetUserOperation = operations['UsersController_findOne'];
export type UpdateUserOperation = operations['UsersController_update'];
export type DeleteUserOperation = operations['UsersController_remove'];

// Member Operations
export type GetMembersOperation = operations['UsersController_getAllMembers'];
export type CreateMemberOperation = operations['UsersController_createMember'];
export type GetMemberOperation = operations['UsersController_getMemberById'];
export type UpdateMemberOperation = operations['UsersController_updateMember'];
export type DeleteMemberOperation = operations['UsersController_deleteMember'];
export type GetMemberByMemberIdOperation = operations['UsersController_getMemberByMemberId'];
export type GetMemberBookingHistoryOperation = operations['UsersController_getMemberBookingHistory'];
export type GetMemberAttendanceStatsOperation = operations['UsersController_getMemberAttendanceStats'];
export type ActivateMemberOperation = operations['UsersController_activateMember'];
export type DeactivateMemberOperation = operations['UsersController_deactivateMember'];
export type SuspendMemberOperation = operations['UsersController_suspendMember'];

// Staff Operations
export type GetStaffOperation = operations['UsersController_getAllStaff'];
export type CreateStaffOperation = operations['UsersController_createStaff'];
export type GetStaffByIdOperation = operations['UsersController_getStaffById'];
export type UpdateStaffOperation = operations['UsersController_updateStaff'];
export type DeleteStaffOperation = operations['UsersController_deleteStaff'];
export type GetStaffAvailabilityOperation = operations['UsersController_getStaffAvailability'];
export type SetStaffAvailabilityOperation = operations['UsersController_setStaffAvailability'];

// Admin Operations
export type GetAdminsOperation = operations['UsersController_getAllAdmins'];
export type CreateAdminOperation = operations['UsersController_createAdmin'];
export type GetAdminByIdOperation = operations['UsersController_getAdminById'];
export type UpdateAdminOperation = operations['UsersController_updateAdmin'];
export type DeleteAdminOperation = operations['UsersController_deleteAdmin'];

// User Management Operations
export type GetOrganizationStatsOperation = operations['UsersController_getOrganizationStats'];
export type GetOrganizationActivityOperation = operations['UsersController_getOrganizationActivity'];
export type GetRecentSignupsOperation = operations['UsersController_getRecentSignups'];
export type GetUsersRequiringAttentionOperation = operations['UsersController_getUsersRequiringAttention'];
export type BulkUserOperationsOperation = operations['UsersController_bulkUserOperations'];
export type PromoteUserRoleOperation = operations['UsersController_promoteUserRole'];
export type DemoteUserRoleOperation = operations['UsersController_demoteUserRole'];
export type ChangePasswordOperation = operations['UsersController_changePassword'];
export type ResetUserPasswordOperation = operations['UsersController_resetPassword'];
export type VerifyEmailOperation = operations['UsersController_verifyEmail'];
export type VerifyPhoneOperation = operations['UsersController_verifyPhone'];

// User Notes Operations
export type GetUserNotesOperation = operations['UsersController_getUserNotes'];
export type CreateUserNoteOperation = operations['UsersController_createUserNote'];
export type GetNoteOperation = operations['UsersController_getNote'];
export type UpdateUserNoteOperation = operations['UsersController_updateUserNote'];
export type DeleteUserNoteOperation = operations['UsersController_deleteUserNote'];
export type GetAlertsOperation = operations['UsersController_getAlerts'];
export type GetUsersWithAlertsOperation = operations['UsersController_getUsersWithAlerts'];
export type MarkAlertAsReadOperation = operations['UsersController_markAlertAsRead'];
export type GetNotesStatsOperation = operations['UsersController_getNotesStats'];

// Booking Operations
export type GetBookingsOperation = operations['BookingController_getBookings'];
export type CreateBookingOperation = operations['BookingController_createBooking'];
export type GetMyBookingsOperation = operations['BookingController_getMyBookings'];
export type GetBookingOperation = operations['BookingController_getBooking'];
export type UpdateBookingOperation = operations['BookingController_updateBooking'];
export type CancelBookingOperation = operations['BookingController_cancelBooking'];
export type CheckAvailabilityOperation = operations['BookingController_checkAvailability'];
export type GetAvailableSlotsOperation = operations['BookingController_getAvailableSlots'];

// Waitlist Operations
export type GetWaitlistEntriesOperation = operations['BookingController_getWaitlistEntries'];
export type AddToWaitlistOperation = operations['BookingController_addToWaitlist'];
export type GetMyWaitlistEntriesOperation = operations['BookingController_getMyWaitlistEntries'];
export type RemoveFromWaitlistOperation = operations['BookingController_removeFromWaitlist'];
export type UpdateWaitlistPriorityOperation = operations['BookingController_updateWaitlistPriority'];
export type GetWaitlistPositionOperation = operations['BookingController_getWaitlistPosition'];

// Recurring Schedule Operations
export type GetRecurringSchedulesOperation = operations['RecurringScheduleController_getRecurringSchedules'];
export type CreateRecurringScheduleOperation = operations['RecurringScheduleController_createRecurringSchedule'];
export type ValidateRRuleOperation = operations['RecurringScheduleController_validateRRule'];
export type GetRecurringTemplatesOperation = operations['RecurringScheduleController_getRecurringTemplates'];
export type GetRecurringScheduleOperation = operations['RecurringScheduleController_getRecurringSchedule'];
export type UpdateRecurringScheduleOperation = operations['RecurringScheduleController_updateRecurringSchedule'];
export type DeleteRecurringScheduleOperation = operations['RecurringScheduleController_deleteRecurringSchedule'];
export type GenerateOccurrencesOperation = operations['RecurringScheduleController_generateOccurrences'];
export type CreateExceptionOperation = operations['RecurringScheduleController_createException'];

// Calendar Operations
export type GetCalendarEventsOperation = operations['CalendarController_getCalendarEvents'];
export type GetStaffCalendarOperation = operations['CalendarController_getStaffCalendar'];
export type GetMemberCalendarOperation = operations['CalendarController_getMemberCalendar'];
export type GetResourceCalendarOperation = operations['CalendarController_getResourceCalendar'];
export type GetServiceScheduleOperation = operations['CalendarController_getServiceSchedule'];
export type GetDayViewOperation = operations['CalendarController_getDayView'];
export type GetWeekViewOperation = operations['CalendarController_getWeekView'];
export type GetMyCalendarOperation = operations['CalendarController_getMyCalendar'];
export type GetAvailabilityOverviewOperation = operations['CalendarController_getAvailabilityOverview'];

// Organization Operations
export type GetOrganizationsOperation = operations['OrganizationController_findAll'];
export type CreateOrganizationOperation = operations['OrganizationController_create'];
export type GetOrganizationOperation = operations['OrganizationController_findOne'];
export type UpdateOrganizationOperation = operations['OrganizationController_update'];
export type DeleteOrganizationOperation = operations['OrganizationController_remove'];
export type GetOrganizationBySlugOperation = operations['OrganizationController_findBySlug'];

// Location Operations
export type GetLocationsOperation = operations['OrganizationController_findLocations'];
export type CreateLocationOperation = operations['OrganizationController_createLocation'];
export type GetLocationOperation = operations['OrganizationController_findLocation'];
export type UpdateLocationOperation = operations['OrganizationController_updateLocation'];
export type DeleteLocationOperation = operations['OrganizationController_removeLocation'];

// Resource Operations
export type GetResourcesOperation = operations['OrganizationController_findResources'];
export type CreateResourceOperation = operations['OrganizationController_createResource'];
export type GetResourceOperation = operations['OrganizationController_findResource'];
export type UpdateResourceOperation = operations['OrganizationController_updateResource'];
export type DeleteResourceOperation = operations['OrganizationController_removeResource'];

// Service Operations
export type GetServicesOperation = operations['OrganizationController_getServices'];
export type CreateServiceOperation = operations['OrganizationController_createService'];
export type GetServiceOperation = operations['OrganizationController_getService'];
export type UpdateServiceOperation = operations['OrganizationController_updateService'];
export type DeleteServiceOperation = operations['OrganizationController_removeService'];
export type GetServicesByTypeOperation = operations['OrganizationController_getServicesByType'];

// Settings Operations
export type GetSettingsOperation = operations['OrganizationController_getSettings'];
export type UpdateSettingsOperation = operations['OrganizationController_updateSettings'];
