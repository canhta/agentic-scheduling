'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { createCalendar, destroyCalendar, DayGrid, TimeGrid, ResourceTimeGrid, List, ResourceTimeline, Interaction } from '@event-calendar/core';
import { Card } from 'flowbite-react';
import { CalendarToolbar, type CalendarView } from './CalendarToolbar';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EventFormModal } from './EventFormModal';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { mockCalendarEvents, mockResources } from './mock-data';
import type { CalendarEvent } from '@/lib/types';
import '@event-calendar/core/index.css';

interface CalendarProps {
  organizationId?: string;
  events?: CalendarEvent[];
  loading?: boolean;
  onEventClick?: (event: CalendarEvent) => void;
  onDateSelect?: (date: Date) => void;
  onEventDrop?: (event: CalendarEvent, newStart: Date, newEnd: Date) => void;
  onEventResize?: (event: CalendarEvent, newStart: Date, newEnd: Date) => void;
  onEventCreate?: (event: Omit<CalendarEvent, 'id'>) => void;
  onEventUpdate?: (event: CalendarEvent) => void;
  onEventDelete?: (event: CalendarEvent, deleteAll?: boolean) => void;
  className?: string;
  height?: string;
  initialView?: CalendarView;
}

export function Calendar({
  organizationId,
  events = mockCalendarEvents,
  loading = false,
  onEventClick,
  onDateSelect,
  onEventDrop,
  onEventResize,
  onEventCreate,
  onEventUpdate,
  onEventDelete,
  className = '',
  height = '600px',
  initialView = 'dayGridMonth',
}: CalendarProps) {
  const calendarRef = useRef<HTMLDivElement>(null);
  const [calendar, setCalendar] = useState<any>(null);
  const [currentView, setCurrentView] = useState<CalendarView>(initialView);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedResource, setSelectedResource] = useState<string>('');
  
  // Modal states
  const [eventFormModal, setEventFormModal] = useState({
    isOpen: false,
    event: null as CalendarEvent | null,
    selectedDate: null as Date | null,
    selectedStartTime: null as Date | null,
    selectedEndTime: null as Date | null,
  });
  
  const [deleteConfirmModal, setDeleteConfirmModal] = useState({
    isOpen: false,
    event: null as CalendarEvent | null,
  });

  // Convert CalendarEvent to @event-calendar/core format
  const formatEventsForCalendar = useCallback((events: CalendarEvent[]) => {
    return events.map(event => ({
      id: event.id,
      title: event.title,
      start: new Date(event.start),
      end: new Date(event.end),
      allDay: event.allDay,
      backgroundColor: event.color || '#3b82f6',
      borderColor: event.color || '#3b82f6',
      textColor: '#ffffff',
      extendedProps: {
        ...event,
        description: `${event.instructor ? `Instructor: ${event.instructor}` : ''}${event.capacity ? `\nCapacity: ${event.booked}/${event.capacity}` : ''}${event.location ? `\nLocation: ${event.location}` : ''}`,
      },
      resourceId: currentView.includes('resource') ? event.resource : undefined,
    }));
  }, [currentView]);

  // Filter events by resource if selected
  const filteredEvents = selectedResource
    ? events.filter(event => event.resource === selectedResource)
    : events;

  // Get plugins needed for the current view
  const getPlugins = useCallback(() => {
    const plugins = [Interaction]; // Always include Interaction plugin
    
    if (currentView === 'dayGridMonth') {
      plugins.push(DayGrid);
    } else if (currentView === 'timeGridWeek' || currentView === 'timeGridDay') {
      plugins.push(TimeGrid);
    } else if (currentView === 'resourceTimeGridWeek' || currentView === 'resourceTimeGridDay') {
      plugins.push(ResourceTimeGrid);
    } else if (currentView === 'resourceTimelineWeek' || currentView === 'resourceTimelineDay') {
      plugins.push(ResourceTimeline);
    } else if (currentView === 'listWeek' || currentView === 'listDay') {
      plugins.push(List);
    }
    
    return plugins;
  }, [currentView]);

  // Calendar configuration
  const getCalendarOptions = useCallback(() => {
    const baseOptions = {
      view: currentView,
      height,
      events: formatEventsForCalendar(filteredEvents),
      headerToolbar: {
        start: '',
        center: '',
        end: '',
      }, // We use our custom toolbar
      dayMaxEvents: true,
      moreLinkText: 'more',
      eventDisplay: 'block',
      displayEventTime: true,
      eventTimeFormat: {
        hour: 'numeric' as const,
        minute: '2-digit' as const,
        hour12: true,
      },
      slotLabelFormat: {
        hour: 'numeric' as const,
        minute: '2-digit' as const,
        hour12: true,
      },
      
      // Interaction settings
      selectable: true,
      editable: true,
      eventResizable: true,
      eventDraggable: true,
      dragRevertDuration: 300,
      
      // Event handlers
      eventClick: (info: any) => {
        if (info.event.extendedProps) {
          const event = info.event.extendedProps as CalendarEvent;
          // Show event details or edit form
          setEventFormModal({
            isOpen: true,
            event,
            selectedDate: null,
            selectedStartTime: null,
            selectedEndTime: null,
          });
          
          if (onEventClick) {
            onEventClick(event);
          }
        }
      },
      
      dateClick: (info: any) => {
        if (onDateSelect) {
          onDateSelect(info.date);
        }
      },
      
      select: (info: any) => {
        // Handle date range selection for creating new events
        setEventFormModal({
          isOpen: true,
          event: null,
          selectedDate: info.start,
          selectedStartTime: info.start,
          selectedEndTime: info.end,
        });
      },
      
      eventDrop: (info: any) => {
        if (onEventDrop && info.event.extendedProps) {
          onEventDrop(
            info.event.extendedProps as CalendarEvent,
            info.event.start,
            info.event.end
          );
        }
      },
      
      eventResize: (info: any) => {
        if (onEventResize && info.event.extendedProps) {
          onEventResize(
            info.event.extendedProps as CalendarEvent,
            info.event.start,
            info.event.end
          );
        }
      },
      
      // Drag and drop constraints
      eventAllow: (dropInfo: any, draggedEvent: any) => {
        // Allow dropping only during business hours
        return true; // You can add more complex logic here
      },
      
      selectAllow: (selectInfo: any) => {
        // Allow selection only during business hours
        return true; // You can add more complex logic here
      },
      
      // Business hours
      businessHours: {
        daysOfWeek: [1, 2, 3, 4, 5, 6, 0], // Monday - Sunday
        startTime: '06:00',
        endTime: '22:00',
      },
      
      // Time grid specific options (only apply to time views)
      ...(currentView.includes('timeGrid') && {
        slotMinTime: '06:00:00',
        slotMaxTime: '22:00:00',
        slotDuration: '00:30:00',
        slotLabelInterval: '01:00:00',
        nowIndicator: true,
        scrollTime: '08:00:00',
        selectMirror: true,
        unselectAuto: false,
      }),
    };

    // Add resource-specific options
    if (currentView.includes('resource')) {
      return {
        ...baseOptions,
        resources: mockResources,
        resourceAreaHeaderContent: 'Resources',
        resourceAreaWidth: '200px',
        filterResourcesWithEvents: false,
      };
    }

    return baseOptions;
  }, [currentView, height, formatEventsForCalendar, filteredEvents, onEventClick, onDateSelect, onEventDrop, onEventResize]);

  // Initialize calendar once
  useEffect(() => {
    if (!calendarRef.current) return;

    const plugins = getPlugins();
    const options = getCalendarOptions();
    const newCalendar = createCalendar(calendarRef.current, plugins, options);
    setCalendar(newCalendar);

    return () => {
      destroyCalendar(newCalendar);
    };
  }, [getPlugins, getCalendarOptions]);

  // Update calendar options when they change
  useEffect(() => {
    if (calendar) {
      // Update view
      calendar.setOption('view', currentView);
      
      // Update events
      calendar.setOption('events', formatEventsForCalendar(filteredEvents));
      
      // Only set resource options for resource views
      if (currentView.includes('resource')) {
        calendar.setOption('resources', mockResources);
        calendar.setOption('resourceAreaHeaderContent', 'Resources');
        calendar.setOption('resourceAreaWidth', '200px');
      }
    }
  }, [calendar, currentView, filteredEvents, formatEventsForCalendar]);

  // Modal handlers
  const handleEventSave = (eventData: Omit<CalendarEvent, 'id'> & { id?: string }) => {
    if (eventData.id) {
      // Update existing event
      if (onEventUpdate) {
        onEventUpdate({
          ...eventData,
          id: eventData.id,
        } as CalendarEvent);
      }
    } else {
      // Create new event
      if (onEventCreate) {
        onEventCreate(eventData);
      }
    }
    setEventFormModal({ isOpen: false, event: null, selectedDate: null, selectedStartTime: null, selectedEndTime: null });
  };

  const handleEventDelete = (event: CalendarEvent, deleteAll?: boolean) => {
    if (onEventDelete) {
      onEventDelete(event, deleteAll);
    }
    setDeleteConfirmModal({ isOpen: false, event: null });
  };

  const handleEventClickInternal = (event: CalendarEvent) => {
    // Show event details or edit form
    setEventFormModal({
      isOpen: true,
      event,
      selectedDate: null,
      selectedStartTime: null,
      selectedEndTime: null,
    });
    
    if (onEventClick) {
      onEventClick(event);
    }
  };

  const handleDeleteEventClick = (event: CalendarEvent) => {
    setDeleteConfirmModal({
      isOpen: true,
      event,
    });
  };

  // Toolbar handlers
  const handleViewChange = (view: CalendarView) => {
    setCurrentView(view);
    // Only reset resource selection when switching away from resource views
    if (!view.includes('resource')) {
      setSelectedResource('');
    }
  };

  const handlePrevious = () => {
    if (calendar) {
      calendar.prev();
      // Get the new date from the calendar view
      const view = calendar.getView();
      setCurrentDate(view.currentStart || new Date());
    }
  };

  const handleNext = () => {
    if (calendar) {
      calendar.next();
      // Get the new date from the calendar view
      const view = calendar.getView();
      setCurrentDate(view.currentStart || new Date());
    }
  };

  const handleToday = () => {
    if (calendar) {
      const today = new Date();
      calendar.setOption('date', today);
      setCurrentDate(today);
    }
  };

  const handleResourceChange = (resourceId: string) => {
    setSelectedResource(resourceId);
  };

  if (loading) {
    return (
      <Card className={className}>
        <LoadingSpinner text="Loading calendar..." />
      </Card>
    );
  }

  return (
    <>
      <Card className={`overflow-hidden ${className}`}>
        <CalendarToolbar
          currentView={currentView}
          onViewChange={handleViewChange}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onToday={handleToday}
          currentDate={currentDate}
          selectedResource={selectedResource}
          resources={mockResources}
          onResourceChange={handleResourceChange}
        />
        
        <div className="calendar-container relative">
          <div ref={calendarRef} className="w-full ec-calendar" />
        </div>
      </Card>

      {/* Event Form Modal */}
      <EventFormModal
        event={eventFormModal.event}
        isOpen={eventFormModal.isOpen}
        onClose={() => setEventFormModal({ isOpen: false, event: null, selectedDate: null, selectedStartTime: null, selectedEndTime: null })}
        onSave={handleEventSave}
        selectedDate={eventFormModal.selectedDate}
        selectedStartTime={eventFormModal.selectedStartTime}
        selectedEndTime={eventFormModal.selectedEndTime}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        event={deleteConfirmModal.event}
        isOpen={deleteConfirmModal.isOpen}
        onClose={() => setDeleteConfirmModal({ isOpen: false, event: null })}
        onConfirm={handleEventDelete}
      />
    </>
  );
}
