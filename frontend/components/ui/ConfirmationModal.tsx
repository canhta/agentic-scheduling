'use client';

import { Button } from 'flowbite-react';
import { HiExclamationCircle, HiX } from 'react-icons/hi';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: 'blue' | 'red' | 'green' | 'yellow' | 'purple';
  isLoading?: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmColor = 'red',
  isLoading = false
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={isLoading}
          >
            <HiX className="h-6 w-6" />
          </button>
        </div>
        
        <div className="flex items-start gap-4 mb-6">
          <div className="flex-shrink-0">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              confirmColor === 'red' ? 'bg-red-100' :
              confirmColor === 'yellow' ? 'bg-yellow-100' :
              'bg-blue-100'
            }`}>
              <HiExclamationCircle className={`w-6 h-6 ${
                confirmColor === 'red' ? 'text-red-600' :
                confirmColor === 'yellow' ? 'text-yellow-600' :
                'text-blue-600'
              }`} />
            </div>
          </div>
          <div className="flex-1">
            <p className="text-gray-600">{message}</p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            color="gray"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            color={confirmColor === 'red' ? 'failure' : confirmColor}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}