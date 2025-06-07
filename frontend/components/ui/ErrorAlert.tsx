'use client';

import { Alert } from 'flowbite-react';
import { HiInformationCircle, HiExclamation, HiX, HiCheckCircle } from 'react-icons/hi';

interface ErrorAlertProps {
  type?: 'error' | 'warning' | 'info' | 'success';
  message: string;
  onDismiss?: () => void;
  className?: string;
}

export function ErrorAlert({ 
  type = 'error', 
  message, 
  onDismiss,
  className = "mb-4" 
}: ErrorAlertProps) {
  const getIcon = () => {
    switch (type) {
      case 'error':
        return HiX;
      case 'warning':
        return HiExclamation;
      case 'success':
        return HiCheckCircle;
      default:
        return HiInformationCircle;
    }
  };

  const getColor = () => {
    switch (type) {
      case 'error':
        return 'failure';
      case 'warning':
        return 'warning';
      case 'success':
        return 'success';
      default:
        return 'info';
    }
  };

  return (
    <div className={className}>
      <Alert 
        color={getColor()} 
        icon={getIcon()}
        onDismiss={onDismiss}
      >
        {message}
      </Alert>
    </div>
  );
}