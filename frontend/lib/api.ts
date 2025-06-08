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
  LoginDto,
  RegisterDto,
  User,
  Organization,
  LocationResponse,
  ResourceResponse,
  ServiceResponse,
  CreateOrganizationDto,
  UpdateOrganizationDto,
  CreateLocationDto,
  UpdateLocationDto,
  CreateResourceDto,
  UpdateResourceDto,
  CreateServiceDto,
  UpdateServiceDto,
  OrganizationSettingsResponseDto,
  UpdateOrganizationSettingsDto,
};
