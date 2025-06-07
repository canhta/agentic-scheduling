'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HiChartPie,
  HiInbox,
  HiShoppingBag,
  HiCalendar,
  HiLocationMarker,
  HiCog,
  HiViewBoards,
  HiUsers,
} from 'react-icons/hi';

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const sidebarItems: SidebarItem[] = [
  { name: 'Dashboard', href: '/admin', icon: HiChartPie },
  { name: 'Organizations', href: '/admin/organizations', icon: HiViewBoards },
  { name: 'Users', href: '/admin/users', icon: HiUsers },
  { name: 'Locations', href: '/admin/locations', icon: HiLocationMarker },
  { name: 'Resources', href: '/admin/resources', icon: HiShoppingBag },
  { name: 'Schedules', href: '/admin/schedules', icon: HiCalendar },
  { name: 'Bookings', href: '/admin/bookings', icon: HiInbox },
  { name: 'Settings', href: '/admin/settings', icon: HiCog },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function AdminSidebar({ isOpen, onToggle }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-20 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-30 w-64 h-screen pt-20 transition-transform bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group ${
                      isActive
                        ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                        : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    <item.icon className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                    <span className="ml-3">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}
