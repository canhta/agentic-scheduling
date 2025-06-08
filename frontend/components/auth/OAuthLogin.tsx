'use client';

import React, { useState } from 'react';
import { Button, Alert, Spinner } from 'flowbite-react';
import { HiExclamationCircle } from 'react-icons/hi';
import { FaGoogle, FaFacebook, FaGithub } from 'react-icons/fa';
import { useAuth } from '../../lib/auth/auth-context';

interface OAuthLoginProps {
  onSuccess?: () => void;
  redirectTo?: string;
  organizationId?: string;
  className?: string;
}

export function OAuthLogin({ 
  onSuccess, 
  redirectTo, 
  organizationId,
  className = ''
}: OAuthLoginProps) {
  const { initiateGoogleOAuth, error, clearError } = useAuth();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setIsLoading('google');
    clearError();
    
    try {
      // Save redirect information for after OAuth callback
      if (redirectTo) {
        localStorage.setItem('auth_redirect', redirectTo);
      }
      
      const oauthUrl = await initiateGoogleOAuth(organizationId);
      
      // Redirect to OAuth provider
      window.location.href = oauthUrl;
    } catch (error) {
      console.error('OAuth initiation failed:', error);
      setIsLoading(null);
    }
  };

  const handleFacebookLogin = async () => {
    setIsLoading('facebook');
    // Facebook OAuth implementation would go here
    // For now, just show a placeholder
    setTimeout(() => {
      setIsLoading(null);
      alert('Facebook OAuth not implemented yet');
    }, 1000);
  };

  const handleGithubLogin = async () => {
    setIsLoading('github');
    // GitHub OAuth implementation would go here
    // For now, just show a placeholder
    setTimeout(() => {
      setIsLoading(null);
      alert('GitHub OAuth not implemented yet');
    }, 1000);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {error && (
        <Alert color="failure" icon={HiExclamationCircle} className="mb-4">
          <span className="font-medium">OAuth failed!</span> {error.message}
        </Alert>
      )}

      <Button
        color="light"
        className="w-full border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
        onClick={handleGoogleLogin}
        disabled={!!isLoading}
      >
        {isLoading === 'google' ? (
          <>
            <Spinner size="sm" className="mr-3" />
            Connecting...
          </>
        ) : (
          <>
            <FaGoogle className="mr-3 text-red-500" size={18} />
            Continue with Google
          </>
        )}
      </Button>

      <Button
        color="light"
        className="w-full border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
        onClick={handleFacebookLogin}
        disabled={!!isLoading}
      >
        {isLoading === 'facebook' ? (
          <>
            <Spinner size="sm" className="mr-3" />
            Connecting...
          </>
        ) : (
          <>
            <FaFacebook className="mr-3 text-blue-600" size={18} />
            Continue with Facebook
          </>
        )}
      </Button>

      <Button
        color="light"
        className="w-full border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
        onClick={handleGithubLogin}
        disabled={!!isLoading}
      >
        {isLoading === 'github' ? (
          <>
            <Spinner size="sm" className="mr-3" />
            Connecting...
          </>
        ) : (
          <>
            <FaGithub className="mr-3 text-gray-800 dark:text-gray-200" size={18} />
            Continue with GitHub
          </>
        )}
      </Button>
    </div>
  );
}
