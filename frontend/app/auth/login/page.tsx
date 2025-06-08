'use client';

import { LoginForm } from '@/components/auth/LoginForm';
import { Card } from 'flowbite-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/auth-context';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const targetUrl = redirectTo && redirectTo.startsWith('/') ? redirectTo : '/admin';
      router.push(targetUrl);
    }
  }, [user, router, redirectTo]);

  if (user) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              href="/auth/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              create a new account
            </Link>
          </p>
        </div>
        
        <Card className="max-w-md w-full">
          <div className="p-6">
            <div className="mb-6 text-center">
              <h3 className="text-lg font-semibold">Welcome Back</h3>
              {redirectTo && (
                <p className="text-sm text-gray-600 mt-2">
                  Please sign in to continue to your destination.
                </p>
              )}
            </div>
            <LoginForm redirectTo={redirectTo || undefined} />
          </div>
        </Card>

        <div className="text-center">
          <Link
            href="/auth/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  );
}
