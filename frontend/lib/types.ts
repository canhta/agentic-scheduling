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
