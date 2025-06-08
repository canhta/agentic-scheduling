'use client';

import React, { useState } from 'react';
import { Card, Button, TextInput, Label, Select, Checkbox, Textarea, Badge } from 'flowbite-react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserRole } from '@/lib/types';
import { 
  HiCog, 
  HiMail, 
  HiGlobe, 
  HiShieldCheck, 
  HiCurrencyDollar, 
  HiDocumentText,
  HiSave,
  HiRefresh
} from 'react-icons/hi';

const AdminSettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      alert('Settings saved successfully!');
    }, 1500);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: HiCog },
    { id: 'notifications', label: 'Notifications', icon: HiMail },
    { id: 'appearance', label: 'Appearance', icon: HiGlobe },
    { id: 'security', label: 'Security', icon: HiShieldCheck },
    { id: 'billing', label: 'Billing', icon: HiCurrencyDollar },
    { id: 'integrations', label: 'Integrations', icon: HiDocumentText },
  ];

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="appName" title="Application Name" />
          <TextInput
            id="appName"
            placeholder="Wellness Management System"
            defaultValue="Wellness Management System"
          />
        </div>
        <div>
          <Label htmlFor="timezone" title="Default Timezone" />
          <Select id="timezone" defaultValue="UTC">
            <option value="UTC">UTC</option>
            <option value="EST">Eastern Time</option>
            <option value="PST">Pacific Time</option>
            <option value="CST">Central Time</option>
            <option value="MST">Mountain Time</option>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="language" title="Default Language" />
          <Select id="language" defaultValue="en">
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="currency" title="Default Currency" />
          <Select id="currency" defaultValue="USD">
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="CAD">CAD ($)</option>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="maintenanceMode" title="Maintenance Mode" />
        <div className="flex items-center gap-2 mt-2">
          <Checkbox id="maintenanceMode" />
          <Label htmlFor="maintenanceMode">Enable maintenance mode</Label>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          When enabled, only administrators can access the system
        </p>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Checkbox id="emailBookings" defaultChecked />
            <Label htmlFor="emailBookings">New booking notifications</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="emailCancellations" defaultChecked />
            <Label htmlFor="emailCancellations">Booking cancellation notifications</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="emailReminders" defaultChecked />
            <Label htmlFor="emailReminders">Appointment reminders</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="emailReports" />
            <Label htmlFor="emailReports">Daily reports</Label>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">SMS Notifications</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Checkbox id="smsReminders" />
            <Label htmlFor="smsReminders">Appointment reminders</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="smsConfirmations" />
            <Label htmlFor="smsConfirmations">Booking confirmations</Label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="emailFrom" title="From Email Address" />
          <TextInput
            id="emailFrom"
            type="email"
            placeholder="noreply@wellness.com"
            defaultValue="noreply@wellness.com"
          />
        </div>
        <div>
          <Label htmlFor="emailReplyTo" title="Reply-To Email" />
          <TextInput
            id="emailReplyTo"
            type="email"
            placeholder="support@wellness.com"
            defaultValue="support@wellness.com"
          />
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="logoUpload" title="Company Logo" />
          <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-2">
              <HiDocumentText className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">Click to upload logo</p>
            <p className="text-xs text-gray-400">PNG, JPG up to 2MB</p>
          </div>
        </div>
        <div>
          <Label htmlFor="favicon" title="Favicon" />
          <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-2">
              <HiGlobe className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">Upload favicon</p>
            <p className="text-xs text-gray-400">ICO, PNG 32x32px</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="primaryColor" title="Primary Color" />
          <div className="flex items-center gap-2 mt-2">
            <input
              type="color"
              id="primaryColor"
              defaultValue="#3B82F6"
              className="w-12 h-10 border border-gray-300 rounded"
            />
            <TextInput
              placeholder="#3B82F6"
              defaultValue="#3B82F6"
              className="flex-1"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="secondaryColor" title="Secondary Color" />
          <div className="flex items-center gap-2 mt-2">
            <input
              type="color"
              id="secondaryColor"
              defaultValue="#10B981"
              className="w-12 h-10 border border-gray-300 rounded"
            />
            <TextInput
              placeholder="#10B981"
              defaultValue="#10B981"
              className="flex-1"
            />
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="customCSS" title="Custom CSS" />
        <Textarea
          id="customCSS"
          placeholder="/* Add your custom CSS here */"
          rows={6}
          className="mt-2"
        />
        <p className="text-sm text-gray-500 mt-1">
          Add custom CSS to override default styles
        </p>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Password Policy</h3>
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="minPasswordLength" title="Minimum Password Length" />
              <Select id="minPasswordLength" defaultValue="8">
                <option value="6">6 characters</option>
                <option value="8">8 characters</option>
                <option value="10">10 characters</option>
                <option value="12">12 characters</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="passwordExpiry" title="Password Expiry (days)" />
              <Select id="passwordExpiry" defaultValue="90">
                <option value="30">30 days</option>
                <option value="60">60 days</option>
                <option value="90">90 days</option>
                <option value="never">Never</option>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox id="requireUppercase" defaultChecked />
              <Label htmlFor="requireUppercase">Require uppercase letters</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="requireNumbers" defaultChecked />
              <Label htmlFor="requireNumbers">Require numbers</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="requireSpecialChars" />
              <Label htmlFor="requireSpecialChars">Require special characters</Label>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Checkbox id="require2FA" />
            <Label htmlFor="require2FA">Require 2FA for all users</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="require2FAAdmin" defaultChecked />
            <Label htmlFor="require2FAAdmin">Require 2FA for administrators</Label>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Session Management</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="sessionTimeout" title="Session Timeout (minutes)" />
            <Select id="sessionTimeout" defaultValue="30">
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="maxSessions" title="Max Concurrent Sessions" />
            <Select id="maxSessions" defaultValue="3">
              <option value="1">1 session</option>
              <option value="3">3 sessions</option>
              <option value="5">5 sessions</option>
              <option value="unlimited">Unlimited</option>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBillingSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="taxRate" title="Default Tax Rate (%)" />
          <TextInput
            id="taxRate"
            type="number"
            placeholder="8.25"
            defaultValue="8.25"
            min="0"
            max="100"
            step="0.01"
          />
        </div>
        <div>
          <Label htmlFor="invoicePrefix" title="Invoice Number Prefix" />
          <TextInput
            id="invoicePrefix"
            placeholder="INV-"
            defaultValue="INV-"
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Methods</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Checkbox id="acceptCard" defaultChecked />
            <Label htmlFor="acceptCard">Accept Credit/Debit Cards</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="acceptPaypal" defaultChecked />
            <Label htmlFor="acceptPaypal">Accept PayPal</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="acceptBank" />
            <Label htmlFor="acceptBank">Accept Bank Transfers</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="acceptCash" defaultChecked />
            <Label htmlFor="acceptCash">Accept Cash Payments</Label>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Billing Cycle</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="billingCycle" title="Default Billing Cycle" />
            <Select id="billingCycle" defaultValue="monthly">
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="gracePeriod" title="Grace Period (days)" />
            <Select id="gracePeriod" defaultValue="7">
              <option value="3">3 days</option>
              <option value="7">7 days</option>
              <option value="14">14 days</option>
              <option value="30">30 days</option>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderIntegrationsSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Calendar Integration</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Google Calendar</span>
              <Badge color="success">Connected</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Outlook Calendar</span>
              <Badge color="gray">Not Connected</Badge>
            </div>
            <Button size="sm" color="blue">Configure Calendar</Button>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Payment Gateways</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Stripe</span>
              <Badge color="success">Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>PayPal</span>
              <Badge color="warning">Testing</Badge>
            </div>
            <Button size="sm" color="blue">Manage Payments</Button>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Email Service</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>SendGrid</span>
              <Badge color="success">Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>AWS SES</span>
              <Badge color="gray">Not Connected</Badge>
            </div>
            <Button size="sm" color="blue">Configure Email</Button>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Analytics</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Google Analytics</span>
              <Badge color="gray">Not Connected</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Custom Analytics</span>
              <Badge color="success">Active</Badge>
            </div>
            <Button size="sm" color="blue">Setup Analytics</Button>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'appearance':
        return renderAppearanceSettings();
      case 'security':
        return renderSecuritySettings();
      case 'billing':
        return renderBillingSettings();
      case 'integrations':
        return renderIntegrationsSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <ProtectedRoute requireRole={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600">Configure your wellness management system</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:w-64">
            <Card>
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {tabs.find(tab => tab.id === activeTab)?.label} Settings
                  </h2>
                  <div className="flex gap-2">
                    <Button color="gray" size="sm">
                      <HiRefresh className="w-4 h-4 mr-2" />
                      Reset
                    </Button>
                    <Button 
                      color="blue" 
                      size="sm" 
                      onClick={handleSave}
                      disabled={isSaving}
                    >
                      <HiSave className="w-4 h-4 mr-2" />
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </div>

                {renderTabContent()}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminSettingsPage;
