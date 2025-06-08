'use client';

import { Card, Button, Select, Badge, TextInput, Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell } from 'flowbite-react';
import { HiPlus, HiSearch, HiCalendar, HiUser, HiEye, HiPencil, HiX } from 'react-icons/hi';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserRole } from '@/lib/types';

export default function BookingsPage() {
  return (
    <ProtectedRoute requireRole={[UserRole.ADMIN, UserRole.STAFF, UserRole.ORGANIZATION_ADMIN, UserRole.SUPER_ADMIN]}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Booking Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              View and manage all member bookings and reservations
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button outline>
              <HiCalendar className="w-4 h-4 mr-2" />
              Export Bookings
            </Button>
            <Button>
              <HiPlus className="w-4 h-4 mr-2" />
              Manual Booking
            </Button>
          </div>
        </div>

        {/* Booking Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">24</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Today&apos;s Bookings</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">156</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">This Week</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">5</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Pending</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">3</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Cancelled Today</div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <TextInput
                icon={HiSearch}
                placeholder="Search bookings..."
              />
            </div>
            
            <div>
              <Select>
                <option value="">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
                <option value="no-show">No Show</option>
              </Select>
            </div>

            <div>
              <Select>
                <option value="">All Services</option>
                <option value="yoga">Yoga</option>
                <option value="fitness">Fitness</option>
                <option value="personal">Personal Training</option>
                <option value="group">Group Classes</option>
              </Select>
            </div>

            <div>
              <Select>
                <option value="">Date Range</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="custom">Custom Range</option>
              </Select>
            </div>

            <div>
              <Select>
                <option value="">All Instructors</option>
                <option value="john">John Smith</option>
                <option value="sarah">Sarah Johnson</option>
                <option value="mike">Mike Wilson</option>
              </Select>
            </div>
          </div>
        </Card>

        {/* Bookings Table */}
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHead>
                <TableHeadCell>Member</TableHeadCell>
                <TableHeadCell>Service</TableHeadCell>
                <TableHeadCell>Date & Time</TableHeadCell>
                <TableHeadCell>Instructor</TableHeadCell>
                <TableHeadCell>Status</TableHeadCell>
                <TableHeadCell>Booking Date</TableHeadCell>
                <TableHeadCell>Actions</TableHeadCell>
              </TableHead>
              <TableBody className="divide-y">
                <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <TableCell>
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                        <HiUser className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          Alice Cooper
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          alice@example.com
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        Morning Yoga Flow
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Studio 1
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        Today, 9:00 AM
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        60 minutes
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>Sarah Johnson</TableCell>
                  <TableCell>
                    <Badge color="success">Confirmed</Badge>
                  </TableCell>
                  <TableCell>2 days ago</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="xs" outline>
                        <HiEye className="w-3 h-3" />
                      </Button>
                      <Button size="xs" outline>
                        <HiPencil className="w-3 h-3" />
                      </Button>
                      <Button size="xs" color="failure" outline>
                        <HiX className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>

                <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <TableCell>
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                        <HiUser className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          Bob Williams
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          bob@example.com
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        Personal Training
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Studio 2
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        Tomorrow, 2:00 PM
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        60 minutes
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>Mike Wilson</TableCell>
                  <TableCell>
                    <Badge color="warning">Pending</Badge>
                  </TableCell>
                  <TableCell>1 hour ago</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="xs" outline>
                        <HiEye className="w-3 h-3" />
                      </Button>
                      <Button size="xs" outline>
                        <HiPencil className="w-3 h-3" />
                      </Button>
                      <Button size="xs" color="failure" outline>
                        <HiX className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>

                <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <TableCell>
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                        <HiUser className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          Carol Davis
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          carol@example.com
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        HIIT Training
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Main Gym
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        Yesterday, 6:00 PM
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        45 minutes
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>John Smith</TableCell>
                  <TableCell>
                    <Badge color="purple">Completed</Badge>
                  </TableCell>
                  <TableCell>3 days ago</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="xs" outline>
                        <HiEye className="w-3 h-3" />
                      </Button>
                      <Button size="xs" outline>
                        <HiPencil className="w-3 h-3" />
                      </Button>
                      <Button size="xs" color="failure" outline>
                        <HiX className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <span className="text-sm text-gray-700 dark:text-gray-400">
              Showing 1 to 3 of 156 bookings
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
