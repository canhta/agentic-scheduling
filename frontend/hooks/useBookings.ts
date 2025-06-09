import { useState, useEffect, useCallback, useMemo } from 'react';
import { api } from '@/lib/api';
import type { BookingResponse, CreateBookingDto, UpdateBookingDto, CalendarEvent } from '@/lib/types';

interface UseBookingsOptions {
  organizationId?: string;
  memberId?: string;
  status?: string;
}

// Utility function to check if a string is a valid UUID
function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

// Valid booking status enum values
const VALID_BOOKING_STATUSES = [
  'CONFIRMED',
  'PENDING',
  'CANCELLED_BY_MEMBER',
  'CANCELLED_BY_STAFF',
  'NO_SHOW',
  'ATTENDED',
  'LATE_CANCELLED'
] as const;

type ValidBookingStatus = typeof VALID_BOOKING_STATUSES[number];

// Function to validate CreateBookingDto before sending to API
function validateCreateBookingDto(data: CreateBookingDto): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate required fields
  if (!data.serviceId) {
    errors.push('Service ID is required');
  } else if (!isValidUUID(data.serviceId)) {
    errors.push('Service ID must be a valid UUID');
  }

  if (!data.userId) {
    errors.push('User ID is required');
  } else if (!isValidUUID(data.userId)) {
    errors.push('User ID must be a valid UUID');
  }

  if (!data.startTime) {
    errors.push('Start time is required');
  }

  if (!data.endTime) {
    errors.push('End time is required');
  }

  // Validate optional UUID fields
  if (data.locationId && !isValidUUID(data.locationId)) {
    errors.push('Location ID must be a valid UUID if provided');
  }

  if (data.resourceId && !isValidUUID(data.resourceId)) {
    errors.push('Resource ID must be a valid UUID if provided');
  }

  if (data.recurringScheduleId && !isValidUUID(data.recurringScheduleId)) {
    errors.push('Recurring schedule ID must be a valid UUID if provided');
  }

  // Validate status enum
  if (data.status && !VALID_BOOKING_STATUSES.includes(data.status as ValidBookingStatus)) {
    errors.push(`Status must be one of: ${VALID_BOOKING_STATUSES.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Function to validate UpdateBookingDto before sending to API
function validateUpdateBookingDto(data: UpdateBookingDto): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate status enum if provided
  if (data.status && !VALID_BOOKING_STATUSES.includes(data.status as ValidBookingStatus)) {
    errors.push(`Status must be one of: ${VALID_BOOKING_STATUSES.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Transform booking response to calendar event format
function transformBookingToCalendarEvent(booking: BookingResponse): CalendarEvent {
  // Extract user details if available
  const user = (booking as any).user;
  const service = (booking as any).service;
  const resource = (booking as any).resource;
  const staff = (booking as any).staff;

  const memberName = user 
    ? `${user.firstName} ${user.lastName}`.trim()
    : 'Unknown Member';

  const staffName = staff
    ? `${staff.firstName} ${staff.lastName}`.trim()
    : undefined;

  return {
    id: booking.id,
    title: service?.name || 'Unknown Service',
    start: booking.startTime,
    end: booking.endTime,
    allDay: booking.allDay,
    type: 'APPOINTMENT' as const, // Default type, could be enhanced based on service type
    status: booking.status,
    memberId: booking.userId,
    memberName,
    staffId: staff?.id,
    staffName,
    serviceId: booking.serviceId,
    serviceName: service?.name || 'Unknown Service',
    resourceId: booking.resourceId,
    resourceName: resource?.name,
    notes: booking.notes,
    isRecurring: !!booking.recurringScheduleId,
    recurringScheduleId: booking.recurringScheduleId,
    // Add bookingId for backward compatibility and to support booking operations
    bookingId: booking.id,
  };
}

export function useBookings(options: UseBookingsOptions = {}) {
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    if (!options.organizationId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await api.getBookings(options.organizationId, {
        userId: options.memberId,
        status: options.status,
      });
      setBookings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  }, [options.organizationId, options.memberId, options.status]);

  const createBooking = async (bookingData: CreateBookingDto) => {
    if (!options.organizationId) {
      throw new Error('Organization ID is required');
    }

    // Validate booking data
    const { isValid, errors } = validateCreateBookingDto(bookingData);
    if (!isValid) {
      throw new Error(`Invalid booking data: ${errors.join(', ')}`);
    }

    try {
      const newBooking = await api.createBooking(options.organizationId, bookingData);
      setBookings(prev => [...prev, newBooking]);
      return newBooking;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking');
      throw err;
    }
  };

  const updateBooking = async (id: string, bookingData: UpdateBookingDto) => {
    if (!options.organizationId) {
      throw new Error('Organization ID is required');
    }

    // Validate booking data
    const { isValid, errors } = validateUpdateBookingDto(bookingData);
    if (!isValid) {
      throw new Error(`Invalid booking data: ${errors.join(', ')}`);
    }

    try {
      const updatedBooking = await api.updateBooking(options.organizationId, id, bookingData);
      setBookings(prev => prev.map(booking => 
        booking.id === id ? updatedBooking : booking
      ));
      return updatedBooking;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update booking');
      throw err;
    }
  };

  const cancelBooking = async (id: string) => {
    if (!options.organizationId) {
      throw new Error('Organization ID is required');
    }

    try {
      await api.cancelBooking(options.organizationId, id);
      setBookings(prev => prev.map(booking => 
        booking.id === id ? { ...booking, status: 'CANCELLED_BY_MEMBER' as const } : booking
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel booking');
      throw err;
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Transform bookings to calendar events
  const events = useMemo(() => 
    bookings.map(transformBookingToCalendarEvent), 
    [bookings]
  );

  return {
    bookings,
    events, // Add calendar events derived from bookings
    loading,
    error,
    createBooking,
    updateBooking,
    cancelBooking,
    refetch: fetchBookings,
  };
}
