import { UserRole, UserStatus } from 'generated/prisma';
import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ description: 'User ID' })
  id: string;

  @ApiProperty({ description: 'User email address' })
  email: string;

  @ApiProperty({ description: 'User first name' })
  firstName: string;

  @ApiProperty({ description: 'User last name' })
  lastName: string;

  @ApiProperty({ description: 'User role', enum: UserRole })
  role: UserRole;

  @ApiProperty({ description: 'User status', enum: UserStatus })
  status: UserStatus;

  @ApiProperty({ description: 'Organization ID' })
  organizationId: string;

  @ApiProperty({ description: 'Member ID (for members only)', required: false })
  memberId?: string;

  @ApiProperty({ description: 'User phone number', required: false })
  phone?: string;

  @ApiProperty({ description: 'Date of birth', required: false })
  dateOfBirth?: Date;

  @ApiProperty({ description: 'Emergency contact name', required: false })
  emergencyContactName?: string;

  @ApiProperty({ description: 'Emergency contact phone', required: false })
  emergencyContactPhone?: string;

  @ApiProperty({ description: 'Email verified status' })
  emailVerified: boolean;

  @ApiProperty({ description: 'Phone verified status' })
  phoneVerified: boolean;

  @ApiProperty({ description: 'User creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt: Date;

  @ApiProperty({ description: 'Last login date', required: false })
  lastLoginAt?: Date;
}

export class PaginatedUsersResponseDto {
  @ApiProperty({ description: 'List of users', type: [UserResponseDto] })
  users: UserResponseDto[];

  @ApiProperty({ description: 'Total number of users' })
  total: number;

  @ApiProperty({ description: 'Current page number' })
  page: number;

  @ApiProperty({ description: 'Number of items per page' })
  limit: number;

  @ApiProperty({ description: 'Total number of pages' })
  totalPages: number;
}

export class OrganizationStatsResponseDto {
  @ApiProperty({ description: 'Total number of users' })
  totalUsers: number;

  @ApiProperty({ description: 'Number of members' })
  memberCount: number;

  @ApiProperty({ description: 'Number of staff' })
  staffCount: number;

  @ApiProperty({ description: 'Number of admins' })
  adminCount: number;

  @ApiProperty({ description: 'Number of active users' })
  activeUsers: number;

  @ApiProperty({ description: 'Number of inactive users' })
  inactiveUsers: number;

  @ApiProperty({ description: 'Number of suspended users' })
  suspendedUsers: number;

  @ApiProperty({ description: 'Number of pending users' })
  pendingUsers: number;
}

export class OrganizationActivityResponseDto {
  @ApiProperty({ description: 'Total number of bookings' })
  totalBookings: number;

  @ApiProperty({ description: 'Number of completed bookings' })
  completedBookings: number;

  @ApiProperty({ description: 'Number of cancelled bookings' })
  cancelledBookings: number;

  @ApiProperty({ description: 'Number of no-shows' })
  noShows: number;

  @ApiProperty({ description: 'Number of new members' })
  newMembers: number;

  @ApiProperty({ description: 'Total revenue' })
  totalRevenue: number;
}

export class BulkOperationResponseDto {
  @ApiProperty({ description: 'Number of affected users' })
  affected: number;
}

export class UserNoteResponseDto {
  @ApiProperty({ description: 'Note ID' })
  id: string;

  @ApiProperty({ description: 'Note content' })
  content: string;

  @ApiProperty({ description: 'Is alert flag' })
  isAlert: boolean;

  @ApiProperty({ description: 'Note creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Note update date' })
  updatedAt: Date;

  @ApiProperty({ description: 'Author information' })
  author: {
    id: string;
    firstName: string;
    lastName: string;
    role: UserRole;
  };
}

export class UserWithAlertsResponseDto {
  @ApiProperty({ description: 'User ID' })
  id: string;

  @ApiProperty({ description: 'User first name' })
  firstName: string;

  @ApiProperty({ description: 'User last name' })
  lastName: string;

  @ApiProperty({ description: 'User email' })
  email: string;

  @ApiProperty({ description: 'User role', enum: UserRole })
  role: UserRole;

  @ApiProperty({ description: 'Number of alerts' })
  alertCount: number;

  @ApiProperty({ description: 'Latest alert', required: false })
  latestAlert?: UserNoteResponseDto;
}

export class AttentionUsersResponseDto {
  @ApiProperty({
    description: 'Users pending verification',
    type: [UserResponseDto],
  })
  pendingVerification: UserResponseDto[];

  @ApiProperty({ description: 'Suspended users', type: [UserResponseDto] })
  suspendedUsers: UserResponseDto[];

  @ApiProperty({ description: 'Users with alerts', type: [UserResponseDto] })
  usersWithAlerts: UserResponseDto[];
}

export class NotesStatsResponseDto {
  @ApiProperty({ description: 'Total number of notes' })
  totalNotes: number;

  @ApiProperty({ description: 'Total number of alerts' })
  totalAlerts: number;

  @ApiProperty({ description: 'Notes created this week' })
  notesThisWeek: number;

  @ApiProperty({ description: 'Alerts created this week' })
  alertsThisWeek: number;
}
