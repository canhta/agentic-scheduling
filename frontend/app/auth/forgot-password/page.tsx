'use client';

import { ForgotPasswordForm } from '@/components/auth/PasswordReset';
import { Card } from 'flowbite-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {`Enter your email address and we'll send you a link to reset your password.`}
          </p>
        </div>
        
        <Card className="max-w-md w-full">
          <div className="p-6">
            <div className="mb-6 text-center">
              <h3 className="text-lg font-semibold">Password Reset</h3>
            </div>
            <ForgotPasswordForm />
          </div>
        </Card>

        <div className="text-center">
          <Link
            href="/auth/login"
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
