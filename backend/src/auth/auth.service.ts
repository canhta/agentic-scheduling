import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { UserRole, User, UserStatus } from 'generated/prisma';
import * as bcrypt from 'bcryptjs';
import { AuthUserDto, LoginResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    // Use the users service to verify the password
    return this.usersService.verifyPassword(email, password);
  }

  login(user: User) {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
      organizationId: user.organizationId,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        organizationId: user.organizationId,
        emailVerified: user.emailVerified || false,
        phoneVerified: user.phoneVerified || false,
      } as AuthUserDto,
    };
  }
  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    organizationId: string;
    role?: UserRole;
  }) {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Check if organization exists
    const organization = await this.prisma.organization.findUnique({
      where: { id: userData.organizationId },
    });

    if (!organization) {
      throw new BadRequestException('Invalid organization ID');
    }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        organizationId: userData.organizationId,
        role: userData.role || UserRole.MEMBER,
        status: UserStatus.ACTIVE,
        emailVerified: false,
        phoneVerified: false,
      },
      include: { organization: true },
    });

    return this.login(user);
  }

  refreshToken(
    refreshToken: string,
  ): Promise<{ access_token: string; expires_in: number }> {
    // This is a placeholder implementation
    // In production, you'd want to:
    // 1. Validate the refresh token
    // 2. Check if it's expired
    // 3. Generate a new access token
    // 4. Optionally rotate the refresh token
    throw new BadRequestException(
      'Refresh token functionality not implemented',
    );
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists for security
      return {
        message:
          'If an account with that email exists, a password reset link has been sent',
      };
    }

    // In production, you would:
    // 1. Generate a secure reset token
    // 2. Store it with expiration
    // 3. Send email with reset link
    // For now, just return success message
    return {
      message:
        'If an account with that email exists, a password reset link has been sent',
    };
  }

  resetPassword(token: string, newPassword: string) {
    // In production, you would:
    // 1. Find user by reset token
    // 2. Check if token is valid and not expired
    // 3. Hash new password and update user
    // 4. Invalidate the reset token
    throw new BadRequestException(
      'Password reset functionality not implemented',
    );
  }

  generateOAuthUrl(provider: 'google', organizationId?: string) {
    if (provider === 'google') {
      const state = Math.random().toString(36).substring(7);
      const baseUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
      const params = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID || 'placeholder',
        redirect_uri: `${process.env.APP_URL}/auth/google/callback`,
        response_type: 'code',
        scope: 'openid email profile',
        state: organizationId ? `${state}:${organizationId}` : state,
      });

      return {
        url: `${baseUrl}?${params.toString()}`,
        state,
      };
    }

    throw new BadRequestException('Unsupported OAuth provider');
  }

  handleOAuthCallback(
    provider: 'google',
    code: string,
    state?: string,
  ): LoginResponseDto {
    // In production, you would:
    // 1. Exchange code for access token with OAuth provider
    // 2. Get user info from provider
    // 3. Create or update user in database
    // 4. Generate JWT tokens
    throw new BadRequestException(`${provider} OAuth not implemented yet`);
  }

  // Mock function to create a development token for a specific user
  async createDevToken(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { organization: true },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.login(user);
  }
}
