'use client';

import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Avatar, Spinner } from 'flowbite-react';
import { HiCalendar, HiUser, HiClock, HiTrendingUp, HiChatAlt2 } from 'react-icons/hi';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserRole, type UserResponseDto } from '@/lib/types';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/auth-context';

interface DashboardStats {
    upcomingBookings: number;
    totalBookings: number;
    attendanceRate: number;
    membershipStatus: string;
    membershipExpiry?: string;
    creditsRemaining?: number;
}

interface UpcomingBooking {
    id: string;
    serviceName: string;
    date: string;
    time: string;
    instructor: string;
    location: string;
    status: string;
}

interface RecentActivity {
    id: string;
    type: 'booking' | 'attendance' | 'payment' | 'communication';
    description: string;
    date: string;
    status?: string;
}

export default function AccountDashboard() {
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [upcomingBookings, setUpcomingBookings] = useState<UpcomingBooking[]>([]);
    const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);

                // TODO: Replace with actual API calls
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Mock data
                const mockStats: DashboardStats = {
                    upcomingBookings: 3,
                    totalBookings: 45,
                    attendanceRate: 92,
                    membershipStatus: 'ACTIVE',
                    membershipExpiry: '2024-12-31',
                    creditsRemaining: 12
                };

                const mockUpcomingBookings: UpcomingBooking[] = [
                    {
                        id: '1',
                        serviceName: 'Yoga Flow',
                        date: '2024-01-28',
                        time: '09:00',
                        instructor: 'Sarah Johnson',
                        location: 'Studio A',
                        status: 'CONFIRMED'
                    },
                    {
                        id: '2',
                        serviceName: 'Personal Training',
                        date: '2024-01-29',
                        time: '15:00',
                        instructor: 'Mike Wilson',
                        location: 'Gym Floor',
                        status: 'CONFIRMED'
                    },
                    {
                        id: '3',
                        serviceName: 'HIIT Class',
                        date: '2024-01-30',
                        time: '18:00',
                        instructor: 'Alex Chen',
                        location: 'Studio B',
                        status: 'WAITLISTED'
                    }
                ];

                const mockRecentActivity: RecentActivity[] = [
                    {
                        id: '1',
                        type: 'booking',
                        description: 'Booked Yoga Flow class for Jan 28',
                        date: '2024-01-26T10:00:00Z',
                        status: 'confirmed'
                    },
                    {
                        id: '2',
                        type: 'attendance',
                        description: 'Attended HIIT Class',
                        date: '2024-01-25T18:00:00Z',
                        status: 'attended'
                    },
                    {
                        id: '3',
                        type: 'payment',
                        description: 'Monthly membership payment processed',
                        date: '2024-01-24T12:00:00Z',
                        status: 'success'
                    },
                    {
                        id: '4',
                        type: 'communication',
                        description: 'Received class reminder notification',
                        date: '2024-01-24T08:00:00Z'
                    }
                ];

                setStats(mockStats);
                setUpcomingBookings(mockUpcomingBookings);
                setRecentActivity(mockRecentActivity);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'booking': return HiCalendar;
            case 'attendance': return HiUser;
            case 'payment': return HiTrendingUp;
            case 'communication': return HiChatAlt2;
            default: return HiClock;
        }
    };

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'CONFIRMED': return 'success';
            case 'WAITLISTED': return 'warning';
            case 'CANCELLED': return 'failure';
            default: return 'gray';
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

    return (
        <ProtectedRoute requireRole={[UserRole.MEMBER]}>
            <div className="space-y-6">
                {/* Welcome Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Welcome back, {user?.firstName}!
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            {` Here's your fitness activity overview`}
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <Button onClick={() => router.push('/bookings/new')}>
                            <HiCalendar className="w-4 h-4 mr-2" />
                            Book a Class
                        </Button>
                        <Button outline onClick={() => router.push('/account/profile')}>
                            <HiUser className="w-4 h-4 mr-2" />
                            My Profile
                        </Button>
                    </div>
                </div>

                {/* Stats Overview */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card>
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
                                    <HiCalendar className="w-8 h-8" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Upcoming Bookings
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {stats.upcomingBookings}
                                    </p>
                                </div>
                            </div>
                        </Card>

                        <Card>
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
                                    <HiTrendingUp className="w-8 h-8" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Total Bookings
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {stats.totalBookings}
                                    </p>
                                </div>
                            </div>
                        </Card>

                        <Card>
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-purple-100 text-purple-500 mr-4">
                                    <HiUser className="w-8 h-8" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Attendance Rate
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {stats.attendanceRate}%
                                    </p>
                                </div>
                            </div>
                        </Card>

                        <Card>
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-orange-100 text-orange-500 mr-4">
                                    <HiClock className="w-8 h-8" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Credits Remaining
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {stats.creditsRemaining || 0}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Upcoming Bookings */}
                    <div className="lg:col-span-2">
                        <Card>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Upcoming Bookings
                                </h3>
                                <Link href="/bookings" className="text-blue-600 hover:text-blue-500 text-sm font-medium">
                                    View All
                                </Link>
                            </div>

                            {upcomingBookings.length === 0 ? (
                                <div className="text-center py-8">
                                    <HiCalendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                        No Upcoming Bookings
                                    </h4>
                                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                                        Ready to get back to your fitness routine?
                                    </p>
                                    <Button onClick={() => router.push('/bookings/new')}>
                                        Book a Class
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {upcomingBookings.map((booking) => (
                                        <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <div className="flex items-center gap-4">
                                                <div className="flex-shrink-0">
                                                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                                                        <HiCalendar className="w-6 h-6" />
                                                    </div>
                                                </div>

                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-900 dark:text-white">
                                                        {booking.serviceName}
                                                    </h4>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        with {booking.instructor} • {booking.location}
                                                    </p>
                                                    <div className="flex items-center gap-4 mt-1">
                                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                                            {new Date(booking.date).toLocaleDateString()} at {booking.time}
                                                        </span>
                                                        <Badge color={getStatusBadgeColor(booking.status)} size="sm">
                                                            {booking.status}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <Button size="xs" outline>
                                                    Modify
                                                </Button>
                                                <Button size="xs" color="failure" outline>
                                                    Cancel
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>
                    </div>

                    {/* Membership Status & Recent Activity */}
                    <div className="space-y-6">
                        {/* Membership Status */}
                        {stats && (
                            <Card>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    Membership Status
                                </h3>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 dark:text-gray-400">Status</span>
                                        <Badge color="success">{stats.membershipStatus}</Badge>
                                    </div>

                                    {stats.membershipExpiry && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 dark:text-gray-400">Expires</span>
                                            <span className="text-gray-900 dark:text-white">
                                                {new Date(stats.membershipExpiry).toLocaleDateString()}
                                            </span>
                                        </div>
                                    )}

                                    {stats.creditsRemaining !== undefined && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 dark:text-gray-400">Credits</span>
                                            <span className="text-gray-900 dark:text-white font-medium">
                                                {stats.creditsRemaining} remaining
                                            </span>
                                        </div>
                                    )}

                                    <Button outline className="w-full" onClick={() => router.push('/membership')}>
                                        Manage Membership
                                    </Button>
                                </div>
                            </Card>
                        )}

                        {/* Recent Activity */}
                        <Card>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Recent Activity
                                </h3>
                                <Link href="/account/activity" className="text-blue-600 hover:text-blue-500 text-sm font-medium">
                                    View All
                                </Link>
                            </div>

                            <div className="space-y-3">
                                {recentActivity.map((activity) => {
                                    const IconComponent = getActivityIcon(activity.type);
                                    return (
                                        <div key={activity.id} className="flex items-start gap-3">
                                            <div className="flex-shrink-0 mt-0.5">
                                                <div className="w-8 h-8 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center">
                                                    <IconComponent className="w-4 h-4" />
                                                </div>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-gray-900 dark:text-white">
                                                    {activity.description}
                                                </p>
                                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                                    {new Date(activity.date).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Quick Actions */}
                <Card>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Quick Actions
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Button outline className="flex flex-col items-center py-4" onClick={() => router.push('/bookings/new')}>
                            <HiCalendar className="w-8 h-8 mb-2" />
                            <span>Book Class</span>
                        </Button>

                        <Button outline className="flex flex-col items-center py-4" onClick={() => router.push('/bookings')}>
                            <HiClock className="w-8 h-8 mb-2" />
                            <span>My Bookings</span>
                        </Button>

                        <Button outline className="flex flex-col items-center py-4" onClick={() => router.push('/account/profile')}>
                            <HiUser className="w-8 h-8 mb-2" />
                            <span>Profile</span>
                        </Button>

                        <Button outline className="flex flex-col items-center py-4" onClick={() => router.push('/support')}>
                            <HiChatAlt2 className="w-8 h-8 mb-2" />
                            <span>Support</span>
                        </Button>
                    </div>
                </Card>
            </div>
        </ProtectedRoute>
    );
}
