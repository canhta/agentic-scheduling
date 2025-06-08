import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { User, UserRole, UserStatus, Prisma } from 'generated/prisma';

@Injectable()
export class MemberService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {}

  async createMember(
    createUserDto: CreateUserDto,
    organizationId: string,
  ): Promise<User> {
    if (createUserDto.role !== UserRole.MEMBER) {
      throw new BadRequestException(
        'This service only handles member creation',
      );
    }

    const memberData = {
      ...createUserDto,
      organizationId,
      role: UserRole.MEMBER,
      memberSince: new Date(),
    };

    return this.usersService.create(memberData);
  }

  async getAllMembers(
    organizationId: string,
    searchDto?: any,
  ): Promise<{
    members: User[];
    total: number;
    page: number;
    limit: number;
  }> {
    const result = await this.usersService.findAll(organizationId, {
      ...searchDto,
      role: UserRole.MEMBER,
    });

    return {
      members: result.users,
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }

  async getMemberById(id: string, organizationId: string): Promise<User> {
    const member = await this.usersService.findOne(id, organizationId);

    if (member.role !== UserRole.MEMBER) {
      throw new NotFoundException('Member not found');
    }

    return member;
  }

  async getMemberByMemberId(
    memberId: string,
    organizationId: string,
  ): Promise<User> {
    const member = await this.usersService.findByMemberId(
      memberId,
      organizationId,
    );

    if (!member || member.role !== UserRole.MEMBER) {
      throw new NotFoundException('Member not found');
    }

    return member;
  }

  async updateMember(
    id: string,
    updateUserDto: UpdateUserDto,
    organizationId: string,
  ): Promise<User> {
    const member = await this.getMemberById(id, organizationId);

    // Don't allow role change through this service
    if (updateUserDto.role && updateUserDto.role !== UserRole.MEMBER) {
      throw new BadRequestException(
        'Cannot change member role through this service',
      );
    }

    return this.usersService.update(id, updateUserDto, organizationId);
  }

  async deleteMember(id: string, organizationId: string): Promise<void> {
    await this.getMemberById(id, organizationId); // Verify it's a member
    await this.usersService.remove(id, organizationId);
  }

  async getMemberBookingHistory(
    id: string,
    organizationId: string,
    limit = 50,
  ): Promise<any[]> {
    const member = await this.getMemberById(id, organizationId);

    return this.prisma.booking.findMany({
      where: {
        userId: member.id,
        organizationId,
      },
      include: {
        service: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
      orderBy: { startTime: 'desc' },
      take: limit,
    });
  }

  async getMemberAttendanceStats(
    id: string,
    organizationId: string,
  ): Promise<{
    totalBookings: number;
    attended: number;
    noShows: number;
    cancelled: number;
    attendanceRate: number;
  }> {
    const member = await this.getMemberById(id, organizationId);

    const [totalBookings, attended, noShows, cancelled] = await Promise.all([
      this.prisma.booking.count({
        where: { userId: member.id, organizationId },
      }),
      this.prisma.booking.count({
        where: {
          userId: member.id,
          organizationId,
          status: 'ATTENDED',
        },
      }),
      this.prisma.booking.count({
        where: {
          userId: member.id,
          organizationId,
          status: 'NO_SHOW',
        },
      }),
      this.prisma.booking.count({
        where: {
          userId: member.id,
          organizationId,
          status: { in: ['CANCELLED_BY_MEMBER', 'CANCELLED_BY_STAFF'] },
        },
      }),
    ]);

    const attendanceRate =
      totalBookings > 0 ? (attended / totalBookings) * 100 : 0;

    return {
      totalBookings,
      attended,
      noShows,
      cancelled,
      attendanceRate: Math.round(attendanceRate * 100) / 100,
    };
  }

  async getMemberMemberships(
    id: string,
    organizationId: string,
  ): Promise<any[]> {
    const member = await this.getMemberById(id, organizationId);

    return this.prisma.membership.findMany({
      where: {
        userId: member.id,
      },
      include: {
        membershipType: true,
      },
      orderBy: { startDate: 'desc' },
    });
  }

  async getMemberCommunicationHistory(
    id: string,
    organizationId: string,
    limit = 20,
  ): Promise<any[]> {
    const member = await this.getMemberById(id, organizationId);

    return this.prisma.communicationLog.findMany({
      where: {
        userId: member.id,
      },
      orderBy: { sentAt: 'desc' },
      take: limit,
    });
  }

  async getMemberUpcomingBookings(
    id: string,
    organizationId: string,
  ): Promise<any[]> {
    const member = await this.getMemberById(id, organizationId);

    return this.prisma.booking.findMany({
      where: {
        userId: member.id,
        organizationId,
        startTime: { gte: new Date() },
        status: { in: ['CONFIRMED', 'PENDING'] },
      },
      include: {
        service: {
          select: {
            id: true,
            name: true,
            type: true,
            duration: true,
          },
        },
        resource: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
      orderBy: { startTime: 'asc' },
    });
  }

  async activateMember(id: string, organizationId: string): Promise<User> {
    const member = await this.getMemberById(id, organizationId);

    return this.prisma.user.update({
      where: { id: member.id },
      data: { status: UserStatus.ACTIVE },
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

  async deactivateMember(id: string, organizationId: string): Promise<User> {
    const member = await this.getMemberById(id, organizationId);

    return this.prisma.user.update({
      where: { id: member.id },
      data: { status: UserStatus.INACTIVE },
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

  async suspendMember(
    id: string,
    organizationId: string,
    reason?: string,
  ): Promise<User> {
    const member = await this.getMemberById(id, organizationId);

    // Cancel all future bookings
    await this.prisma.booking.updateMany({
      where: {
        userId: member.id,
        organizationId,
        startTime: { gte: new Date() },
        status: { in: ['CONFIRMED', 'PENDING'] },
      },
      data: { status: 'CANCELLED_BY_STAFF' },
    });

    return this.prisma.user.update({
      where: { id: member.id },
      data: { status: UserStatus.SUSPENDED },
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

  async searchMembers(organizationId: string, query: string): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        organizationId,
        role: UserRole.MEMBER,
        OR: [
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          { memberId: { contains: query, mode: 'insensitive' } },
          { phone: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        organization: true,
        memberships: {
          where: { status: 'ACTIVE' },
          include: {
            membershipType: true,
          },
          take: 1,
        },
      },
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
      take: 20,
    });
  }

  async getMemberPackages(id: string, organizationId: string): Promise<any[]> {
    const member = await this.getMemberById(id, organizationId);

    return this.prisma.memberPackage.findMany({
      where: {
        userId: member.id,
        organizationId,
      },
      include: {
        membershipType: true,
        packageUsage: {
          include: {
            booking: {
              include: {
                service: true,
              },
            },
          },
        },
      },
      orderBy: { purchaseDate: 'desc' },
    });
  }
}
