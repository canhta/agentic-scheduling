// Common types and interfaces used across the application
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'staff' | 'member';
  organizationId: string;
  profileImage?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Member extends User {
  role: 'member';
  membershipType?: string;
  membershipStatus: 'active' | 'inactive' | 'frozen' | 'expired';
  membershipStartDate?: string;
  membershipEndDate?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  dateOfBirth?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  remainingCredits?: number;
  waiverSigned?: boolean;
  waiverSignedDate?: string;
}

export interface Staff extends User {
  role: 'staff' | 'admin';
  jobTitle?: string;
  qualifications?: string[];
  certifications?: {
    name: string;
    expiryDate: string;
  }[];
  availability?: {
    dayOfWeek: number; // 0-6 (Sunday to Saturday)
    startTime: string;
    endTime: string;
  }[];
}

export interface ServiceType {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  category: 'class' | 'appointment';
  duration: number; // in minutes
  maxCapacity?: number; // for classes
  price?: number;
  creditsRequired?: number;
  color?: string; // for calendar display
  requiresQualification?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  id: string;
  serviceTypeId: string;
  serviceType: ServiceType;
  organizationId: string;
  instructorId: string;
  instructor: Staff;
  startTime: string;
  endTime: string;
  maxCapacity?: number;
  currentBookings: number;
  status: 'scheduled' | 'cancelled' | 'completed';
  notes?: string;
  recurrenceRule?: string; // RRULE string
  parentSessionId?: string; // for recurring sessions
  roomId?: string;
  waitlistEnabled: boolean;
  waitlistCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  sessionId: string;
  session: Session;
  memberId: string;
  member: Member;
  status: 'booked' | 'attended' | 'no_show' | 'cancelled_by_member' | 'cancelled_by_gym' | 'late_cancel';
  bookingTime: string;
  notes?: string;
  creditsUsed?: number;
  amountPaid?: number;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WaitlistEntry {
  id: string;
  sessionId: string;
  session: Session;
  memberId: string;
  member: Member;
  position: number;
  joinedAt: string;
  notifiedAt?: string;
  expiresAt?: string;
  status: 'waiting' | 'notified' | 'expired' | 'converted';
}

// Form types for creating/updating entities
export interface CreateMemberForm {
  name: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface CreateStaffForm {
  name: string;
  email: string;
  phone?: string;
  jobTitle?: string;
  qualifications?: string[];
  role: 'staff' | 'admin';
}

export interface CreateServiceTypeForm {
  name: string;
  description?: string;
  category: 'class' | 'appointment';
  duration: number;
  maxCapacity?: number;
  price?: number;
  creditsRequired?: number;
  color?: string;
  requiresQualification?: string[];
}

export interface CreateSessionForm {
  serviceTypeId: string;
  instructorId: string;
  startTime: string;
  endTime: string;
  maxCapacity?: number;
  notes?: string;
  recurrenceRule?: string;
  roomId?: string;
  waitlistEnabled: boolean;
}

// Filter and search types
export interface SessionFilters {
  serviceTypeId?: string;
  instructorId?: string;
  startDate?: string;
  endDate?: string;
  status?: string[];
  hasAvailability?: boolean;
}

export interface MemberFilters {
  membershipStatus?: string[];
  search?: string;
  membershipType?: string;
}

export interface BookingFilters {
  memberId?: string;
  sessionId?: string;
  status?: string[];
  startDate?: string;
  endDate?: string;
}

// API Response types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
  timestamp: string;
}

// Calendar types
export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  resourceId?: string;
  color?: string;
  extendedProps?: {
    sessionId: string;
    serviceType: ServiceType;
    instructor: Staff;
    bookings: number;
    maxCapacity?: number;
    status: string;
  };
}

// Notification types
export interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  bookingConfirmations: boolean;
  cancellationAlerts: boolean;
  waitlistNotifications: boolean;
  reminderNotifications: boolean;
  reminderTime: number; // minutes before session
}
