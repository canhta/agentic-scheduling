'use client';

import { useState } from 'react';
import { 
    HiMenu, 
    HiBell, 
    HiSearch, 
    HiUser, 
    HiCog, 
    HiLogout,
    HiChevronDown,
    HiSun,
    HiGlobeAlt,
    HiChartPie
} from 'react-icons/hi';
import { Button, Dropdown, DropdownDivider, DropdownHeader, DropdownItem, TextInput, Badge } from 'flowbite-react';
import { useAuth } from '@/lib/auth/auth-context';
import { useRouter } from 'next/navigation';

interface AdminHeaderProps {
    onSidebarToggle: () => void;
    sidebarOpen?: boolean;
}

export default function AdminHeader({ onSidebarToggle, sidebarOpen = false }: AdminHeaderProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [notificationCount] = useState(3);
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement search functionality
        console.log('Search query:', searchQuery);
    };

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/auth/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <div className="px-3 py-3 lg:px-5 lg:pl-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center justify-start">
                        <button
                            onClick={onSidebarToggle}
                            aria-controls="logo-sidebar"
                            type="button"
                            className={`inline-flex items-center p-2 text-sm rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:hover:bg-gray-700 dark:focus:ring-gray-600 transition-colors ${
                                sidebarOpen 
                                    ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900' 
                                    : 'text-gray-500 dark:text-gray-400'
                            }`}
                        >
                            <span className="sr-only">Toggle sidebar</span>
                            <HiMenu className="w-6 h-6" />
                        </button>
                        <a href="/admin" className="flex ml-2 md:mr-24">
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mr-3 flex items-center justify-center">
                                    <HiGlobeAlt className="w-5 h-5 text-white" />
                                </div>
                                <span className="self-center text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap">
                                    Agentic Scheduling
                                </span>
                            </div>
                        </a>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Enhanced Search */}
                        <form onSubmit={handleSearch} className="relative hidden md:block">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <HiSearch className="w-4 h-4 text-gray-400" />
                            </div>
                            <TextInput
                                type="text"
                                placeholder="Search organizations, users, bookings..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 w-64 lg:w-80"
                                sizing="sm"
                            />
                        </form>

                        {/* Theme Toggle */}
                        <Button color="gray" size="sm" className="hidden lg:flex">
                            <HiSun className="w-4 h-4" />
                        </Button>

                        {/* Notifications with Badge */}
                        <div className="relative">
                            <Button color="gray" size="sm">
                                <HiBell className="w-4 h-4" />
                            </Button>
                            {notificationCount > 0 && (
                                <Badge 
                                    color="red" 
                                    size="sm"
                                    className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 flex items-center justify-center"
                                >
                                    {notificationCount > 9 ? '9+' : notificationCount}
                                </Badge>
                            )}
                        </div>

                        {/* Enhanced User dropdown */}
                        <Dropdown
                            arrowIcon={false}
                            inline
                            label={
                                <div className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors">
                                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center ring-2 ring-gray-200 dark:ring-gray-600">
                                        <HiUser className="w-4 h-4 text-white" />
                                    </div>
                                    <HiChevronDown className="w-4 h-4 text-gray-500" />
                                </div>
                            }
                        >
                            <DropdownHeader>
                                <span className="block text-sm font-medium">
                                    {user?.firstName && user?.lastName 
                                        ? `${user.firstName} ${user.lastName}`
                                        : user?.email || 'User'
                                    }
                                </span>
                                <span className="block truncate text-sm text-gray-500">
                                    {user?.email || 'user@example.com'}
                                </span>
                                {user?.role && (
                                    <span className="inline-flex items-center px-2 py-1 mt-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900 dark:text-blue-300">
                                        {user.role}
                                    </span>
                                )}
                            </DropdownHeader>
                            <DropdownItem href="/admin" className="flex items-center">
                                <HiChartPie className="w-4 h-4 mr-2" />
                                Dashboard
                            </DropdownItem>
                            <DropdownItem href="/admin/settings" className="flex items-center">
                                <HiCog className="w-4 h-4 mr-2" />
                                Settings
                            </DropdownItem>
                            <DropdownDivider />
                            <DropdownItem 
                                onClick={handleLogout}
                                className="flex items-center text-red-600 hover:text-red-700 cursor-pointer"
                            >
                                <HiLogout className="w-4 h-4 mr-2" />
                                Sign out
                            </DropdownItem>
                        </Dropdown>
                    </div>
                </div>
            </div>
        </nav>
    );
}
