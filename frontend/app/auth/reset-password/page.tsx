'use client';

import { ResetPasswordForm } from '@/components/auth/PasswordReset';
import { Card } from 'flowbite-react';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  return <ResetPasswordForm token={token} />;
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Set new password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your new password below.
          </p>
        </div>
        
        <Card className="max-w-md w-full">
          <div className="p-6">
            <div className="mb-6 text-center">
              <h3 className="text-lg font-semibold">New Password</h3>
            </div>
            <Suspense fallback={<div>Loading...</div>}>
              <ResetPasswordContent />
            </Suspense>
          </div>
        </Card>
      </div>
    </div>
  );
}
