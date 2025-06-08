'use client';

import React, { useState } from 'react';
import { Button, Label, TextInput, Card } from 'flowbite-react';
import { HiSave, HiX, HiMail, HiPhone } from 'react-icons/hi';
import type { UserResponseDto } from '@/lib/types';

interface ContactDetailsSectionProps {
  member: UserResponseDto;
  isEditing: boolean;
  onSave: (data: Partial<UserResponseDto>) => void;
  canEdit: boolean;
}

export function ContactDetailsSection({
  member,
  isEditing,
  onSave,
  canEdit
}: ContactDetailsSectionProps) {
  const [formData, setFormData] = useState({
    email: member.email || '',
    phone: member.phone || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  const handleCancel = () => {
    setFormData({
      email: member.email || '',
      phone: member.phone || '',
    });
  };

  if (!isEditing) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Contact Details
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="mb-1 block text-sm font-medium">Primary Email</Label>
            <div className="flex items-center gap-2">
              <HiMail className="h-4 w-4 text-gray-400" />
              <p className="text-gray-900 dark:text-white">{member.email || 'Not provided'}</p>
              {member.emailVerified && (
                <span className="text-green-600 text-xs">✓ Verified</span>
              )}
            </div>
          </div>

          <div>
            <Label className="mb-1 block text-sm font-medium">Phone Number</Label>
            <div className="flex items-center gap-2">
              <HiPhone className="h-4 w-4 text-gray-400" />
              <p className="text-gray-900 dark:text-white">{member.phone || 'Not provided'}</p>
              {member.phoneVerified && (
                <span className="text-green-600 text-xs">✓ Verified</span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Edit Contact Details
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="email">Primary Email *</Label>
          <TextInput
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            placeholder="Enter email address"
            icon={HiMail}
          />
          <p className="text-xs text-gray-500 mt-1">
            This email is used for login and important communications
          </p>
        </div>

        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <TextInput
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Enter phone number"
            icon={HiPhone}
          />
        </div>


        

    


      </div>
    </div>
  );
}
