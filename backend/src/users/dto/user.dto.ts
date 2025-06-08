import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsDateString,
  IsBoolean,
  IsUUID,
  Length,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole, UserStatus } from 'generated/prisma';

export class CreateUserDto {
  @ApiProperty({ description: 'Organization ID for the user' })
  @IsOptional()
  @IsUUID()
  organizationId?: string;

  @ApiProperty({ description: 'User email address (unique)' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ description: 'Username (optional)' })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ description: 'First name' })
  @IsString()
  @Length(1, 50)
  firstName: string;

  @ApiProperty({ description: 'Last name' })
  @IsString()
  @Length(1, 50)
  lastName: string;

  @ApiPropertyOptional({ description: 'Preferred name' })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  preferredName?: string;

  @ApiPropertyOptional({ description: 'Phone number' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'Date of birth' })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiPropertyOptional({
    description: 'Gender',
    enum: ['male', 'female', 'other', 'prefer_not_to_say'],
  })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiPropertyOptional({ description: 'Profile photo URL' })
  @IsOptional()
  @IsString()
  profilePhoto?: string;

  @ApiPropertyOptional({ description: 'Bio/description' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({ description: 'Street address' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'City' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'State/Province' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ description: 'ZIP/Postal code' })
  @IsOptional()
  @IsString()
  zipCode?: string;

  @ApiPropertyOptional({ description: 'Country' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ description: 'Emergency contact name' })
  @IsOptional()
  @IsString()
  emergencyContactName?: string;

  @ApiPropertyOptional({ description: 'Emergency contact phone' })
  @IsOptional()
  @IsString()
  emergencyContactPhone?: string;

  @ApiPropertyOptional({ description: 'Emergency contact relation' })
  @IsOptional()
  @IsString()
  emergencyContactRelation?: string;

  @ApiProperty({ description: 'User role', enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiPropertyOptional({ description: 'User status', enum: UserStatus })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @ApiPropertyOptional({ description: 'Member ID (for members)' })
  @IsOptional()
  @IsString()
  memberId?: string;

  @ApiPropertyOptional({ description: 'Employee ID (for staff)' })
  @IsOptional()
  @IsString()
  employeeId?: string;

  @ApiPropertyOptional({ description: 'Department (for staff)' })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiPropertyOptional({ description: 'Specialty (for staff)' })
  @IsOptional()
  @IsString()
  specialty?: string;

  @ApiPropertyOptional({
    description: 'Certifications (for staff)',
    type: [String],
  })
  @IsOptional()
  @IsString({ each: true })
  certifications?: string[];

  @ApiPropertyOptional({ description: 'Hourly rate (for staff)' })
  @IsOptional()
  @IsString()
  hourlyRate?: string;

  @ApiPropertyOptional({
    description:
      'Temporary password (will be required to change on first login)',
  })
  @IsOptional()
  @IsString()
  @MinLength(8)
  temporaryPassword?: string;
}

export class UpdateUserDto {
  @ApiPropertyOptional({ description: 'User email address (unique)' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'Username (optional)' })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({ description: 'First name' })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  firstName?: string;

  @ApiPropertyOptional({ description: 'Last name' })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  lastName?: string;

  @ApiPropertyOptional({ description: 'Preferred name' })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  preferredName?: string;

  @ApiPropertyOptional({ description: 'Phone number' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'Date of birth' })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiPropertyOptional({
    description: 'Gender',
    enum: ['male', 'female', 'other', 'prefer_not_to_say'],
  })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiPropertyOptional({ description: 'Profile photo URL' })
  @IsOptional()
  @IsString()
  profilePhoto?: string;

  @ApiPropertyOptional({ description: 'Bio/description' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({ description: 'Street address' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'City' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'State/Province' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ description: 'ZIP/Postal code' })
  @IsOptional()
  @IsString()
  zipCode?: string;

  @ApiPropertyOptional({ description: 'Country' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ description: 'Emergency contact name' })
  @IsOptional()
  @IsString()
  emergencyContactName?: string;

  @ApiPropertyOptional({ description: 'Emergency contact phone' })
  @IsOptional()
  @IsString()
  emergencyContactPhone?: string;

  @ApiPropertyOptional({ description: 'Emergency contact relation' })
  @IsOptional()
  @IsString()
  emergencyContactRelation?: string;

  @ApiPropertyOptional({ description: 'User role', enum: UserRole })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({ description: 'User status', enum: UserStatus })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @ApiPropertyOptional({ description: 'Member ID (for members)' })
  @IsOptional()
  @IsString()
  memberId?: string;

  @ApiPropertyOptional({ description: 'Employee ID (for staff)' })
  @IsOptional()
  @IsString()
  employeeId?: string;

  @ApiPropertyOptional({ description: 'Department (for staff)' })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiPropertyOptional({ description: 'Specialty (for staff)' })
  @IsOptional()
  @IsString()
  specialty?: string;

  @ApiPropertyOptional({
    description: 'Certifications (for staff)',
    type: [String],
  })
  @IsOptional()
  @IsString({ each: true })
  certifications?: string[];

  @ApiPropertyOptional({ description: 'Hourly rate (for staff)' })
  @IsOptional()
  @IsString()
  hourlyRate?: string;

  @ApiPropertyOptional({ description: 'Email verification status' })
  @IsOptional()
  @IsBoolean()
  emailVerified?: boolean;

  @ApiPropertyOptional({ description: 'Phone verification status' })
  @IsOptional()
  @IsBoolean()
  phoneVerified?: boolean;
}

export class ChangePasswordDto {
  @ApiProperty({ description: 'Current password' })
  @IsString()
  @MinLength(8)
  currentPassword: string;

  @ApiProperty({ description: 'New password' })
  @IsString()
  @MinLength(8)
  newPassword: string;

  @ApiProperty({ description: 'Confirm new password' })
  @IsString()
  @MinLength(8)
  confirmPassword: string;
}

export class ResetPasswordDto {
  @ApiProperty({ description: 'User email' })
  @IsEmail()
  email: string;
}

export class CreateUserNoteDto {
  @ApiProperty({ description: 'Note content' })
  @IsString()
  @Length(1, 2000)
  content: string;

  @ApiPropertyOptional({ description: 'Mark as alert', default: false })
  @IsOptional()
  @IsBoolean()
  isAlert?: boolean;
}

export class UpdateUserNoteDto {
  @ApiPropertyOptional({ description: 'Note content' })
  @IsOptional()
  @IsString()
  @Length(1, 2000)
  content?: string;

  @ApiPropertyOptional({ description: 'Mark as alert' })
  @IsOptional()
  @IsBoolean()
  isAlert?: boolean;
}

export class UserSearchDto {
  @ApiPropertyOptional({ description: 'Search query (name, email, member ID)' })
  @IsOptional()
  @IsString()
  query?: string;

  @ApiPropertyOptional({ description: 'Filter by role', enum: UserRole })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({ description: 'Filter by status', enum: UserStatus })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  @IsOptional()
  @IsString()
  page?: string;

  @ApiPropertyOptional({ description: 'Items per page', default: 20 })
  @IsOptional()
  @IsString()
  limit?: string;
}

export class BulkUserOperationDto {
  @ApiProperty({
    description: 'User IDs to perform operation on',
    type: [String],
  })
  @IsString({ each: true })
  userIds: string[];

  @ApiProperty({
    description: 'Operation to perform',
    enum: ['activate', 'deactivate', 'suspend', 'delete'],
  })
  @IsEnum(['activate', 'deactivate', 'suspend', 'delete'])
  operation: string;
}
