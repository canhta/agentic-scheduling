'use client';

import { ReactNode } from 'react';
import { useAuth, useRequireRole } from '@/lib/auth/auth-context';
import { UserRole } from '@/lib/types';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface ProtectedRouteProps {
  children: ReactNode;
  requireRole?: UserRole | UserRole[];
  fallback?: ReactNode;
}

export function ProtectedRoute({ 
  children, 
  requireRole, 
  fallback 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner text="Authenticating..." />
      </div>
    );
  }

  // If no user (useRequireAuth will redirect), show fallback or nothing
  if (!user) {
    return fallback || null;
  }

  // If role is required, check it
  if (requireRole) {
    const roles = Array.isArray(requireRole) ? requireRole : [requireRole];
    const hasRequiredRole = roles.some(role => user.role === role || 
      (role === UserRole.STAFF && user.role === UserRole.ADMIN) // Admin has staff permissions
    );

    if (!hasRequiredRole) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Access Denied
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {`You don't have permission to access this page.`}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Required role: {Array.isArray(requireRole) ? requireRole.join(' or ') : requireRole}
            </p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}

// Convenience components for specific roles
export function AdminRoute({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <ProtectedRoute requireRole={UserRole.ADMIN} fallback={fallback}>
      {children}
    </ProtectedRoute>
  );
}

export function StaffRoute({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <ProtectedRoute requireRole={[UserRole.ADMIN, UserRole.STAFF]} fallback={fallback}>
      {children}
    </ProtectedRoute>
  );
}

export function MemberRoute({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <ProtectedRoute requireRole={[UserRole.ADMIN, UserRole.STAFF, UserRole.MEMBER]} fallback={fallback}>
      {children}
    </ProtectedRoute>
  );
}
