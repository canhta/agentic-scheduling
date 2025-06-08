import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserNoteDto, UpdateUserNoteDto } from './dto/user.dto';
import { UserNote, UserRole, User } from 'generated/prisma';

@Injectable()
export class UserNotesService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: string,
    authorId: string,
    createNoteDto: CreateUserNoteDto,
    organizationId: string,
    authorRole: UserRole,
  ): Promise<UserNote> {
    // Only staff, admin, and above can create notes
    if (
      authorRole !== UserRole.STAFF &&
      authorRole !== UserRole.ADMIN &&
      authorRole !== UserRole.ORGANIZATION_ADMIN &&
      authorRole !== UserRole.SUPER_ADMIN
    ) {
      throw new ForbiddenException(
        'Insufficient permissions to create user notes',
      );
    }

    // Verify the target user exists and belongs to the organization
    const targetUser = await this.prisma.user.findFirst({
      where: {
        id: userId,
        organizationId,
      },
    });

    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    // Verify the author belongs to the same organization (except super admin)
    if (authorRole !== UserRole.SUPER_ADMIN) {
      const author = await this.prisma.user.findFirst({
        where: {
          id: authorId,
          organizationId,
        },
      });

      if (!author) {
        throw new ForbiddenException('Author not found in organization');
      }
    }

    return this.prisma.userNote.create({
      data: {
        userId,
        authorId,
        content: createNoteDto.content,
        isAlert: createNoteDto.isAlert || false,
      },
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
    });
  }

  async findAllForUser(
    userId: string,
    organizationId: string,
    requesterRole: UserRole,
    requesterId: string,
  ): Promise<UserNote[]> {
    // Members can only view their own notes
    if (requesterRole === UserRole.MEMBER && requesterId !== userId) {
      throw new ForbiddenException('Members can only view their own notes');
    }

    // Staff and above can view notes for users in their organization
    if (
      requesterRole !== UserRole.STAFF &&
      requesterRole !== UserRole.ADMIN &&
      requesterRole !== UserRole.ORGANIZATION_ADMIN &&
      requesterRole !== UserRole.SUPER_ADMIN
    ) {
      throw new ForbiddenException(
        'Insufficient permissions to view user notes',
      );
    }

    // Verify the target user exists and belongs to the organization
    const targetUser = await this.prisma.user.findFirst({
      where: {
        id: userId,
        organizationId,
      },
    });

    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.userNote.findMany({
      where: { userId },
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
      orderBy: [
        { isAlert: 'desc' }, // Alerts first
        { createdAt: 'desc' },
      ],
    });
  }

  async findOne(
    id: string,
    organizationId: string,
    requesterRole: UserRole,
    requesterId: string,
  ): Promise<UserNote> {
    const note = await this.prisma.userNote.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            organizationId: true,
          },
        },
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    // Verify the note belongs to a user in the correct organization
    const noteUser = note.user as {
      id: string;
      organizationId: string | null;
    } | null;
    if (!noteUser || !noteUser.organizationId) {
      throw new NotFoundException('Note not found');
    }

    if (noteUser.organizationId !== organizationId) {
      throw new NotFoundException('Note not found');
    }

    // Members can only view their own notes
    if (requesterRole === UserRole.MEMBER && requesterId !== note.userId) {
      throw new ForbiddenException('Members can only view their own notes');
    }

    // Staff and above can view notes for users in their organization
    if (
      requesterRole !== UserRole.STAFF &&
      requesterRole !== UserRole.ADMIN &&
      requesterRole !== UserRole.ORGANIZATION_ADMIN &&
      requesterRole !== UserRole.SUPER_ADMIN
    ) {
      throw new ForbiddenException(
        'Insufficient permissions to view user notes',
      );
    }

    return note;
  }

  async update(
    id: string,
    updateNoteDto: UpdateUserNoteDto,
    organizationId: string,
    requesterRole: UserRole,
    requesterId: string,
  ): Promise<UserNote> {
    const note = await this.findOne(
      id,
      organizationId,
      requesterRole,
      requesterId,
    );

    // Only the author or admins can edit notes
    if (
      note.authorId !== requesterId &&
      requesterRole !== UserRole.ADMIN &&
      requesterRole !== UserRole.ORGANIZATION_ADMIN &&
      requesterRole !== UserRole.SUPER_ADMIN
    ) {
      throw new ForbiddenException('Only the author or admins can edit notes');
    }

    return this.prisma.userNote.update({
      where: { id },
      data: {
        content: updateNoteDto.content,
        isAlert: updateNoteDto.isAlert,
        updatedAt: new Date(),
      },
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
    });
  }

  async remove(
    id: string,
    organizationId: string,
    requesterRole: UserRole,
    requesterId: string,
  ): Promise<void> {
    const note = await this.findOne(
      id,
      organizationId,
      requesterRole,
      requesterId,
    );

    // Only the author or admins can delete notes
    if (
      note.authorId !== requesterId &&
      requesterRole !== UserRole.ADMIN &&
      requesterRole !== UserRole.ORGANIZATION_ADMIN &&
      requesterRole !== UserRole.SUPER_ADMIN
    ) {
      throw new ForbiddenException(
        'Only the author or admins can delete notes',
      );
    }

    await this.prisma.userNote.delete({
      where: { id },
    });
  }

  async getAlerts(
    organizationId: string,
    requesterRole: UserRole,
  ): Promise<UserNote[]> {
    // Only staff and above can view alerts
    if (
      requesterRole !== UserRole.STAFF &&
      requesterRole !== UserRole.ADMIN &&
      requesterRole !== UserRole.ORGANIZATION_ADMIN &&
      requesterRole !== UserRole.SUPER_ADMIN
    ) {
      throw new ForbiddenException('Insufficient permissions to view alerts');
    }

    return this.prisma.userNote.findMany({
      where: {
        isAlert: true,
        user: {
          organizationId,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUsersWithAlerts(
    organizationId: string,
    requesterRole: UserRole,
  ): Promise<any[]> {
    // Only staff and above can view users with alerts
    if (
      requesterRole !== UserRole.STAFF &&
      requesterRole !== UserRole.ADMIN &&
      requesterRole !== UserRole.ORGANIZATION_ADMIN &&
      requesterRole !== UserRole.SUPER_ADMIN
    ) {
      throw new ForbiddenException(
        'Insufficient permissions to view users with alerts',
      );
    }

    const usersWithAlerts = await this.prisma.user.findMany({
      where: {
        organizationId,
        notes: {
          some: {
            isAlert: true,
          },
        },
      },
      include: {
        notes: {
          where: {
            isAlert: true,
          },
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
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
    });

    return usersWithAlerts.map((user) => {
      // Safely handle the notes array with explicit type checking
      const notesArray = user.notes;
      const userNotes: any[] =
        notesArray && Array.isArray(notesArray) ? notesArray : [];

      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        alertCount: userNotes.length,
        latestAlert: userNotes.length > 0 ? userNotes[0] : null,
      };
    });
  }

  async markAlertAsRead(
    id: string,
    organizationId: string,
    requesterRole: UserRole,
  ): Promise<UserNote> {
    // Only staff and above can mark alerts as read
    if (
      requesterRole !== UserRole.STAFF &&
      requesterRole !== UserRole.ADMIN &&
      requesterRole !== UserRole.ORGANIZATION_ADMIN &&
      requesterRole !== UserRole.SUPER_ADMIN
    ) {
      throw new ForbiddenException(
        'Insufficient permissions to mark alerts as read',
      );
    }

    const note = await this.prisma.userNote.findFirst({
      where: {
        id,
        isAlert: true,
        user: {
          organizationId,
        },
      },
      include: {
        user: {
          select: {
            organizationId: true,
          },
        },
      },
    });

    if (!note) {
      throw new NotFoundException('Alert not found');
    }

    return this.prisma.userNote.update({
      where: { id },
      data: { isAlert: false },
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
    });
  }

  async getNotesForBooking(
    bookingId: string,
    organizationId: string,
    requesterRole: UserRole,
  ): Promise<UserNote[]> {
    // Only staff and above can view booking-related notes
    if (
      requesterRole !== UserRole.STAFF &&
      requesterRole !== UserRole.ADMIN &&
      requesterRole !== UserRole.ORGANIZATION_ADMIN &&
      requesterRole !== UserRole.SUPER_ADMIN
    ) {
      throw new ForbiddenException(
        'Insufficient permissions to view booking notes',
      );
    }

    // Get the booking to find the user
    const booking = await this.prisma.booking.findFirst({
      where: {
        id: bookingId,
        organizationId,
      },
      select: {
        userId: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Get recent notes for the user
    return this.prisma.userNote.findMany({
      where: {
        userId: booking.userId,
      },
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
      orderBy: { createdAt: 'desc' },
      take: 10, // Get last 10 notes
    });
  }

  async createQuickNote(
    userId: string,
    authorId: string,
    content: string,
    isAlert: boolean,
    organizationId: string,
    authorRole: UserRole,
  ): Promise<UserNote> {
    return this.create(
      userId,
      authorId,
      { content, isAlert },
      organizationId,
      authorRole,
    );
  }

  async getNotesStats(
    organizationId: string,
    requesterRole: UserRole,
  ): Promise<{
    totalNotes: number;
    totalAlerts: number;
    notesThisWeek: number;
    alertsThisWeek: number;
  }> {
    // Only admins and above can view note statistics
    if (
      requesterRole !== UserRole.ADMIN &&
      requesterRole !== UserRole.ORGANIZATION_ADMIN &&
      requesterRole !== UserRole.SUPER_ADMIN
    ) {
      throw new ForbiddenException(
        'Insufficient permissions to view note statistics',
      );
    }

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const [totalNotes, totalAlerts, notesThisWeek, alertsThisWeek] =
      await Promise.all([
        this.prisma.userNote.count({
          where: {
            user: {
              organizationId,
            },
          },
        }),
        this.prisma.userNote.count({
          where: {
            isAlert: true,
            user: {
              organizationId,
            },
          },
        }),
        this.prisma.userNote.count({
          where: {
            createdAt: { gte: weekAgo },
            user: {
              organizationId,
            },
          },
        }),
        this.prisma.userNote.count({
          where: {
            isAlert: true,
            createdAt: { gte: weekAgo },
            user: {
              organizationId,
            },
          },
        }),
      ]);

    return {
      totalNotes,
      totalAlerts,
      notesThisWeek,
      alertsThisWeek,
    };
  }
}
