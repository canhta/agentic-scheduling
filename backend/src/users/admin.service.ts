import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from './users.service';
import {
  CreateUserDto,
  UpdateUserDto,
  BulkUserOperationDto,
} from './dto/user.dto';
import { User, UserRole, UserStatus } from 'generated/prisma';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {}

  async createAdmin(
    createUserDto: CreateUserDto,
    organizationId: string,
    creatorRole: UserRole,
  ): Promise<User> {
    // Only ORGANIZATION_ADMIN and SUPER_ADMIN can create admins
    if (
      creatorRole !== UserRole.ORGANIZATION_ADMIN &&
      creatorRole !== UserRole.SUPER_ADMIN
    ) {
      throw new ForbiddenException(
        'Insufficient permissions to create admin users',
      );
    }

    if (createUserDto.role !== UserRole.ADMIN) {
      throw new BadRequestException('This service only handles admin creation');
    }

    const adminData = {
      ...createUserDto,
      organizationId,
      role: UserRole.ADMIN,
    };

    return this.usersService.create(adminData);
  }

  async getAllAdmins(
    organizationId: string,
    searchDto?: any,
  ): Promise<{
    admins: User[];
    total: number;
    page: number;
    limit: number;
  }> {
    const result = await this.usersService.findAll(organizationId, {
      ...searchDto,
      role: UserRole.ADMIN,
    });

    return {
      admins: result.users,
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }

  async getAdminById(id: string, organizationId: string): Promise<User> {
    const admin = await this.usersService.findOne(id, organizationId);

    if (admin.role !== UserRole.ADMIN) {
      throw new NotFoundException('Admin not found');
    }

    return admin;
  }

  async updateAdmin(
    id: string,
    updateUserDto: UpdateUserDto,
    organizationId: string,
    updaterRole: UserRole,
  ): Promise<User> {
    // Only ORGANIZATION_ADMIN and SUPER_ADMIN can update admins
    if (
      updaterRole !== UserRole.ORGANIZATION_ADMIN &&
      updaterRole !== UserRole.SUPER_ADMIN
    ) {
      throw new ForbiddenException(
        'Insufficient permissions to update admin users',
      );
    }

    const admin = await this.getAdminById(id, organizationId);

    // Don't allow role change through this service
    if (updateUserDto.role && updateUserDto.role !== UserRole.ADMIN) {
      throw new BadRequestException(
        'Cannot change admin role through this service',
      );
    }

    return this.usersService.update(id, updateUserDto, organizationId);
  }

  async deleteAdmin(
    id: string,
    organizationId: string,
    deleterRole: UserRole,
  ): Promise<void> {
    // Only ORGANIZATION_ADMIN and SUPER_ADMIN can delete admins
    if (
      deleterRole !== UserRole.ORGANIZATION_ADMIN &&
      deleterRole !== UserRole.SUPER_ADMIN
    ) {
      throw new ForbiddenException(
        'Insufficient permissions to delete admin users',
      );
    }

    await this.getAdminById(id, organizationId); // Verify it's an admin
    await this.usersService.remove(id, organizationId);
  }

  async getOrganizationUsers(
    organizationId: string,
    requesterRole: UserRole,
  ): Promise<{
    totalUsers: number;
    memberCount: number;
    staffCount: number;
    adminCount: number;
    activeUsers: number;
    inactiveUsers: number;
    suspendedUsers: number;
    pendingUsers: number;
  }> {
    // Only admins and above can view organization stats
    if (
      !(
        [
          UserRole.ADMIN,
          UserRole.ORGANIZATION_ADMIN,
          UserRole.SUPER_ADMIN,
        ] as UserRole[]
      ).includes(requesterRole)
    ) {
      throw new ForbiddenException(
        'Insufficient permissions to view organization statistics',
      );
    }

    const [
      totalUsers,
      memberCount,
      staffCount,
      adminCount,
      activeUsers,
      inactiveUsers,
      suspendedUsers,
      pendingUsers,
    ] = await Promise.all([
      this.prisma.user.count({ where: { organizationId } }),
      this.prisma.user.count({
        where: { organizationId, role: UserRole.MEMBER },
      }),
      this.prisma.user.count({
        where: { organizationId, role: UserRole.STAFF },
      }),
      this.prisma.user.count({
        where: { organizationId, role: UserRole.ADMIN },
      }),
      this.prisma.user.count({
        where: { organizationId, status: UserStatus.ACTIVE },
      }),
      this.prisma.user.count({
        where: { organizationId, status: UserStatus.INACTIVE },
      }),
      this.prisma.user.count({
        where: { organizationId, status: UserStatus.SUSPENDED },
      }),
      this.prisma.user.count({
        where: { organizationId, status: UserStatus.PENDING_VERIFICATION },
      }),
    ]);

    return {
      totalUsers,
      memberCount,
      staffCount,
      adminCount,
      activeUsers,
      inactiveUsers,
      suspendedUsers,
      pendingUsers,
    };
  }

  async getOrganizationActivity(
    organizationId: string,
    requesterRole: UserRole,
    startDate?: Date,
    endDate?: Date,
  ): Promise<{
    totalBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    noShows: number;
    newMembers: number;
    totalRevenue: number;
  }> {
    // Only admins and above can view organization activity
    if (
      !(
        [
          UserRole.ADMIN,
          UserRole.ORGANIZATION_ADMIN,
          UserRole.SUPER_ADMIN,
        ] as UserRole[]
      ).includes(requesterRole)
    ) {
      throw new ForbiddenException(
        'Insufficient permissions to view organization activity',
      );
    }

    const dateFilter =
      startDate && endDate
        ? {
            gte: startDate,
            lte: endDate,
          }
        : undefined;

    const [
      totalBookings,
      completedBookings,
      cancelledBookings,
      noShows,
      newMembers,
      revenue,
    ] = await Promise.all([
      this.prisma.booking.count({
        where: {
          organizationId,
          ...(dateFilter && { createdAt: dateFilter }),
        },
      }),
      this.prisma.booking.count({
        where: {
          organizationId,
          status: 'ATTENDED',
          ...(dateFilter && { startTime: dateFilter }),
        },
      }),
      this.prisma.booking.count({
        where: {
          organizationId,
          status: { in: ['CANCELLED_BY_MEMBER', 'CANCELLED_BY_STAFF'] },
          ...(dateFilter && { startTime: dateFilter }),
        },
      }),
      this.prisma.booking.count({
        where: {
          organizationId,
          status: 'NO_SHOW',
          ...(dateFilter && { startTime: dateFilter }),
        },
      }),
      this.prisma.user.count({
        where: {
          organizationId,
          role: UserRole.MEMBER,
          ...(dateFilter && { memberSince: dateFilter }),
        },
      }),
      this.prisma.payment.aggregate({
        where: {
          organizationId,
          status: 'COMPLETED',
          ...(dateFilter && { createdAt: dateFilter }),
        },
        _sum: {
          amount: true,
        },
      }),
    ]);

    return {
      totalBookings,
      completedBookings,
      cancelledBookings,
      noShows,
      newMembers,
      totalRevenue: Number(revenue._sum.amount || 0),
    };
  }

  async bulkUserOperations(
    bulkDto: BulkUserOperationDto,
    organizationId: string,
    requesterRole: UserRole,
  ): Promise<{ affected: number }> {
    // Only admins and above can perform bulk operations
    if (
      !(
        [
          UserRole.ADMIN,
          UserRole.ORGANIZATION_ADMIN,
          UserRole.SUPER_ADMIN,
        ] as UserRole[]
      ).includes(requesterRole)
    ) {
      throw new ForbiddenException(
        'Insufficient permissions to perform bulk operations',
      );
    }

    return this.usersService.bulkOperation(bulkDto, organizationId);
  }

  async getUserLoginHistory(
    organizationId: string,
    requesterRole: UserRole,
    userId?: string,
    limit = 50,
  ): Promise<any[]> {
    // Only admins and above can view login history
    if (
      !(
        [
          UserRole.ADMIN,
          UserRole.ORGANIZATION_ADMIN,
          UserRole.SUPER_ADMIN,
        ] as UserRole[]
      ).includes(requesterRole)
    ) {
      throw new ForbiddenException(
        'Insufficient permissions to view login history',
      );
    }

    const where: any = { organizationId };
    if (userId) {
      where.id = userId;
    }

    return this.prisma.user.findMany({
      where,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        lastLoginAt: true,
        status: true,
      },
      orderBy: { lastLoginAt: 'desc' },
      take: limit,
    });
  }

  async getRecentSignups(
    organizationId: string,
    requesterRole: UserRole,
    days = 30,
  ): Promise<User[]> {
    // Only admins and above can view recent signups
    if (
      !(
        [
          UserRole.ADMIN,
          UserRole.ORGANIZATION_ADMIN,
          UserRole.SUPER_ADMIN,
        ] as UserRole[]
      ).includes(requesterRole)
    ) {
      throw new ForbiddenException(
        'Insufficient permissions to view recent signups',
      );
    }

    const since = new Date();
    since.setDate(since.getDate() - days);

    return this.prisma.user.findMany({
      where: {
        organizationId,
        createdAt: { gte: since },
      },
      include: {
        organization: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUsersRequiringAttention(
    organizationId: string,
    requesterRole: UserRole,
  ): Promise<{
    pendingVerification: User[];
    suspendedUsers: User[];
    usersWithAlerts: User[];
  }> {
    // Only admins and above can view users requiring attention
    if (
      !(
        [
          UserRole.ADMIN,
          UserRole.ORGANIZATION_ADMIN,
          UserRole.SUPER_ADMIN,
        ] as UserRole[]
      ).includes(requesterRole)
    ) {
      throw new ForbiddenException(
        'Insufficient permissions to view users requiring attention',
      );
    }

    const [pendingVerification, suspendedUsers, usersWithAlerts] =
      await Promise.all([
        this.prisma.user.findMany({
          where: {
            organizationId,
            status: UserStatus.PENDING_VERIFICATION,
          },
          include: { organization: true },
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.user.findMany({
          where: {
            organizationId,
            status: UserStatus.SUSPENDED,
          },
          include: { organization: true },
          orderBy: { updatedAt: 'desc' },
        }),
        this.prisma.user.findMany({
          where: {
            organizationId,
            notes: {
              some: {
                isAlert: true,
              },
            },
          },
          include: {
            organization: true,
            notes: {
              where: { isAlert: true },
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
          },
          orderBy: { updatedAt: 'desc' },
        }),
      ]);

    return {
      pendingVerification,
      suspendedUsers,
      usersWithAlerts,
    };
  }

  async promoteUserRole(
    userId: string,
    newRole: UserRole,
    organizationId: string,
    promoterRole: UserRole,
  ): Promise<User> {
    // Role promotion hierarchy checks
    if (promoterRole === UserRole.ADMIN) {
      // Admins can only promote members to staff
      if (newRole !== UserRole.STAFF) {
        throw new ForbiddenException(
          'Admins can only promote members to staff role',
        );
      }
    } else if (promoterRole === UserRole.ORGANIZATION_ADMIN) {
      // Org admins can promote to admin or staff
      if (!([UserRole.ADMIN, UserRole.STAFF] as UserRole[]).includes(newRole)) {
        throw new ForbiddenException(
          'Organization admins can only promote to admin or staff roles',
        );
      }
    } else if (promoterRole !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Insufficient permissions to promote users');
    }

    const user = await this.usersService.findOne(userId, organizationId);

    // Can't promote someone to the same role
    if (user.role === newRole) {
      throw new BadRequestException('User already has this role');
    }

    // Can't promote someone higher than yourself (except super admin)
    if (promoterRole !== UserRole.SUPER_ADMIN) {
      const roleHierarchy = {
        [UserRole.MEMBER]: 1,
        [UserRole.STAFF]: 2,
        [UserRole.ADMIN]: 3,
        [UserRole.ORGANIZATION_ADMIN]: 4,
        [UserRole.SUPER_ADMIN]: 5,
      };

      if (roleHierarchy[newRole] >= roleHierarchy[promoterRole]) {
        throw new ForbiddenException(
          'Cannot promote user to a role equal or higher than your own',
        );
      }
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
      include: {
        organization: true,
      },
    });
  }

  async demoteUserRole(
    userId: string,
    newRole: UserRole,
    organizationId: string,
    demoterRole: UserRole,
  ): Promise<User> {
    // Only organization admins and super admins can demote users
    if (
      !(
        [UserRole.ORGANIZATION_ADMIN, UserRole.SUPER_ADMIN] as UserRole[]
      ).includes(demoterRole)
    ) {
      throw new ForbiddenException('Insufficient permissions to demote users');
    }

    const user = await this.usersService.findOne(userId, organizationId);

    // Can't demote someone to the same role
    if (user.role === newRole) {
      throw new BadRequestException('User already has this role');
    }

    const roleHierarchy = {
      [UserRole.MEMBER]: 1,
      [UserRole.STAFF]: 2,
      [UserRole.ADMIN]: 3,
      [UserRole.ORGANIZATION_ADMIN]: 4,
      [UserRole.SUPER_ADMIN]: 5,
    };

    // Must be a demotion (lower role)
    if (roleHierarchy[newRole] >= roleHierarchy[user.role]) {
      throw new BadRequestException('New role must be lower than current role');
    }

    // Can't demote someone equal or higher than yourself (except super admin)
    if (
      demoterRole !== UserRole.SUPER_ADMIN &&
      roleHierarchy[user.role] >= roleHierarchy[demoterRole]
    ) {
      throw new ForbiddenException(
        'Cannot demote user with equal or higher role than your own',
      );
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
      include: {
        organization: true,
      },
    });
  }
}
