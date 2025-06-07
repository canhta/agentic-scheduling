import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
  CreateLocationDto,
  UpdateLocationDto,
  CreateResourceDto,
  UpdateResourceDto,
  UpdateOrganizationSettingsDto,
} from './dto/organization.dto';
import { Prisma } from '../../generated/prisma';

@Injectable()
export class OrganizationService {
  constructor(private readonly prisma: PrismaService) {}

  // Organization Management
  async createOrganization(createOrganizationDto: CreateOrganizationDto) {
    try {
      // Check if slug is already taken
      const existingOrg = await this.prisma.organization.findUnique({
        where: { slug: createOrganizationDto.slug },
      });

      if (existingOrg) {
        throw new ConflictException('Organization slug already exists');
      }

      return await this.prisma.organization.create({
        data: {
          ...createOrganizationDto,
          organizationSettings: {
            create: {
              // Create default settings
              bookingWindowDays: 30,
              cancellationWindowHours: 24,
              lateCancelPenalty: false,
              noShowPenalty: true,
              waitlistEnabled: true,
              maxWaitlistSize: 10,
              defaultClassDuration: 60,
              allowRecurringBookings: true,
              maxBookingsPerMember: 10,
              sendConfirmationEmails: true,
              sendReminderEmails: true,
              reminderHours: 24,
              primaryColor: '#007bff',
              secondaryColor: '#6c757d',
              requireMembershipForBooking: false,
              allowGuestBookings: true,
              minimumAdvanceBooking: 0,
              maximumAdvanceBooking: 43200, // 30 days in minutes
            },
          },
        },
        include: {
          organizationSettings: true,
          locations: true,
          resources: true,
        },
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Failed to create organization');
    }
  }

  async findAllOrganizations() {
    return await this.prisma.organization.findMany({
      include: {
        organizationSettings: true,
        locations: {
          where: { isActive: true },
        },
        resources: {
          where: { isActive: true },
        },
        _count: {
          select: {
            users: true,
            locations: true,
            resources: true,
            services: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOrganizationById(id: string) {
    const organization = await this.prisma.organization.findUnique({
      where: { id },
      include: {
        organizationSettings: true,
        locations: {
          where: { isActive: true },
          include: {
            resources: {
              where: { isActive: true },
            },
          },
        },
        resources: {
          where: { isActive: true },
        },
        _count: {
          select: {
            users: true,
            locations: true,
            resources: true,
            services: true,
          },
        },
      },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    return organization;
  }

  async findOrganizationBySlug(slug: string) {
    const organization = await this.prisma.organization.findUnique({
      where: { slug },
      include: {
        organizationSettings: true,
        locations: {
          where: { isActive: true },
        },
        resources: {
          where: { isActive: true },
        },
      },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    return organization;
  }

  async updateOrganization(
    id: string,
    updateOrganizationDto: UpdateOrganizationDto,
  ) {
    try {
      // Check if organization exists
      await this.findOrganizationById(id);

      return await this.prisma.organization.update({
        where: { id },
        data: updateOrganizationDto,
        include: {
          organizationSettings: true,
          locations: {
            where: { isActive: true },
          },
          resources: {
            where: { isActive: true },
          },
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update organization');
    }
  }

  async deleteOrganization(id: string) {
    try {
      // Check if organization exists
      await this.findOrganizationById(id);

      // Soft delete by setting isActive to false
      return await this.prisma.organization.update({
        where: { id },
        data: { isActive: false },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete organization');
    }
  }

  // Location Management (FR-OM-FM-01)
  async createLocation(
    organizationId: string,
    createLocationDto: CreateLocationDto,
  ) {
    try {
      // Verify organization exists
      await this.findOrganizationById(organizationId);

      return await this.prisma.location.create({
        data: {
          ...createLocationDto,
          organizationId,
        },
        include: {
          resources: {
            where: { isActive: true },
          },
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to create location');
    }
  }

  async findLocationsByOrganization(organizationId: string) {
    return await this.prisma.location.findMany({
      where: {
        organizationId,
        isActive: true,
      },
      include: {
        resources: {
          where: { isActive: true },
        },
        _count: {
          select: {
            resources: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findLocationById(organizationId: string, locationId: string) {
    const location = await this.prisma.location.findFirst({
      where: {
        id: locationId,
        organizationId,
        isActive: true,
      },
      include: {
        resources: {
          where: { isActive: true },
        },
      },
    });

    if (!location) {
      throw new NotFoundException('Location not found');
    }

    return location;
  }

  async updateLocation(
    organizationId: string,
    locationId: string,
    updateLocationDto: UpdateLocationDto,
  ) {
    try {
      // Check if location exists
      await this.findLocationById(organizationId, locationId);

      return await this.prisma.location.update({
        where: { id: locationId },
        data: updateLocationDto,
        include: {
          resources: {
            where: { isActive: true },
          },
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update location');
    }
  }

  async deleteLocation(organizationId: string, locationId: string) {
    try {
      // Check if location exists
      await this.findLocationById(organizationId, locationId);

      // Soft delete by setting isActive to false
      return await this.prisma.location.update({
        where: { id: locationId },
        data: { isActive: false },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete location');
    }
  }

  // Resource Management (FR-OM-FM-02, FR-OM-FM-03)
  async createResource(
    organizationId: string,
    createResourceDto: CreateResourceDto,
  ) {
    try {
      // Verify organization exists
      await this.findOrganizationById(organizationId);

      // If locationId is provided, verify it exists and belongs to the organization
      if (createResourceDto.locationId) {
        await this.findLocationById(
          organizationId,
          createResourceDto.locationId,
        );
      }

      return await this.prisma.resource.create({
        data: {
          ...createResourceDto,
          organizationId,
        },
        include: {
          location: true,
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to create resource');
    }
  }

  async findResourcesByOrganization(
    organizationId: string,
    type?: string,
    locationId?: string,
  ) {
    const where: Prisma.ResourceWhereInput = {
      organizationId,
      isActive: true,
    };

    if (type) {
      where.type = type;
    }

    if (locationId) {
      where.locationId = locationId;
    }

    return await this.prisma.resource.findMany({
      where,
      include: {
        location: true,
      },
      orderBy: [{ type: 'asc' }, { name: 'asc' }],
    });
  }

  async findResourceById(organizationId: string, resourceId: string) {
    const resource = await this.prisma.resource.findFirst({
      where: {
        id: resourceId,
        organizationId,
        isActive: true,
      },
      include: {
        location: true,
      },
    });

    if (!resource) {
      throw new NotFoundException('Resource not found');
    }

    return resource;
  }

  async updateResource(
    organizationId: string,
    resourceId: string,
    updateResourceDto: UpdateResourceDto,
  ) {
    try {
      // Check if resource exists
      await this.findResourceById(organizationId, resourceId);

      // If locationId is provided, verify it exists and belongs to the organization
      if (updateResourceDto.locationId) {
        await this.findLocationById(
          organizationId,
          updateResourceDto.locationId,
        );
      }

      return await this.prisma.resource.update({
        where: { id: resourceId },
        data: updateResourceDto,
        include: {
          location: true,
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update resource');
    }
  }

  async deleteResource(organizationId: string, resourceId: string) {
    try {
      // Check if resource exists
      await this.findResourceById(organizationId, resourceId);

      // Soft delete by setting isActive to false
      return await this.prisma.resource.update({
        where: { id: resourceId },
        data: { isActive: false },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete resource');
    }
  }

  // Organization Settings Management
  async getOrganizationSettings(organizationId: string) {
    // Verify organization exists
    await this.findOrganizationById(organizationId);

    const settings = await this.prisma.organizationSettings.findUnique({
      where: { organizationId },
    });

    if (!settings) {
      throw new NotFoundException('Organization settings not found');
    }

    return settings;
  }

  async updateOrganizationSettings(
    organizationId: string,
    updateSettingsDto: UpdateOrganizationSettingsDto,
  ): Promise<any> {
    try {
      // Verify organization exists
      await this.findOrganizationById(organizationId);

      // Handle businessHours conversion to JSON and prepare update data
      const { businessHours, ...otherFields } = updateSettingsDto;

      const updateData = {
        ...otherFields,
        ...(businessHours !== undefined && { businessHours }),
      };

      return await this.prisma.organizationSettings.upsert({
        where: { organizationId },
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        update: updateData as any,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        create: {
          organizationId,
          ...updateData,
        } as any,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update organization settings');
    }
  }
}
