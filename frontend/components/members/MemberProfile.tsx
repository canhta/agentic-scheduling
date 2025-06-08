'use client';

import React, { useState } from 'react';
import { Card, Button, Avatar, Badge, Tabs, TabItem } from 'flowbite-react';
import { HiPencil, HiUser, HiPhone, HiLocationMarker, HiCalendar, HiChatAlt2, HiLockClosed } from 'react-icons/hi';
import { HiExclamationTriangle } from 'react-icons/hi2';
import { BasicInformationSection } from './profile-sections/BasicInformationSection';
import { ContactDetailsSection } from './profile-sections/ContactDetailsSection';
import { EmergencyContactSection } from './profile-sections/EmergencyContactSection';
import { MembershipInformationSection } from './profile-sections/MembershipInformationSection';
import { BookingHistorySection } from './profile-sections/BookingHistorySection';
import NotesAlertsSection from './profile-sections/NotesAlertsSection';
import SecuritySection from './profile-sections/SecuritySection';
import type { User, UserResponseDto } from '@/lib/types';
import CommunicationLogSection from './profile-sections/CommunicationLogSection';

interface MemberProfileProps {
  member: UserResponseDto;
  isOwnProfile?: boolean;
  onUpdate?: (updatedMember: Partial<UserResponseDto>) => void;
  readOnly?: boolean;
}

export function MemberProfile({
  member,
  isOwnProfile = false,
  onUpdate,
  readOnly = false
}: MemberProfileProps) {
  const [activeTab, setActiveTab] = useState('basic');
  const [isEditing, setIsEditing] = useState(false);

  // Mock data for new sections
  const mockNotes = [
    {
      id: '1',
      content: 'Member prefers morning classes and has requested quiet environments.',
      createdAt: '2024-01-15T10:00:00Z',
      createdBy: 'John Admin',
      updatedAt: '2024-01-20T14:30:00Z',
      updatedBy: 'Jane Staff',
      category: 'general' as const,
      isPrivate: false
    },
    {
      id: '2',
      content: 'Has knee injury - avoid high-impact exercises.',
      createdAt: '2024-01-10T08:00:00Z',
      createdBy: 'Dr. Smith',
      category: 'medical' as const,
      isPrivate: true
    }
  ];

  const mockAlerts = [
    {
      id: '1',
      type: 'warning' as const,
      title: 'Payment Overdue',
      description: 'Membership payment is 5 days overdue. Please follow up.',
      createdAt: '2024-01-25T09:00:00Z',
      createdBy: 'Billing System',
      isActive: true,
      priority: 'high' as const
    },
    {
      id: '2',
      type: 'info' as const,
      title: 'Membership Renewal Due',
      description: 'Annual membership expires in 30 days.',
      createdAt: '2024-01-20T10:00:00Z',
      createdBy: 'System',
      isActive: true,
      expiresAt: '2024-03-01T00:00:00Z',
      priority: 'medium' as const
    }
  ];

  const mockCommunications = [
    {
      id: '1',
      type: 'email' as const,
      subject: 'Class Booking Confirmation',
      content: 'Your booking for Yoga Class on Monday 9 AM has been confirmed.',
      sentAt: '2024-01-26T08:00:00Z',
      sentBy: 'Booking System',
      status: 'delivered' as const,
      recipient: member.email,
      category: 'booking' as const
    },
    {
      id: '2',
      type: 'sms' as const,
      subject: 'Class Reminder',
      content: 'Reminder: Your yoga class starts in 1 hour.',
      sentAt: '2024-01-26T08:00:00Z',
      sentBy: 'Reminder System',
      status: 'delivered' as const,
      recipient: member.phone || '',
      category: 'booking' as const
    }
  ];

  const mockSecuritySettings = {
    twoFactorEnabled: false,
    loginNotifications: true,
    sessionTimeout: 60,
    requirePasswordChange: false,
    passwordLastChanged: '2024-01-01T00:00:00Z',
    accountLocked: false,
    failedLoginAttempts: 0,
    maxFailedAttempts: 5
  };

  const mockLoginSessions = [
    {
      id: '1',
      deviceType: 'desktop' as const,
      browser: 'Chrome 120.0',
      location: 'New York, NY',
      ipAddress: '192.168.1.100',
      loginAt: '2024-01-26T09:00:00Z',
      lastActivity: '2024-01-26T15:30:00Z',
      isCurrentSession: true
    },
    {
      id: '2',
      deviceType: 'mobile' as const,
      browser: 'Safari Mobile',
      location: 'New York, NY',
      ipAddress: '192.168.1.101',
      loginAt: '2024-01-25T18:00:00Z',
      lastActivity: '2024-01-25T22:00:00Z',
      isCurrentSession: false
    }
  ];

  const mockSecurityEvents = [
    {
      id: '1',
      type: 'login' as const,
      description: 'Successful login from desktop device',
      timestamp: '2024-01-26T09:00:00Z',
      ipAddress: '192.168.1.100',
      location: 'New York, NY',
      success: true
    },
    {
      id: '2',
      type: 'failed_login' as const,
      description: 'Failed login attempt - incorrect password',
      timestamp: '2024-01-25T14:30:00Z',
      ipAddress: '192.168.1.105',
      location: 'Unknown',
      success: false
    }
  ];

  // Determine user role based on member.role
  const userRole = isOwnProfile ?
    (member.role === 'MEMBER' ? 'member' :
      member.role === 'ADMIN' || member.role === 'ORGANIZATION_ADMIN' || member.role === 'SUPER_ADMIN' ? 'admin' : 'staff') :
    'admin'; // Assume viewer is admin if viewing another profile

  const handleSave = async (updatedData: Partial<UserResponseDto>) => {
    try {
      // TODO: Implement API call to update member
      console.log('Updating member with data:', updatedData);

      if (onUpdate) {
        onUpdate(updatedData);
      }

      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update member profile:', error);
    }
  };

  const canEdit = !readOnly && (isOwnProfile || !isOwnProfile); // Admin/Staff can edit other profiles

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Avatar
              img={undefined} // UserResponseDto doesn't have profilePhoto
              size="lg"
              className="flex-shrink-0"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {`${member.firstName} ${member.lastName}`}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Member ID: {member.memberId || 'Not assigned'}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  color={member.status === 'ACTIVE' ? 'success' :
                    member.status === 'INACTIVE' ? 'gray' :
                      member.status === 'SUSPENDED' ? 'failure' : 'warning'}
                >
                  {member.status}
                </Badge>
                {member.emailVerified && (
                  <Badge color="success" size="sm">Email Verified</Badge>
                )}
                {member.phoneVerified && (
                  <Badge color="success" size="sm">Phone Verified</Badge>
                )}
              </div>
            </div>
          </div>

          {canEdit && (
            <div className="flex gap-2 ml-auto">
              <Button
                size="sm"
                outline
                onClick={() => setIsEditing(!isEditing)}
              >
                <HiPencil className="h-4 w-4 mr-2" />
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Profile Tabs */}
      <Card>
        <Tabs aria-label="Member profile tabs" variant="underline">
          <TabItem active={activeTab === 'basic'} title="Basic Info" icon={HiUser}>
            <div className="p-4">
              <BasicInformationSection
                member={member}
                isEditing={isEditing}
                onSave={handleSave}
                canEdit={canEdit}
                isOwnProfile={isOwnProfile}
              />
            </div>
          </TabItem>

          <TabItem active={activeTab === 'contact'} title="Contact" icon={HiPhone}>
            <div className="p-4">
              <ContactDetailsSection
                member={member}
                isEditing={isEditing}
                onSave={handleSave}
                canEdit={canEdit}
              />
            </div>
          </TabItem>

          <TabItem active={activeTab === 'emergency'} title="Emergency Contact" icon={HiLocationMarker}>
            <div className="p-4">
              <EmergencyContactSection
                member={member}
                isEditing={isEditing}
                onSave={handleSave}
                canEdit={canEdit}
              />
            </div>
          </TabItem>

          <TabItem active={activeTab === 'membership'} title="Membership" icon={HiUser}>
            <div className="p-4">
              <MembershipInformationSection
                member={member}
                canEdit={!isOwnProfile && canEdit} // Only admin/staff can edit membership
              />
            </div>
          </TabItem>

          <TabItem active={activeTab === 'bookings'} title="Bookings & Attendance" icon={HiCalendar}>
            <div className="p-4">
              <BookingHistorySection
                memberId={member.id}
                isOwnProfile={isOwnProfile}
              />
            </div>
          </TabItem>

          {!isOwnProfile && (
            <TabItem active={activeTab === 'communication'} title="Communications" icon={HiChatAlt2}>
              <div className="p-4">
                <CommunicationLogSection
                  isOwnProfile={isOwnProfile}
                  communications={mockCommunications}
                  memberId={member.id}
                />
              </div>
            </TabItem>
          )}

          {!isOwnProfile && (
            <TabItem active={activeTab === 'notes'} title="Notes & Alerts" icon={HiChatAlt2}>
              <div className="p-4">
                <NotesAlertsSection
                  memberId={member.id}
                  notes={mockNotes}
                  alerts={mockAlerts}
                  isOwnProfile={isOwnProfile}
                  userRole={userRole}
                />
              </div>
            </TabItem>
          )}

          {isOwnProfile && (
            <TabItem active={activeTab === 'security'} title="Security" icon={HiLockClosed}>
              <div className="p-4">
                <SecuritySection
                  memberId={member.id}
                  isOwnProfile={isOwnProfile}
                  securitySettings={mockSecuritySettings}
                  loginSessions={mockLoginSessions}
                  securityEvents={mockSecurityEvents}
                  userRole={userRole}
                />
              </div>
            </TabItem>
          )}
        </Tabs>
      </Card>
    </div>
  );
}
