'use client';

import { Modal, Button, ModalHeader, ModalBody, ModalFooter } from 'flowbite-react';
import { HiExclamation } from 'react-icons/hi';
import type { CalendarEvent } from '@/lib/types';

interface DeleteConfirmationModalProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (event: CalendarEvent, deleteAll?: boolean) => void;
}

export function DeleteConfirmationModal({
  event,
  isOpen,
  onClose,
  onConfirm,
}: DeleteConfirmationModalProps) {
  if (!event) return null;

  const isRecurring = event.type === 'recurring' || event.recurringScheduleId;

  const handleDeleteThis = () => {
    onConfirm(event, false);
    onClose();
  };

  const handleDeleteAll = () => {
    onConfirm(event, true);
    onClose();
  };

  const handleDeleteSingle = () => {
    onConfirm(event);
    onClose();
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="md" className="z-[1001]">
      <ModalHeader>
        <div className="flex items-center gap-2 text-red-600">
          <HiExclamation className="h-5 w-5" />
          Delete Event
        </div>
      </ModalHeader>
      
      <ModalBody>
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <HiExclamation className="h-6 w-6 text-red-600" />
          </div>
          
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Delete &quot;{event.title}&quot;?
          </h3>
          
          <p className="text-sm text-gray-500 mb-4">
            {isRecurring 
              ? "This is a recurring event. Would you like to delete just this occurrence or all occurrences?"
              : "This action cannot be undone. The event will be permanently deleted."
            }
          </p>

          {event.booked && event.booked > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-yellow-800">
                <strong>Warning:</strong> This event has {event.booked} booking{event.booked > 1 ? 's' : ''}. 
                Deleting it will affect existing bookings.
              </p>
            </div>
          )}
        </div>
      </ModalBody>
      
      <ModalFooter className="justify-center">
        {isRecurring ? (
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <Button color="red" onClick={handleDeleteThis} className="flex-1">
              Delete This Event
            </Button>
            <Button color="red" onClick={handleDeleteAll} className="flex-1">
              Delete All Events
            </Button>
            <Button color="gray" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button color="red" onClick={handleDeleteSingle}>
              Delete Event
            </Button>
            <Button color="gray" onClick={onClose}>
              Cancel
            </Button>
          </div>
        )}
      </ModalFooter>
    </Modal>
  );
}
