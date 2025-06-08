'use client';

import React from 'react';
import { Label, Badge, Card, Progress } from 'flowbite-react';
import { HiCreditCard, HiCalendar, HiClock } from 'react-icons/hi';
import type { UserResponseDto } from '@/lib/types';

interface MembershipInformationSectionProps {
  member: UserResponseDto;
  canEdit: boolean;
}

export function MembershipInformationSection({
  member,
  canEdit
}: MembershipInformationSectionProps) {
  // Mock membership data - in real app, this would come from the API
  const memberships = [
    {
      id: '1',
      type: 'Monthly Unlimited',
      status: 'ACTIVE',
      startDate: '2024-01-01',
      expiryDate: '2024-12-31',
      creditsRemaining: null,
      isUnlimited: true,
      price: 89.99,
      billingCycle: 'monthly'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'INACTIVE': return 'gray';
      case 'EXPIRED': return 'failure';
      case 'FROZEN': return 'warning';
      default: return 'gray';
    }
  };

  const calculateProgress = (startDate: string, expiryDate: string) => {
    const start = new Date(startDate).getTime();
    const end = new Date(expiryDate).getTime();
    const now = Date.now();
    
    if (now < start) return 0;
    if (now > end) return 100;
    
    const progress = ((now - start) / (end - start)) * 100;
    return Math.round(progress);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Membership Information
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Current membership status and entitlements for booking access.
        </p>
      </div>

      {memberships.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <HiCreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Active Membership
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {`This member doesn't have an active membership.`}
            </p>
            {canEdit && (
              <button className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                Assign Membership
              </button>
            )}
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {memberships.map((membership) => (
            <Card key={membership.id}>
              <div className="space-y-4">
                {/* Membership Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                      {membership.type}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      ${membership.price}/{membership.billingCycle}
                    </p>
                  </div>
                  <Badge color={getStatusColor(membership.status)}>
                    {membership.status}
                  </Badge>
                </div>

                {/* Membership Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="mb-1 block text-sm font-medium">Start Date</Label>
                    <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                      <HiCalendar className="h-4 w-4 text-gray-400" />
                      {new Date(membership.startDate).toLocaleDateString()}
                    </div>
                  </div>

                  <div>
                    <Label className="mb-1 block text-sm font-medium">Expiry Date</Label>
                    <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                      <HiClock className="h-4 w-4 text-gray-400" />
                      {new Date(membership.expiryDate).toLocaleDateString()}
                    </div>
                  </div>

                  <div>
                    <Label className="mb-1 block text-sm font-medium">
                      {membership.isUnlimited ? 'Access Type' : 'Credits Remaining'}
                    </Label>
                    <div className="text-gray-900 dark:text-white">
                      {membership.isUnlimited ? (
                        <Badge color="success" size="sm">Unlimited</Badge>
                      ) : (
                        <span className="font-medium">{membership.creditsRemaining || 0} credits</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Membership Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium">Membership Period</Label>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {calculateProgress(membership.startDate, membership.expiryDate)}% complete
                    </span>
                  </div>
                  <Progress 
                    progress={calculateProgress(membership.startDate, membership.expiryDate)} 
                    color="blue"
                    size="sm"
                  />
                </div>

                {/* Actions for Admin/Staff */}
                {canEdit && (
                  <div className="flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <button className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
                      Edit Membership
                    </button>
                    <button className="text-yellow-600 hover:text-yellow-500 dark:text-yellow-400 dark:hover:text-yellow-300 text-sm font-medium">
                      Freeze Membership
                    </button>
                    <button className="text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium">
                      Cancel Membership
                    </button>
                  </div>
                )}
              </div>
            </Card>
          ))}

          {canEdit && (
            <Card>
              <div className="text-center py-4">
                <button className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                  + Add New Membership
                </button>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Booking Entitlements Summary */}
      <Card>
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-900 dark:text-white">
            Booking Entitlements
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400">Classes</span>
              <Badge color="success">Allowed</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400">Personal Training</span>
              <Badge color="success">Allowed</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400">Advanced Booking</span>
              <span className="text-sm text-gray-900 dark:text-white font-medium">30 days</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400">Cancellation Window</span>
              <span className="text-sm text-gray-900 dark:text-white font-medium">24 hours</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
