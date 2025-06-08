'use client';

import { Card, Button, Select, Badge } from 'flowbite-react';
import { HiDocumentReport, HiDownload, HiChartBar, HiTrendingUp, HiUsers, HiCalendar } from 'react-icons/hi';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserRole } from '@/lib/types';

export default function ReportsPage() {
  return (
    <ProtectedRoute requireRole={[UserRole.ADMIN, UserRole.STAFF, UserRole.ORGANIZATION_ADMIN, UserRole.SUPER_ADMIN]}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Reports & Analytics
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Generate detailed reports and view business analytics
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button outline>
              <HiDownload className="w-4 h-4 mr-2" />
              Export All Reports
            </Button>
            <Button>
              <HiDocumentReport className="w-4 h-4 mr-2" />
              Custom Report
            </Button>
          </div>
        </div>

        {/* Report Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Membership Reports */}
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                  <HiUsers className="w-8 h-8" />
                </div>
                <Badge color="info">12 Reports</Badge>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Membership Reports
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Member analytics, retention, and growth reports
              </p>
              <div className="space-y-2">
                <Button size="sm" outline className="w-full justify-start">
                  Member Growth Report
                </Button>
                <Button size="sm" outline className="w-full justify-start">
                  Retention Analysis
                </Button>
                <Button size="sm" outline className="w-full justify-start">
                  Membership Revenue
                </Button>
              </div>
            </div>
          </Card>

          {/* Booking Reports */}
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                  <HiCalendar className="w-8 h-8" />
                </div>
                <Badge color="success">8 Reports</Badge>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Booking Reports
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Class attendance, booking trends, and capacity reports
              </p>
              <div className="space-y-2">
                <Button size="sm" outline className="w-full justify-start">
                  Class Attendance Report
                </Button>
                <Button size="sm" outline className="w-full justify-start">
                  Booking Trends
                </Button>
                <Button size="sm" outline className="w-full justify-start">
                  Capacity Utilization
                </Button>
              </div>
            </div>
          </Card>

          {/* Revenue Reports */}
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                  <HiTrendingUp className="w-8 h-8" />
                </div>
                <Badge color="purple">6 Reports</Badge>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Revenue Reports
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Financial performance and revenue analytics
              </p>
              <div className="space-y-2">
                <Button size="sm" outline className="w-full justify-start">
                  Monthly Revenue
                </Button>
                <Button size="sm" outline className="w-full justify-start">
                  Service Performance
                </Button>
                <Button size="sm" outline className="w-full justify-start">
                  Payment Analytics
                </Button>
              </div>
            </div>
          </Card>

          {/* Staff Reports */}
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
                  <HiChartBar className="w-8 h-8" />
                </div>
                <Badge color="warning">5 Reports</Badge>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Staff Reports
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Staff performance and scheduling reports
              </p>
              <div className="space-y-2">
                <Button size="sm" outline className="w-full justify-start">
                  Staff Performance
                </Button>
                <Button size="sm" outline className="w-full justify-start">
                  Schedule Utilization
                </Button>
                <Button size="sm" outline className="w-full justify-start">
                  Training Hours
                </Button>
              </div>
            </div>
          </Card>

          {/* Operational Reports */}
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-red-100 text-red-600 rounded-lg">
                  <HiDocumentReport className="w-8 h-8" />
                </div>
                <Badge color="failure">7 Reports</Badge>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Operational Reports
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Facility usage and operational metrics
              </p>
              <div className="space-y-2">
                <Button size="sm" outline className="w-full justify-start">
                  Facility Usage
                </Button>
                <Button size="sm" outline className="w-full justify-start">
                  Equipment Reports
                </Button>
                <Button size="sm" outline className="w-full justify-start">
                  Peak Hours Analysis
                </Button>
              </div>
            </div>
          </Card>

          {/* Custom Reports */}
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gray-100 text-gray-600 rounded-lg">
                  <HiChartBar className="w-8 h-8" />
                </div>
                <Badge color="gray">Create New</Badge>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Custom Reports
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Build your own reports with custom parameters
              </p>
              <Button className="w-full">
                <HiDocumentReport className="w-4 h-4 mr-2" />
                Create Report
              </Button>
            </div>
          </Card>
        </div>

        {/* Recent Reports */}
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Reports
              </h3>
              <Button size="sm" outline>
                View All
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">Report Name</th>
                    <th scope="col" className="px-6 py-3">Type</th>
                    <th scope="col" className="px-6 py-3">Generated</th>
                    <th scope="col" className="px-6 py-3">Status</th>
                    <th scope="col" className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      Monthly Revenue Report - December
                    </td>
                    <td className="px-6 py-4">Revenue</td>
                    <td className="px-6 py-4">2 hours ago</td>
                    <td className="px-6 py-4">
                      <Badge color="success">Ready</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Button size="xs" outline>
                        <HiDownload className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                    </td>
                  </tr>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      Class Attendance Report - Weekly
                    </td>
                    <td className="px-6 py-4">Booking</td>
                    <td className="px-6 py-4">1 day ago</td>
                    <td className="px-6 py-4">
                      <Badge color="success">Ready</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Button size="xs" outline>
                        <HiDownload className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                    </td>
                  </tr>
                  <tr className="bg-white dark:bg-gray-800">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      Member Growth Analysis
                    </td>
                    <td className="px-6 py-4">Membership</td>
                    <td className="px-6 py-4">3 days ago</td>
                    <td className="px-6 py-4">
                      <Badge color="warning">Processing</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Button size="xs" outline disabled>
                        Processing...
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
