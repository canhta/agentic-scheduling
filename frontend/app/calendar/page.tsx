'use client';

import { useState } from 'react';
import { Calendar } from '@/components/calendar/Calendar';
import { EventDetailsModal } from '@/components/calendar/EventDetailsModal';
import { mockCalendarEvents } from '@/components/calendar/mock-data';
import type { CalendarEvent } from '@/lib/types';

export default function CalendarPage() {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleDateSelect = (date: Date) => {
    console.log('Date selected:', date);
    // Here you could open a "Create Event" modal or navigate to event creation
  };

  const handleEventDrop = (event: CalendarEvent, newStart: Date, newEnd: Date) => {
    console.log('Event dropped:', { event, newStart, newEnd });
    // Here you would update the event in your data store
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleEditEvent = (event: CalendarEvent) => {
    console.log('Edit event:', event);
    // Here you would open an edit form or navigate to edit page
    handleCloseModal();
  };

  const handleDeleteEvent = (event: CalendarEvent) => {
    console.log('Delete event:', event);
    // Here you would show a confirmation dialog and delete the event
    handleCloseModal();
  };

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
          events={mockCalendarEvents}
          onEventClick={handleEventClick}
          onDateSelect={handleDateSelect}
          onEventDrop={handleEventDrop}
          height="calc(100vh - 200px)"
          className="shadow-sm"
        />

        {/* Event Details Modal */}
        <EventDetailsModal
          event={selectedEvent}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onEdit={handleEditEvent}
          onDelete={handleDeleteEvent}
        />
      </div>
    </div>
  );
}
