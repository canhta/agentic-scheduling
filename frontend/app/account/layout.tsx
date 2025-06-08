'use client';

import React from 'react';
import { Navbar } from 'flowbite-react';
import { HiHome, HiUser, HiCalendar, HiCreditCard, HiCog, HiSupport, HiLogout, HiClipboardList } from 'react-icons/hi';
import { useAuth } from '@/lib/auth/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

interface AccountLayoutProps {
  children: React.ReactNode;
}

export default function AccountLayout({ children }: AccountLayoutProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const sidebarItems = [
    {
      href: '/account',
      label: 'Dashboard',
      icon: HiHome,
      active: pathname === '/account'
    },
    {
      href: '/account/profile',
      label: 'My Profile',
      icon: HiUser,
      active: pathname === '/account/profile'
    },
    {
      href: '/account/bookings',
      label: 'My Bookings',
      icon: HiCalendar,
      active: pathname.startsWith('/account/bookings')
    },
    {
      href: '/account/membership',
      label: 'Membership',
      icon: HiCreditCard,
      active: pathname.startsWith('/account/membership')
    },
    {
      href: '/account/activity',
      label: 'Activity Log',
      icon: HiClipboardList,
      active: pathname.startsWith('/account/activity')
    },
    {
      href: '/account/settings',
      label: 'Settings',
      icon: HiCog,
      active: pathname.startsWith('/account/settings')
    },
    {
      href: '/account/support',
      label: 'Support',
      icon: HiSupport,
      active: pathname.startsWith('/account/support')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Navigation */}
      <Navbar fluid className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center w-full px-4">
          <div className="flex items-center gap-4">
            <Link href="/account" className="text-xl font-bold text-gray-900 dark:text-white">
              My Account
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Welcome, {user?.firstName || 'Member'}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <HiLogout className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </Navbar>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen">
          <nav aria-label="Account navigation" className="w-full p-4">
            <ul className="space-y-2">
              {sidebarItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center p-2 rounded-lg transition-all duration-200 group ${
                      item.active
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    <item.icon 
                      className={`w-5 h-5 transition duration-200 ${
                        item.active 
                          ? 'text-blue-600 dark:text-blue-400' 
                          : 'text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300'
                      }`} 
                    />
                    <span className="flex-1 ml-3 font-medium">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
