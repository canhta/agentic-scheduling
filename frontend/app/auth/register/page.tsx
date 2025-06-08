'use client';

import { RegisterForm } from '@/components/auth/RegisterForm';
import { Card } from 'flowbite-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RegisterPage() {
  const { user } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/admin');
    }
  }, [user, router]);

  if (user) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              href="/auth/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        <Card className="max-w-md w-full">
          <div className="p-6">
            <div className="mb-6 text-center">
              <h3 className="text-lg font-semibold">Get Started</h3>
            </div>
            <RegisterForm />
          </div>
        </Card>
      </div>
    </div>
  );
}
