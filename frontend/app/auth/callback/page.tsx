'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { Card, Alert, Spinner } from 'flowbite-react';
import { HiExclamationCircle } from 'react-icons/hi';

export default function OAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { handleOAuthCallback, user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processOAuthCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');
        const provider = searchParams.get('provider') || 'google';

        if (error) {
          setError(`OAuth error: ${error}`);
          setIsProcessing(false);
          return;
        }

        if (!code) {
          setError('No authorization code received');
          setIsProcessing(false);
          return;
        }

        console.log('Processing OAuth callback with code:', code);

        // Handle OAuth callback
        await handleOAuthCallback(code, state || undefined);

        // Wait a moment for auth state to update
        setTimeout(() => {
          // Get redirect destination from state or use default
          let redirectTo = '/admin';
          
          if (state) {
            try {
              const stateData = JSON.parse(decodeURIComponent(state));
              if (stateData.redirectTo) {
                redirectTo = stateData.redirectTo;
              }
            } catch (e) {
              // If state parsing fails, just use default
              console.warn('Failed to parse state data:', e);
            }
          }

          // Check if there's a saved redirect URL in localStorage
          const savedRedirect = localStorage.getItem('auth_redirect');
          if (savedRedirect) {
            localStorage.removeItem('auth_redirect');
            redirectTo = savedRedirect;
          }

          console.log('OAuth callback successful, redirecting to:', redirectTo);
          router.push(redirectTo);
        }, 1000);

      } catch (err: any) {
        console.error('OAuth callback error:', err);
        setError(err.message || 'Authentication failed');
        setIsProcessing(false);
      }
    };

    processOAuthCallback();
  }, [searchParams, handleOAuthCallback, router]);

  // If we have a user and no error, show success
  if (user && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <Card>
            <div className="pt-6 p-6">
              <div className="text-center">
                <div className="text-green-600 mb-4">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Authentication Successful!</h3>
                <p className="text-gray-600">Welcome back! Redirecting you now...</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <Card>
            <div className="pt-6 p-6">
              <Alert color="failure" icon={HiExclamationCircle} className="mb-4">
                <span className="font-medium">Authentication Failed!</span> {error}
              </Alert>
              <div className="text-center">
                <button
                  onClick={() => router.push('/auth/login')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Back to Login
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card>
          <div className="pt-6 p-6">
            <div className="text-center">
              <Spinner size="lg" className="mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Completing sign in...</h3>
              <p className="text-gray-600">Please wait while we complete your authentication.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
