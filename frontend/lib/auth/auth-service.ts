import { api } from '../api';
import type {
  LoginDto,
  RegisterDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  LoginResponseDto,
  RegisterResponseDto,
  MessageResponseDto,
  User,
  AuthError,
} from '../types';

export class AuthService {
  private currentUser: User | null = null;
  private authCallbacks: Array<(user: User | null) => void> = [];

  constructor() {
    // Initialize current user if token exists
    this.initializeUser();
  }

  private async initializeUser(): Promise<void> {
    if (api.isAuthenticated()) {
      try {
        this.currentUser = await api.getCurrentUser();
        this.notifyAuthChange();
      } catch (error) {
        // Token might be invalid, clear it
        api.clearAuth();
        this.currentUser = null;
        this.notifyAuthChange();
      }
    }
  }

  private notifyAuthChange(): void {
    this.authCallbacks.forEach(callback => callback(this.currentUser));
  }

  onAuthChange(callback: (user: User | null) => void): () => void {
    this.authCallbacks.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.authCallbacks.indexOf(callback);
      if (index > -1) {
        this.authCallbacks.splice(index, 1);
      }
    };
  }

  async login(credentials: LoginDto): Promise<{ user: User; token: string }> {
    try {
      const response = await api.login(credentials);
      this.currentUser = response.user;
      this.notifyAuthChange();
      
      return {
        user: response.user,
        token: response.access_token,
      };
    } catch (error) {
      const authError: AuthError = {
        message: error instanceof Error ? error.message : 'Login failed',
        code: 'LOGIN_FAILED',
      };
      throw authError;
    }
  }

  async register(userData: RegisterDto): Promise<{ user: User; token: string }> {
    try {
      const response = await api.register(userData);
      this.currentUser = response.user;
      this.notifyAuthChange();
      
      return {
        user: response.user,
        token: response.access_token,
      };
    } catch (error) {
      const authError: AuthError = {
        message: error instanceof Error ? error.message : 'Registration failed',
        code: 'REGISTRATION_FAILED',
      };
      throw authError;
    }
  }

  async logout(): Promise<void> {
    try {
      await api.logout();
    } catch (error) {
      // Ignore logout errors, we'll clear local state anyway
      console.warn('Logout request failed:', error);
    } finally {
      this.currentUser = null;
      this.notifyAuthChange();
    }
  }

  async forgotPassword(email: string): Promise<string> {
    try {
      const response = await api.forgotPassword({ email });
      return response.message;
    } catch (error) {
      const authError: AuthError = {
        message: error instanceof Error ? error.message : 'Password reset request failed',
        code: 'PASSWORD_RESET_FAILED',
      };
      throw authError;
    }
  }

  /**
   * Reset a user's password using the provided reset token and new password.
   * The backend API expects the token and the new password in the request body.
   */
  async resetPassword(token: string, newPassword: string): Promise<string> {
    try {
      const response = await api.resetPassword({ token, password: newPassword });
      return response.message;
    } catch (error) {
      const authError: AuthError = {
        message: error instanceof Error ? error.message : 'Password reset failed',
        code: 'PASSWORD_RESET_FAILED',
      };
      throw authError;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    if (!api.isAuthenticated()) {
      return null;
    }

    try {
      if (!this.currentUser) {
        this.currentUser = await api.getCurrentUser();
        this.notifyAuthChange();
      }
      return this.currentUser;
    } catch (error) {
      // Token might be invalid
      api.clearAuth();
      this.currentUser = null;
      this.notifyAuthChange();
      return null;
    }
  }

  async refreshUserData(): Promise<User | null> {
    if (!api.isAuthenticated()) {
      return null;
    }

    try {
      this.currentUser = await api.getCurrentUser();
      this.notifyAuthChange();
      return this.currentUser;
    } catch (error) {
      // Token might be invalid
      api.clearAuth();
      this.currentUser = null;
      this.notifyAuthChange();
      return null;
    }
  }

  // OAuth methods
  async initiateGoogleOAuth(organizationId?: string): Promise<string> {
    try {
      const response = await api.getGoogleOAuthUrl(organizationId);
      return response.url;
    } catch (error) {
      const authError: AuthError = {
        message: error instanceof Error ? error.message : 'OAuth initialization failed',
        code: 'OAUTH_INIT_FAILED',
      };
      throw authError;
    }
  }

  async handleOAuthCallback(code: string, state?: string): Promise<{ user: User; token: string }> {
    try {
      const response = await api.handleGoogleCallback({ code, state });
      this.currentUser = response.user;
      this.notifyAuthChange();
      
      return {
        user: response.user,
        token: response.access_token,
      };
    } catch (error) {
      const authError: AuthError = {
        message: error instanceof Error ? error.message : 'OAuth callback failed',
        code: 'OAUTH_CALLBACK_FAILED',
      };
      throw authError;
    }
  }

  // Development helper
  async createDevToken(userId: string): Promise<{ user: User; token: string }> {
    try {
      const response = await api.createDevToken(userId);
      this.currentUser = response.user;
      this.notifyAuthChange();
      
      return {
        user: response.user,
        token: response.access_token,
      };
    } catch (error) {
      const authError: AuthError = {
        message: error instanceof Error ? error.message : 'Dev token creation failed',
        code: 'DEV_TOKEN_FAILED',
      };
      throw authError;
    }
  }

  // Utility methods
  isAuthenticated(): boolean {
    return api.isAuthenticated() && !!this.currentUser;
  }

  getToken(): string | null {
    return api.getStoredToken();
  }

  hasRole(role: string): boolean {
    return this.currentUser?.role === role;
  }

  hasAnyRole(roles: string[]): boolean {
    return this.currentUser ? roles.includes(this.currentUser.role) : false;
  }

  isAdmin(): boolean {
    return this.hasAnyRole(['SUPER_ADMIN', 'ORGANIZATION_ADMIN', 'ADMIN']);
  }

  isStaff(): boolean {
    return this.hasAnyRole(['SUPER_ADMIN', 'ORGANIZATION_ADMIN', 'ADMIN', 'STAFF']);
  }

  getCurrentOrganizationId(): string | null {
    return this.currentUser?.organizationId || null;
  }
}

// Export singleton instance
export const authService = new AuthService();
