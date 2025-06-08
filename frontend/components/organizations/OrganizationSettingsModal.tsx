'use client';

import { Button, Label, TextInput, Textarea, Select, Modal, ModalHeader, ModalBody, ModalFooter } from 'flowbite-react';
import { UpdateOrganizationSettingsDto, OrganizationSettingsResponse, BusinessHoursDto } from '../../lib/types';

interface OrganizationSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: UpdateOrganizationSettingsDto) => void;
    formData: UpdateOrganizationSettingsDto;
    setFormData: (data: UpdateOrganizationSettingsDto) => void;
    isLoading?: boolean;
    settings?: OrganizationSettingsResponse | null;
}

const DAYS_OF_WEEK = [
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' },
];

export function OrganizationSettingsModal({
    isOpen,
    onClose,
    onSubmit,
    formData,
    setFormData,
    isLoading = false,
    settings
}: OrganizationSettingsModalProps) {
    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const updateBusinessHours = (dayOfWeek: number, field: keyof BusinessHoursDto, value: any) => {
        const currentHours = formData.businessHours || [];
        const dayIndex = currentHours.findIndex(h => h.dayOfWeek === dayOfWeek);

        if (dayIndex >= 0) {
            const updatedHours = [...currentHours];
            updatedHours[dayIndex] = { ...updatedHours[dayIndex], [field]: value };
            setFormData({ ...formData, businessHours: updatedHours });
        } else {
            const newHours = [...currentHours, {
                dayOfWeek,
                openTime: '09:00',
                closeTime: '17:00',
                isOpen: true,
                [field]: value
            }];
            setFormData({ ...formData, businessHours: newHours });
        }
    };

    const getBusinessHoursForDay = (dayOfWeek: number): BusinessHoursDto => {
        const hours = formData.businessHours?.find(h => h.dayOfWeek === dayOfWeek);
        return hours || {
            dayOfWeek,
            openTime: '09:00',
            closeTime: '17:00',
            isOpen: true
        };
    };

    return (
        <Modal show={isOpen} onClose={onClose} size="4xl">
            <ModalHeader>
                Organization Settings
            </ModalHeader>

            <form onSubmit={handleSubmit}>
                <ModalBody className="space-y-6">
                    {/* Booking Settings */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-md font-medium text-gray-900 mb-4">Booking Settings</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="bookingWindowDays" title="Booking Window (Days)" />
                                        <TextInput
                                            id="bookingWindowDays"
                                            type="number"
                                            min="1"
                                            value={formData.bookingWindowDays?.toString() || '30'}
                                            onChange={(e) => setFormData({ ...formData, bookingWindowDays: parseInt(e.target.value) })}
                                            disabled={isLoading}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="cancellationWindowHours" title="Cancellation Window (Hours)" />
                                        <TextInput
                                            id="cancellationWindowHours"
                                            type="number"
                                            min="0"
                                            value={formData.cancellationWindowHours?.toString() || '24'}
                                            onChange={(e) => setFormData({ ...formData, cancellationWindowHours: parseInt(e.target.value) })}
                                            disabled={isLoading}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="minimumAdvanceBooking" title="Min Advance Booking (Minutes)" />
                                        <TextInput
                                            id="minimumAdvanceBooking"
                                            type="number"
                                            min="0"
                                            value={formData.minimumAdvanceBooking?.toString() || '60'}
                                            onChange={(e) => setFormData({ ...formData, minimumAdvanceBooking: parseInt(e.target.value) })}
                                            disabled={isLoading}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="maximumAdvanceBooking" title="Max Advance Booking (Minutes)" />
                                        <TextInput
                                            id="maximumAdvanceBooking"
                                            type="number"
                                            min="0"
                                            value={formData.maximumAdvanceBooking?.toString() || '43200'}
                                            onChange={(e) => setFormData({ ...formData, maximumAdvanceBooking: parseInt(e.target.value) })}
                                            disabled={isLoading}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="maxBookingsPerMember" title="Max Bookings Per Member" />
                                        <TextInput
                                            id="maxBookingsPerMember"
                                            type="number"
                                            min="1"
                                            value={formData.maxBookingsPerMember?.toString() || '10'}
                                            onChange={(e) => setFormData({ ...formData, maxBookingsPerMember: parseInt(e.target.value) })}
                                            disabled={isLoading}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="defaultClassDuration" title="Default Class Duration (Minutes)" />
                                        <TextInput
                                            id="defaultClassDuration"
                                            type="number"
                                            min="1"
                                            value={formData.defaultClassDuration?.toString() || '60'}
                                            onChange={(e) => setFormData({ ...formData, defaultClassDuration: parseInt(e.target.value) })}
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center">
                                            <input
                                                id="requireMembershipForBooking"
                                                type="checkbox"
                                                checked={formData.requireMembershipForBooking ?? false}
                                                onChange={(e) => setFormData({ ...formData, requireMembershipForBooking: e.target.checked })}
                                                disabled={isLoading}
                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <Label htmlFor="requireMembershipForBooking" className="ml-2 text-sm">
                                                Require Membership
                                            </Label>
                                        </div>

                                        <div className="flex items-center">
                                            <input
                                                id="allowGuestBookings"
                                                type="checkbox"
                                                checked={formData.allowGuestBookings ?? true}
                                                onChange={(e) => setFormData({ ...formData, allowGuestBookings: e.target.checked })}
                                                disabled={isLoading}
                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <Label htmlFor="allowGuestBookings" className="ml-2 text-sm">
                                                Allow Guest Bookings
                                            </Label>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            id="allowRecurringBookings"
                                            type="checkbox"
                                            checked={formData.allowRecurringBookings ?? true}
                                            onChange={(e) => setFormData({ ...formData, allowRecurringBookings: e.target.checked })}
                                            disabled={isLoading}
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <Label htmlFor="allowRecurringBookings" className="ml-2 text-sm">
                                            Allow Recurring Bookings
                                        </Label>
                                    </div>
                                </div>
                            </div>

                            {/* Penalty Settings */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="text-md font-medium text-gray-900 mb-4">Penalty Settings</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center">
                                        <input
                                            id="lateCancelPenalty"
                                            type="checkbox"
                                            checked={formData.lateCancelPenalty ?? false}
                                            onChange={(e) => setFormData({ ...formData, lateCancelPenalty: e.target.checked })}
                                            disabled={isLoading}
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <Label htmlFor="lateCancelPenalty" className="ml-2 text-sm">
                                            Late Cancel Penalty
                                        </Label>
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            id="noShowPenalty"
                                            type="checkbox"
                                            checked={formData.noShowPenalty ?? false}
                                            onChange={(e) => setFormData({ ...formData, noShowPenalty: e.target.checked })}
                                            disabled={isLoading}
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <Label htmlFor="noShowPenalty" className="ml-2 text-sm">
                                            No Show Penalty
                                        </Label>
                                    </div>
                                </div>
                            </div>

                            {/* Waitlist Settings */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="text-md font-medium text-gray-900 mb-4">Waitlist Settings</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center">
                                        <input
                                            id="waitlistEnabled"
                                            type="checkbox"
                                            checked={formData.waitlistEnabled ?? true}
                                            onChange={(e) => setFormData({ ...formData, waitlistEnabled: e.target.checked })}
                                            disabled={isLoading}
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <Label htmlFor="waitlistEnabled" className="ml-2 text-sm">
                                            Enable Waitlist
                                        </Label>
                                    </div>

                                    <div>
                                        <Label htmlFor="maxWaitlistSize" title="Max Waitlist Size" />
                                        <TextInput
                                            id="maxWaitlistSize"
                                            type="number"
                                            min="1"
                                            value={formData.maxWaitlistSize?.toString() || '10'}
                                            onChange={(e) => setFormData({ ...formData, maxWaitlistSize: parseInt(e.target.value) })}
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Email Settings */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="text-md font-medium text-gray-900 mb-4">Email Settings</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center">
                                        <input
                                            id="sendConfirmationEmails"
                                            type="checkbox"
                                            checked={formData.sendConfirmationEmails ?? true}
                                            onChange={(e) => setFormData({ ...formData, sendConfirmationEmails: e.target.checked })}
                                            disabled={isLoading}
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <Label htmlFor="sendConfirmationEmails" className="ml-2 text-sm">
                                            Send Confirmation Emails
                                        </Label>
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            id="sendReminderEmails"
                                            type="checkbox"
                                            checked={formData.sendReminderEmails ?? true}
                                            onChange={(e) => setFormData({ ...formData, sendReminderEmails: e.target.checked })}
                                            disabled={isLoading}
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <Label htmlFor="sendReminderEmails" className="ml-2 text-sm">
                                            Send Reminder Emails
                                        </Label>
                                    </div>

                                    <div>
                                        <Label htmlFor="reminderHours" title="Reminder Hours Before Class" />
                                        <TextInput
                                            id="reminderHours"
                                            type="number"
                                            min="1"
                                            value={formData.reminderHours?.toString() || '24'}
                                            onChange={(e) => setFormData({ ...formData, reminderHours: parseInt(e.target.value) })}
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Branding Settings */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="text-md font-medium text-gray-900 mb-4">Branding</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="primaryColor" title="Primary Color" />
                                        <TextInput
                                            id="primaryColor"
                                            type="color"
                                            value={formData.primaryColor || '#3B82F6'}
                                            onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                                            disabled={isLoading}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="secondaryColor" title="Secondary Color" />
                                        <TextInput
                                            id="secondaryColor"
                                            type="color"
                                            value={formData.secondaryColor || '#10B981'}
                                            onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                                            disabled={isLoading}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="logoUrl" title="Logo URL" />
                                        <TextInput
                                            id="logoUrl"
                                            type="url"
                                            value={formData.logoUrl || ''}
                                            onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                                            disabled={isLoading}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="customDomain" title="Custom Domain" />
                                        <TextInput
                                            id="customDomain"
                                            type="text"
                                            value={formData.customDomain || ''}
                                            onChange={(e) => setFormData({ ...formData, customDomain: e.target.value })}
                                            disabled={isLoading}
                                            placeholder="yourbrand.com"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Business Hours */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="text-md font-medium text-gray-900 mb-4">Business Hours</h4>
                                <div className="space-y-3">
                                    {DAYS_OF_WEEK.map((day) => {
                                        const hours = getBusinessHoursForDay(day.value);
                                        return (
                                            <div key={day.value} className="flex items-center space-x-4">
                                                <div className="w-20">
                                                    <span className="text-sm font-medium">{day.label}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={hours.isOpen}
                                                        onChange={(e) => updateBusinessHours(day.value, 'isOpen', e.target.checked)}
                                                        disabled={isLoading}
                                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                                    />
                                                    <span className="ml-2 text-sm">Open</span>
                                                </div>
                                                {hours.isOpen && (
                                                    <>
                                                        <TextInput
                                                            type="time"
                                                            value={hours.openTime}
                                                            onChange={(e) => updateBusinessHours(day.value, 'openTime', e.target.value)}
                                                            disabled={isLoading}
                                                            className="w-32"
                                                        />
                                                        <span className="text-sm">to</span>
                                                        <TextInput
                                                            type="time"
                                                            value={hours.closeTime}
                                                            onChange={(e) => updateBusinessHours(day.value, 'closeTime', e.target.value)}
                                                            disabled={isLoading}
                                                            className="w-32"
                                                        />
                                                    </>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                </ModalBody>

                <ModalFooter>
                    <Button color="gray" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Update Settings'}
                    </Button>
                </ModalFooter>
            </form>
        </Modal>
    );
}
