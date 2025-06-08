import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { User, UserRole, UserStatus, DayOfWeek } from 'generated/prisma';

@Injectable()
export class StaffService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {}

  async createStaff(
    createUserDto: CreateUserDto,
    organizationId: string,
  ): Promise<User> {
    if (createUserDto.role !== UserRole.STAFF) {
      throw new BadRequestException('This service only handles staff creation');
    }

    const staffData = {
      ...createUserDto,
      organizationId,
      role: UserRole.STAFF,
    };

    return this.usersService.create(staffData);
  }

  async getAllStaff(
    organizationId: string,
    searchDto?: any,
  ): Promise<{
    staff: User[];
    total: number;
    page: number;
    limit: number;
  }> {
    const result = await this.usersService.findAll(organizationId, {
      ...searchDto,
      role: UserRole.STAFF,
    });

    return {
      staff: result.users,
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }

  async getStaffById(id: string, organizationId: string): Promise<User> {
    const staff = await this.usersService.findOne(id, organizationId);

    if (staff.role !== UserRole.STAFF) {
      throw new NotFoundException('Staff member not found');
    }

    return staff;
  }

  async updateStaff(
    id: string,
    updateUserDto: UpdateUserDto,
    organizationId: string,
  ): Promise<User> {
    const staff = await this.getStaffById(id, organizationId);

    // Don't allow role change through this service
    if (updateUserDto.role && updateUserDto.role !== UserRole.STAFF) {
      throw new BadRequestException(
        'Cannot change staff role through this service',
      );
    }

    return this.usersService.update(id, updateUserDto, organizationId);
  }

  async deleteStaff(id: string, organizationId: string): Promise<void> {
    await this.getStaffById(id, organizationId); // Verify it's a staff member
    await this.usersService.remove(id, organizationId);
  }

  async getStaffAvailability(
    id: string,
    organizationId: string,
  ): Promise<any[]> {
    const staff = await this.getStaffById(id, organizationId);

    return this.prisma.staffAvailability.findMany({
      where: {
        userId: staff.id,
      },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    });
  }

  async setStaffAvailability(
    id: string,
    organizationId: string,
    availability: {
      dayOfWeek: DayOfWeek;
      startTime: string;
      endTime: string;
      isAvailable?: boolean;
      specificDate?: Date;
      notes?: string;
    }[],
  ): Promise<any[]> {
    const staff = await this.getStaffById(id, organizationId);

    // Delete existing availability for this staff member
    await this.prisma.staffAvailability.deleteMany({
      where: { userId: staff.id },
    });

    // Create new availability records
    const availabilityData = availability.map((avail) => ({
      userId: staff.id,
      ...avail,
    }));

    await this.prisma.staffAvailability.createMany({
      data: availabilityData,
    });

    return this.getStaffAvailability(id, organizationId);
  }

  async getStaffSchedule(
    id: string,
    organizationId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<any[]> {
    const staff = await this.getStaffById(id, organizationId);

    return this.prisma.booking.findMany({
      where: {
        organizationId,
        startTime: { gte: startDate, lte: endDate },
        service: {
          OR: [
            { primaryInstructorId: staff.id },
            { assistantInstructorId: staff.id },
          ],
        },
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
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
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

  async getStaffServices(id: string, organizationId: string): Promise<any[]> {
    const staff = await this.getStaffById(id, organizationId);

    return this.prisma.service.findMany({
      where: {
        organizationId,
        OR: [
          { primaryInstructorId: staff.id },
          { assistantInstructorId: staff.id },
        ],
        isActive: true,
      },
      include: {
        primaryInstructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        assistantInstructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async assignStaffToService(
    staffId: string,
    serviceId: string,
    organizationId: string,
    role: 'primary' | 'assistant' = 'primary',
  ): Promise<any> {
    const staff = await this.getStaffById(staffId, organizationId);

    // Verify service exists and belongs to organization
    const service = await this.prisma.service.findFirst({
      where: {
        id: serviceId,
        organizationId,
      },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    const updateData =
      role === 'primary'
        ? { primaryInstructorId: staff.id }
        : { assistantInstructorId: staff.id };

    return this.prisma.service.update({
      where: { id: serviceId },
      data: updateData,
      include: {
        primaryInstructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        assistantInstructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async removeStaffFromService(
    staffId: string,
    serviceId: string,
    organizationId: string,
    role: 'primary' | 'assistant' = 'primary',
  ): Promise<any> {
    const staff = await this.getStaffById(staffId, organizationId);

    // Verify service exists and belongs to organization
    const service = await this.prisma.service.findFirst({
      where: {
        id: serviceId,
        organizationId,
      },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    const updateData =
      role === 'primary'
        ? { primaryInstructorId: null }
        : { assistantInstructorId: null };

    return this.prisma.service.update({
      where: { id: serviceId },
      data: updateData,
      include: {
        primaryInstructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        assistantInstructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async getStaffTimeOffRequests(
    id: string,
    organizationId: string,
  ): Promise<any[]> {
    const staff = await this.getStaffById(id, organizationId);

    return this.prisma.timeOffRequest.findMany({
      where: {
        userId: staff.id,
      },
      include: {
        approver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createTimeOffRequest(
    id: string,
    organizationId: string,
    timeOffData: {
      type: string;
      startDate: Date;
      endDate: Date;
      reason?: string;
      notes?: string;
    },
  ): Promise<any> {
    const staff = await this.getStaffById(id, organizationId);

    return this.prisma.timeOffRequest.create({
      data: {
        userId: staff.id,
        type: timeOffData.type as any,
        startDate: timeOffData.startDate,
        endDate: timeOffData.endDate,
        reason: timeOffData.reason,
        notes: timeOffData.notes,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async updateTimeOffRequest(
    staffId: string,
    requestId: string,
    organizationId: string,
    status: 'APPROVED' | 'DENIED',
    approverId: string,
    reviewNotes?: string,
  ): Promise<any> {
    await this.getStaffById(staffId, organizationId);

    // Verify the request belongs to the staff member
    const request = await this.prisma.timeOffRequest.findFirst({
      where: {
        id: requestId,
        userId: staffId,
      },
    });

    if (!request) {
      throw new NotFoundException('Time off request not found');
    }

    return this.prisma.timeOffRequest.update({
      where: { id: requestId },
      data: {
        status: status as any,
        approvedBy: approverId,
        approvedAt: new Date(),
        reviewNotes,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        approver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async getStaffPerformanceStats(
    id: string,
    organizationId: string,
  ): Promise<{
    totalClassesTaught: number;
    totalStudentsTaught: number;
    averageRating: number;
    totalRevenue: number;
  }> {
    const staff = await this.getStaffById(id, organizationId);

    const [totalClasses, totalStudents, reviews, revenue] = await Promise.all([
      // Count classes taught
      this.prisma.booking.count({
        where: {
          organizationId,
          status: 'ATTENDED',
          service: {
            OR: [
              { primaryInstructorId: staff.id },
              { assistantInstructorId: staff.id },
            ],
          },
        },
      }),

      // Count unique students taught
      this.prisma.booking.count({
        where: {
          organizationId,
          status: 'ATTENDED',
          service: {
            OR: [
              { primaryInstructorId: staff.id },
              { assistantInstructorId: staff.id },
            ],
          },
        },
      }),

      // Get reviews
      this.prisma.review.findMany({
        where: {
          instructorId: staff.id,
          organizationId,
        },
        select: {
          rating: true,
        },
      }),

      // Calculate revenue (if pricing is tracked)
      this.prisma.booking.aggregate({
        where: {
          organizationId,
          status: 'ATTENDED',
          service: {
            OR: [
              { primaryInstructorId: staff.id },
              { assistantInstructorId: staff.id },
            ],
          },
          price: { not: null },
        },
        _sum: {
          price: true,
        },
      }),
    ]);

    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        : 0;

    return {
      totalClassesTaught: totalClasses,
      totalStudentsTaught: totalStudents,
      averageRating: Math.round(averageRating * 100) / 100,
      totalRevenue: Number(revenue._sum.price || 0),
    };
  }

  async searchStaff(organizationId: string, query: string): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        organizationId,
        role: UserRole.STAFF,
        status: UserStatus.ACTIVE,
        OR: [
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          { employeeId: { contains: query, mode: 'insensitive' } },
          { specialty: { contains: query, mode: 'insensitive' } },
          { department: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        organization: true,
      },
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
      take: 20,
    });
  }

  async getAvailableStaff(
    organizationId: string,
    date: Date,
    startTime: string,
    endTime: string,
    serviceId?: string,
  ): Promise<User[]> {
    // Get all active staff members
    const staffWhere = {
      organizationId,
      role: UserRole.STAFF,
      status: UserStatus.ACTIVE,
      ...(serviceId && {
        OR: [
          { instructedServices: { some: { id: serviceId } } },
          { assistantServices: { some: { id: serviceId } } },
        ],
      }),
    };

    const staff = await this.prisma.user.findMany({
      where: staffWhere,
      include: {
        staffAvailability: true,
        timeOffRequests: {
          where: {
            status: 'APPROVED',
            startDate: { lte: date },
            endDate: { gte: date },
          },
        },
      },
    });

    // Filter based on availability and existing bookings
    const dayOfWeek = [
      'SUNDAY',
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY',
    ][date.getDay()];

    const availableStaff: User[] = [];

    for (const staffMember of staff) {
      // Check if they have time off
      if (staffMember.timeOffRequests.length > 0) {
        continue;
      }

      // Check availability
      const availability = staffMember.staffAvailability.find(
        (a) =>
          a.dayOfWeek === dayOfWeek &&
          a.isAvailable &&
          a.startTime <= startTime &&
          a.endTime >= endTime,
      );

      if (!availability) {
        continue;
      }

      // Check for conflicting bookings
      const conflictingBooking = await this.prisma.booking.findFirst({
        where: {
          organizationId,
          startTime: {
            lt: new Date(`${date.toISOString().split('T')[0]}T${endTime}`),
          },
          endTime: {
            gt: new Date(`${date.toISOString().split('T')[0]}T${startTime}`),
          },
          service: {
            OR: [
              { primaryInstructorId: staffMember.id },
              { assistantInstructorId: staffMember.id },
            ],
          },
          status: { in: ['CONFIRMED', 'PENDING'] },
        },
      });

      if (!conflictingBooking) {
        availableStaff.push(staffMember);
      }
    }

    return availableStaff;
  }
}
