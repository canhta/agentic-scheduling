/**
 * API Client for the Agentic Scheduling Application
 * This file contains all API functions and the main API client class.
 * Based on the auto-generated schema.d.ts file.
 */

import type {
  // Auth types
  LoginDto,
  RegisterDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  RefreshTokenDto,
  OAuthCallbackDto,
  LoginResponseDto,
  RegisterResponseDto,
  RefreshTokenResponseDto,
  MessageResponseDto,
  OAuthUrlResponseDto,
  User,
  
  // User types
  UserResponseDto,
  CreateUserDto,
  UpdateUserDto,
  PaginatedUsersResponseDto,
  OrganizationStatsResponseDto,
  OrganizationActivityResponseDto,
  AttentionUsersResponseDto,
  BulkUserOperationDto,
  BulkOperationResponseDto,
  ChangePasswordDto,
  CreateUserNoteDto,
  UserNoteResponseDto,
  UpdateUserNoteDto,
  UserWithAlertsResponseDto,
  NotesStatsResponseDto,
  
  // Organization types
  Organization,
  CreateOrganizationDto,
  UpdateOrganizationDto,
  
  // Location types
  LocationResponse,
  CreateLocationDto,
  UpdateLocationDto,
  
  // Resource types
  ResourceResponse,
  CreateResourceDto,
  UpdateResourceDto,
  
  // Service types
  ServiceResponse,
  CreateServiceDto,
  UpdateServiceDto,
  
  // Settings types
  OrganizationSettingsResponseDto,
  UpdateOrganizationSettingsDto,
  
  // Booking types
  BookingResponse,
  CreateBookingDto,
  UpdateBookingDto,
  CheckAvailabilityDto,
  
  // Waitlist types
  WaitlistResponse,
  AddToWaitlistDto,
  UpdateWaitlistPositionDto,
  
  // Recurring schedule types
  RecurringScheduleResponse,
  CreateRecurringScheduleDto,
  
  // Calendar types
  CalendarEvent,
  DayViewResponse,
  WeekViewResponse,
  
  // Utility types
  ApiError,
} from './types';

// =============================================================================
// CONFIGURATION
// =============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// =============================================================================
// TOKEN MANAGEMENT
// =============================================================================

interface TokenManager {
  getToken(): string | null;
  setToken(token: string, expiresIn?: number): void;
  removeToken(): void;
  isExpired(): boolean;
}

class LocalTokenManager implements TokenManager {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly TOKEN_EXPIRY_KEY = 'auth_token_expiry';

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    // Try to get from cookies first, fallback to localStorage
    const cookieToken = this.getCookieValue(this.TOKEN_KEY);
    if (cookieToken) return cookieToken;
    
    return localStorage.getItem(this.TOKEN_KEY);
  }

  setToken(token: string, expiresIn?: number): void {
    if (typeof window === 'undefined') return;
    
    // Store in localStorage for compatibility
    localStorage.setItem(this.TOKEN_KEY, token);
    
    // Also store in cookies for middleware access
    const maxAge = expiresIn || 24 * 60 * 60; // Default 24 hours
    document.cookie = `${this.TOKEN_KEY}=${token}; path=/; max-age=${maxAge}; secure; samesite=strict`;
    
    if (expiresIn) {
      const expiryTime = Date.now() + (expiresIn * 1000);
      localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString());
      document.cookie = `${this.TOKEN_EXPIRY_KEY}=${expiryTime}; path=/; max-age=${maxAge}; secure; samesite=strict`;
    }
  }

  removeToken(): void {
    if (typeof window === 'undefined') return;
    
    // Remove from localStorage
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
    
    // Remove from cookies
    document.cookie = `${this.TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
    document.cookie = `${this.TOKEN_EXPIRY_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
  }

  isExpired(): boolean {
    if (typeof window === 'undefined') return true;
    
    // Check cookie first, fallback to localStorage
    const cookieExpiry = this.getCookieValue(this.TOKEN_EXPIRY_KEY);
    const expiryTime = cookieExpiry || localStorage.getItem(this.TOKEN_EXPIRY_KEY);
    
    if (!expiryTime) return false;
    return Date.now() > parseInt(expiryTime);
  }

  private getCookieValue(name: string): string | null {
    if (typeof document === 'undefined') return null;
    
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      const cookieValue = parts.pop()?.split(';').shift();
      return cookieValue || null;
    }
    return null;
  }
}

// =============================================================================
// MAIN API CLIENT CLASS
// =============================================================================

export class ApiClient {
  private baseUrl: string;
  private tokenManager: TokenManager;

  constructor(baseUrl: string = API_BASE_URL, tokenManager?: TokenManager) {
    this.baseUrl = baseUrl;
    this.tokenManager = tokenManager || new LocalTokenManager();
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    // Get auth token and add to headers if available
    const token = this.tokenManager.getToken();
    
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token && !this.tokenManager.isExpired() && { 
          Authorization: `Bearer ${token}` 
        }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      // Handle 401 responses by clearing token
      if (response.status === 401) {
        this.tokenManager.removeToken();
      }

      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({
          message: "An error occurred",
          statusCode: response.status,
        }));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error occurred");
    }
  }

  // =============================================================================
  // AUTHENTICATION API METHODS
  // =============================================================================

  async login(loginData: LoginDto): Promise<LoginResponseDto> {
    const response = await this.request<LoginResponseDto>("/auth/login", {
      method: "POST",
      body: JSON.stringify(loginData),
    });
    
    if (response.access_token) {
      this.tokenManager.setToken(response.access_token, response.expires_in);
    }
    
    return response;
  }

  async register(registerData: RegisterDto): Promise<RegisterResponseDto> {
    const response = await this.request<RegisterResponseDto>("/auth/register", {
      method: "POST",
      body: JSON.stringify(registerData),
    });
    
    if (response.access_token) {
      this.tokenManager.setToken(response.access_token, response.expires_in);
    }
    
    return response;
  }

  async logout(): Promise<MessageResponseDto> {
    try {
      const response = await this.request<MessageResponseDto>("/auth/logout", {
        method: "POST",
      });
      
      this.tokenManager.removeToken();
      return response;
    } catch (error) {
      this.tokenManager.removeToken();
      throw error;
    }
  }

  async refreshToken(refreshData: RefreshTokenDto): Promise<RefreshTokenResponseDto> {
    const response = await this.request<RefreshTokenResponseDto>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify(refreshData),
    });
    
    if (response.access_token) {
      this.tokenManager.setToken(response.access_token, response.expires_in);
    }
    
    return response;
  }

  async forgotPassword(emailData: ForgotPasswordDto): Promise<MessageResponseDto> {
    return this.request<MessageResponseDto>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(emailData),
    });
  }

  async resetPassword(resetData: ResetPasswordDto): Promise<MessageResponseDto> {
    return this.request<MessageResponseDto>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(resetData),
    });
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>("/auth/me");
  }

  async getGoogleOAuthUrl(organizationId?: string): Promise<OAuthUrlResponseDto> {
    const params = organizationId ? `?organizationId=${organizationId}` : "";
    return this.request<OAuthUrlResponseDto>(`/auth/google${params}`);
  }

  async handleGoogleCallback(callbackData: OAuthCallbackDto): Promise<LoginResponseDto> {
    const response = await this.request<LoginResponseDto>("/auth/google/callback", {
      method: "POST",
      body: JSON.stringify(callbackData),
    });
    
    if (response.access_token) {
      this.tokenManager.setToken(response.access_token, response.expires_in);
    }
    
    return response;
  }

  async createDevToken(userId: string): Promise<LoginResponseDto> {
    const response = await this.request<LoginResponseDto>("/auth/dev-token", {
      method: "POST",
      body: JSON.stringify({ userId }),
    });
    
    if (response.access_token) {
      this.tokenManager.setToken(response.access_token, response.expires_in);
    }
    
    return response;
  }

  // =============================================================================
  // USER MANAGEMENT API METHODS
  // =============================================================================

  async getUsers(params?: {
    search?: string;
    role?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedUsersResponseDto> {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append('search', params.search);
    if (params?.role) searchParams.append('role', params.role);
    if (params?.status) searchParams.append('status', params.status);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    
    const queryString = searchParams.toString();
    return this.request<PaginatedUsersResponseDto>(`/users${queryString ? `?${queryString}` : ''}`);
  }

  async createUser(data: CreateUserDto): Promise<UserResponseDto> {
    return this.request<UserResponseDto>("/users", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getUser(id: string): Promise<UserResponseDto> {
    return this.request<UserResponseDto>(`/users/${id}`);
  }

  async updateUser(id: string, data: UpdateUserDto): Promise<UserResponseDto> {
    return this.request<UserResponseDto>(`/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteUser(id: string): Promise<void> {
    return this.request<void>(`/users/${id}`, {
      method: "DELETE",
    });
  }

  // Member Management
  async getMembers(params?: {
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<UserResponseDto[]> {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append('search', params.search);
    if (params?.status) searchParams.append('status', params.status);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    
    const queryString = searchParams.toString();
    return this.request<UserResponseDto[]>(`/users/members${queryString ? `?${queryString}` : ''}`);
  }

  async createMember(data: CreateUserDto): Promise<UserResponseDto> {
    return this.request<UserResponseDto>("/users/members", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getMember(id: string): Promise<UserResponseDto> {
    return this.request<UserResponseDto>(`/users/members/${id}`);
  }

  async getMemberByMemberId(memberId: string): Promise<UserResponseDto> {
    return this.request<UserResponseDto>(`/users/members/member-id/${memberId}`);
  }

  async updateMember(id: string, data: UpdateUserDto): Promise<UserResponseDto> {
    return this.request<UserResponseDto>(`/users/members/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteMember(id: string): Promise<void> {
    return this.request<void>(`/users/members/${id}`, {
      method: "DELETE",
    });
  }

  async getMemberBookingHistory(id: string, params?: {
    startDate?: string;
    endDate?: string;
    status?: string;
  }): Promise<BookingResponse[]> {
    const searchParams = new URLSearchParams();
    if (params?.startDate) searchParams.append('startDate', params.startDate);
    if (params?.endDate) searchParams.append('endDate', params.endDate);
    if (params?.status) searchParams.append('status', params.status);
    
    const queryString = searchParams.toString();
    return this.request<BookingResponse[]>(`/users/members/${id}/booking-history${queryString ? `?${queryString}` : ''}`);
  }

  async getMemberAttendanceStats(id: string, params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<any> {
    const searchParams = new URLSearchParams();
    if (params?.startDate) searchParams.append('startDate', params.startDate);
    if (params?.endDate) searchParams.append('endDate', params.endDate);
    
    const queryString = searchParams.toString();
    return this.request<any>(`/users/members/${id}/attendance-stats${queryString ? `?${queryString}` : ''}`);
  }

  async activateMember(id: string): Promise<MessageResponseDto> {
    return this.request<MessageResponseDto>(`/users/members/${id}/activate`, {
      method: "POST",
    });
  }

  async deactivateMember(id: string): Promise<MessageResponseDto> {
    return this.request<MessageResponseDto>(`/users/members/${id}/deactivate`, {
      method: "POST",
    });
  }

  async suspendMember(id: string): Promise<MessageResponseDto> {
    return this.request<MessageResponseDto>(`/users/members/${id}/suspend`, {
      method: "POST",
    });
  }

  // Staff Management
  async getStaff(params?: {
    search?: string;
    department?: string;
    specialty?: string;
    page?: number;
    limit?: number;
  }): Promise<UserResponseDto[]> {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append('search', params.search);
    if (params?.department) searchParams.append('department', params.department);
    if (params?.specialty) searchParams.append('specialty', params.specialty);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    
    const queryString = searchParams.toString();
    return this.request<UserResponseDto[]>(`/users/staff${queryString ? `?${queryString}` : ''}`);
  }

  async createStaff(data: CreateUserDto): Promise<UserResponseDto> {
    return this.request<UserResponseDto>("/users/staff", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getStaffById(id: string): Promise<UserResponseDto> {
    return this.request<UserResponseDto>(`/users/staff/${id}`);
  }

  async updateStaff(id: string, data: UpdateUserDto): Promise<UserResponseDto> {
    return this.request<UserResponseDto>(`/users/staff/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteStaff(id: string): Promise<void> {
    return this.request<void>(`/users/staff/${id}`, {
      method: "DELETE",
    });
  }

  async getStaffAvailability(id: string, params?: {
    date?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<any> {
    const searchParams = new URLSearchParams();
    if (params?.date) searchParams.append('date', params.date);
    if (params?.startDate) searchParams.append('startDate', params.startDate);
    if (params?.endDate) searchParams.append('endDate', params.endDate);
    
    const queryString = searchParams.toString();
    return this.request<any>(`/users/staff/${id}/availability${queryString ? `?${queryString}` : ''}`);
  }

  async setStaffAvailability(id: string, data: any): Promise<any> {
    return this.request<any>(`/users/staff/${id}/availability`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Admin Management
  async getAdmins(params?: {
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<UserResponseDto[]> {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append('search', params.search);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    
    const queryString = searchParams.toString();
    return this.request<UserResponseDto[]>(`/users/admins${queryString ? `?${queryString}` : ''}`);
  }

  async createAdmin(data: CreateUserDto): Promise<UserResponseDto> {
    return this.request<UserResponseDto>("/users/admins", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getAdminById(id: string): Promise<UserResponseDto> {
    return this.request<UserResponseDto>(`/users/admins/${id}`);
  }

  async updateAdmin(id: string, data: UpdateUserDto): Promise<UserResponseDto> {
    return this.request<UserResponseDto>(`/users/admins/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteAdmin(id: string): Promise<void> {
    return this.request<void>(`/users/admins/${id}`, {
      method: "DELETE",
    });
  }

  // Organization Statistics and Reports
  async getOrganizationStats(): Promise<OrganizationStatsResponseDto> {
    return this.request<OrganizationStatsResponseDto>("/users/organization/stats");
  }

  async getOrganizationActivity(params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<OrganizationActivityResponseDto> {
    const searchParams = new URLSearchParams();
    if (params?.startDate) searchParams.append('startDate', params.startDate);
    if (params?.endDate) searchParams.append('endDate', params.endDate);
    
    const queryString = searchParams.toString();
    return this.request<OrganizationActivityResponseDto>(`/users/organization/activity${queryString ? `?${queryString}` : ''}`);
  }

  async getRecentSignups(params?: {
    days?: number;
    limit?: number;
  }): Promise<UserResponseDto[]> {
    const searchParams = new URLSearchParams();
    if (params?.days) searchParams.append('days', params.days.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    
    const queryString = searchParams.toString();
    return this.request<UserResponseDto[]>(`/users/organization/recent-signups${queryString ? `?${queryString}` : ''}`);
  }

  async getUsersRequiringAttention(): Promise<AttentionUsersResponseDto> {
    return this.request<AttentionUsersResponseDto>("/users/organization/attention-required");
  }

  async bulkUserOperations(data: BulkUserOperationDto): Promise<BulkOperationResponseDto> {
    return this.request<BulkOperationResponseDto>("/users/bulk-operations", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async promoteUserRole(id: string, data: { newRole: string }): Promise<MessageResponseDto> {
    return this.request<MessageResponseDto>(`/users/${id}/promote`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async demoteUserRole(id: string, data: { newRole: string }): Promise<MessageResponseDto> {
    return this.request<MessageResponseDto>(`/users/${id}/demote`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async changeUserPassword(id: string, data: ChangePasswordDto): Promise<MessageResponseDto> {
    return this.request<MessageResponseDto>(`/users/${id}/change-password`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async resetUserPassword(id: string, data: { newPassword: string }): Promise<MessageResponseDto> {
    return this.request<MessageResponseDto>(`/users/${id}/reset-password`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async verifyUserEmail(id: string): Promise<MessageResponseDto> {
    return this.request<MessageResponseDto>(`/users/${id}/verify-email`, {
      method: "POST",
    });
  }

  async verifyUserPhone(id: string, data: { verificationCode: string }): Promise<MessageResponseDto> {
    return this.request<MessageResponseDto>(`/users/${id}/verify-phone`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // User Notes Management
  async getUserNotes(userId: string, params?: {
    includeAlerts?: boolean;
    page?: number;
    limit?: number;
  }): Promise<UserNoteResponseDto[]> {
    const searchParams = new URLSearchParams();
    if (params?.includeAlerts !== undefined) searchParams.append('includeAlerts', params.includeAlerts.toString());
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    
    const queryString = searchParams.toString();
    return this.request<UserNoteResponseDto[]>(`/users/${userId}/notes${queryString ? `?${queryString}` : ''}`);
  }

  async createUserNote(userId: string, data: CreateUserNoteDto): Promise<UserNoteResponseDto> {
    return this.request<UserNoteResponseDto>(`/users/${userId}/notes`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getNote(noteId: string): Promise<UserNoteResponseDto> {
    return this.request<UserNoteResponseDto>(`/users/notes/${noteId}`);
  }

  async updateUserNote(noteId: string, data: UpdateUserNoteDto): Promise<UserNoteResponseDto> {
    return this.request<UserNoteResponseDto>(`/users/notes/${noteId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteUserNote(noteId: string): Promise<void> {
    return this.request<void>(`/users/notes/${noteId}`, {
      method: "DELETE",
    });
  }

  async getAlerts(): Promise<UserNoteResponseDto[]> {
    return this.request<UserNoteResponseDto[]>("/users/organization/alerts");
  }

  async getUsersWithAlerts(): Promise<UserWithAlertsResponseDto[]> {
    return this.request<UserWithAlertsResponseDto[]>("/users/organization/users-with-alerts");
  }

  async markAlertAsRead(alertId: string): Promise<MessageResponseDto> {
    return this.request<MessageResponseDto>(`/users/alerts/${alertId}/mark-read`, {
      method: "POST",
    });
  }

  async getNotesStats(): Promise<NotesStatsResponseDto> {
    return this.request<NotesStatsResponseDto>("/users/organization/notes-stats");
  }

  // =============================================================================
  // BOOKING API METHODS
  // =============================================================================

  async getBookings(organizationId: string, params?: {
    serviceId?: string;
    userId?: string;
    memberId?: string;
    staffId?: string;
    resourceId?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    type?: string;
    page?: number;
    limit?: number;
  }): Promise<BookingResponse[]> {
    const searchParams = new URLSearchParams();
    if (params?.serviceId) searchParams.append('serviceId', params.serviceId);
    if (params?.userId) searchParams.append('userId', params.userId);
    if (params?.memberId) searchParams.append('memberId', params.memberId);
    if (params?.staffId) searchParams.append('staffId', params.staffId);
    if (params?.resourceId) searchParams.append('resourceId', params.resourceId);
    if (params?.status) searchParams.append('status', params.status);
    if (params?.startDate) searchParams.append('startDate', params.startDate);
    if (params?.endDate) searchParams.append('endDate', params.endDate);
    if (params?.type) searchParams.append('type', params.type);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    
    const queryString = searchParams.toString();
    return this.request<BookingResponse[]>(`/organizations/${organizationId}/bookings${queryString ? `?${queryString}` : ''}`);
  }

  async createBooking(organizationId: string, data: CreateBookingDto): Promise<BookingResponse> {
    return this.request<BookingResponse>(`/organizations/${organizationId}/bookings`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getMyBookings(organizationId: string, params?: {
    status?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<BookingResponse[]> {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append('status', params.status);
    if (params?.startDate) searchParams.append('startDate', params.startDate);
    if (params?.endDate) searchParams.append('endDate', params.endDate);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    
    const queryString = searchParams.toString();
    return this.request<BookingResponse[]>(`/organizations/${organizationId}/bookings/my-bookings${queryString ? `?${queryString}` : ''}`);
  }

  async getBooking(organizationId: string, bookingId: string): Promise<BookingResponse> {
    return this.request<BookingResponse>(`/organizations/${organizationId}/bookings/${bookingId}`);
  }

  async updateBooking(organizationId: string, bookingId: string, data: UpdateBookingDto): Promise<BookingResponse> {
    return this.request<BookingResponse>(`/organizations/${organizationId}/bookings/${bookingId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async cancelBooking(organizationId: string, bookingId: string): Promise<void> {
    return this.request<void>(`/organizations/${organizationId}/bookings/${bookingId}`, {
      method: "DELETE",
    });
  }

  async checkAvailability(organizationId: string, data: CheckAvailabilityDto): Promise<{ available: boolean; conflictingBookings?: any[] }> {
    return this.request<{ available: boolean; conflictingBookings?: any[] }>(`/organizations/${organizationId}/bookings/check-availability`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getAvailableSlots(organizationId: string, params: {
    serviceId: string;
    date: string;
    resourceId?: string;
    staffId?: string;
    duration?: string;
  }): Promise<{ time: string; available: boolean; capacity?: number; booked?: number }[]> {
    const searchParams = new URLSearchParams();
    searchParams.append('serviceId', params.serviceId);
    searchParams.append('date', params.date);
    if (params.resourceId) searchParams.append('resourceId', params.resourceId);
    if (params.staffId) searchParams.append('staffId', params.staffId);
    if (params.duration) searchParams.append('duration', params.duration);
    
    return this.request<{ time: string; available: boolean; capacity?: number; booked?: number }[]>(`/organizations/${organizationId}/bookings/availability/slots?${searchParams.toString()}`);
  }

  // Waitlist Management
  async getWaitlistEntries(organizationId: string, params?: {
    serviceId?: string;
    resourceId?: string;
    memberId?: string;
    userId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<WaitlistResponse[]> {
    const searchParams = new URLSearchParams();
    if (params?.serviceId) searchParams.append('serviceId', params.serviceId);
    if (params?.resourceId) searchParams.append('resourceId', params.resourceId);
    if (params?.memberId) searchParams.append('memberId', params.memberId);
    if (params?.userId) searchParams.append('userId', params.userId);
    if (params?.startDate) searchParams.append('startDate', params.startDate);
    if (params?.endDate) searchParams.append('endDate', params.endDate);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    
    const queryString = searchParams.toString();
    return this.request<WaitlistResponse[]>(`/organizations/${organizationId}/bookings/waitlist${queryString ? `?${queryString}` : ''}`);
  }

  async addToWaitlist(organizationId: string, data: AddToWaitlistDto): Promise<WaitlistResponse> {
    return this.request<WaitlistResponse>(`/organizations/${organizationId}/bookings/waitlist`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getMyWaitlistEntries(organizationId: string): Promise<WaitlistResponse[]> {
    return this.request<WaitlistResponse[]>(`/organizations/${organizationId}/bookings/waitlist/my-entries`);
  }

  async removeFromWaitlist(organizationId: string, waitlistId: string): Promise<void> {
    return this.request<void>(`/organizations/${organizationId}/bookings/waitlist/${waitlistId}`, {
      method: "DELETE",
    });
  }

  async updateWaitlistPriority(organizationId: string, waitlistId: string, data: UpdateWaitlistPositionDto): Promise<WaitlistResponse> {
    return this.request<WaitlistResponse>(`/organizations/${organizationId}/bookings/waitlist/${waitlistId}/priority`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async getWaitlistPosition(organizationId: string, params: {
    userId: string;
    serviceId: string;
  }): Promise<{ position: number; totalInWaitlist: number }> {
    const searchParams = new URLSearchParams();
    searchParams.append('userId', params.userId);
    searchParams.append('serviceId', params.serviceId);
    
    return this.request<{ position: number; totalInWaitlist: number }>(`/organizations/${organizationId}/bookings/waitlist/position?${searchParams.toString()}`);
  }

  // =============================================================================
  // RECURRING SCHEDULE API METHODS
  // =============================================================================

  async getRecurringSchedules(organizationId: string, params?: {
    serviceId?: string;
    staffId?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }): Promise<RecurringScheduleResponse[]> {
    const searchParams = new URLSearchParams();
    if (params?.serviceId) searchParams.append('serviceId', params.serviceId);
    if (params?.staffId) searchParams.append('staffId', params.staffId);
    if (params?.isActive !== undefined) searchParams.append('isActive', params.isActive.toString());
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    
    const queryString = searchParams.toString();
    return this.request<RecurringScheduleResponse[]>(`/organizations/${organizationId}/recurring-schedules${queryString ? `?${queryString}` : ''}`);
  }

  async createRecurringSchedule(organizationId: string, data: CreateRecurringScheduleDto): Promise<RecurringScheduleResponse> {
    return this.request<RecurringScheduleResponse>(`/organizations/${organizationId}/recurring-schedules`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async validateRRule(organizationId: string, params: {
    rrule: string;
    dtstart: string;
    previewCount?: number;
  }): Promise<{
    isValid: boolean;
    error?: string;
    preview: { start: string; end: string }[];
  }> {
    const searchParams = new URLSearchParams();
    searchParams.append('rrule', params.rrule);
    searchParams.append('dtstart', params.dtstart);
    if (params.previewCount) searchParams.append('previewCount', params.previewCount.toString());
    
    return this.request<{
      isValid: boolean;
      error?: string;
      preview: { start: string; end: string }[];
    }>(`/organizations/${organizationId}/recurring-schedules/validate-rrule?${searchParams.toString()}`);
  }

  async getRecurringTemplates(organizationId: string): Promise<{
    name: string;
    description: string;
    rrule: string;
    frequency: string;
  }[]> {
    return this.request<{
      name: string;
      description: string;
      rrule: string;
      frequency: string;
    }[]>(`/organizations/${organizationId}/recurring-schedules/templates`);
  }

  async getRecurringSchedule(organizationId: string, scheduleId: string): Promise<RecurringScheduleResponse> {
    return this.request<RecurringScheduleResponse>(`/organizations/${organizationId}/recurring-schedules/${scheduleId}`);
  }

  async updateRecurringSchedule(organizationId: string, scheduleId: string, data: Partial<CreateRecurringScheduleDto>): Promise<RecurringScheduleResponse> {
    return this.request<RecurringScheduleResponse>(`/organizations/${organizationId}/recurring-schedules/${scheduleId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteRecurringSchedule(organizationId: string, scheduleId: string): Promise<void> {
    return this.request<void>(`/organizations/${organizationId}/recurring-schedules/${scheduleId}`, {
      method: "DELETE",
    });
  }

  async generateOccurrences(organizationId: string, scheduleId: string, params: {
    startDate: string;
    endDate: string;
    limit?: number;
  }): Promise<{ start: string; end: string; instanceDate: string }[]> {
    const searchParams = new URLSearchParams();
    searchParams.append('startDate', params.startDate);
    searchParams.append('endDate', params.endDate);
    if (params.limit) searchParams.append('limit', params.limit.toString());
    
    return this.request<{ start: string; end: string; instanceDate: string }[]>(`/organizations/${organizationId}/recurring-schedules/${scheduleId}/occurrences?${searchParams.toString()}`);
  }

  async createException(organizationId: string, scheduleId: string, data: {
    exceptionDate: string;
    reason?: string;
  }): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/organizations/${organizationId}/recurring-schedules/${scheduleId}/exceptions`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // =============================================================================
  // CALENDAR API METHODS
  // =============================================================================

  async getCalendarEvents(organizationId: string, params: {
    startDate: string;
    endDate: string;
    serviceId?: string;
    resourceId?: string;
    staffId?: string;
    memberId?: string;
    type?: string;
    view?: 'month' | 'week' | 'day';
  }): Promise<CalendarEvent[]> {
    const searchParams = new URLSearchParams();
    searchParams.append('startDate', params.startDate);
    searchParams.append('endDate', params.endDate);
    if (params.serviceId) searchParams.append('serviceId', params.serviceId);
    if (params.resourceId) searchParams.append('resourceId', params.resourceId);
    if (params.staffId) searchParams.append('staffId', params.staffId);
    if (params.memberId) searchParams.append('memberId', params.memberId);
    if (params.type) searchParams.append('type', params.type);
    if (params.view) searchParams.append('view', params.view);
    
    return this.request<CalendarEvent[]>(`/organizations/${organizationId}/calendar?${searchParams.toString()}`);
  }

  async getStaffCalendar(organizationId: string, staffId: string, params: {
    startDate: string;
    endDate: string;
    includeAvailability?: boolean;
  }): Promise<CalendarEvent[]> {
    const searchParams = new URLSearchParams();
    searchParams.append('startDate', params.startDate);
    searchParams.append('endDate', params.endDate);
    if (params.includeAvailability !== undefined) searchParams.append('includeAvailability', params.includeAvailability.toString());
    
    return this.request<CalendarEvent[]>(`/organizations/${organizationId}/calendar/staff/${staffId}?${searchParams.toString()}`);
  }

  async getMemberCalendar(organizationId: string, memberId: string, params: {
    startDate: string;
    endDate: string;
  }): Promise<CalendarEvent[]> {
    const searchParams = new URLSearchParams();
    searchParams.append('startDate', params.startDate);
    searchParams.append('endDate', params.endDate);
    
    return this.request<CalendarEvent[]>(`/organizations/${organizationId}/calendar/member/${memberId}?${searchParams.toString()}`);
  }

  async getResourceCalendar(organizationId: string, resourceId: string, params: {
    startDate: string;
    endDate: string;
  }): Promise<CalendarEvent[]> {
    const searchParams = new URLSearchParams();
    searchParams.append('startDate', params.startDate);
    searchParams.append('endDate', params.endDate);
    
    return this.request<CalendarEvent[]>(`/organizations/${organizationId}/calendar/resource/${resourceId}?${searchParams.toString()}`);
  }

  async getServiceSchedule(organizationId: string, serviceId: string, params: {
    startDate: string;
    endDate: string;
    includeRecurring?: boolean;
  }): Promise<CalendarEvent[]> {
    const searchParams = new URLSearchParams();
    searchParams.append('startDate', params.startDate);
    searchParams.append('endDate', params.endDate);
    if (params.includeRecurring !== undefined) searchParams.append('includeRecurring', params.includeRecurring.toString());
    
    return this.request<CalendarEvent[]>(`/organizations/${organizationId}/calendar/service/${serviceId}/schedule?${searchParams.toString()}`);
  }

  async getDayView(organizationId: string, params: {
    date: string;
    serviceId?: string;
    resourceId?: string;
    staffId?: string;
  }): Promise<DayViewResponse> {
    const searchParams = new URLSearchParams();
    searchParams.append('date', params.date);
    if (params.serviceId) searchParams.append('serviceId', params.serviceId);
    if (params.resourceId) searchParams.append('resourceId', params.resourceId);
    if (params.staffId) searchParams.append('staffId', params.staffId);
    
    return this.request<DayViewResponse>(`/organizations/${organizationId}/calendar/day?${searchParams.toString()}`);
  }

  async getWeekView(organizationId: string, params: {
    startOfWeek: string;
    serviceId?: string;
    resourceId?: string;
    staffId?: string;
  }): Promise<WeekViewResponse> {
    const searchParams = new URLSearchParams();
    searchParams.append('startOfWeek', params.startOfWeek);
    if (params.serviceId) searchParams.append('serviceId', params.serviceId);
    if (params.resourceId) searchParams.append('resourceId', params.resourceId);
    if (params.staffId) searchParams.append('staffId', params.staffId);
    
    return this.request<WeekViewResponse>(`/organizations/${organizationId}/calendar/week?${searchParams.toString()}`);
  }

  async getMyCalendar(organizationId: string, params: {
    startDate: string;
    endDate: string;
    type?: string;
    includeWaitlist?: boolean;
  }): Promise<CalendarEvent[]> {
    const searchParams = new URLSearchParams();
    searchParams.append('startDate', params.startDate);
    searchParams.append('endDate', params.endDate);
    if (params.type) searchParams.append('type', params.type);
    if (params.includeWaitlist !== undefined) searchParams.append('includeWaitlist', params.includeWaitlist.toString());
    
    return this.request<CalendarEvent[]>(`/organizations/${organizationId}/calendar/my-calendar?${searchParams.toString()}`);
  }

  async getAvailabilityOverview(organizationId: string, params: {
    date: string;
    resourceIds?: string[];
    staffIds?: string[];
  }): Promise<{
    date: string;
    resources: { id: string; name: string; availability: { time: string; available: boolean; capacity?: number; booked?: number }[] }[];
    staff: { id: string; name: string; availability: { time: string; available: boolean }[] }[];
  }> {
    const searchParams = new URLSearchParams();
    searchParams.append('date', params.date);
    if (params.resourceIds?.length) {
      params.resourceIds.forEach(id => searchParams.append('resourceIds', id));
    }
    if (params.staffIds?.length) {
      params.staffIds.forEach(id => searchParams.append('staffIds', id));
    }
    
    return this.request<{
      date: string;
      resources: { id: string; name: string; availability: { time: string; available: boolean; capacity?: number; booked?: number }[] }[];
      staff: { id: string; name: string; availability: { time: string; available: boolean }[] }[];
    }>(`/organizations/${organizationId}/calendar/availability-overview?${searchParams.toString()}`);
  }

  // =============================================================================
  // ORGANIZATION API METHODS
  // =============================================================================

  async getOrganizations(): Promise<Organization[]> {
    return this.request<Organization[]>("/organizations");
  }

  async getOrganization(id: string): Promise<Organization> {
    return this.request<Organization>(`/organizations/${id}`);
  }

  async getOrganizationBySlug(slug: string): Promise<Organization> {
    return this.request<Organization>(`/organizations/slug/${slug}`);
  }

  async createOrganization(data: CreateOrganizationDto): Promise<Organization> {
    return this.request<Organization>("/organizations", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateOrganization(id: string, data: UpdateOrganizationDto): Promise<Organization> {
    return this.request<Organization>(`/organizations/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteOrganization(id: string): Promise<void> {
    return this.request<void>(`/organizations/${id}`, {
      method: "DELETE",
    });
  }

  // =============================================================================
  // LOCATION API METHODS
  // =============================================================================

  async getOrganizationLocations(organizationId: string): Promise<LocationResponse[]> {
    return this.request<LocationResponse[]>(`/organizations/${organizationId}/locations`);
  }

  async getOrganizationLocation(organizationId: string, locationId: string): Promise<LocationResponse> {
    return this.request<LocationResponse>(`/organizations/${organizationId}/locations/${locationId}`);
  }

  async createOrganizationLocation(organizationId: string, data: CreateLocationDto): Promise<LocationResponse> {
    return this.request<LocationResponse>(`/organizations/${organizationId}/locations`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateOrganizationLocation(organizationId: string, locationId: string, data: UpdateLocationDto): Promise<LocationResponse> {
    return this.request<LocationResponse>(`/organizations/${organizationId}/locations/${locationId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteOrganizationLocation(organizationId: string, locationId: string): Promise<void> {
    return this.request<void>(`/organizations/${organizationId}/locations/${locationId}`, {
      method: "DELETE",
    });
  }

  // =============================================================================
  // RESOURCE API METHODS
  // =============================================================================

  async getOrganizationResources(organizationId: string): Promise<ResourceResponse[]> {
    return this.request<ResourceResponse[]>(`/organizations/${organizationId}/resources`);
  }

  async getOrganizationResource(organizationId: string, resourceId: string): Promise<ResourceResponse> {
    return this.request<ResourceResponse>(`/organizations/${organizationId}/resources/${resourceId}`);
  }

  async createOrganizationResource(organizationId: string, data: CreateResourceDto): Promise<ResourceResponse> {
    return this.request<ResourceResponse>(`/organizations/${organizationId}/resources`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateOrganizationResource(organizationId: string, resourceId: string, data: UpdateResourceDto): Promise<ResourceResponse> {
    return this.request<ResourceResponse>(`/organizations/${organizationId}/resources/${resourceId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteOrganizationResource(organizationId: string, resourceId: string): Promise<void> {
    return this.request<void>(`/organizations/${organizationId}/resources/${resourceId}`, {
      method: "DELETE",
    });
  }

  // =============================================================================
  // SERVICE API METHODS
  // =============================================================================

  async getOrganizationServices(organizationId: string): Promise<ServiceResponse[]> {
    return this.request<ServiceResponse[]>(`/organizations/${organizationId}/services`);
  }

  async getOrganizationService(organizationId: string, serviceId: string): Promise<ServiceResponse> {
    return this.request<ServiceResponse>(`/organizations/${organizationId}/services/${serviceId}`);
  }

  async getOrganizationServicesByType(
    organizationId: string,
    serviceType: "CLASS" | "APPOINTMENT" | "WORKSHOP" | "PERSONAL_TRAINING"
  ): Promise<ServiceResponse[]> {
    return this.request<ServiceResponse[]>(`/organizations/${organizationId}/services/type/${serviceType}`);
  }

  async createOrganizationService(organizationId: string, data: CreateServiceDto): Promise<ServiceResponse> {
    return this.request<ServiceResponse>(`/organizations/${organizationId}/services`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateOrganizationService(organizationId: string, serviceId: string, data: UpdateServiceDto): Promise<ServiceResponse> {
    return this.request<ServiceResponse>(`/organizations/${organizationId}/services/${serviceId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteOrganizationService(organizationId: string, serviceId: string): Promise<void> {
    return this.request<void>(`/organizations/${organizationId}/services/${serviceId}`, {
      method: "DELETE",
    });
  }

  // =============================================================================
  // SETTINGS API METHODS
  // =============================================================================

  async getOrganizationSettings(organizationId: string): Promise<OrganizationSettingsResponseDto> {
    return this.request<OrganizationSettingsResponseDto>(`/organizations/${organizationId}/settings`);
  }

  async updateOrganizationSettings(organizationId: string, data: UpdateOrganizationSettingsDto): Promise<OrganizationSettingsResponseDto> {
    return this.request<OrganizationSettingsResponseDto>(`/organizations/${organizationId}/settings`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  // =============================================================================
  // TOKEN MANAGEMENT METHODS
  // =============================================================================

  getStoredToken(): string | null {
    return this.tokenManager.getToken();
  }

  isAuthenticated(): boolean {
    const token = this.tokenManager.getToken();
    return !!token && !this.tokenManager.isExpired();
  }

  clearAuth(): void {
    this.tokenManager.removeToken();
  }
}

// =============================================================================
// EXPORT SINGLETON INSTANCE
// =============================================================================

export const api = new ApiClient();

// =============================================================================
// CONVENIENCE EXPORTS
// =============================================================================

// Re-export commonly used types for convenience
export type {
  // Auth types
  LoginDto,
  RegisterDto,
  User,
  
  // User types
  UserResponseDto,
  CreateUserDto,
  UpdateUserDto,
  PaginatedUsersResponseDto,
  OrganizationStatsResponseDto,
  OrganizationActivityResponseDto,
  AttentionUsersResponseDto,
  BulkUserOperationDto,
  BulkOperationResponseDto,
  ChangePasswordDto,
  CreateUserNoteDto,
  UserNoteResponseDto,
  UpdateUserNoteDto,
  UserWithAlertsResponseDto,
  NotesStatsResponseDto,
  
  // Organization types
  Organization,
  CreateOrganizationDto,
  UpdateOrganizationDto,
  LocationResponse,
  ResourceResponse,
  ServiceResponse,
  CreateLocationDto,
  UpdateLocationDto,
  CreateResourceDto,
  UpdateResourceDto,
  CreateServiceDto,
  UpdateServiceDto,
  OrganizationSettingsResponseDto,
  UpdateOrganizationSettingsDto,
  
  // Booking types
  BookingResponse,
  CreateBookingDto,
  UpdateBookingDto,
  CheckAvailabilityDto,
  WaitlistResponse,
  AddToWaitlistDto,
  UpdateWaitlistPositionDto,
  
  // Recurring schedule types
  RecurringScheduleResponse,
  CreateRecurringScheduleDto,
  
  // Calendar types
  CalendarEvent,
  DayViewResponse,
  WeekViewResponse,
};
