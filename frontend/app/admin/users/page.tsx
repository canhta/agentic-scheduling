'use client';

import { Card, Button, TextInput, Select, Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell, Badge } from 'flowbite-react';
import { HiPlus, HiSearch, HiUsers, HiUserGroup, HiShieldCheck } from 'react-icons/hi';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserRole } from '@/lib/types';

export default function UsersPage() {
  return (
    <ProtectedRoute requireRole={[UserRole.ADMIN, UserRole.ORGANIZATION_ADMIN, UserRole.SUPER_ADMIN]}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              User Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage system users, roles, and permissions
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button outline>
              <HiUsers className="w-4 h-4 mr-2" />
              Export Users
            </Button>
            <Button>
              <HiPlus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <TextInput
                icon={HiSearch}
                placeholder="Search users..."
              />
            </div>
            
            <div>
              <Select>
                <option value="">All Roles</option>
                <option value="SUPER_ADMIN">Super Admin</option>
                <option value="ORGANIZATION_ADMIN">Organization Admin</option>
                <option value="ADMIN">Admin</option>
                <option value="STAFF">Staff</option>
                <option value="MEMBER">Member</option>
              </Select>
            </div>

            <div>
              <Select>
                <option value="">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="PENDING">Pending</option>
                <option value="SUSPENDED">Suspended</option>
              </Select>
            </div>

            <div>
              <Select>
                <option value="">All Organizations</option>
                <option value="org1">FitLife Gym</option>
                <option value="org2">PowerHouse Fitness</option>
                <option value="org3">Zen Yoga Studio</option>
              </Select>
            </div>
          </div>
        </Card>

        {/* Users Table */}
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHead>
                <TableHeadCell>User</TableHeadCell>
                <TableHeadCell>Role</TableHeadCell>
                <TableHeadCell>Organization</TableHeadCell>
                <TableHeadCell>Status</TableHeadCell>
                <TableHeadCell>Last Login</TableHeadCell>
                <TableHeadCell>Actions</TableHeadCell>
              </TableHead>
              <TableBody className="divide-y">
                <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <TableCell>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                        <HiUsers className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          John Smith
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          john.smith@example.com
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge color="info" icon={HiShieldCheck}>
                      Admin
                    </Badge>
                  </TableCell>
                  <TableCell>FitLife Gym</TableCell>
                  <TableCell>
                    <Badge color="success">
                      Active
                    </Badge>
                  </TableCell>
                  <TableCell>2 hours ago</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="xs" outline>
                        Edit
                      </Button>
                      <Button size="xs" color="failure" outline>
                        Disable
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                
                <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <TableCell>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                        <HiUserGroup className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          Sarah Johnson
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          sarah.johnson@example.com
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge color="success">
                      Staff
                    </Badge>
                  </TableCell>
                  <TableCell>PowerHouse Fitness</TableCell>
                  <TableCell>
                    <Badge color="success">
                      Active
                    </Badge>
                  </TableCell>
                  <TableCell>1 day ago</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="xs" outline>
                        Edit
                      </Button>
                      <Button size="xs" color="failure" outline>
                        Disable
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between pt-4">
            <span className="text-sm text-gray-700 dark:text-gray-400">
              Showing 1 to 2 of 12 entries
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
