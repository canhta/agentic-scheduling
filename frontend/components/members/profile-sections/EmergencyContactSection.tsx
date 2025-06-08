'use client';

import React, { useState } from 'react';
import { Button, Label, TextInput, Select } from 'flowbite-react';
import { HiSave, HiX } from 'react-icons/hi';
import type { UserResponseDto } from '@/lib/types';
import { HiExclamationTriangle } from 'react-icons/hi2';

interface EmergencyContactSectionProps {
  member: UserResponseDto;
  isEditing: boolean;
  onSave: (data: Partial<UserResponseDto>) => void;
  canEdit: boolean;
}

export function EmergencyContactSection({
  member,
  isEditing,
  onSave,
  canEdit
}: EmergencyContactSectionProps) {
  const [formData, setFormData] = useState({
    emergencyContactName: member.emergencyContactName || '',
    emergencyContactPhone: member.emergencyContactPhone || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  const handleCancel = () => {
    setFormData({
      emergencyContactName: member.emergencyContactName || '',
      emergencyContactPhone: member.emergencyContactPhone || '',
    });
  };

  const relationshipOptions = [
    { value: '', label: 'Select relationship' },
    { value: 'spouse', label: 'Spouse' },
    { value: 'partner', label: 'Partner' },
    { value: 'parent', label: 'Parent' },
    { value: 'child', label: 'Child' },
    { value: 'sibling', label: 'Sibling' },
    { value: 'friend', label: 'Friend' },
    { value: 'other', label: 'Other' }
  ];

  if (!isEditing) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <HiExclamationTriangle className="h-5 w-5 text-orange-500" />
            Emergency Contact
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            This contact will be notified in case of an emergency during your visits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="mb-1 block text-sm font-medium">Contact Name</Label>
            <p className="text-gray-900 dark:text-white">
              {member.emergencyContactName || 'Not provided'}
            </p>
          </div>

          <div>
            <Label className="mb-1 block text-sm font-medium">Phone Number</Label>
            <p className="text-gray-900 dark:text-white">
              {member.emergencyContactPhone || 'Not provided'}
            </p>
          </div>

       
        </div>

        {(!member.emergencyContactName || !member.emergencyContactPhone) && (
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <HiExclamationTriangle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-orange-800 dark:text-orange-200">
                  Emergency Contact Incomplete
                </h4>
                <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                  Please provide emergency contact information for safety purposes.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <HiExclamationTriangle className="h-5 w-5 text-orange-500" />
          Edit Emergency Contact
        </h3>
        <div className="flex gap-2">
          <Button size="sm" color="gray" onClick={handleCancel}>
            <HiX className="h-4 w-4 mr-1" />
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave}>
            <HiSave className="h-4 w-4 mr-1" />
            Save Changes
          </Button>
        </div>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400">
        This contact will be notified in case of an emergency during your visits.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="emergencyContactName">Contact Name *</Label>
          <TextInput
            id="emergencyContactName"
            name="emergencyContactName"
            value={formData.emergencyContactName}
            onChange={handleInputChange}
            required
            placeholder="Enter emergency contact name"
          />
        </div>

        <div>
          <Label htmlFor="emergencyContactPhone">Phone Number *</Label>
          <TextInput
            id="emergencyContactPhone"
            name="emergencyContactPhone"
            type="tel"
            value={formData.emergencyContactPhone}
            onChange={handleInputChange}
            required
            placeholder="Enter phone number"
          />
        </div>


      </div>
    </div>
  );
}
