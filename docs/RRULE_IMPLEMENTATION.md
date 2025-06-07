# RRULE Implementation Guide

## Google Calendar-Style Recurring Events

This document explains how our system implements RFC 5545 compliant RRULE (Recurrence Rule) functionality, similar to Google Calendar.

## RRULE Components

### Core Structure
```typescript
interface RecurringSchedule {
  // Complete RRULE string (RFC 5545 compliant)
  rrule: string;     // "FREQ=WEEKLY;BYDAY=MO,WE,FR;INTERVAL=1"
  
  // Date/time components
  dtstart: DateTime; // When recurrence starts
  dtend?: DateTime;  // When recurrence ends (optional)
  timezone: string;  // IANA timezone identifier
  
  // Breakdown for easier querying
  frequency: string; // DAILY, WEEKLY, MONTHLY, YEARLY
  interval: number;  // Repeat every N periods
  
  // Specific day/date rules
  byDay: string[];    // ["MO", "WE", "FR"] for weekly
  byMonthDay: number[]; // [1, 15] for 1st and 15th of month
  byMonth: number[];    // [1, 6] for January and June
  bySetPos: number[];   // [1, -1] for first and last
  
  // Limitation
  count?: number;     // Number of occurrences
  
  // Exception handling
  exdates: DateTime[]; // Specific dates to exclude
}
```

## Example RRULE Patterns

### 1. Weekly Classes
**Every Monday, Wednesday, Friday at 9:00 AM**
```typescript
{
  rrule: "FREQ=WEEKLY;BYDAY=MO,WE,FR;INTERVAL=1",
  dtstart: "2025-01-06T09:00:00Z", // Starting Monday
  frequency: "WEEKLY",
  interval: 1,
  byDay: ["MO", "WE", "FR"],
  startTime: "09:00",
  duration: 60 // minutes
}
```

### 2. Monthly Workshops
**First Saturday of every month at 2:00 PM**
```typescript
{
  rrule: "FREQ=MONTHLY;BYDAY=1SA;INTERVAL=1",
  dtstart: "2025-01-04T14:00:00Z", // First Saturday
  frequency: "MONTHLY",
  interval: 1,
  byDay: ["SA"],
  bySetPos: [1], // First occurrence
  startTime: "14:00",
  duration: 120
}
```

### 3. Daily Classes with End Date
**Daily yoga class for 30 days**
```typescript
{
  rrule: "FREQ=DAILY;INTERVAL=1;COUNT=30",
  dtstart: "2025-01-01T07:00:00Z",
  frequency: "DAILY",
  interval: 1,
  count: 30,
  startTime: "07:00",
  duration: 45
}
```

### 4. Bi-weekly Personal Training
**Every other Tuesday and Thursday**
```typescript
{
  rrule: "FREQ=WEEKLY;BYDAY=TU,TH;INTERVAL=2",
  dtstart: "2025-01-02T10:00:00Z", // Starting Thursday
  frequency: "WEEKLY",
  interval: 2,
  byDay: ["TU", "TH"],
  startTime: "10:00",
  duration: 30
}
```

## Exception Handling

### Cancelling Specific Instances
```typescript
// Cancel the class on January 15th, 2025
{
  recurringScheduleId: "schedule_123",
  originalDateTime: "2025-01-15T09:00:00Z",
  exceptionType: "CANCELLED",
  reason: "Instructor unavailable"
}
```

### Rescheduling Specific Instances
```typescript
// Move the January 15th class to January 16th
{
  recurringScheduleId: "schedule_123",
  originalDateTime: "2025-01-15T09:00:00Z",
  exceptionType: "RESCHEDULED",
  newStartTime: "2025-01-16T09:00:00Z",
  newEndTime: "2025-01-16T10:00:00Z",
  reason: "Holiday schedule adjustment"
}
```

### Modifying Specific Instances
```typescript
// Change instructor for one class
{
  recurringScheduleId: "schedule_123",
  originalDateTime: "2025-01-15T09:00:00Z",
  exceptionType: "MODIFIED",
  newInstructorId: "instructor_456",
  reason: "Substitute instructor"
}
```

## Instance Generation Algorithm

### 1. Parse RRULE
```typescript
function parseRRule(rrule: string): RRuleComponents {
  // Parse the RRULE string into components
  // Handle FREQ, INTERVAL, BYDAY, BYMONTHDAY, etc.
}
```

### 2. Generate Occurrences
```typescript
function generateOccurrences(
  schedule: RecurringSchedule,
  startDate: Date,
  endDate: Date
): Date[] {
  // Use RRULE library (e.g., rrule.js) to generate occurrences
  // Apply timezone conversions
  // Filter by date range
  // Exclude EXDATES
}
```

### 3. Apply Exceptions
```typescript
function applyExceptions(
  occurrences: Date[],
  exceptions: RecurrenceException[]
): BookingInstance[] {
  // Remove cancelled instances
  // Reschedule moved instances
  // Apply modifications
}
```

## Database Queries

### Get Upcoming Classes for a Date Range
```sql
-- Get all recurring schedules that might have instances in date range
SELECT rs.*, s.name, s.capacity
FROM recurring_schedules rs
JOIN services s ON rs.service_id = s.id
WHERE rs.is_active = true
  AND rs.dtstart <= '2025-01-31'
  AND (rs.dtend IS NULL OR rs.dtend >= '2025-01-01')
  AND s.organization_id = ?;

-- Then generate instances programmatically and check for exceptions
```

### Get Exceptions for a Schedule
```sql
SELECT *
FROM recurrence_exceptions
WHERE recurring_schedule_id = ?
  AND original_date_time BETWEEN ? AND ?;
```

## Conflict Detection

### Check for Staff Conflicts
```typescript
function checkStaffConflict(
  instructorId: string,
  startTime: Date,
  endTime: Date
): boolean {
  // Check staff availability
  // Check existing bookings
  // Check recurring schedules
  // Check time-off requests
}
```

### Check for Resource Conflicts
```typescript
function checkResourceConflict(
  resourceId: string,
  startTime: Date,
  endTime: Date
): boolean {
  // Check resource bookings
  // Check maintenance schedules
  // Check recurring reservations
}
```

## Timezone Handling

### Storage
- All times stored in UTC in database
- Timezone information stored separately
- User preferences for display timezone

### Conversion
```typescript
function convertToUserTimezone(
  utcDateTime: Date,
  userTimezone: string
): Date {
  // Use timezone libraries (e.g., date-fns-tz, moment-timezone)
  // Convert for display
}
```

## Performance Optimizations

### 1. Pre-generated Instances
For high-frequency patterns, pre-generate instances:
```typescript
// Generate instances for next 3 months
// Store in separate table for fast queries
// Regenerate when patterns change
```

### 2. Caching
- Cache generated occurrences
- Invalidate on pattern changes
- Use Redis for session-based caching

### 3. Indexing
```sql
CREATE INDEX idx_recurring_active_dates 
ON recurring_schedules (is_active, dtstart, dtend);

CREATE INDEX idx_exceptions_schedule_date 
ON recurrence_exceptions (recurring_schedule_id, original_date_time);
```

## Human-Readable Descriptions

### Generate Descriptions
```typescript
function generateDescription(schedule: RecurringSchedule): string {
  switch (schedule.frequency) {
    case 'WEEKLY':
      return `Every ${formatDays(schedule.byDay)} at ${schedule.startTime}`;
    case 'MONTHLY':
      return `${formatMonthlyPattern(schedule)} at ${schedule.startTime}`;
    case 'DAILY':
      return `Daily at ${schedule.startTime}`;
  }
}

// Examples:
// "Every Monday, Wednesday, Friday at 9:00 AM"
// "First Saturday of every month at 2:00 PM"
// "Every other Tuesday at 10:00 AM"
```

This implementation provides a robust, Google Calendar-compatible recurring event system that can handle complex scheduling patterns while maintaining performance and data integrity.
