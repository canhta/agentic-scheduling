'use client';

import React, { useState } from 'react';
import { Button, Label, TextInput, Select, Card, FileInput, HelperText } from 'flowbite-react';
import { HiSave, HiX, HiCamera } from 'react-icons/hi';
import type { UserResponseDto } from '@/lib/types';

interface BasicInformationSectionProps {
    member: UserResponseDto;
    isEditing: boolean;
    onSave: (data: Partial<UserResponseDto>) => void;
    canEdit: boolean;
    isOwnProfile?: boolean;
}

export function BasicInformationSection({
    member,
    isEditing,
    onSave,
    canEdit,
    isOwnProfile = false
}: BasicInformationSectionProps) {
    const [formData, setFormData] = useState({
        firstName: member.firstName || '',
        lastName: member.lastName || '',
        dateOfBirth: member.dateOfBirth ? new Date(member.dateOfBirth).toISOString().split('T')[0] : '',
    });


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };



    const handleSave = async () => {
        try {


            const updateData = {
                ...formData,
                dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : undefined
            };

            onSave(updateData);
        } catch (error) {
            console.error('Failed to save basic information:', error);
        }
    };

    const handleCancel = () => {
        setFormData({
            firstName: member.firstName || '',
            lastName: member.lastName || '',
            dateOfBirth: member.dateOfBirth ? new Date(member.dateOfBirth).toISOString().split('T')[0] : '',
        });
    };

    const genderOptions = [
        { value: '', label: 'Select gender' },
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other' },
        { value: 'prefer_not_to_say', label: 'Prefer not to say' }
    ];

    if (!isEditing) {
        return (
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Basic Information
                    </h3>
                </div>



                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label className="mb-1 block text-sm font-medium">First Name</Label>
                        <p className="text-gray-900 dark:text-white">{member.firstName || 'Not provided'}</p>
                    </div>

                    <div>
                        <Label className="mb-1 block text-sm font-medium">Last Name</Label>
                        <p className="text-gray-900 dark:text-white">{member.lastName || 'Not provided'}</p>
                    </div>



                    <div>
                        <Label className="mb-1 block text-sm font-medium">Member ID</Label>
                        <p className="text-gray-900 dark:text-white font-mono">
                            {member.memberId || 'Not assigned'}
                        </p>
                    </div>

                    <div>
                        <Label className="mb-1 block text-sm font-medium">Date of Birth</Label>
                        <p className="text-gray-900 dark:text-white">
                            {member.dateOfBirth
                                ? new Date(member.dateOfBirth).toLocaleDateString()
                                : 'Not provided'}
                        </p>
                    </div>


                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Edit Basic Information
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
                    <Label htmlFor="firstName">First Name *</Label>
                    <TextInput
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter first name"
                    />
                </div>

                <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <TextInput
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter last name"
                    />
                </div>



                <div>
                    <Label className="mb-1 block text-sm font-medium">Member ID</Label>
                    <TextInput
                        value={member.memberId || 'Auto-generated'}
                        disabled
                        className="bg-gray-100 dark:bg-gray-800"
                    />
                    <p className="text-xs text-gray-500 mt-1">Member ID is automatically generated</p>
                </div>

                <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <TextInput
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        disabled={isOwnProfile} // Members can't edit their own DOB for age verification
                    />
                    {isOwnProfile && (
                        <p className="text-xs text-gray-500 mt-1">
                            Contact support to update your date of birth
                        </p>
                    )}
                </div>


            </div>
        </div>
    );
}
