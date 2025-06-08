/**
 * Mock data for calendar component testing
 * This file contains sample calendar events for a multi-tenant SaaS gym scheduling system
 */

import type { CalendarEvent } from '@/lib/types';

// Helper function to generate dates relative to current date
const getDate = (daysOffset: number, hours: number = 9, minutes: number = 0): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
};

// Mock calendar events for testing
export const mockCalendarEvents: CalendarEvent[] = [
  // Today's events
  {
    id: '1',
    title: 'Morning Yoga Class',
    start: getDate(0, 7, 0),
    end: getDate(0, 8, 0),
    allDay: false,
    serviceId: 'service-1',
    type: 'recurring',
    status: 'confirmed',
    location: 'Studio A',
    resource: 'resource-1',
    instructor: 'Sarah Johnson',
    capacity: 15,
    booked: 12,
    color: '#10b981', // emerald-500
  },
  {
    id: '2',
    title: 'HIIT Training',
    start: getDate(0, 9, 30),
    end: getDate(0, 10, 30),
    allDay: false,
    serviceId: 'service-2',
    type: 'recurring',
    status: 'confirmed',
    location: 'Gym Floor',
    resource: 'resource-2',
    instructor: 'Mike Wilson',
    capacity: 20,
    booked: 18,
    color: '#f59e0b', // amber-500
  },
  {
    id: '3',
    title: 'Personal Training - John Doe',
    start: getDate(0, 14, 0),
    end: getDate(0, 15, 0),
    allDay: false,
    bookingId: 'booking-1',
    type: 'booking',
    status: 'confirmed',
    location: 'Private Room 1',
    resource: 'resource-3',
    instructor: 'Emily Chen',
    capacity: 1,
    booked: 1,
    color: '#3b82f6', // blue-500
  },
  {
    id: '4',
    title: 'Equipment Maintenance',
    start: getDate(0, 16, 0),
    end: getDate(0, 18, 0),
    allDay: false,
    type: 'exception',
    status: 'blocked',
    location: 'Gym Floor',
    resource: 'resource-2',
    color: '#ef4444', // red-500
  },

  // Tomorrow's events
  {
    id: '5',
    title: 'Pilates Class',
    start: getDate(1, 8, 0),
    end: getDate(1, 9, 0),
    allDay: false,
    serviceId: 'service-3',
    type: 'recurring',
    status: 'confirmed',
    location: 'Studio B',
    resource: 'resource-4',
    instructor: 'Lisa Anderson',
    capacity: 12,
    booked: 8,
    color: '#8b5cf6', // violet-500
  },
  {
    id: '6',
    title: 'Crossfit WOD',
    start: getDate(1, 18, 0),
    end: getDate(1, 19, 0),
    allDay: false,
    serviceId: 'service-4',
    type: 'recurring',
    status: 'confirmed',
    location: 'Crossfit Box',
    resource: 'resource-5',
    instructor: 'David Rodriguez',
    capacity: 25,
    booked: 22,
    color: '#dc2626', // red-600
  },

  // Day after tomorrow
  {
    id: '7',
    title: 'Zumba Dance',
    start: getDate(2, 19, 0),
    end: getDate(2, 20, 0),
    allDay: false,
    serviceId: 'service-5',
    type: 'recurring',
    status: 'confirmed',
    location: 'Dance Studio',
    resource: 'resource-6',
    instructor: 'Maria Garcia',
    capacity: 30,
    booked: 25,
    color: '#ec4899', // pink-500
  },

  // Next week events
  {
    id: '8',
    title: 'Strength Training',
    start: getDate(7, 10, 0),
    end: getDate(7, 11, 0),
    allDay: false,
    serviceId: 'service-6',
    type: 'recurring',
    status: 'confirmed',
    location: 'Weight Room',
    resource: 'resource-7',
    instructor: 'Tom Mitchell',
    capacity: 15,
    booked: 10,
    color: '#6366f1', // indigo-500
  },
  {
    id: '9',
    title: 'Spin Class',
    start: getDate(8, 17, 30),
    end: getDate(8, 18, 30),
    allDay: false,
    serviceId: 'service-7',
    type: 'recurring',
    status: 'confirmed',
    location: 'Cycling Studio',
    resource: 'resource-8',
    instructor: 'Jennifer Lee',
    capacity: 20,
    booked: 15,
    color: '#059669', // emerald-600
  },

  // All-day events
  {
    id: '10',
    title: 'Gym Closed - Holiday',
    start: getDate(14),
    end: getDate(14),
    allDay: true,
    type: 'exception',
    status: 'blocked',
    color: '#6b7280', // gray-500
  },
  {
    id: '11',
    title: 'Special Event - Fitness Challenge',
    start: getDate(21),
    end: getDate(21),
    allDay: true,
    type: 'booking',
    status: 'confirmed',
    location: 'Entire Facility',
    capacity: 100,
    booked: 45,
    color: '#f97316', // orange-500
  },
];

// Mock resources data for resource view
export const mockResources = [
  { id: 'resource-1', title: 'Studio A' },
  { id: 'resource-2', title: 'Gym Floor' },
  { id: 'resource-3', title: 'Private Room 1' },
  { id: 'resource-4', title: 'Studio B' },
  { id: 'resource-5', title: 'Crossfit Box' },
  { id: 'resource-6', title: 'Dance Studio' },
  { id: 'resource-7', title: 'Weight Room' },
  { id: 'resource-8', title: 'Cycling Studio' },
];

// Mock staff data for filtering
export const mockStaff = [
  { id: 'staff-1', name: 'Sarah Johnson' },
  { id: 'staff-2', name: 'Mike Wilson' },
  { id: 'staff-3', name: 'Emily Chen' },
  { id: 'staff-4', name: 'Lisa Anderson' },
  { id: 'staff-5', name: 'David Rodriguez' },
  { id: 'staff-6', name: 'Maria Garcia' },
  { id: 'staff-7', name: 'Tom Mitchell' },
  { id: 'staff-8', name: 'Jennifer Lee' },
];
