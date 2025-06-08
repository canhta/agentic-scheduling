'use client';

import { Card, Button } from 'flowbite-react';
import { HiDocumentReport, HiTrendingUp, HiUsers, HiCalendar, HiChartBar } from 'react-icons/hi';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserRole } from '@/lib/types';

export default function AnalyticsPage() {
  return (
    <ProtectedRoute requireRole={[UserRole.ADMIN, UserRole.STAFF, UserRole.ORGANIZATION_ADMIN, UserRole.SUPER_ADMIN]}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Analytics & Reports
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              View detailed analytics and performance metrics
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button outline>
              <HiDocumentReport className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button>
              <HiChartBar className="w-4 h-4 mr-2" />
              Custom Report
            </Button>
          </div>
        </div>

        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
                <HiUsers className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Members
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  1,248
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
                <HiCalendar className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Monthly Bookings
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  2,847
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-500 mr-4">
                <HiTrendingUp className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Revenue Growth
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  +12.5%
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100 text-orange-500 mr-4">
                <HiChartBar className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Attendance Rate
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  87.2%
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Placeholder for Charts and Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Booking Trends
            </h3>
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <HiChartBar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Chart component will be implemented here</p>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Revenue Analytics
            </h3>
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <HiTrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Revenue chart will be implemented here</p>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Member Activity
            </h3>
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <HiUsers className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Activity chart will be implemented here</p>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Popular Services
            </h3>
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <HiDocumentReport className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Services analytics will be implemented here</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
