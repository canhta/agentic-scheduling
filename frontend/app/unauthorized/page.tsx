'use client';

import { Card, Button } from 'flowbite-react';
import { useRouter } from 'next/navigation';
import { HiExclamationCircle, HiHome } from 'react-icons/hi';
import { useAuth } from '@/lib/auth/auth-context';

export default function UnauthorizedPage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleGoHome = () => {
    router.push('/admin');
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
      router.push('/auth/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card>
          <div className="pt-6 p-6">
            <div className="text-center">
              <div className="text-red-600 mb-4">
                <HiExclamationCircle className="w-16 h-16 mx-auto" />
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Access Denied
              </h1>
              
              <p className="text-gray-600 mb-6">
                {`You don't have permission to access this resource. Please contact your administrator if you believe this is an error.`}
              </p>

              {user && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-600">
                    Signed in as: <span className="font-medium">{user.email}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Role: <span className="font-medium capitalize">{user.role.toLowerCase()}</span>
                  </p>
                </div>
              )}
              
              <div className="space-y-3">
                <Button
                  onClick={handleGoHome}
                  className="w-full"
                  color="blue"
                >
                  <HiHome className="w-4 h-4 mr-2" />
                  Go to Dashboard
                </Button>
                
                <Button
                  onClick={handleLogout}
                  className="w-full"
                  color="gray"
                  outline
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
