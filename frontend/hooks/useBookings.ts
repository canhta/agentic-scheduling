import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import type { BookingResponse, CreateBookingDto, UpdateBookingDto } from '@/lib/types';

interface UseBookingsOptions {
  organizationId?: string;
  memberId?: string;
  status?: string;
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

  return {
    bookings,
    loading,
    error,
    createBooking,
    updateBooking,
    cancelBooking,
    refetch: fetchBookings,
  };
}
