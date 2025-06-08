import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateUserDto,
  UpdateUserDto,
  UserSearchDto,
  BulkUserOperationDto,
  ChangePasswordDto,
  ResetPasswordDto,
} from './dto/user.dto';
import { User, UserRole, UserStatus, Prisma } from 'generated/prisma';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { temporaryPassword, ...userData } = createUserDto;

    // Check if user with email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Check if username is provided and unique
    if (createUserDto.username) {
      const existingUsername = await this.prisma.user.findUnique({
        where: { username: createUserDto.username },
      });

      if (existingUsername) {
        throw new ConflictException('Username already taken');
      }
    }

    // Generate member ID for members
    let memberId: string | undefined;
    if (
      createUserDto.role === UserRole.MEMBER &&
      createUserDto.organizationId
    ) {
      memberId = await this.generateMemberId(createUserDto.organizationId);
    }

    // Hash temporary password if provided
    let hashedPassword: string | undefined;
    if (temporaryPassword) {
      hashedPassword = await bcrypt.hash(temporaryPassword, 10);
    }

    const { organizationId, ...userDataWithoutOrgId } = userData;

    const userCreateData: Prisma.UserCreateInput = {
      ...userDataWithoutOrgId,
      password: hashedPassword, // Add hashed password to user creation
      memberId,
      organization: organizationId
        ? { connect: { id: organizationId } }
        : undefined,
      status: temporaryPassword
        ? UserStatus.PENDING_VERIFICATION
        : UserStatus.ACTIVE,
      memberSince:
        createUserDto.role === UserRole.MEMBER ? new Date() : undefined,
    };

    return this.prisma.user.create({
      data: userCreateData,
      include: {
        organization: true,
      },
    });
  }

  async findAll(
    organizationId?: string,
    searchDto?: UserSearchDto,
  ): Promise<{
    users: User[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = searchDto?.page ? parseInt(searchDto.page) : 1;
    const limit = searchDto?.limit ? parseInt(searchDto.limit) : 20;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
      organizationId,
    };

    // Add search filters
    if (searchDto?.query) {
      where.OR = [
        { firstName: { contains: searchDto.query, mode: 'insensitive' } },
        { lastName: { contains: searchDto.query, mode: 'insensitive' } },
        { email: { contains: searchDto.query, mode: 'insensitive' } },
        { memberId: { contains: searchDto.query, mode: 'insensitive' } },
      ];
    }

    if (searchDto?.role) {
      where.role = searchDto.role;
    }

    if (searchDto?.status) {
      where.status = searchDto.status;
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
        include: {
          organization: true,
          memberships: true,
          notes: {
            where: { isAlert: true },
            orderBy: { createdAt: 'desc' },
            take: 3,
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      users,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string, organizationId?: string): Promise<User> {
    const where: Prisma.UserWhereUniqueInput = { id };

    const user = await this.prisma.user.findUnique({
      where,
      include: {
        organization: true,
        memberships: {
          include: {
            membershipType: true,
          },
        },
        notes: {
          orderBy: { createdAt: 'desc' },
          include: {
            author: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                role: true,
              },
            },
          },
        },
        staffAvailability: true,
        bookings: {
          take: 10,
          orderBy: { startTime: 'desc' },
          include: {
            service: true,
          },
        },
        communicationLogs: {
          take: 10,
          orderBy: { sentAt: 'desc' },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify user belongs to organization if specified
    if (organizationId && user.organizationId !== organizationId) {
      throw new NotFoundException('User not found in this organization');
    }

    return user;
  }

  async findByEmail(
    email: string,
    organizationId?: string,
  ): Promise<User | null> {
    const where: Prisma.UserWhereInput = { email };

    if (organizationId) {
      where.organizationId = organizationId;
    }

    return this.prisma.user.findFirst({
      where,
      include: {
        organization: true,
      },
    });
  }

  async findByMemberId(
    memberId: string,
    organizationId: string,
  ): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        memberId,
        organizationId,
      },
      include: {
        organization: true,
        memberships: {
          include: {
            membershipType: true,
          },
        },
      },
    });
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    organizationId?: string,
  ): Promise<User> {
    const existingUser = await this.findOne(id, organizationId);

    // Check email uniqueness if email is being changed
    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const emailExists = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });

      if (emailExists && emailExists.id !== id) {
        throw new ConflictException('Email already in use');
      }
    }

    // Check username uniqueness if username is being changed
    if (
      updateUserDto.username &&
      updateUserDto.username !== existingUser.username
    ) {
      const usernameExists = await this.prisma.user.findUnique({
        where: { username: updateUserDto.username },
      });

      if (usernameExists && usernameExists.id !== id) {
        throw new ConflictException('Username already taken');
      }
    }

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      include: {
        organization: true,
        memberships: {
          include: {
            membershipType: true,
          },
        },
      },
    });
  }

  async remove(id: string, organizationId?: string): Promise<void> {
    await this.findOne(id, organizationId); // Verify user exists and belongs to org

    await this.prisma.user.delete({
      where: { id },
    });
  }

  async bulkOperation(
    bulkDto: BulkUserOperationDto,
    organizationId?: string,
  ): Promise<{ affected: number }> {
    const { userIds, operation } = bulkDto;

    // Verify all users exist and belong to organization
    const users = await this.prisma.user.findMany({
      where: {
        id: { in: userIds },
        ...(organizationId && { organizationId }),
      },
    });

    if (users.length !== userIds.length) {
      throw new BadRequestException(
        'Some users not found or do not belong to this organization',
      );
    }

    const updateData: Prisma.UserUpdateInput = {};

    switch (operation) {
      case 'activate':
        updateData.status = UserStatus.ACTIVE;
        break;
      case 'deactivate':
        updateData.status = UserStatus.INACTIVE;
        break;
      case 'suspend':
        updateData.status = UserStatus.SUSPENDED;
        break;
      case 'delete': {
        const deleteResult = await this.prisma.user.deleteMany({
          where: {
            id: { in: userIds },
            ...(organizationId && { organizationId }),
          },
        });
        return { affected: deleteResult.count };
      }
    }

    const updateResult = await this.prisma.user.updateMany({
      where: {
        id: { in: userIds },
        ...(organizationId && { organizationId }),
      },
      data: updateData,
    });

    return { affected: updateResult.count };
  }

  async getByRole(role: UserRole, organizationId?: string): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        role,
        ...(organizationId && { organizationId }),
        status: UserStatus.ACTIVE,
      },
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
      include: {
        organization: true,
      },
    });
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    });
  }

  async verifyEmail(id: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: {
        emailVerified: true,
        status: UserStatus.ACTIVE,
      },
      include: {
        organization: true,
      },
    });
  }

  async verifyPhone(id: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { phoneVerified: true },
      include: {
        organization: true,
      },
    });
  }

  async changePassword(
    id: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // If user has a current password, verify it
    if (user.password && changePasswordDto.currentPassword) {
      const isCurrentPasswordValid = await bcrypt.compare(
        changePasswordDto.currentPassword,
        user.password,
      );

      if (!isCurrentPasswordValid) {
        throw new BadRequestException('Current password is incorrect');
      }
    }

    // Validate new password matches confirmation
    if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword) {
      throw new BadRequestException(
        'New password and confirmation do not match',
      );
    }

    // Hash and update the new password
    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);

    await this.prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword, // Update the password field
        updatedAt: new Date(),
      },
    });
  }

  async resetPassword(
    id: string,
    resetPasswordDto: ResetPasswordDto,
    organizationId?: string,
  ): Promise<void> {
    const user = await this.findOne(id, organizationId);

    if (user.email !== resetPasswordDto.email) {
      throw new BadRequestException('Email does not match user account');
    }

    // Generate a temporary password
    const temporaryPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

    await this.prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword, // Set the new temporary password
        status: UserStatus.PENDING_VERIFICATION,
        updatedAt: new Date(),
      },
    });

    // In a real implementation, you would send the temporary password via email
    console.log(`Temporary password for ${user.email}: ${temporaryPassword}`);
  }

  /**
   * Verify a user's password for authentication
   */
  async verifyPassword(email: string, password: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { organization: true },
    });

    if (!user || !user.password) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    // Only return user if they are active
    if (user.status !== UserStatus.ACTIVE) {
      return null;
    }

    return user;
  }

  private async generateMemberId(organizationId: string): Promise<string> {
    // Get organization to use in member ID format
    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
      select: { slug: true },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    // Get current count of members in organization
    const memberCount = await this.prisma.user.count({
      where: {
        organizationId,
        role: UserRole.MEMBER,
      },
    });

    // Generate member ID: ORG-XXXX format
    const orgPrefix = organization.slug.toUpperCase().substring(0, 3);
    const memberNumber = (memberCount + 1).toString().padStart(4, '0');

    return `${orgPrefix}-${memberNumber}`;
  }
}
