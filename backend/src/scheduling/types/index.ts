import { BookingStatus, BookingType } from 'generated/prisma';

export interface ConflictCheckResult {
  hasConflict: boolean;
  conflicts: ConflictDetail[];
  message?: string;
}

export interface ConflictDetail {
  type: 'staff' | 'resource' | 'member' | 'availability' | 'capacity';
  message: string;
  conflictingBookingId?: string;
  details?: any;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: BookingType;
  status: BookingStatus;
  memberId: string;
  memberName: string;
  staffId?: string;
  staffName?: string;
  serviceId?: string;
  serviceName?: string;
  resourceId?: string;
  resourceName?: string;
  notes?: string;
  isRecurring: boolean;
  recurringScheduleId?: string;
  allDay?: boolean;
}

// Filter interfaces for better type safety
export interface BookingFilters {
  startDate?: Date;
  endDate?: Date;
  memberId?: string;
  staffId?: string;
  serviceId?: string;
  resourceId?: string;
  status?: BookingStatus;
  type?: BookingType;
}

export interface RecurringScheduleFilters {
  serviceId?: string;
  resourceId?: string;
  staffId?: string;
}
