'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Card, Button, Badge, Tabs, TabItem, Select, TextInput, Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell } from 'flowbite-react';
import { HiCalendar, HiViewList, HiViewGrid, HiSearch, HiFilter, HiPlus, HiEye, HiPencil, HiX, HiUser, HiClock, HiLocationMarker } from 'react-icons/hi';
import { Calendar } from '@/components/calendar/Calendar';
import { useCalendarEvents, useBookings } from '@/hooks';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import type { CalendarEvent } from '@/lib/types';

export type ViewMode = 'calendar' | 'list' | 'table';
export type UserContext = 'admin' | 'member';

interface SchedulingDashboardProps {
  userContext: UserContext;
  organizationId?: string;
  memberId?: string; // For member-specific views
  className?: string;
}

export function SchedulingDashboard({ 
  userContext, 
  organizationId, 
  memberId,
  className = '' 
}: SchedulingDashboardProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [activeTab, setActiveTab] = useState(0);

  // Use API hooks instead of mock data
  const { 
    events, 
    loading: eventsLoading, 
    error: eventsError,
    createEvent,
    updateEvent,
    deleteEvent,
    refetch: refetchEvents
  } = useCalendarEvents({ 
    organizationId, 
    memberId: userContext === 'member' ? memberId : undefined 
  });

  const {
    bookings,
    loading: bookingsLoading,
    error: bookingsError,
    createBooking,
    updateBooking,
    cancelBooking
  } = useBookings({ organizationId, memberId });

  const loading = eventsLoading || bookingsLoading;
  const error = eventsError || bookingsError;

  // Filter events based on user context and filters
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      // Member-specific filtering
      if (userContext === 'member' && memberId) {
        // Only show events for this specific member
        if (event.memberId !== memberId) return false;
      }

      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          event.title.toLowerCase().includes(searchLower) ||
          (event.staffName && event.staffName.toLowerCase().includes(searchLower)) ||
          (event.resourceName && event.resourceName.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }

      // Status filter
      if (statusFilter !== 'all' && event.status !== statusFilter) {
        return false;
      }

      // Date filter
      if (dateFilter !== 'all') {
        const eventDate = new Date(event.start);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (dateFilter === 'today') {
          const tomorrow = new Date(today);
          tomorrow.setDate(today.getDate() + 1);
          if (eventDate < today || eventDate >= tomorrow) return false;
        } else if (dateFilter === 'upcoming') {
          if (eventDate < today) return false;
        } else if (dateFilter === 'past') {
          if (eventDate >= today) return false;
        }
      }

      // Service filter (for admin view)
      if (userContext === 'admin' && serviceFilter !== 'all' && event.serviceId !== serviceFilter) {
        return false;
      }

      return true;
    });
  }, [events, userContext, memberId, searchTerm, statusFilter, dateFilter, serviceFilter]);

  // Split events for member view
  const upcomingEvents = filteredEvents.filter(event => new Date(event.start) >= new Date());
  const pastEvents = filteredEvents.filter(event => new Date(event.start) < new Date());

  // Event handlers - now using API hooks
  const handleEventClick = useCallback((event: CalendarEvent) => {
    // Handle event details modal or navigation
    console.log('Event clicked:', event);
  }, []);

  const handleEventCreate = useCallback(async (eventData: Omit<CalendarEvent, 'id'>) => {
    try {
      await createEvent(eventData);
      // Event is automatically added to the events state via the hook
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  }, [createEvent]);

  const handleEventUpdate = useCallback(async (event: CalendarEvent) => {
    try {
      await updateEvent(event);
      // Event is automatically updated in the events state via the hook
    } catch (error) {
      console.error('Failed to update event:', error);
    }
  }, [updateEvent]);

  const handleEventDelete = useCallback(async (event: CalendarEvent, deleteAll?: boolean) => {
    try {
      if (deleteAll && event.recurringScheduleId) {
        // Handle recurring event deletion - you might need to add this to the API
        await deleteEvent(event.id);
      } else {
        await deleteEvent(event.id);
      }
      // Event is automatically removed from the events state via the hook
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  }, [deleteEvent]);

  const handleEventDrop = useCallback(async (event: CalendarEvent, newStart: Date, newEnd: Date) => {
    try {
      const updatedEvent = { 
        ...event, 
        start: newStart.toISOString(), 
        end: newEnd.toISOString() 
      };
      await updateEvent(updatedEvent);
    } catch (error) {
      console.error('Failed to update event:', error);
    }
  }, [updateEvent]);

  const handleEventResize = useCallback(async (event: CalendarEvent, newStart: Date, newEnd: Date) => {
    try {
      const updatedEvent = { 
        ...event, 
        start: newStart.toISOString(), 
        end: newEnd.toISOString() 
      };
      await updateEvent(updatedEvent);
    } catch (error) {
      console.error('Failed to update event:', error);
    }
  }, [updateEvent]);

  const formatDateTime = (dateInput: string | Date) => {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      })
    };
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return <Badge color="gray">Unknown</Badge>;
    
    const statusConfig = {
      CONFIRMED: { color: 'success', label: 'Confirmed' },
      PENDING: { color: 'warning', label: 'Pending' },
      CANCELLED_BY_MEMBER: { color: 'failure', label: 'Cancelled' },
      CANCELLED_BY_ADMIN: { color: 'failure', label: 'Cancelled' },
      COMPLETED: { color: 'info', label: 'Completed' },
      NO_SHOW: { color: 'gray', label: 'No Show' },
    } as const;

    const config = statusConfig[status as keyof typeof statusConfig] || { color: 'gray', label: status };
    return <Badge color={config.color}>{config.label}</Badge>;
  };

  // Show loading state
  if (loading) {
    return (
      <Card className={className}>
        <div className="flex items-center justify-center p-8">
          <LoadingSpinner size="lg" />
          <span className="ml-3 text-gray-600">Loading events...</span>
        </div>
      </Card>
    );
  }

  // Show error state
  if (error) {
    return (
      <Card className={className}>
        <div className="text-center p-8">
          <div className="text-red-600 mb-4">Error loading events: {error}</div>
          <Button onClick={() => refetchEvents()} color="blue">
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  const renderMemberView = () => (
    <div className="space-y-6">
      <Tabs aria-label="Member Dashboard" onActiveTabChange={setActiveTab}>
        <TabItem active={activeTab === 0} title="Upcoming Sessions">
          <div className="space-y-4">
            {upcomingEvents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No upcoming sessions scheduled
              </div>
            ) : (
              upcomingEvents.map((event) => {
                const { date, time } = formatDateTime(event.start);
                return (
                  <Card key={event.id} className="hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {event.title}
                        </h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <HiClock className="w-4 h-4" />
                            <span>{date} at {time}</span>
                          </div>
                          {event.resourceName && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <HiLocationMarker className="w-4 h-4" />
                              <span>{event.resourceName}</span>
                            </div>
                          )}
                          {event.staffName && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <HiUser className="w-4 h-4" />
                              <span>with {event.staffName}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {getStatusBadge(event.status)}
                        <div className="flex gap-2">
                          <Button size="xs" color="gray" onClick={() => handleEventClick(event)}>
                            <HiEye className="w-3 h-3" />
                          </Button>
                          {event.status === 'CONFIRMED' && (
                            <Button
                              size="xs"
                              color="failure"
                              onClick={() => handleEventDelete(event)}
                            >
                              <HiX className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </TabItem>
        <TabItem active={activeTab === 1} title="Session History">
          <div className="space-y-4">
            {pastEvents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No past sessions found
              </div>
            ) : (
              pastEvents.map((event) => {
                const { date, time } = formatDateTime(event.start);
                return (
                  <Card key={event.id} className="opacity-75">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">
                          {event.title}
                        </h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <HiClock className="w-4 h-4" />
                            <span>{date} at {time}</span>
                          </div>
                          {event.staffName && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <HiUser className="w-4 h-4" />
                              <span>with {event.staffName}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {getStatusBadge(event.status)}
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </TabItem>
      </Tabs>
    </div>
  );

  const renderAdminView = () => (
    <div className="space-y-6">
      {/* Filters and Controls */}
      <Card>
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative">
              <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <TextInput
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PENDING">Pending</option>
              <option value="CANCELLED_BY_MEMBER">Cancelled by Member</option>
              <option value="CANCELLED_BY_ADMIN">Cancelled by Admin</option>
              <option value="COMPLETED">Completed</option>
              <option value="NO_SHOW">No Show</option>
            </Select>

            <Select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </Select>

            <Select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
            >
              <option value="all">All Services</option>
              <option value="yoga">Yoga Classes</option>
              <option value="fitness">Fitness Training</option>
              <option value="martial-arts">Martial Arts</option>
              <option value="consultation">Consultation</option>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button
              color={viewMode === 'calendar' ? 'blue' : 'gray'}
              onClick={() => setViewMode('calendar')}
              className="rounded-none border-0 border-r"
            >
              <HiCalendar className="w-4 h-4 mr-2" />
              Calendar
            </Button>
            <Button
              color={viewMode === 'list' ? 'blue' : 'gray'}
              onClick={() => setViewMode('list')}
              className="rounded-none border-0 border-r"
            >
              <HiViewList className="w-4 h-4 mr-2" />
              List
            </Button>
            <Button
              color={viewMode === 'table' ? 'blue' : 'gray'}
              onClick={() => setViewMode('table')}
              className="rounded-none border-0 border-l"
            >
              <HiViewGrid className="w-4 h-4 mr-2" />
              Table
            </Button>
          </div>
        </div>
      </Card>

      {/* Content based on view mode */}
      {viewMode === 'calendar' && (
        <Calendar
          organizationId={organizationId}
          events={filteredEvents}
          loading={loading}
          onEventClick={handleEventClick}
          onEventCreate={handleEventCreate}
          onEventUpdate={handleEventUpdate}
          onEventDelete={handleEventDelete}
          onEventDrop={handleEventDrop}
          onEventResize={handleEventResize}
        />
      )}

      {viewMode === 'list' && (
        <Card>
          <div className="space-y-4">
            {filteredEvents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No events found matching your filters
              </div>
            ) : (
              filteredEvents.map((event) => {
                const { date, time } = formatDateTime(event.start);
                return (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{event.title}</h3>
                      <div className="text-sm text-gray-600 mt-1">
                        {date} at {time}
                        {event.staffName && ` • ${event.staffName}`}
                        {event.resourceName && ` • ${event.resourceName}`}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(event.status)}
                      <div className="flex gap-2">
                        <Button size="xs" color="gray" onClick={() => handleEventClick(event)}>
                          <HiEye className="w-3 h-3" />
                        </Button>
                        <Button size="xs" color="gray">
                          <HiPencil className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      )}

      {viewMode === 'table' && (
        <Card>
          <Table>
            <TableHead>
              <TableHeadCell>Event</TableHeadCell>
              <TableHeadCell>Date & Time</TableHeadCell>
              <TableHeadCell>Staff</TableHeadCell>
              <TableHeadCell>Location</TableHeadCell>
              <TableHeadCell>Status</TableHeadCell>
              <TableHeadCell>Actions</TableHeadCell>
            </TableHead>
            <TableBody>
              {filteredEvents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No events found matching your filters
                  </TableCell>
                </TableRow>
              ) : (
                filteredEvents.map((event) => {
                  const { date, time } = formatDateTime(event.start);
                  return (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">{event.title}</TableCell>
                      <TableCell>
                        <div>
                          <div>{date}</div>
                          <div className="text-sm text-gray-500">{time}</div>
                        </div>
                      </TableCell>
                      <TableCell>{event.staffName || '-'}</TableCell>
                      <TableCell>{event.resourceName || '-'}</TableCell>
                      <TableCell>{getStatusBadge(event.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="xs" color="gray" onClick={() => handleEventClick(event)}>
                            <HiEye className="w-3 h-3" />
                          </Button>
                          <Button size="xs" color="gray">
                            <HiPencil className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {userContext === 'member' ? renderMemberView() : renderAdminView()}
    </div>
  );
}