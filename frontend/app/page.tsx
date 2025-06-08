'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push('/admin');
      } else {
        router.push('/auth/login');
      }
    }
  }, [router, user, loading]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Agentic Scheduling
        </h1>
        {loading ? (
          <LoadingSpinner text="Loading..." />
        ) : (
          <p className="text-gray-600 dark:text-gray-400">
            Redirecting...
          </p>
        )}
      </div>
    </div>
  );
}
