'use client';

import { Modal, Button, Badge, ModalHeader, ModalBody, ModalFooter } from 'flowbite-react';
import { 
  HiClock, 
  HiLocationMarker, 
  HiUser, 
  HiUserGroup,
  HiCalendar,
  HiX
} from 'react-icons/hi';
import type { CalendarEvent } from '@/lib/types';

interface EventDetailsModalProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (event: CalendarEvent) => void;
  onDelete?: (event: CalendarEvent) => void;
}

export function EventDetailsModal({
  event,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: EventDetailsModalProps) {
  if (!event) return null;

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'failure';
      case 'blocked':
        return 'gray';
      default:
        return 'info';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'booking':
        return 'Booking';
      case 'recurring':
        return 'Class/Session';
      case 'exception':
        return 'Exception';
      case 'availability':
        return 'Availability';
      default:
        return 'Event';
    }
  };

  const utilizationPercentage = event.capacity && event.booked 
    ? Math.round((event.booked / event.capacity) * 100)
    : 0;

  return (
    <Modal show={isOpen} onClose={onClose} size="lg">
      <ModalHeader className="border-b border-gray-200">
        <div className="flex items-center justify-between w-full">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {event.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge color={getStatusColor(event.status)} size="sm">
                {getTypeLabel(event.type)}
              </Badge>
              {event.status && (
                <Badge color={getStatusColor(event.status)} size="sm">
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </ModalHeader>

      <ModalBody className="space-y-6">
        {/* Date and Time */}
        <div className="flex items-start gap-3">
          <HiClock className="h-5 w-5 text-gray-400 mt-0.5" />
          <div>
            <div className="font-medium text-gray-900">
              {event.allDay ? 'All Day' : `${formatTime(event.start)} - ${formatTime(event.end)}`}
            </div>
            <div className="text-sm text-gray-600">
              {formatDateTime(event.start).split(' at ')[0]}
            </div>
          </div>
        </div>

        {/* Location */}
        {event.location && (
          <div className="flex items-start gap-3">
            <HiLocationMarker className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <div className="font-medium text-gray-900">Location</div>
              <div className="text-sm text-gray-600">{event.location}</div>
            </div>
          </div>
        )}

        {/* Instructor */}
        {event.instructor && (
          <div className="flex items-start gap-3">
            <HiUser className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <div className="font-medium text-gray-900">Instructor</div>
              <div className="text-sm text-gray-600">{event.instructor}</div>
            </div>
          </div>
        )}

        {/* Capacity and Bookings */}
        {event.capacity && (
          <div className="flex items-start gap-3">
            <HiUserGroup className="h-5 w-5 text-gray-400 mt-0.5" />
            <div className="w-full">
              <div className="font-medium text-gray-900">Capacity</div>
              <div className="text-sm text-gray-600 mb-2">
                {event.booked || 0} of {event.capacity} spots filled
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    utilizationPercentage >= 90
                      ? 'bg-red-500'
                      : utilizationPercentage >= 75
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }`}
                  style={{ width: `${utilizationPercentage}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {utilizationPercentage}% utilization
              </div>
            </div>
          </div>
        )}

        {/* IDs for debugging/admin */}
        <div className="border-t border-gray-200 pt-4">
          <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
            <div>
              <span className="font-medium">Event ID:</span> {event.id}
            </div>
            {event.serviceId && (
              <div>
                <span className="font-medium">Service ID:</span> {event.serviceId}
              </div>
            )}
            {event.bookingId && (
              <div>
                <span className="font-medium">Booking ID:</span> {event.bookingId}
              </div>
            )}
            {event.recurringScheduleId && (
              <div>
                <span className="font-medium">Schedule ID:</span> {event.recurringScheduleId}
              </div>
            )}
          </div>
        </div>
      </ModalBody>

      <ModalFooter className="border-t border-gray-200">
        <div className="flex justify-between w-full">
          <div className="flex gap-2">
            {onEdit && (
              <Button
                color="blue"
                size="sm"
                onClick={() => onEdit(event)}
              >
                Edit Event
              </Button>
            )}
            {onDelete && event.type !== 'recurring' && (
              <Button
                color="failure"
                size="sm"
                onClick={() => onDelete(event)}
              >
                Delete Event
              </Button>
            )}
          </div>
          <Button
            color="gray"
            size="sm"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}
