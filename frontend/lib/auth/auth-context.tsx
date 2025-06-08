'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from './auth-service';
import type { User, AuthState, AuthError, LoginDto, RegisterDto } from '../types';

interface AuthContextType extends AuthState {
  login: (credentials: LoginDto) => Promise<void>;
  register: (userData: RegisterDto) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<string>;
  resetPassword: (token: string, newPassword: string, confirmPassword: string) => Promise<string>;
  refreshUserData: () => Promise<void>;
  initiateGoogleOAuth: (organizationId?: string) => Promise<string>;
  handleOAuthCallback: (code: string, state?: string) => Promise<void>;
  clearError: () => void;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  isAdmin: () => boolean;
  isStaff: () => boolean;
  error: AuthError | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    loading: true,
    isAuthenticated: false,
  });
  const [error, setError] = useState<AuthError | null>(null);

  useEffect(() => {
    // Initialize auth state
    const initializeAuth = async () => {
      try {
        const user = await authService.getCurrentUser();
        const token = authService.getToken();
        
        setAuthState({
          user,
          token,
          loading: false,
          isAuthenticated: !!user && !!token,
        });
      } catch (error) {
        setAuthState({
          user: null,
          token: null,
          loading: false,
          isAuthenticated: false,
        });
      }
    };

    initializeAuth();

    // Subscribe to auth changes
    const unsubscribe = authService.onAuthChange((user) => {
      const token = authService.getToken();
      setAuthState(prev => ({
        ...prev,
        user,
        token,
        isAuthenticated: !!user && !!token,
        loading: false,
      }));
    });

    return unsubscribe;
  }, []);

  const login = async (credentials: LoginDto): Promise<void> => {
    setError(null);
    setAuthState(prev => ({ ...prev, loading: true }));
    
    try {
      const result = await authService.login(credentials);
      // State will be updated via the auth change callback
    } catch (error) {
      setError(error as AuthError);
      setAuthState(prev => ({ ...prev, loading: false }));
      throw error;
    }
  };

  const register = async (userData: RegisterDto): Promise<void> => {
    setError(null);
    setAuthState(prev => ({ ...prev, loading: true }));
    
    try {
      const result = await authService.register(userData);
      // State will be updated via the auth change callback
    } catch (error) {
      setError(error as AuthError);
      setAuthState(prev => ({ ...prev, loading: false }));
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    setError(null);
    try {
      await authService.logout();
      // State will be updated via the auth change callback
    } catch (error) {
      setError(error as AuthError);
      throw error;
    }
  };

  const forgotPassword = async (email: string): Promise<string> => {
    setError(null);
    try {
      return await authService.forgotPassword(email);
    } catch (error) {
      setError(error as AuthError);
      throw error;
    }
  };

  const resetPassword = async (
    token: string, 
    newPassword: string, 
    confirmPassword: string
  ): Promise<string> => {
    setError(null);
    try {
      return await authService.resetPassword(token, newPassword, confirmPassword);
    } catch (error) {
      setError(error as AuthError);
      throw error;
    }
  };

  const refreshUserData = async (): Promise<void> => {
    setError(null);
    try {
      await authService.refreshUserData();
      // State will be updated via the auth change callback
    } catch (error) {
      setError(error as AuthError);
      throw error;
    }
  };

  const initiateGoogleOAuth = async (organizationId?: string): Promise<string> => {
    setError(null);
    try {
      return await authService.initiateGoogleOAuth(organizationId);
    } catch (error) {
      setError(error as AuthError);
      throw error;
    }
  };

  const handleOAuthCallback = async (code: string, state?: string): Promise<void> => {
    setError(null);
    setAuthState(prev => ({ ...prev, loading: true }));
    
    try {
      await authService.handleOAuthCallback(code, state);
      // State will be updated via the auth change callback
    } catch (error) {
      setError(error as AuthError);
      setAuthState(prev => ({ ...prev, loading: false }));
      throw error;
    }
  };

  const clearError = (): void => {
    setError(null);
  };

  const hasRole = (role: string): boolean => {
    return authService.hasRole(role);
  };

  const hasAnyRole = (roles: string[]): boolean => {
    return authService.hasAnyRole(roles);
  };

  const isAdmin = (): boolean => {
    return authService.isAdmin();
  };

  const isStaff = (): boolean => {
    return authService.isStaff();
  };

  const contextValue: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    refreshUserData,
    initiateGoogleOAuth,
    handleOAuthCallback,
    clearError,
    hasRole,
    hasAnyRole,
    isAdmin,
    isStaff,
    error,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook for protecting routes
export function useRequireAuth(): User {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // Redirect to login page
      router.push('/auth/login');
    }
  }, [isAuthenticated, loading, router]);

  if (!user || !isAuthenticated) {
    throw new Error('Authentication required');
  }

  return user;
}

// Hook for role-based access control
export function useRequireRole(roles: string | string[]): User {
  const { user, hasRole, hasAnyRole } = useRequireAuth() as any;
  const router = useRouter();
  const rolesArray = useMemo(() => Array.isArray(roles) ? roles : [roles], [roles]);
  
  useEffect(() => {
    if (user && !hasAnyRole(rolesArray)) {
      // Redirect to unauthorized page or dashboard
      router.push('/unauthorized');
    }
  }, [user, rolesArray, hasAnyRole, router]);

  if (!hasAnyRole(rolesArray)) {
    throw new Error(`Role ${rolesArray.join(' or ')} required`);
  }

  return user;
}
