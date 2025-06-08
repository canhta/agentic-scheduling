'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { createCalendar, destroyCalendar, DayGrid, TimeGrid, ResourceTimeGrid, List, ResourceTimeline } from '@event-calendar/core';
import { Card } from 'flowbite-react';
import { CalendarToolbar, type CalendarView } from './CalendarToolbar';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
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
  className = '',
  height = '600px',
  initialView = 'dayGridMonth',
}: CalendarProps) {
  const calendarRef = useRef<HTMLDivElement>(null);
  const [calendar, setCalendar] = useState<any>(null);
  const [currentView, setCurrentView] = useState<CalendarView>(initialView);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedResource, setSelectedResource] = useState<string>('');

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
    const plugins = [];
    
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
      // Event handlers
      eventClick: (info: any) => {
        if (onEventClick && info.event.extendedProps) {
          onEventClick(info.event.extendedProps as CalendarEvent);
        }
      },
      dateClick: (info: any) => {
        if (onDateSelect) {
          onDateSelect(info.date);
        }
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
  }, [currentView, height, formatEventsForCalendar, filteredEvents, onEventClick, onDateSelect, onEventDrop]);

  // Initialize calendar once
  useEffect(() => {
    if (!calendarRef.current) return;

    const plugins = [DayGrid, TimeGrid, ResourceTimeGrid, List, ResourceTimeline];
    const options = getCalendarOptions();
    const newCalendar = createCalendar(calendarRef.current, plugins, options);
    setCalendar(newCalendar);

    return () => {
      destroyCalendar(newCalendar);
    };
  }, [getCalendarOptions]); // Include the dependency

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
      
      <div className="calendar-container">
        <div ref={calendarRef} className="w-full" />
      </div>
    </Card>
  );
}
