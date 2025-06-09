'use client';

import React, { useState, useCallback } from 'react';
import { Card, Button, Badge, Tabs, TabItem, Select, TextInput, Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell } from 'flowbite-react';
import { HiCalendar, HiViewList, HiViewGrid, HiSearch, HiFilter, HiPlus, HiEye, HiPencil, HiX, HiUser, HiClock, HiLocationMarker } from 'react-icons/hi';
import { Calendar } from '@/components/calendar/Calendar';
import { mockCalendarEvents } from '@/components/calendar/mock-data';
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
  const [events, setEvents] = useState<CalendarEvent[]>(mockCalendarEvents);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [activeTab, setActiveTab] = useState(0);

  // Filter events based on user context and filters
  const filteredEvents = events.filter(event => {
    // Member-specific filtering
    if (userContext === 'member' && memberId) {
      // Only show events for this specific member
      if (event.bookingId !== memberId) return false;
    }

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        event.title.toLowerCase().includes(searchLower) ||
        (event.instructor && event.instructor.toLowerCase().includes(searchLower)) ||
        (event.location && event.location.toLowerCase().includes(searchLower));
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

  // Split events for member view
  const upcomingEvents = filteredEvents.filter(event => new Date(event.start) >= new Date());
  const pastEvents = filteredEvents.filter(event => new Date(event.start) < new Date());

  // Event handlers
  const handleEventClick = useCallback((event: CalendarEvent) => {
    // Handle event details modal or navigation
    console.log('Event clicked:', event);
  }, []);

  const handleEventCreate = useCallback((eventData: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: `event_${Date.now()}`,
    };
    setEvents(prev => [...prev, newEvent]);
  }, []);

  const handleEventUpdate = useCallback((event: CalendarEvent) => {
    setEvents(prev => prev.map(e => e.id === event.id ? event : e));
  }, []);

  const handleEventDelete = useCallback((event: CalendarEvent, deleteAll?: boolean) => {
    if (deleteAll && event.recurringScheduleId) {
      setEvents(prev => prev.filter(e => e.recurringScheduleId !== event.recurringScheduleId));
    } else {
      setEvents(prev => prev.filter(e => e.id !== event.id));
    }
  }, []);

  const handleEventDrop = useCallback((event: CalendarEvent, newStart: Date, newEnd: Date) => {
    setEvents(prev => prev.map(e => 
      e.id === event.id 
        ? { ...e, start: newStart.toISOString(), end: newEnd.toISOString() }
        : e
    ));
  }, []);

  const handleEventResize = useCallback((event: CalendarEvent, newStart: Date, newEnd: Date) => {
    setEvents(prev => prev.map(e => 
      e.id === event.id 
        ? { ...e, start: newStart.toISOString(), end: newEnd.toISOString() }
        : e
    ));
  }, []);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
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
      confirmed: { color: 'success', label: 'Confirmed' },
      pending: { color: 'warning', label: 'Pending' },
      cancelled: { color: 'failure', label: 'Cancelled' },
      completed: { color: 'purple', label: 'Completed' },
      'no-show': { color: 'gray', label: 'No Show' },
      waitlisted: { color: 'info', label: 'Waitlisted' },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || { color: 'gray', label: status };
    return <Badge color={config.color as any}>{config.label}</Badge>;
  };

  const renderFilters = () => (
    <Card className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <TextInput
            type="text"
            placeholder={userContext === 'admin' ? "Search bookings, members, instructors..." : "Search classes or instructors..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={HiSearch}
          />
        </div>
        
        <div>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
            <option value="no-show">No Show</option>
            <option value="waitlisted">Waitlisted</option>
          </Select>
        </div>

        <div>
          <Select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </Select>
        </div>

        {userContext === 'admin' && (
          <div>
            <Select value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)}>
              <option value="all">All Services</option>
              <option value="yoga">Yoga Classes</option>
              <option value="fitness">Fitness Training</option>
              <option value="martial-arts">Martial Arts</option>
              <option value="swimming">Swimming</option>
            </Select>
          </div>
        )}
      </div>
    </Card>
  );

  const renderViewModeSelector = () => (
    <div className="flex items-center gap-4 mb-6">
      <span className="text-sm font-medium text-gray-700">View:</span>
      <div className="flex border border-gray-200 rounded-lg overflow-hidden">
        <Button
          size="sm"
          color={viewMode === 'calendar' ? 'blue' : 'light'}
          onClick={() => setViewMode('calendar')}
          className="rounded-none border-0"
        >
          <HiCalendar className="w-4 h-4 mr-2" />
          Calendar
        </Button>
        <Button
          size="sm"
          color={viewMode === 'list' ? 'blue' : 'light'}
          onClick={() => setViewMode('list')}
          className="rounded-none border-0 border-l"
        >
          <HiViewList className="w-4 h-4 mr-2" />
          List
        </Button>
        <Button
          size="sm"
          color={viewMode === 'table' ? 'blue' : 'light'}
          onClick={() => setViewMode('table')}
          className="rounded-none border-0 border-l"
        >
          <HiViewGrid className="w-4 h-4 mr-2" />
          Table
        </Button>
      </div>
    </div>
  );

  const renderCalendarView = () => (
    <Calendar
      organizationId={organizationId}
      events={filteredEvents}
      onEventClick={handleEventClick}
      onEventCreate={handleEventCreate}
      onEventUpdate={handleEventUpdate}
      onEventDelete={handleEventDelete}
      onEventDrop={handleEventDrop}
      onEventResize={handleEventResize}
      className="mb-6"
    />
  );

  const renderListView = () => {
    if (userContext === 'member') {
      // Member view with tabs for upcoming/past bookings
      return (
        <Tabs onActiveTabChange={setActiveTab}>
          <TabItem active={activeTab === 0} title={`Upcoming (${upcomingEvents.length})`}>
            <div className="space-y-4">
              {upcomingEvents.map((event) => {
                const { date, time } = formatDateTime(event.start);
                return (
                  <Card key={event.id} className="hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                          {getStatusBadge(event.status)}
                        </div>
                        
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <HiClock className="w-4 h-4" />
                            <span>{date} at {time}</span>
                            {event.instructor && (
                              <span className="text-sm text-gray-600">
                                with {event.instructor}
                              </span>
                            )}
                          </div>
                          
                          {event.location && (
                            <div className="flex items-center gap-2">
                              <HiLocationMarker className="w-4 h-4" />
                              <span>{event.location}</span>
                            </div>
                          )}
                          
                          {event.resource && (
                            <div className="flex items-center gap-2">
                              <HiUser className="w-4 h-4" />
                              <span>
                                {event.resource}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" outline onClick={() => handleEventClick(event)}>
                          <HiEye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
              {upcomingEvents.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No upcoming bookings found.
                </div>
              )}
            </div>
          </TabItem>
          
          <TabItem active={activeTab === 1} title={`Past (${pastEvents.length})`}>
            <div className="space-y-4">
              {pastEvents.map((event) => {
                const { date, time } = formatDateTime(event.start);
                return (
                  <Card key={event.id} className="hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                          {getStatusBadge(event.status)}
                        </div>
                        
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <HiClock className="w-4 h-4" />
                            <span>{date} at {time}</span>
                            {event.instructor && (
                              <span className="text-sm text-gray-600">
                                with {event.instructor}
                              </span>
                            )}
                          </div>
                          
                          {event.location && (
                            <div className="flex items-center gap-2">
                              <HiLocationMarker className="w-4 h-4" />
                              <span>{event.location}</span>
                            </div>
                          )}
                          
                          {event.resource && (
                            <div className="flex items-center gap-2">
                              <HiUser className="w-4 h-4" />
                              <span>
                                {event.resource}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" outline onClick={() => handleEventClick(event)}>
                          <HiEye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
              {pastEvents.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No past bookings found.
                </div>
              )}
            </div>
          </TabItem>
        </Tabs>
      );
    }

    // Admin list view
    return (
      <div className="space-y-4">
        {filteredEvents.map((event) => {
          const { date, time } = formatDateTime(event.start);
          return (
            <Card key={event.id} className="hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                    {getStatusBadge(event.status)}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <HiClock className="w-4 h-4" />
                        <span>{date} at {time}</span>
                      </div>
                      
                      {event.location && (
                        <div className="flex items-center gap-2">
                          <HiLocationMarker className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                      )}
                      
                      {event.instructor && (
                        <div className="flex items-center gap-2">
                          <HiUser className="w-4 h-4" />
                          <span>Instructor: {event.instructor}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      {event.capacity && (
                        <div>
                          <span className="font-medium">Capacity:</span> {event.booked || 0}/{event.capacity}
                        </div>
                      )}
                      
                      {event.resource && (
                        <div className="flex items-center gap-2">
                          <HiLocationMarker className="w-4 h-4" />
                          <span>
                            {event.resource}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" outline onClick={() => handleEventClick(event)}>
                    <HiEye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" outline onClick={() => handleEventUpdate(event)}>
                    <HiPencil className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
        {filteredEvents.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No events found matching your criteria.
          </div>
        )}
      </div>
    );
  };

  const renderTableView = () => (
    <Card>
      <div className="overflow-x-auto">
        <Table>
          <TableHead>
            <TableHeadCell>Event</TableHeadCell>
            <TableHeadCell>Date & Time</TableHeadCell>
            <TableHeadCell>Location</TableHeadCell>
            {userContext === 'admin' && <TableHeadCell>Member</TableHeadCell>}
            <TableHeadCell>Instructor</TableHeadCell>
            <TableHeadCell>Status</TableHeadCell>
            {userContext === 'admin' && <TableHeadCell>Capacity</TableHeadCell>}
            <TableHeadCell>Actions</TableHeadCell>
          </TableHead>
          <TableBody className="divide-y">
            {filteredEvents.map((event) => {
              const { date, time } = formatDateTime(event.start);
              return (
                <TableRow key={event.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {event.title}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{date}</div>
                      <div className="text-sm text-gray-500">{time}</div>
                    </div>
                  </TableCell>
                  <TableCell>{event.location || 'Not specified'}</TableCell>
                  {userContext === 'admin' && (
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <HiUser className="w-4 h-4" />
                        Unknown Member
                      </div>
                    </TableCell>
                  )}
                  <TableCell>{event.instructor || 'Not assigned'}</TableCell>
                  <TableCell>{getStatusBadge(event.status)}</TableCell>
                  {userContext === 'admin' && (
                    <TableCell>
                      {event.capacity ? `${event.booked || 0}/${event.capacity}` : 'N/A'}
                    </TableCell>
                  )}
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="xs" outline onClick={() => handleEventClick(event)}>
                        <HiEye className="w-3 h-3" />
                      </Button>
                      {userContext === 'admin' && (
                        <Button size="xs" outline onClick={() => handleEventUpdate(event)}>
                          <HiPencil className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {filteredEvents.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No events found matching your criteria.
          </div>
        )}
      </div>
    </Card>
  );

  const renderContent = () => {
    switch (viewMode) {
      case 'calendar':
        return renderCalendarView();
      case 'list':
        return renderListView();
      case 'table':
        return renderTableView();
      default:
        return renderCalendarView();
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {renderFilters()}
      {renderViewModeSelector()}
      {renderContent()}
    </div>
  );
}
