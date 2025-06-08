'use client';

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'flowbite-react';
import { HiExclamationCircle } from 'react-icons/hi';

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
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="md">
      <ModalHeader>
        <div className="flex items-center gap-3">
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
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
      </ModalHeader>
      
      <ModalBody>
        <p className="text-gray-600">{message}</p>
      </ModalBody>
      
      <ModalFooter>
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
      </ModalFooter>
    </Modal>
  );
}