'use client';

import { Card, Button, TextInput, Select } from 'flowbite-react';
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
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">User</th>
                  <th scope="col" className="px-6 py-3">Role</th>
                  <th scope="col" className="px-6 py-3">Organization</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                  <th scope="col" className="px-6 py-3">Last Login</th>
                  <th scope="col" className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td className="px-6 py-4">
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
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <HiShieldCheck className="w-3 h-3 mr-1" />
                      Admin
                    </span>
                  </td>
                  <td className="px-6 py-4">FitLife Gym</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4">2 hours ago</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button size="xs" outline>
                        Edit
                      </Button>
                      <Button size="xs" color="failure" outline>
                        Disable
                      </Button>
                    </div>
                  </td>
                </tr>
                
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td className="px-6 py-4">
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
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Staff
                    </span>
                  </td>
                  <td className="px-6 py-4">PowerHouse Fitness</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4">1 day ago</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button size="xs" outline>
                        Edit
                      </Button>
                      <Button size="xs" color="failure" outline>
                        Disable
                      </Button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
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
