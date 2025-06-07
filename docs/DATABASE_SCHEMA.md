# Database Schema Documentation

## Multi-Tenant SaaS Gym Scheduling and Management System

This document provides a comprehensive overview of the database schema designed for the multi-tenant SaaS gym scheduling and management system, fully compliant with the BRD and FRD requirements.

## Schema Overview

The schema follows a multi-tenant architecture where each organization (gym/fitness center) operates as an isolated tenant with complete data separation.

### Core Entities

#### 1. Multi-Tenancy & Organization Management

- **Organization**: Root tenant entity containing gym/studio information
- **OrganizationSettings**: Tenant-specific configurations (booking policies, business hours, etc.)
- **Location**: Physical locations within an organization (for multi-location gyms)

#### 2. User Management & Roles

- **User**: Central user entity supporting all roles (Super Admin, Organization Admin, Admin, Staff, Member)
- **UserNote**: Staff notes and alerts about users
- **Role-based permissions**: SUPER_ADMIN, ORGANIZATION_ADMIN, ADMIN, STAFF, MEMBER

#### 3. Membership & Client Management

- **MembershipType**: Different membership tiers and packages
- **Membership**: Individual member's subscription status and credits
- **MemberPackage**: Credit-based packages for services
- **PackageUsage**: Tracking of package credit consumption

#### 4. Services & Resources

- **Service**: Classes, appointments, and workshops offered
- **Resource**: Bookable rooms, equipment, and facilities
- **ServiceType**: CLASS, APPOINTMENT, WORKSHOP, PERSONAL_TRAINING

#### 5. Advanced Scheduling System (RRULE Compliant)

- **RecurringSchedule**: RFC 5545 compliant recurring schedules
- **RecurrenceException**: Handle modifications to specific recurring instances
- **Booking**: Individual booking instances with comprehensive status tracking
- **Waitlist**: FIFO waitlist management for fully booked services

#### 6. Staff Management

- **StaffAvailability**: Weekly schedules and date-specific overrides
- **TimeOffRequest**: Formal time-off workflow with approval process

#### 7. Operational Features

- **CheckIn**: Member check-in tracking with multiple methods
- **Payment**: Comprehensive payment and billing tracking
- **Review**: Member feedback and rating system
- **AnalyticsSnapshot**: Operational metrics and reporting data

#### 8. Legal & Compliance

- **Waiver**: Digital waiver management
- **WaiverSignature**: Tracking of signed waivers with digital signatures

#### 9. Communication

- **CommunicationLog**: Audit trail of all system communications

## Key Features Implemented

### 1. Google Calendar-Style RRULE Support

The `RecurringSchedule` model fully implements RFC 5545 RRULE standard:

```prisma
model RecurringSchedule {
  rrule     String   // Complete RRULE string
  dtstart   DateTime // Start date and time
  dtend     DateTime? // End date (optional)
  frequency String   // DAILY, WEEKLY, MONTHLY, YEARLY
  interval  Int      // Repeat every N periods
  byDay     String[] // Days of week for WEEKLY
  byMonthDay Int[]   // Days of month for MONTHLY
  exdates   DateTime[] // Exception dates
  // ... additional RRULE components
}
```

### 2. Conflict Detection Support

The schema supports comprehensive conflict detection:
- Staff double-booking prevention
- Resource utilization tracking
- Member booking limits
- Availability validation

### 3. Waitlist Management

FIFO waitlist system with:
- Position tracking
- Automated notifications
- Expiration handling
- Admin override capabilities

### 4. Multi-Tenant Data Isolation

Every tenant-specific model includes `organizationId` with proper foreign key constraints ensuring complete data isolation between organizations.

### 5. Comprehensive Audit Trail

- Creation and update timestamps on all models
- Communication logging
- Payment transaction tracking
- Booking status history

### 6. Flexible Membership System

- Credit-based packages
- Unlimited memberships
- Membership status tracking (ACTIVE, FROZEN, EXPIRED, etc.)
- Package expiration and usage tracking

### 7. Staff Management

- Availability templates
- Time-off request workflow
- Qualification and certification tracking
- Service assignment and capabilities

## Data Relationships

### User Hierarchy
```
Organization → OrganizationAdmin → Admin → Staff
                                        → Member
```

### Booking Flow
```
Service → RecurringSchedule → Booking
       → Waitlist (if full)
       → Payment
       → CheckIn
       → Review
```

### Resource Management
```
Organization → Location → Resource
                       → Service → Booking
```

## Security & Compliance

1. **Multi-tenant isolation**: All data scoped by `organizationId`
2. **Role-based access**: Granular permissions by user role
3. **Audit logging**: Complete action and communication trails
4. **Data retention**: Configurable retention policies
5. **Waiver management**: Digital signature compliance

## Performance Considerations

### Indexes
- Optimized for common query patterns
- Organization-scoped indexes for tenant isolation
- Time-based indexes for scheduling queries
- Status-based indexes for operational queries

### Key Indexes Implemented:
```sql
-- Booking queries
@@index([organizationId, startTime])
@@index([userId, startTime])
@@index([serviceId, startTime])

-- Waitlist management
@@index([serviceId, position])

-- Payment tracking
@@index([organizationId, status])

-- Analytics
@@index([organizationId, checkedInAt])
```

## Migration Strategy

The schema is designed for:
1. Zero-downtime deployments
2. Backward compatibility
3. Feature flag support
4. Gradual rollout capabilities

## Next Steps

1. Implement business logic layer
2. Add API endpoints
3. Create admin dashboard
4. Build member portal
5. Implement real-time notifications
6. Add analytics and reporting

This schema provides a solid foundation for a comprehensive gym management system that can scale to serve multiple tenants while maintaining data integrity and performance.
