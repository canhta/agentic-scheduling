'use client';

import React, { useState, useEffect } from 'react';
import { Card, TextInput, Select, Button, Badge, Avatar, Spinner, Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell } from 'flowbite-react';
import { HiSearch, HiPlus, HiFilter, HiEye, HiPencil, HiTrash, HiDownload } from 'react-icons/hi';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserRole, type UserResponseDto } from '@/lib/types';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/auth-context';

interface MemberListFilters {
  search: string;
  status: string;
  membershipType: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export default function MembersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [members, setMembers] = useState<UserResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

  const [filters, setFilters] = useState<MemberListFilters>({
    search: '',
    status: 'ALL',
    membershipType: 'ALL',
    sortBy: 'lastName',
    sortOrder: 'asc'
  });

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Replace with actual API call
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockMembers: UserResponseDto[] = [
        {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@email.com',
          phone: '+1234567890',
          role: UserRole.MEMBER,
          status: 'ACTIVE',
          emailVerified: true,
          phoneVerified: true,
          memberId: 'MBR001',
          organizationId: '1',
          createdAt: '2024-01-15T00:00:00Z',
          updatedAt: '2024-01-20T00:00:00Z',
          lastLoginAt: '2024-01-26T08:00:00Z'
        },
        {
          id: '2',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@email.com',
          phone: '+1234567891',
          role: UserRole.MEMBER,
          status: 'ACTIVE',
          emailVerified: true,
          phoneVerified: false,
          memberId: 'MBR002',
          organizationId: '1',
          createdAt: '2024-01-10T00:00:00Z',
          updatedAt: '2024-01-25T00:00:00Z',
          lastLoginAt: '2024-01-25T14:30:00Z'
        },
        {
          id: '3',
          firstName: 'Bob',
          lastName: 'Johnson',
          email: 'bob.johnson@email.com',
          phone: '+1234567892',
          role: UserRole.MEMBER,
          status: 'INACTIVE',
          emailVerified: true,
          phoneVerified: true,
          memberId: 'MBR003',
          organizationId: '1',
          createdAt: '2024-01-05T00:00:00Z',
          updatedAt: '2024-01-22T00:00:00Z',
          lastLoginAt: '2024-01-22T10:15:00Z'
        },
        {
          id: '4',
          firstName: 'Alice',
          lastName: 'Williams',
          email: 'alice.williams@email.com',
          phone: '+1234567893',
          role: UserRole.MEMBER,
          status: 'SUSPENDED',
          emailVerified: true,
          phoneVerified: true,
          memberId: 'MBR004',
          organizationId: '1',
          createdAt: '2023-12-20T00:00:00Z',
          updatedAt: '2024-01-24T00:00:00Z',
          lastLoginAt: '2024-01-20T16:45:00Z'
        }
      ];

      setMembers(mockMembers);
      setPagination({
        page: 1,
        limit: 20,
        total: mockMembers.length,
        totalPages: Math.ceil(mockMembers.length / 20)
      });
    } catch (err) {
      setError('Failed to load members');
      console.error('Error fetching members:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [filters, pagination.page]);

  const handleFilterChange = (key: keyof MemberListFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'INACTIVE': return 'gray';
      case 'SUSPENDED': return 'failure';
      case 'PENDING': return 'warning';
      default: return 'gray';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Active';
      case 'INACTIVE': return 'Inactive';
      case 'SUSPENDED': return 'Suspended';
      case 'PENDING': return 'Pending';
      default: return status;
    }
  };

  const handleCreateMember = () => {
    // TODO: Implement create member modal or navigate to create page
    console.log('Create member clicked');
  };

  const handleViewMember = (memberId: string) => {
    router.push(`/admin/members/${memberId}`);
  };

  const handleEditMember = (memberId: string) => {
    router.push(`/admin/members/${memberId}?edit=true`);
  };

  const handleDeleteMember = async (memberId: string) => {
    if (confirm('Are you sure you want to delete this member?')) {
      // TODO: Implement delete member API call
      console.log('Delete member:', memberId);
    }
  };

  const handleExportMembers = () => {
    // TODO: Implement export functionality
    console.log('Export members clicked');
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = !filters.search || 
      member.firstName.toLowerCase().includes(filters.search.toLowerCase()) ||
      member.lastName.toLowerCase().includes(filters.search.toLowerCase()) ||
      member.email.toLowerCase().includes(filters.search.toLowerCase()) ||
      (member.memberId && member.memberId.toLowerCase().includes(filters.search.toLowerCase()));
    
    const matchesStatus = filters.status === 'ALL' || member.status === filters.status;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <ProtectedRoute requireRole={[UserRole.ADMIN, UserRole.STAFF, UserRole.ORGANIZATION_ADMIN, UserRole.SUPER_ADMIN]}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Members
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage member accounts and profiles
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              outline
              onClick={handleExportMembers}
            >
              <HiDownload className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button
              onClick={handleCreateMember}
            >
              <HiPlus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <TextInput
                icon={HiSearch}
                placeholder="Search members..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            
            <div>
              <Select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="SUSPENDED">Suspended</option>
                <option value="PENDING">Pending</option>
              </Select>
            </div>

            <div>
              <Select
                value={filters.membershipType}
                onChange={(e) => handleFilterChange('membershipType', e.target.value)}
              >
                <option value="ALL">All Memberships</option>
                <option value="BASIC">Basic</option>
                <option value="PREMIUM">Premium</option>
                <option value="VIP">VIP</option>
              </Select>
            </div>

            <div>
              <Select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-');
                  handleFilterChange('sortBy', sortBy);
                  handleFilterChange('sortOrder', sortOrder);
                }}
              >
                <option value="lastName-asc">Name (A-Z)</option>
                <option value="lastName-desc">Name (Z-A)</option>
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="lastLoginAt-desc">Recent Login</option>
              </Select>
            </div>
          </div>
        </Card>

        {/* Members List */}
        <Card>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Spinner size="xl" />
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 dark:text-red-400">{error}</p>
              <Button onClick={fetchMembers} className="mt-4">
                Retry
              </Button>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">
                No members found matching your criteria.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHead>
                  <TableHeadCell>Member</TableHeadCell>
                  <TableHeadCell>Contact</TableHeadCell>
                  <TableHeadCell>Status</TableHeadCell>
                  <TableHeadCell>Member ID</TableHeadCell>
                  <TableHeadCell>Last Login</TableHeadCell>
                  <TableHeadCell>
                    <span className="sr-only">Actions</span>
                  </TableHeadCell>
                </TableHead>
                <TableBody className="divide-y">
                  {filteredMembers.map((member) => (
                    <TableRow key={member.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar
                            size="sm"
                            alt={`${member.firstName} ${member.lastName}`}
                          />
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {member.firstName} {member.lastName}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              Joined {new Date(member.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div>
                          <div className="text-sm text-gray-900 dark:text-white">
                            {member.email}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {member.phone || 'No phone'}
                          </div>
                          <div className="flex gap-1 mt-1">
                            {member.emailVerified && (
                              <Badge color="success" size="xs">Email ✓</Badge>
                            )}
                            {member.phoneVerified && (
                              <Badge color="success" size="xs">Phone ✓</Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge color={getStatusBadgeColor(member.status)}>
                          {getStatusText(member.status)}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="font-mono text-sm">
                          {member.memberId || 'Not assigned'}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="text-sm">
                          {member.lastLoginAt 
                            ? new Date(member.lastLoginAt).toLocaleDateString()
                            : 'Never'
                          }
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="xs"
                            outline
                            onClick={() => handleViewMember(member.id)}
                          >
                            <HiEye className="w-3 h-3" />
                          </Button>
                          <Button
                            size="xs"
                            outline
                            onClick={() => handleEditMember(member.id)}
                          >
                            <HiPencil className="w-3 h-3" />
                          </Button>
                          <Button
                            size="xs"
                            color="failure"
                            outline
                            onClick={() => handleDeleteMember(member.id)}
                          >
                            <HiTrash className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <Card>
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total} members
              </div>
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  outline
                  disabled={pagination.page === 1}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                >
                  Previous
                </Button>
                <Button
                  size="sm"
                  outline
                  disabled={pagination.page === pagination.totalPages}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                >
                  Next
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </ProtectedRoute>
  );
}
