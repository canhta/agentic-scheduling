import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole, User } from 'generated/prisma';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { organization: true },
    });

    if (user && user.status === 'ACTIVE') {
      // In a real implementation, you would verify the password hash here
      // For now, we'll just return the user if found and password is provided
      if (password) {
        return user;
      }
    }
    return null;
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
      },
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
    // In a real implementation, you would hash the password here
    // const hashedPassword = userData.password; // TODO: Hash with bcrypt

    const user = await this.prisma.user.create({
      data: {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        organizationId: userData.organizationId,
        role: userData.role || UserRole.MEMBER,
        status: 'ACTIVE',
      },
      include: { organization: true },
    });

    return this.login(user);
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
