'use client';

import { Card, Button, Select, Badge } from 'flowbite-react';
import { HiPlus, HiCalendar, HiClock, HiUser, HiEye, HiPencil } from 'react-icons/hi';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserRole } from '@/lib/types';

export default function SchedulesPage() {
  return (
    <ProtectedRoute requireRole={[UserRole.ADMIN, UserRole.STAFF, UserRole.ORGANIZATION_ADMIN, UserRole.SUPER_ADMIN]}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Schedule Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Create and manage class schedules and staff assignments
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button outline>
              <HiCalendar className="w-4 h-4 mr-2" />
              View Calendar
            </Button>
            <Button>
              <HiPlus className="w-4 h-4 mr-2" />
              Create Schedule
            </Button>
          </div>
        </div>

        {/* Schedule Filters */}
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Date Range
              </label>
              <Select>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="custom">Custom Range</option>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Service Type
              </label>
              <Select>
                <option value="">All Services</option>
                <option value="yoga">Yoga</option>
                <option value="fitness">Fitness</option>
                <option value="personal">Personal Training</option>
                <option value="group">Group Classes</option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Instructor
              </label>
              <Select>
                <option value="">All Instructors</option>
                <option value="john">John Smith</option>
                <option value="sarah">Sarah Johnson</option>
                <option value="mike">Mike Wilson</option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Location
              </label>
              <Select>
                <option value="">All Locations</option>
                <option value="studio1">Studio 1</option>
                <option value="studio2">Studio 2</option>
                <option value="gym">Main Gym</option>
              </Select>
            </div>
          </div>
        </Card>

        {/* Schedule List */}
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Upcoming Schedules
            </h3>
          </div>

          <div className="space-y-4">
            {/* Schedule Item 1 */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <HiCalendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                      Morning Yoga Flow
                    </h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center">
                        <HiClock className="w-4 h-4 mr-1" />
                        9:00 AM - 10:00 AM
                      </span>
                      <span className="flex items-center">
                        <HiUser className="w-4 h-4 mr-1" />
                        Sarah Johnson
                      </span>
                      <span>Studio 1</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge color="success">15/20 Booked</Badge>
                  <Button size="xs" outline>
                    <HiEye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button size="xs" outline>
                    <HiPencil className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
            </div>

            {/* Schedule Item 2 */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                    <HiCalendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                      HIIT Training
                    </h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center">
                        <HiClock className="w-4 h-4 mr-1" />
                        6:00 PM - 7:00 PM
                      </span>
                      <span className="flex items-center">
                        <HiUser className="w-4 h-4 mr-1" />
                        John Smith
                      </span>
                      <span>Main Gym</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge color="warning">25/25 Booked</Badge>
                  <Badge color="info">3 Waitlist</Badge>
                  <Button size="xs" outline>
                    <HiEye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button size="xs" outline>
                    <HiPencil className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
            </div>

            {/* Schedule Item 3 */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                    <HiCalendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                      Personal Training Session
                    </h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center">
                        <HiClock className="w-4 h-4 mr-1" />
                        2:00 PM - 3:00 PM
                      </span>
                      <span className="flex items-center">
                        <HiUser className="w-4 h-4 mr-1" />
                        Mike Wilson
                      </span>
                      <span>Studio 2</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge color="success">1/1 Booked</Badge>
                  <Button size="xs" outline>
                    <HiEye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button size="xs" outline>
                    <HiPencil className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <span className="text-sm text-gray-700 dark:text-gray-400">
              Showing 1 to 3 of 45 schedules
            </span>
            <div className="flex gap-2">
              <Button size="sm" outline disabled>
                Previous
              </Button>
              <Button size="sm" outline>
                Next
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
