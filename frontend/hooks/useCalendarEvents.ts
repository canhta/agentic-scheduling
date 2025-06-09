import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import type { CalendarEvent } from '@/lib/types';

interface UseCalendarEventsOptions {
  organizationId?: string;
  memberId?: string;
  staffId?: string;
  startDate?: Date;
  endDate?: Date;
}

export function useCalendarEvents(options: UseCalendarEventsOptions = {}) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!options.organizationId) {
        setEvents([]);
        return;
      }

      let data: CalendarEvent[] = [];
      
      // Default date range (current month if not provided)
      const startDate = options.startDate || (() => {
        const date = new Date();
        date.setDate(1);
        date.setHours(0, 0, 0, 0);
        return date;
      })();
      
      const endDate = options.endDate || (() => {
        const date = new Date();
        date.setMonth(date.getMonth() + 1, 0);
        date.setHours(23, 59, 59, 999);
        return date;
      })();
      
      if (options.memberId) {
        // Fetch member-specific calendar
        data = await api.getMemberCalendar(options.organizationId, options.memberId, {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        });
      } else if (options.staffId) {
        // Fetch staff-specific calendar
        data = await api.getStaffCalendar(options.organizationId, options.staffId, {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        });
      } else {
        // Fetch general calendar events
        data = await api.getCalendarEvents(options.organizationId, {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        });
      }
      
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch calendar events');
    } finally {
      setLoading(false);
    }
  }, [options.organizationId, options.memberId, options.staffId, options.startDate, options.endDate]);

  const createEvent = async (eventData: Omit<CalendarEvent, 'id'>) => {
    try {
      // Note: Create calendar event API endpoint might not exist yet
      // This simulates creation until the backend API is implemented
      const newEvent: CalendarEvent = {
        ...eventData,
        id: `event_${Date.now()}`,
      };
      setEvents(prev => [...prev, newEvent]);
      return newEvent;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create event');
      throw err;
    }
  };

  const updateEvent = async (event: CalendarEvent) => {
    try {
      // Note: Update calendar event API endpoint might not exist yet
      // This simulates update until the backend API is implemented
      setEvents(prev => prev.map(e => e.id === event.id ? event : e));
      return event;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update event');
      throw err;
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      // Note: Delete calendar event API endpoint might not exist yet
      // This simulates deletion until the backend API is implemented
      setEvents(prev => prev.filter(e => e.id !== eventId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete event');
      throw err;
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    loading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
    refetch: fetchEvents,
  };
}
