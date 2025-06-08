'use client';

import React, { useState, useEffect } from 'react';
import { Card, Button, Spinner, Alert } from 'flowbite-react';
import { HiArrowLeft, HiPencil, HiSave, HiX } from 'react-icons/hi';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { MemberProfile } from '@/components/members/MemberProfile';
import { UserRole, type UserResponseDto } from '@/lib/types';

export default function MyProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [member, setMember] = useState<UserResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use current user data or fetch fresh profile data
        if (user) {
          setMember(user as UserResponseDto);
        } else {
          // TODO: Fetch user profile from API if not in context
          throw new Error('User not found in context');
        }
      } catch (err) {
        setError('Failed to load your profile');
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleUpdateProfile = async (updatedData: Partial<UserResponseDto>) => {
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      // TODO: Replace with actual API call
      console.log('Updating profile:', updatedData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (member) {
        const updatedMember = { ...member, ...updatedData };
        setMember(updatedMember);
        
        // Update user context if available
        // if (updateUser) {
        //   updateUser(updatedMember);
        // }
        
        setSuccessMessage('Profile updated successfully!');
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute requireRole={[UserRole.MEMBER]}>
        <div className="flex justify-center items-center min-h-64">
          <Spinner size="xl" />
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !member) {
    return (
      <ProtectedRoute requireRole={[UserRole.MEMBER]}>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button outline onClick={() => router.back()}>
              <HiArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
          
          <Alert color="failure">
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-medium">Error Loading Profile</h3>
              <p>{error || 'Profile not found'}</p>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => window.location.reload()}>
                  Retry
                </Button>
                <Button size="sm" outline onClick={() => router.push('/account')}>
                  Back to Dashboard
                </Button>
              </div>
            </div>
          </Alert>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireRole={[UserRole.MEMBER]}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Button outline onClick={() => router.push('/account')}>
              <HiArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                My Profile
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your personal information and account settings
              </p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <Alert color="success" onDismiss={() => setSuccessMessage(null)}>
            <div className="flex items-center">
              <span>{successMessage}</span>
            </div>
          </Alert>
        )}

        {/* Error Message */}
        {error && (
          <Alert color="failure" onDismiss={() => setError(null)}>
            <div className="flex items-center">
              <span>{error}</span>
            </div>
          </Alert>
        )}

        {/* Saving Indicator */}
        {saving && (
          <Alert color="info">
            <div className="flex items-center gap-2">
              <Spinner size="sm" />
              <span>Saving your profile...</span>
            </div>
          </Alert>
        )}

        {/* Profile Help Text */}
        <Card>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-2">
              Profile Information
            </h3>
            <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <p>• Keep your contact information up to date to receive important notifications</p>
              <p>• Update your emergency contact information for safety purposes</p>
              <p>• Your profile information helps us provide personalized services</p>
              <p>• Some information may be view-only and can only be updated by gym staff</p>
            </div>
          </div>
        </Card>

        {/* Member Profile Component */}
        <MemberProfile
          member={member}
          isOwnProfile={true}
          onUpdate={handleUpdateProfile}
          readOnly={false}
        />

        {/* Additional Member Information */}
        <Card>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Account Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Account Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Member Since:</span>
                      <span className="text-gray-900 dark:text-white">
                        {new Date(member.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Last Updated:</span>
                      <span className="text-gray-900 dark:text-white">
                        {new Date(member.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Last Login:</span>
                      <span className="text-gray-900 dark:text-white">
                        {member.lastLoginAt 
                          ? new Date(member.lastLoginAt).toLocaleDateString()
                          : 'Never'
                        }
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Verification Status
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Email:</span>
                      <span className={`font-medium ${member.emailVerified ? 'text-green-600' : 'text-red-600'}`}>
                        {member.emailVerified ? '✅ Verified' : '❌ Not verified'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                      <span className={`font-medium ${member.phoneVerified ? 'text-green-600' : 'text-red-600'}`}>
                        {member.phoneVerified ? '✅ Verified' : '❌ Not verified'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Privacy & Data
                  </h4>
                  <div className="space-y-2">
                    <Button size="sm" outline className="w-full">
                      Download My Data
                    </Button>
                    <Button size="sm" outline className="w-full">
                      Privacy Settings
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Support
                  </h4>
                  <div className="space-y-2">
                    <Button size="sm" outline className="w-full" onClick={() => router.push('/support')}>
                      Contact Support
                    </Button>
                    <Button size="sm" outline className="w-full" onClick={() => router.push('/help')}>
                      Help Center
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
