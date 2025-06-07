'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/admin');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Agentic Scheduling
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Redirecting to admin panel...
        </p>
      </div>
    </div>
  );
}
