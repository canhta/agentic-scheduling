'use client';

import React, { useState } from 'react';
import { Card, Button, TextInput, Select, Textarea, Alert, Modal, Badge } from 'flowbite-react';
import { HiCog, HiBell, HiShieldCheck, HiMail, HiDeviceMobile, HiGlobe, HiInformationCircle, HiExclamationCircle, HiX } from 'react-icons/hi';

interface NotificationSettings {
  email: {
    bookingConfirmations: boolean;
    classReminders: boolean;
    membershipUpdates: boolean;
    promotions: boolean;
    newsletters: boolean;
  };
  push: {
    bookingConfirmations: boolean;
    classReminders: boolean;
    liveUpdates: boolean;
  };
  sms: {
    bookingConfirmations: boolean;
    classReminders: boolean;
    emergencyAlerts: boolean;
  };
}

interface PrivacySettings {
  profileVisibility: 'public' | 'members' | 'private';
  showBookingHistory: boolean;
  allowDirectMessages: boolean;
  dataSharing: boolean;
  analyticsTracking: boolean;
}

const mockNotificationSettings: NotificationSettings = {
  email: {
    bookingConfirmations: true,
    classReminders: true,
    membershipUpdates: true,
    promotions: false,
    newsletters: true
  },
  push: {
    bookingConfirmations: true,
    classReminders: true,
    liveUpdates: false
  },
  sms: {
    bookingConfirmations: false,
    classReminders: true,
    emergencyAlerts: true
  }
};

const mockPrivacySettings: PrivacySettings = {
  profileVisibility: 'members',
  showBookingHistory: false,
  allowDirectMessages: true,
  dataSharing: false,
  analyticsTracking: true
};

export default function SettingsPage() {
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(mockNotificationSettings);
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>(mockPrivacySettings);
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('America/New_York');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [timeFormat, setTimeFormat] = useState('12');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [savedAlert, setSavedAlert] = useState(false);

  const handleNotificationChange = (category: keyof NotificationSettings, setting: string, value: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handlePrivacyChange = (setting: keyof PrivacySettings, value: any) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  // Custom Toggle Component
  const CustomToggle = ({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) => (
    <button
      type="button"
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        checked ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
      }`}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );

  const handleSaveSettings = () => {
    // This would integrate with the actual API
    console.log('Saving settings:', {
      notifications: notificationSettings,
      privacy: privacySettings,
      preferences: { language, timezone, dateFormat, timeFormat }
    });
    
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 3000);
  };

  const handleDeleteAccount = () => {
    // This would integrate with the actual API
    console.log('Deleting account...');
    setShowDeleteModal(false);
  };

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
    { value: 'it', label: 'Italiano' }
  ];

  const timezones = [
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
    { value: 'Europe/Paris', label: 'Central European Time (CET)' },
    { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your preferences, notifications, and account settings
          </p>
        </div>
      </div>

      {/* Success Alert */}
      {savedAlert && (
        <Alert color="success" onDismiss={() => setSavedAlert(false)}>
          <HiInformationCircle className="h-4 w-4" />
          Settings saved successfully!
        </Alert>
      )}

      {/* Notification Settings */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <HiBell className="w-5 h-5 text-blue-500" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Notification Preferences
          </h2>
        </div>

        <div className="space-y-6">
          {/* Email Notifications */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <HiMail className="w-4 h-4" />
              Email Notifications
            </h3>
            <div className="space-y-3">
              {Object.entries(notificationSettings.email).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-900 dark:text-white">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </label>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {key === 'bookingConfirmations' && 'Receive confirmation emails when you book or cancel classes'}
                      {key === 'classReminders' && 'Get reminded about upcoming classes via email'}
                      {key === 'membershipUpdates' && 'Notifications about membership changes and renewals'}
                      {key === 'promotions' && 'Special offers and promotional emails'}
                      {key === 'newsletters' && 'Monthly newsletters and gym updates'}
                    </p>
                  </div>
                  <CustomToggle
                    checked={value}
                    onChange={(checked: boolean) => handleNotificationChange('email', key, checked)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Push Notifications */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <HiDeviceMobile className="w-4 h-4" />
              Push Notifications
            </h3>
            <div className="space-y-3">
              {Object.entries(notificationSettings.push).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-900 dark:text-white">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </label>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {key === 'bookingConfirmations' && 'Push notifications for booking confirmations'}
                      {key === 'classReminders' && 'Push reminders for upcoming classes'}
                      {key === 'liveUpdates' && 'Real-time updates about class changes or cancellations'}
                    </p>
                  </div>
                  <CustomToggle
                    checked={value}
                    onChange={(checked: boolean) => handleNotificationChange('push', key, checked)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* SMS Notifications */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <HiDeviceMobile className="w-4 h-4" />
              SMS Notifications
            </h3>
            <div className="space-y-3">
              {Object.entries(notificationSettings.sms).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-900 dark:text-white">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </label>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {key === 'bookingConfirmations' && 'SMS confirmations for bookings'}
                      {key === 'classReminders' && 'SMS reminders for upcoming classes'}
                      {key === 'emergencyAlerts' && 'Important alerts and emergency notifications'}
                    </p>
                  </div>
                  <CustomToggle
                    checked={value}
                    onChange={(checked: boolean) => handleNotificationChange('sms', key, checked)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <HiShieldCheck className="w-5 h-5 text-green-500" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Privacy & Security
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Profile Visibility
            </label>
            <Select
              value={privacySettings.profileVisibility}
              onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
            >
              <option value="public">Public - Visible to everyone</option>
              <option value="members">Members Only - Visible to gym members</option>
              <option value="private">Private - Hidden from others</option>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900 dark:text-white">
                Show Booking History
              </label>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Allow other members to see your class attendance
              </p>
            </div>
            <CustomToggle
              checked={privacySettings.showBookingHistory}
              onChange={(checked: boolean) => handlePrivacyChange('showBookingHistory', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900 dark:text-white">
                Allow Direct Messages
              </label>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Let other members send you messages
              </p>
            </div>
            <CustomToggle
              checked={privacySettings.allowDirectMessages}
              onChange={(checked: boolean) => handlePrivacyChange('allowDirectMessages', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900 dark:text-white">
                Data Sharing with Partners
              </label>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Share anonymized data with partner services
              </p>
            </div>
            <CustomToggle
              checked={privacySettings.dataSharing}
              onChange={(checked: boolean) => handlePrivacyChange('dataSharing', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900 dark:text-white">
                Analytics Tracking
              </label>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Help us improve by sharing usage analytics
              </p>
            </div>
            <CustomToggle
              checked={privacySettings.analyticsTracking}
              onChange={(checked: boolean) => handlePrivacyChange('analyticsTracking', checked)}
            />
          </div>
        </div>
      </Card>

      {/* Language & Region */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <HiGlobe className="w-5 h-5 text-purple-500" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Language & Region
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Language
            </label>
            <Select value={language} onChange={(e) => setLanguage(e.target.value)}>
              {languages.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Timezone
            </label>
            <Select value={timezone} onChange={(e) => setTimezone(e.target.value)}>
              {timezones.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Date Format
            </label>
            <Select value={dateFormat} onChange={(e) => setDateFormat(e.target.value)}>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Time Format
            </label>
            <Select value={timeFormat} onChange={(e) => setTimeFormat(e.target.value)}>
              <option value="12">12-hour (AM/PM)</option>
              <option value="24">24-hour</option>
            </Select>
          </div>
        </div>
      </Card>

      {/* Account Management */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <HiCog className="w-5 h-5 text-gray-500" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Account Management
          </h2>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Export Account Data
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Download a copy of your account data and history
              </p>
            </div>
            <Button color="gray" size="sm">
              Export Data
            </Button>
          </div>

          <div className="flex justify-between items-center p-4 border border-red-200 dark:border-red-700 rounded-lg bg-red-50 dark:bg-red-900/20">
            <div>
              <h3 className="text-sm font-medium text-red-900 dark:text-red-100">
                Delete Account
              </h3>
              <p className="text-xs text-red-600 dark:text-red-400">
                Permanently delete your account and all associated data
              </p>
            </div>
            <Button
              color="failure"
              size="sm"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button color="blue" onClick={handleSaveSettings}>
          Save Settings
        </Button>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setShowDeleteModal(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="relative inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="bg-white dark:bg-gray-800 rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => setShowDeleteModal(false)}
                >
                  <span className="sr-only">Close</span>
                  <HiX className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 sm:mx-0 sm:h-10 sm:w-10">
                  <HiExclamationCircle className="h-6 w-6 text-red-600 dark:text-red-400" aria-hidden="true" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                    Delete Account
                  </h3>
                  <div className="mt-2">
                    <div className="text-center">
                      <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                        Are you sure you want to delete your account?
                      </h3>
                      <div className="text-left space-y-2 mb-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          This action will permanently:
                        </p>
                        <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>Delete your profile and personal information</li>
                          <li>Cancel your membership and any active bookings</li>
                          <li>Remove your booking history and preferences</li>
                          <li>Revoke access to all gym services</li>
                        </ul>
                        <p className="text-sm text-red-600 dark:text-red-400 font-medium mt-3">
                          This action cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <Button color="failure" onClick={handleDeleteAccount} className="w-full sm:ml-3 sm:w-auto">
                  Yes, Delete My Account
                </Button>
                <Button color="gray" onClick={() => setShowDeleteModal(false)} className="mt-3 w-full sm:mt-0 sm:w-auto">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
