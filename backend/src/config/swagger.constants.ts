/**
 * Swagger configuration constants
 * Centralized location for all Swagger-related configuration values
 */

export const SWAGGER_CONSTANTS = {
  // Base configuration
  VERSION: '1.0',
  BASE_PATH: 'docs',
  ENABLE_BEARER_AUTH: true,

  // API Information
  API_INFO: {
    AUTH: {
      TITLE: 'Authentication API',
      DESCRIPTION: 'Authentication and authorization endpoints',
    },
    USERS: {
      TITLE: 'User Management API',
      DESCRIPTION: 'Endpoints for managing users, members, staff, and admins',
    },
    ORGANIZATIONS: {
      TITLE: 'Organization Management API',
      DESCRIPTION:
        'Endpoints for managing organizations, locations, and resources',
    },
    SCHEDULING: {
      TITLE: 'Scheduling API',
      DESCRIPTION:
        'Booking management, calendar views, and recurring schedule endpoints',
    },
  },

  // Tags configuration
  TAGS: {
    AUTHENTICATION: {
      NAME: 'Authentication',
      DESCRIPTION: 'Authentication and authorization endpoints',
    },
    USER_MANAGEMENT: {
      NAME: 'User Management',
      DESCRIPTION: 'Endpoints for managing users, members, staff, and admins',
    },
    ORGANIZATION_MANAGEMENT: {
      NAME: 'Organization Management',
      DESCRIPTION:
        'Endpoints for managing organizations, locations, and resources',
    },
    BOOKINGS: {
      NAME: 'bookings',
      DESCRIPTION: 'Booking management endpoints',
    },
    CALENDAR: {
      NAME: 'calendar',
      DESCRIPTION: 'Calendar and scheduling view endpoints',
    },
    RECURRING_SCHEDULES: {
      NAME: 'recurring-schedules',
      DESCRIPTION: 'Recurring schedule management endpoints',
    },
  },

  // Paths
  PATHS: {
    AUTH: 'auth',
    USERS: 'users',
    ORGANIZATIONS: 'organizations',
    SCHEDULING: 'scheduling',
  },
} as const;
