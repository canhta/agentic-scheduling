'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { createCalendar, destroyCalendar, DayGrid, TimeGrid, ResourceTimeGrid, List, ResourceTimeline, Interaction } from '@event-calendar/core';
import { Card } from 'flowbite-react';
import { CalendarToolbar, type CalendarView } from './CalendarToolbar';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EventFormModal } from './EventFormModal';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { ApiClient } from '@/lib/api';
import type { CalendarEvent, ResourceResponse } from '@/lib/types';
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
  events = [],
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
  const [resources, setResources] = useState<Array<{ id: string; title: string }>>([]);
  const [resourcesLoading, setResourcesLoading] = useState(false);
  
  // Initialize API client
  const api = useMemo(() => new ApiClient(), []);
  
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

  // Fetch resources for the organization
  const fetchResources = useCallback(async () => {
    if (!organizationId) {
      setResources([]);
      return;
    }

    try {
      setResourcesLoading(true);
      const organizationResources = await api.getOrganizationResources(organizationId);
      
      // Format resources for calendar library (expects id and title properties)
      const formattedResources = organizationResources.map((resource: ResourceResponse) => ({
        id: resource.id,
        title: resource.name,
      }));
      
      setResources(formattedResources);
    } catch (error) {
      console.error('Failed to fetch resources:', error);
      setResources([]);
    } finally {
      setResourcesLoading(false);
    }
  }, [organizationId, api]);

  // Fetch resources when organizationId changes
  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  // Convert CalendarEvent to @event-calendar/core format
  const formatEventsForCalendar = useCallback((events: CalendarEvent[]) => {
    return events.map(event => {
      // Map color to CSS class for better styling
      const getEventClass = (color: string) => {
        const colorMap: { [key: string]: string } = {
          '#3b82f6': 'event-blue',
          '#ef4444': 'event-red',
          '#10b981': 'event-green',
          '#f59e0b': 'event-yellow',
          '#8b5cf6': 'event-purple',
          '#f97316': 'event-orange',
          '#06b6d4': 'event-cyan',
        };
        return colorMap[color] || 'event-blue';
      };

      return {
        id: event.id,
        title: event.title,
        start: new Date(event.start),
        end: new Date(event.end),
        allDay: event.allDay,
        backgroundColor: event.color || '#3b82f6',
        borderColor: 'transparent',
        textColor: event.color === '#f59e0b' ? '#374151' : '#ffffff',
        classNames: [getEventClass(event.color || '#3b82f6')],
        extendedProps: {
          ...event,
          description: `${event.instructor ? `Instructor: ${event.instructor}` : ''}${event.capacity ? `\nCapacity: ${event.booked}/${event.capacity}` : ''}${event.location ? `\nLocation: ${event.location}` : ''}`,
        },
        resourceId: currentView.includes('resource') ? event.resource : undefined,
      };
    });
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
      
      // Enhanced visual options for Google Calendar-like appearance
      dayMaxEvents: currentView === 'dayGridMonth' ? true : false,
      moreLinkText: (num: number) => `+${num} more`,
      eventDisplay: 'block',
      displayEventTime: currentView !== 'dayGridMonth',
      displayEventEnd: currentView.includes('timeGrid'),
      
      // Better time formatting
      eventTimeFormat: {
        hour: 'numeric' as const,
        minute: '2-digit' as const,
        hour12: true,
        omitZeroMinute: true,
      },
      slotLabelFormat: {
        hour: 'numeric' as const,
        minute: '2-digit' as const,
        hour12: true,
        omitZeroMinute: true,
      },
      
      // Enhanced day/date formatting
      dayHeaderFormat: currentView === 'dayGridMonth' 
        ? { weekday: 'short' as const }
        : { weekday: 'short' as const, month: 'numeric' as const, day: 'numeric' as const },
      
      // Interaction settings
      selectable: true,
      editable: true,
      eventResizable: true,
      eventDraggable: true,
      dragRevertDuration: 300,
      selectMirror: true,
      unselectAuto: false,
      
      // Enhanced visual feedback
      selectBackgroundColor: 'rgba(26, 115, 232, 0.1)',
      
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
      
      // Business hours for better UX
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
        allDaySlot: true,
        allDayContent: 'All day',
      }),
    };

    // Add resource-specific options
    if (currentView.includes('resource')) {
      return {
        ...baseOptions,
        resources: resources,
        resourceAreaHeaderContent: 'Resources',
        resourceAreaWidth: '200px',
        filterResourcesWithEvents: false,
        datesAboveResources: true,
      };
    }

    return baseOptions;
  }, [currentView, height, formatEventsForCalendar, filteredEvents, onEventClick, onDateSelect, onEventDrop, onEventResize, resources]);

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
        calendar.setOption('resources', resources);
        calendar.setOption('resourceAreaHeaderContent', 'Resources');
        calendar.setOption('resourceAreaWidth', '200px');
      }
    }
  }, [calendar, currentView, filteredEvents, formatEventsForCalendar, resources]);

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

  const handleCreateEvent = () => {
    setEventFormModal({
      isOpen: true,
      event: null,
      selectedDate: new Date(),
      selectedStartTime: new Date(),
      selectedEndTime: new Date(Date.now() + 60 * 60 * 1000), // 1 hour later
    });
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
      <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
        <CalendarToolbar
          currentView={currentView}
          onViewChange={handleViewChange}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onToday={handleToday}
          currentDate={currentDate}
          selectedResource={selectedResource}
          resources={resources}
          onResourceChange={handleResourceChange}
          onCreateEvent={handleCreateEvent}
        />
        
        <div className="relative">
          <div ref={calendarRef} className="w-full" />
        </div>
      </div>

      {/* Event Form Modal */}
      <EventFormModal
        event={eventFormModal.event}
        isOpen={eventFormModal.isOpen}
        onClose={() => setEventFormModal({ isOpen: false, event: null, selectedDate: null, selectedStartTime: null, selectedEndTime: null })}
        onSave={handleEventSave}
        selectedDate={eventFormModal.selectedDate}
        selectedStartTime={eventFormModal.selectedStartTime}
        selectedEndTime={eventFormModal.selectedEndTime}
        organizationId={organizationId}
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
