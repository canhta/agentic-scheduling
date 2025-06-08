import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { UserRole, User } from 'generated/prisma';
import * as bcrypt from 'bcryptjs';

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
