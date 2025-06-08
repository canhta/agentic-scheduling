'use client';

import { useState, useCallback } from 'react';
import { Calendar } from '@/components/calendar/Calendar';
import { mockCalendarEvents } from '@/components/calendar/mock-data';
import type { CalendarEvent } from '@/lib/types';

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>(mockCalendarEvents);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEventClick = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  }, []);

  const handleDateSelect = useCallback((date: Date) => {
    console.log('Date selected:', date);
    // This is now handled by the drag-to-create functionality in the Calendar component
  }, []);

  const handleEventDrop = useCallback((event: CalendarEvent, newStart: Date, newEnd: Date) => {
    console.log('Event dropped:', { event, newStart, newEnd });
    
    // Update the event in the events array
    setEvents(prevEvents => 
      prevEvents.map(e => 
        e.id === event.id 
          ? { ...e, start: newStart.toISOString(), end: newEnd.toISOString() }
          : e
      )
    );
  }, []);

  const handleEventResize = useCallback((event: CalendarEvent, newStart: Date, newEnd: Date) => {
    console.log('Event resized:', { event, newStart, newEnd });
    
    // Update the event in the events array
    setEvents(prevEvents => 
      prevEvents.map(e => 
        e.id === event.id 
          ? { ...e, start: newStart.toISOString(), end: newEnd.toISOString() }
          : e
      )
    );
  }, []);

  const handleEventCreate = useCallback((eventData: Omit<CalendarEvent, 'id'>) => {
    console.log('Creating new event:', eventData);
    
    const newEvent: CalendarEvent = {
      ...eventData,
      id: `event_${Date.now()}`, // Generate a simple ID
    };
    
    setEvents(prevEvents => [...prevEvents, newEvent]);
  }, []);

  const handleEventUpdate = useCallback((event: CalendarEvent) => {
    console.log('Updating event:', event);
    
    setEvents(prevEvents => 
      prevEvents.map(e => 
        e.id === event.id ? event : e
      )
    );
  }, []);

  const handleEventDelete = useCallback((event: CalendarEvent, deleteAll?: boolean) => {
    console.log('Deleting event:', { event, deleteAll });
    
    if (deleteAll && event.recurringScheduleId) {
      // Delete all events in the recurring series
      setEvents(prevEvents => 
        prevEvents.filter(e => e.recurringScheduleId !== event.recurringScheduleId)
      );
    } else {
      // Delete just this event
      setEvents(prevEvents => 
        prevEvents.filter(e => e.id !== event.id)
      );
    }
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  }, []);

  const handleEditEvent = useCallback((event: CalendarEvent) => {
    console.log('Edit event:', event);
    // The edit functionality is now handled directly in the Calendar component
    handleCloseModal();
  }, [handleCloseModal]);

  const handleDeleteEventModal = useCallback((event: CalendarEvent) => {
    console.log('Delete event:', event);
    // The delete functionality is now handled directly in the Calendar component
    handleCloseModal();
  }, [handleCloseModal]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Gym Schedule Calendar
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage classes, bookings, and facility schedules
          </p>
        </div>

        {/* Calendar Component */}
        <Calendar
          organizationId="org-1"
          events={events}
          onEventClick={handleEventClick}
          onDateSelect={handleDateSelect}
          onEventDrop={handleEventDrop}
          onEventResize={handleEventResize}
          onEventCreate={handleEventCreate}
          onEventUpdate={handleEventUpdate}
          onEventDelete={handleEventDelete}
          height="calc(100vh - 200px)"
          className="shadow-sm"
        />
      </div>
    </div>
  );
}
