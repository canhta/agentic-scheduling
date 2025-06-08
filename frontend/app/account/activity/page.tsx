'use client';

import React, { useState } from 'react';
import { Card, Button, Select, Badge, Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell, TextInput, Label } from 'flowbite-react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserRole } from '@/lib/types';
import { 
  HiSearch, 
  HiCalendar, 
  HiUser, 
  HiCreditCard, 
  HiCog, 
  HiLogin, 
  HiLogout,
  HiDocumentText,
  HiShieldCheck,
  HiRefresh,
  HiDownload
} from 'react-icons/hi';

interface ActivityLog {
  id: string;
  type: 'login' | 'logout' | 'booking' | 'payment' | 'profile_update' | 'password_change' | 'settings_change';
  description: string;
  timestamp: string;
  ipAddress?: string;
  deviceInfo?: string;
  location?: string;
  status: 'success' | 'failed' | 'pending';
  details?: Record<string, any>;
}

const AccountActivityPage = () => {
  const [activities] = useState<ActivityLog[]>([
    {
      id: '1',
      type: 'login',
      description: 'Successful login',
      timestamp: '2024-01-15T10:30:00Z',
      ipAddress: '192.168.1.100',
      deviceInfo: 'Chrome on Windows 10',
      location: 'New York, NY',
      status: 'success'
    },
    {
      id: '2',
      type: 'booking',
      description: 'Booked yoga session with Sarah Johnson',
      timestamp: '2024-01-15T09:45:00Z',
      status: 'success',
      details: {
        serviceType: 'Yoga Class',
        instructor: 'Sarah Johnson',
        date: '2024-01-20',
        time: '10:00 AM'
      }
    },
    {
      id: '3',
      type: 'payment',
      description: 'Monthly membership payment processed',
      timestamp: '2024-01-14T14:20:00Z',
      status: 'success',
      details: {
        amount: 99.99,
        currency: 'USD',
        paymentMethod: 'Credit Card ending in 1234'
      }
    },
    {
      id: '4',
      type: 'profile_update',
      description: 'Updated profile information',
      timestamp: '2024-01-13T16:15:00Z',
      status: 'success',
      details: {
        fieldsChanged: ['phone_number', 'emergency_contact']
      }
    },
    {
      id: '5',
      type: 'password_change',
      description: 'Password changed successfully',
      timestamp: '2024-01-12T11:30:00Z',
      ipAddress: '192.168.1.100',
      deviceInfo: 'Chrome on Windows 10',
      status: 'success'
    },
    {
      id: '6',
      type: 'login',
      description: 'Failed login attempt',
      timestamp: '2024-01-10T08:45:00Z',
      ipAddress: '203.0.113.0',
      deviceInfo: 'Unknown',
      location: 'Unknown',
      status: 'failed'
    },
    {
      id: '7',
      type: 'booking',
      description: 'Cancelled massage appointment',
      timestamp: '2024-01-09T13:20:00Z',
      status: 'success',
      details: {
        serviceType: 'Massage Therapy',
        instructor: 'Mike Thompson',
        originalDate: '2024-01-15',
        originalTime: '2:00 PM'
      }
    },
    {
      id: '8',
      type: 'settings_change',
      description: 'Updated notification preferences',
      timestamp: '2024-01-08T10:10:00Z',
      status: 'success',
      details: {
        settingsChanged: ['email_notifications', 'sms_reminders']
      }
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || activity.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || activity.status === statusFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const activityDate = new Date(activity.timestamp);
      const now = new Date();
      
      switch (dateFilter) {
        case 'today':
          matchesDate = activityDate.toDateString() === now.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = activityDate >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = activityDate >= monthAgo;
          break;
      }
    }

    return matchesSearch && matchesType && matchesStatus && matchesDate;
  });

  const getActivityIcon = (type: string) => {
    const icons = {
      login: HiLogin,
      logout: HiLogout,
      booking: HiCalendar,
      payment: HiCreditCard,
      profile_update: HiUser,
      password_change: HiShieldCheck,
      settings_change: HiCog
    };
    
    return icons[type as keyof typeof icons] || HiDocumentText;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      success: { color: 'success', text: 'Success' },
      failed: { color: 'failure', text: 'Failed' },
      pending: { color: 'warning', text: 'Pending' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    
    return (
      <Badge color={config.color}>
        {config.text}
      </Badge>
    );
  };

  const getActivityTypeLabel = (type: string) => {
    const labels = {
      login: 'Login',
      logout: 'Logout',
      booking: 'Booking',
      payment: 'Payment',
      profile_update: 'Profile Update',
      password_change: 'Password Change',
      settings_change: 'Settings Change'
    };
    
    return labels[type as keyof typeof labels] || type;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const exportActivity = () => {
    // Simulate CSV export
    const csvContent = [
      ['Date', 'Time', 'Type', 'Description', 'Status', 'IP Address', 'Device'].join(','),
      ...filteredActivities.map(activity => {
        const { date, time } = formatTimestamp(activity.timestamp);
        return [
          date,
          time,
          getActivityTypeLabel(activity.type),
          activity.description,
          activity.status,
          activity.ipAddress || 'N/A',
          activity.deviceInfo || 'N/A'
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'account-activity.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <ProtectedRoute requireRole={[UserRole.MEMBER, UserRole.STAFF, UserRole.ADMIN, UserRole.ORGANIZATION_ADMIN, UserRole.SUPER_ADMIN]}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Account Activity</h1>
          <p className="text-gray-600">Track your account activity and security events</p>
        </div>

        {/* Security Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Activities</p>
                <p className="text-2xl font-bold text-blue-600">{activities.length}</p>
              </div>
              <HiDocumentText className="w-8 h-8 text-blue-500" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Login Sessions</p>
                <p className="text-2xl font-bold text-green-600">
                  {activities.filter(a => a.type === 'login' && a.status === 'success').length}
                </p>
              </div>
              <HiLogin className="w-8 h-8 text-green-500" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Failed Attempts</p>
                <p className="text-2xl font-bold text-red-600">
                  {activities.filter(a => a.status === 'failed').length}
                </p>
              </div>
              <HiShieldCheck className="w-8 h-8 text-red-500" />
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="search" title="Search activities" />
              <TextInput
                id="search"
                icon={HiSearch}
                placeholder="Search by description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="type" title="Activity Type" />
              <Select
                id="type"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="login">Login</option>
                <option value="logout">Logout</option>
                <option value="booking">Booking</option>
                <option value="payment">Payment</option>
                <option value="profile_update">Profile Update</option>
                <option value="password_change">Password Change</option>
                <option value="settings_change">Settings Change</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="status" title="Status" />
              <Select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="success">Success</option>
                <option value="failed">Failed</option>
                <option value="pending">Pending</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="date" title="Time Period" />
              <Select
                id="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 days</option>
                <option value="month">Last 30 days</option>
              </Select>
            </div>
          </div>
        </Card>

        {/* Activity Log */}
        <Card>
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Activity Log</h2>
            <div className="flex gap-2">
              <Button color="gray" size="sm" onClick={() => window.location.reload()}>
                <HiRefresh className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button color="blue" size="sm" onClick={exportActivity}>
                <HiDownload className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>

          <Table hoverable>
            <TableHead>
              <TableHeadCell>Activity</TableHeadCell>
              <TableHeadCell>Description</TableHeadCell>
              <TableHeadCell>Date & Time</TableHeadCell>
              <TableHeadCell>Status</TableHeadCell>
              <TableHeadCell>Location & Device</TableHeadCell>
              <TableHeadCell>Details</TableHeadCell>
            </TableHead>
            <TableBody className="divide-y">
              {filteredActivities.map((activity) => {
                const Icon = getActivityIcon(activity.type);
                const { date, time } = formatTimestamp(activity.timestamp);
                
                return (
                  <TableRow key={activity.id} className="bg-white">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          activity.status === 'success' ? 'bg-green-100' :
                          activity.status === 'failed' ? 'bg-red-100' : 'bg-yellow-100'
                        }`}>
                          <Icon className={`w-4 h-4 ${
                            activity.status === 'success' ? 'text-green-600' :
                            activity.status === 'failed' ? 'text-red-600' : 'text-yellow-600'
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {getActivityTypeLabel(activity.type)}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-gray-900">{activity.description}</p>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{date}</p>
                        <p className="text-sm text-gray-500">{time}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(activity.status)}
                    </TableCell>
                    <TableCell>
                      <div>
                        {activity.location && (
                          <p className="text-sm text-gray-900">{activity.location}</p>
                        )}
                        {activity.deviceInfo && (
                          <p className="text-xs text-gray-500">{activity.deviceInfo}</p>
                        )}
                        {activity.ipAddress && (
                          <p className="text-xs text-gray-500">IP: {activity.ipAddress}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {activity.details && (
                        <div className="text-xs text-gray-500">
                          {Object.entries(activity.details).map(([key, value]) => (
                            <p key={key}>
                              <span className="font-medium">{key.replace('_', ' ')}: </span>
                              {Array.isArray(value) ? value.join(', ') : String(value)}
                            </p>
                          ))}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {filteredActivities.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No activities found matching your criteria.</p>
            </div>
          )}
        </Card>

        {/* Security Tips */}
        <Card className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <HiShieldCheck className="w-5 h-5 text-green-500 mt-1" />
              <div>
                <h4 className="font-medium text-gray-900">Monitor Your Activity</h4>
                <p className="text-sm text-gray-500">
                  Regularly check your activity log for any suspicious or unauthorized access.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <HiShieldCheck className="w-5 h-5 text-green-500 mt-1" />
              <div>
                <h4 className="font-medium text-gray-900">Secure Your Account</h4>
                <p className="text-sm text-gray-500">
                  Use a strong password and enable two-factor authentication for better security.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <HiShieldCheck className="w-5 h-5 text-green-500 mt-1" />
              <div>
                <h4 className="font-medium text-gray-900">Report Suspicious Activity</h4>
                <p className="text-sm text-gray-500">
                  If you notice any unauthorized activity, contact support immediately.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <HiShieldCheck className="w-5 h-5 text-green-500 mt-1" />
              <div>
                <h4 className="font-medium text-gray-900">Keep Information Updated</h4>
                <p className="text-sm text-gray-500">
                  Ensure your contact information and security settings are up to date.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </ProtectedRoute>
  );
};

export default AccountActivityPage;
