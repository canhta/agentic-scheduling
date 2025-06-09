'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { SchedulingDashboard } from '@/components/scheduling/SchedulingDashboard';
import { UserRole } from '@/lib/types';

export default function MemberBookingsPage() {
  return (
    <ProtectedRoute requireRole={[UserRole.MEMBER]}>
      <SchedulingDashboard 
        userContext="member"
      />
    </ProtectedRoute>
  );
}