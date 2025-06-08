'use client';

import { useState, useEffect } from 'react';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Set initial sidebar state and handle resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        // Desktop - show sidebar by default
        setSidebarOpen(true);
      } else {
        // Mobile - hide sidebar by default
        setSidebarOpen(false);
      }
    };

    // Set initial state based on screen size
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

    return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminHeader onSidebarToggle={toggleSidebar} sidebarOpen={sidebarOpen} />
      <AdminSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      
      {/* Main content area */}
      <div className={`transition-all duration-300 ${
        sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'
      } ${sidebarOpen ? 'ml-0' : 'ml-0'}`}>
        <div className="pt-20 p-4 lg:p-6">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
