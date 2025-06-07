'use client';

import { Spinner } from 'flowbite-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  className?: string;
}

export function LoadingSpinner({ 
  size = 'md', 
  text, 
  className = "flex items-center justify-center min-h-64" 
}: LoadingSpinnerProps) {
  return (
    <div className={className}>
      <div className="flex flex-col items-center gap-3">
        <Spinner size={size} />
        {text && (
          <span className="text-sm text-gray-600">{text}</span>
        )}
      </div>
    </div>
  );
}
