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
  HiUserGroup,
  HiCube,
  HiChevronRight,
  HiHome,
  HiDocumentReport,
  HiSupport,
  HiCollection,
  HiX
} from 'react-icons/hi';

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  children?: SidebarItem[];
}

interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

const sidebarSections: SidebarSection[] = [
  {
    title: 'Overview',
    items: [
      { name: 'Dashboard', href: '/admin', icon: HiChartPie },
      { name: 'Analytics', href: '/admin/analytics', icon: HiDocumentReport },
    ]
  },
  {
    title: 'User Management',
    items: [
      { name: 'Members', href: '/admin/members', icon: HiUsers },
      { name: 'Staff & Admins', href: '/admin/users', icon: HiUserGroup, badge: '12+' },
    ]
  },
  {
    title: 'Management',
    items: [
      { name: 'Organizations', href: '/admin/organizations', icon: HiViewBoards },
      { name: 'Locations', href: '/admin/locations', icon: HiLocationMarker },
      { name: 'Resources', href: '/admin/resources', icon: HiShoppingBag },
      { name: 'Services', href: '/admin/services', icon: HiCube },
    ]
  },
  {
    title: 'Operations',
    items: [
      { name: 'Schedules', href: '/admin/schedules', icon: HiCalendar, badge: '3' },
      { name: 'Reports', href: '/admin/reports', icon: HiCollection },
    ]
  },
  {
    title: 'System',
    items: [
      { name: 'Settings', href: '/admin/settings', icon: HiCog },
      { name: 'Support', href: '/admin/support', icon: HiSupport },
    ]
  }
];

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function AdminSidebar({ isOpen, onToggle }: AdminSidebarProps) {
  const pathname = usePathname();

  const renderBadge = (badge: string | number) => (
    <span className="inline-flex items-center justify-center px-2 ml-3 text-xs font-medium text-gray-800 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-300">
      {badge}
    </span>
  );

  const renderSidebarItem = (item: SidebarItem) => {
    const isActive = pathname === item.href;
    return (
      <li key={item.name}>
        <Link
          href={item.href}
          className={`flex items-center p-2 rounded-lg transition-all duration-200 group ${
            isActive
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 shadow-sm'
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          <item.icon 
            className={`w-5 h-5 transition duration-200 ${
              isActive 
                ? 'text-blue-600 dark:text-blue-400' 
                : 'text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300'
            }`} 
          />
          <span className="flex-1 ml-3 font-medium">{item.name}</span>
          {item.badge && renderBadge(item.badge)}
          {item.children && (
            <HiChevronRight className="w-4 h-4 text-gray-400" />
          )}
        </Link>
      </li>
    );
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-20 lg:hidden transition-opacity"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-30 w-64 h-screen pt-20 transition-transform duration-300 ease-in-out bg-white border-r border-gray-200 shadow-lg dark:bg-gray-800 dark:border-gray-700 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
          {/* Mobile close button */}
          <div className="flex justify-between items-center pt-4 pb-2 lg:hidden">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Menu</h2>
            <button
              onClick={onToggle}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              <HiX className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-6">
            {sidebarSections.map((section, sectionIndex) => (
              <div key={section.title}>
                {/* Section Header */}
                <div className="px-3 mb-2">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    {section.title}
                  </h3>
                </div>
                
                {/* Section Items */}
                <ul className="space-y-1">
                  {section.items.map(renderSidebarItem)}
                </ul>
                
                {/* Divider (except for last section) */}
                {sectionIndex < sidebarSections.length - 1 && (
                  <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <HiHome className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  Admin Portal
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  v1.0.0
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
