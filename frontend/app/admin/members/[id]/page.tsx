'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button, Spinner, Alert } from 'flowbite-react';
import { HiArrowLeft, HiPencil, HiTrash, HiLockClosed, HiCheckCircle, HiBan } from 'react-icons/hi';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { MemberProfile } from '@/components/members/MemberProfile';
import { UserRole, type UserResponseDto } from '@/lib/types';
import { useAuth } from '@/lib/auth/auth-context';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function MemberProfilePage({ params }: PageProps) {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [member, setMember] = useState<UserResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [memberId, setMemberId] = useState<string | null>(null);

  const isEditMode = searchParams.get('edit') === 'true';

  // Extract params asynchronously
  useEffect(() => {
    const extractParams = async () => {
      const resolvedParams = await params;
      setMemberId(resolvedParams.id);
    };
    extractParams();
  }, [params]);

  const fetchMember = useCallback(async () => {
    if (!memberId) return;
    
    try {
      setLoading(true);
      setError(null);

      // TODO: Replace with actual API call
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockMember: UserResponseDto = {
        id: memberId,
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
      };

      setMember(mockMember);
    } catch (err) {
      setError('Failed to load member profile');
      console.error('Error fetching member:', err);
    } finally {
      setLoading(false);
    }
  }, [memberId]);

  useEffect(() => {
    fetchMember();
  }, [fetchMember]);

  const handleUpdateMember = async (updatedData: Partial<UserResponseDto>) => {
    try {
      // TODO: Implement API call to update member
      console.log('Updating member:', updatedData);
      
      if (member) {
        setMember({ ...member, ...updatedData });
      }
    } catch (error) {
      console.error('Failed to update member:', error);
    }
  };

  const handleMemberAction = async (action: string) => {
    if (!member) return;

    try {
      setActionLoading(action);
      
      // TODO: Replace with actual API calls
      await new Promise(resolve => setTimeout(resolve, 1000));

      switch (action) {
        case 'activate':
          setMember({ ...member, status: 'ACTIVE' });
          break;
        case 'deactivate':
          setMember({ ...member, status: 'INACTIVE' });
          break;
        case 'suspend':
          const reason = prompt('Enter suspension reason:');
          if (reason) {
            setMember({ ...member, status: 'SUSPENDED' });
          }
          break;
        case 'delete':
          if (confirm('Are you sure you want to delete this member? This action cannot be undone.')) {
            // Navigate back to members list after deletion
            router.push('/admin/members');
          }
          break;
        case 'reset-password':
          alert('Password reset email sent to member');
          break;
      }
    } catch (error) {
      console.error(`Failed to ${action} member:`, error);
      alert(`Failed to ${action} member. Please try again.`);
    } finally {
      setActionLoading(null);
    }
  };

  const canPerformActions = user?.role === UserRole.ADMIN || 
                           user?.role === UserRole.ORGANIZATION_ADMIN || 
                           user?.role === UserRole.SUPER_ADMIN;

  if (loading || !memberId) {
    return (
      <ProtectedRoute requireRole={[UserRole.ADMIN, UserRole.STAFF, UserRole.ORGANIZATION_ADMIN, UserRole.SUPER_ADMIN]}>
        <div className="flex justify-center items-center min-h-64">
          <Spinner size="xl" />
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !member) {
    return (
      <ProtectedRoute requireRole={[UserRole.ADMIN, UserRole.STAFF, UserRole.ORGANIZATION_ADMIN, UserRole.SUPER_ADMIN]}>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button outline onClick={() => router.back()}>
              <HiArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
          
          <Alert color="failure">
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-medium">Error Loading Member</h3>
              <p>{error || 'Member not found'}</p>
              <div className="flex gap-2">
                <Button size="sm" onClick={fetchMember}>
                  Retry
                </Button>
                <Button size="sm" outline onClick={() => router.push('/admin/members')}>
                  Back to Members
                </Button>
              </div>
            </div>
          </Alert>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireRole={[UserRole.ADMIN, UserRole.STAFF, UserRole.ORGANIZATION_ADMIN, UserRole.SUPER_ADMIN]}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Button outline onClick={() => router.back()}>
              <HiArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {member.firstName} {member.lastName}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Member Profile - {member.memberId || 'No ID assigned'}
              </p>
            </div>
          </div>

          {canPerformActions && (
            <div className="flex flex-wrap gap-2">
              {/* Status Actions */}
              {member.status === 'ACTIVE' && (
                <>
                  <Button
                    size="sm"
                    color="warning"
                    outline
                    onClick={() => handleMemberAction('deactivate')}
                    disabled={actionLoading === 'deactivate'}
                  >
                    {actionLoading === 'deactivate' ? <Spinner size="sm" /> : <HiBan className="w-4 h-4 mr-2" />}
                    Deactivate
                  </Button>
                  <Button
                    size="sm"
                    color="failure"
                    outline
                    onClick={() => handleMemberAction('suspend')}
                    disabled={actionLoading === 'suspend'}
                  >
                    {actionLoading === 'suspend' ? <Spinner size="sm" /> : <HiBan className="w-4 h-4 mr-2" />}
                    Suspend
                  </Button>
                </>
              )}

              {(member.status === 'INACTIVE' || member.status === 'SUSPENDED') && (
                <Button
                  size="sm"
                  color="success"
                  outline
                  onClick={() => handleMemberAction('activate')}
                  disabled={actionLoading === 'activate'}
                >
                  {actionLoading === 'activate' ? <Spinner size="sm" /> : <HiCheckCircle className="w-4 h-4 mr-2" />}
                  Activate
                </Button>
              )}

              {/* Security Actions */}
              <Button
                size="sm"
                outline
                onClick={() => handleMemberAction('reset-password')}
                disabled={actionLoading === 'reset-password'}
              >
                {actionLoading === 'reset-password' ? <Spinner size="sm" /> : <HiLockClosed className="w-4 h-4 mr-2" />}
                Reset Password
              </Button>

              {/* Edit Action */}
              <Button
                size="sm"
                outline
                onClick={() => router.push(`/admin/members/${member.id}?edit=true`)}
              >
                <HiPencil className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>

              {/* Delete Action */}
              <Button
                size="sm"
                color="failure"
                outline
                onClick={() => handleMemberAction('delete')}
                disabled={actionLoading === 'delete'}
              >
                {actionLoading === 'delete' ? <Spinner size="sm" /> : <HiTrash className="w-4 h-4 mr-2" />}
                Delete
              </Button>
            </div>
          )}
        </div>

        {/* Member Profile Component */}
        <MemberProfile
          member={member}
          isOwnProfile={false}
          onUpdate={handleUpdateMember}
          readOnly={!canPerformActions}
        />

        {/* Additional Admin Actions */}
        {canPerformActions && (
          <Card>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Administrative Actions
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">Account Status</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Current status: <span className="font-medium">{member.status}</span>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Last login: {member.lastLoginAt 
                        ? new Date(member.lastLoginAt).toLocaleString()
                        : 'Never'
                      }
                    </p>
                  </div>
                </Card>

                <Card>
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">Verification Status</h4>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Email: {member.emailVerified ? '✅ Verified' : '❌ Not verified'}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Phone: {member.phoneVerified ? '✅ Verified' : '❌ Not verified'}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card>
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">Quick Actions</h4>
                    <div className="space-y-2">
                      <Button size="xs" outline className="w-full">
                        View Booking History
                      </Button>
                      <Button size="xs" outline className="w-full">
                        Send Communication
                      </Button>
                      <Button size="xs" outline className="w-full">
                        Generate Report
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </Card>
        )}
      </div>
    </ProtectedRoute>
  );
}
