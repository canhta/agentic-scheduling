import { Card } from 'flowbite-react';
import { HiViewBoards, HiUsers, HiLocationMarker, HiCalendar } from 'react-icons/hi';

export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome to the Agentic Scheduling admin panel
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="max-w-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
              <HiViewBoards className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Organizations
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                12
              </p>
            </div>
          </div>
        </Card>

        <Card className="max-w-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
              <HiUsers className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Users
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                248
              </p>
            </div>
          </div>
        </Card>

        <Card className="max-w-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-500 mr-4">
              <HiLocationMarker className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Locations
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                35
              </p>
            </div>
          </div>
        </Card>

        <Card className="max-w-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-500 mr-4">
              <HiCalendar className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Active Bookings
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                156
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="max-w-full">
          <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h5>
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-sm">
                <p className="font-medium text-gray-900 dark:text-white">
                  New organization created: FitLife Gym
                </p>
                <p className="text-gray-500 dark:text-gray-400">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-sm">
                <p className="font-medium text-gray-900 dark:text-white">
                  15 new bookings today
                </p>
                <p className="text-gray-500 dark:text-gray-400">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-sm">
                <p className="font-medium text-gray-900 dark:text-white">
                  System maintenance completed
                </p>
                <p className="text-gray-500 dark:text-gray-400">1 day ago</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="max-w-full">
          <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h5>
          <div className="space-y-2">
            <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900 dark:hover:bg-blue-800 rounded-lg transition-colors">
              <p className="font-medium text-blue-900 dark:text-blue-100">
                Create New Organization
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Set up a new organization in the system
              </p>
            </button>
            <button className="w-full text-left p-3 bg-green-50 hover:bg-green-100 dark:bg-green-900 dark:hover:bg-green-800 rounded-lg transition-colors">
              <p className="font-medium text-green-900 dark:text-green-100">
                View Reports
              </p>
              <p className="text-sm text-green-700 dark:text-green-300">
                Access analytics and reports
              </p>
            </button>
            <button className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900 dark:hover:bg-purple-800 rounded-lg transition-colors">
              <p className="font-medium text-purple-900 dark:text-purple-100">
                System Settings
              </p>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                Configure global system settings
              </p>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
