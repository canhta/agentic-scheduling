import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'generated/prisma';

export class AuthUserDto {
  @ApiProperty({
    description: 'User ID',
    example: 'uuid-string',
  })
  id: string;

  @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  lastName: string;

  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    example: UserRole.MEMBER,
  })
  role: UserRole;

  @ApiProperty({
    description: 'Organization ID',
    example: 'uuid-string',
  })
  organizationId: string;

  @ApiProperty({
    description: 'Email verification status',
    example: true,
  })
  emailVerified: boolean;

  @ApiProperty({
    description: 'Phone verification status',
    example: false,
  })
  phoneVerified: boolean;
}

export class LoginResponseDto {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({
    description: 'User information',
    type: AuthUserDto,
  })
  user: AuthUserDto;

  @ApiProperty({
    description: 'Refresh token',
    example: 'refresh-token-string',
    required: false,
  })
  refresh_token?: string;

  @ApiProperty({
    description: 'Token expiry time in seconds',
    example: 86400,
  })
  expires_in: number;
}

export class RegisterResponseDto extends LoginResponseDto {}

export class RefreshTokenResponseDto {
  @ApiProperty({
    description: 'New JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({
    description: 'Token expiry time in seconds',
    example: 86400,
  })
  expires_in: number;
}

export class MessageResponseDto {
  @ApiProperty({
    description: 'Response message',
    example: 'Operation completed successfully',
  })
  message: string;
}

export class OAuthUrlResponseDto {
  @ApiProperty({
    description: 'OAuth authorization URL',
    example: 'https://accounts.google.com/o/oauth2/v2/auth?...',
  })
  url: string;

  @ApiProperty({
    description: 'OAuth state parameter',
    example: 'state-string',
  })
  state: string;
}
