'use client';

import { Button } from 'flowbite-react';
import { HiPlus, HiCalendar } from 'react-icons/hi';
import { SchedulingDashboard } from '@/components/scheduling/SchedulingDashboard';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserRole } from '@/lib/types';

export default function AdminSchedulingPage() {
  return (
    <ProtectedRoute requireRole={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.ORGANIZATION_ADMIN, UserRole.STAFF]}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Scheduling Management
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage classes, bookings, and facility schedules across calendar, list, and table views
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button outline>
                <HiCalendar className="w-4 h-4 mr-2" />
                Export Schedule
              </Button>
              <Button>
                <HiPlus className="w-4 h-4 mr-2" />
                Create Booking
              </Button>
            </div>
          </div>

          {/* Scheduling Dashboard */}
          <SchedulingDashboard 
            userContext="admin"
            organizationId="org-1"
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}
