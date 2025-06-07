import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { OrganizationService } from './organization.service';
import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
  CreateLocationDto,
  UpdateLocationDto,
  CreateResourceDto,
  UpdateResourceDto,
  UpdateOrganizationSettingsDto,
  CreateServiceDto,
  UpdateServiceDto,
  ResourceType,
} from './dto/organization.dto';
import { OrganizationResponseDto } from './dto/organization-response.dto';

@ApiTags('Organization Management')
@Controller('organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  // Organization CRUD Operations
  @Post()
  @ApiOperation({ summary: 'Create a new organization' })
  @ApiResponse({
    status: 201,
    description: 'Organization created successfully',
    type: OrganizationResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Organization slug already exists' })
  create(@Body() createOrganizationDto: CreateOrganizationDto) {
    return this.organizationService.createOrganization(createOrganizationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all organizations' })
  @ApiResponse({
    status: 200,
    description: 'Organizations retrieved successfully',
    type: [OrganizationResponseDto],
  })
  findAll() {
    return this.organizationService.findAllOrganizations();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get organization by ID' })
  @ApiParam({ name: 'id', description: 'Organization ID' })
  @ApiResponse({
    status: 200,
    description: 'Organization retrieved successfully',
    type: OrganizationResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  findOne(@Param('id') id: string) {
    return this.organizationService.findOrganizationById(id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get organization by slug' })
  @ApiParam({ name: 'slug', description: 'Organization slug' })
  @ApiResponse({
    status: 200,
    description: 'Organization retrieved successfully',
    type: OrganizationResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  findBySlug(@Param('slug') slug: string) {
    return this.organizationService.findOrganizationBySlug(slug);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update organization' })
  @ApiParam({ name: 'id', description: 'Organization ID' })
  @ApiResponse({
    status: 200,
    description: 'Organization updated successfully',
    type: OrganizationResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  update(
    @Param('id') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    return this.organizationService.updateOrganization(
      id,
      updateOrganizationDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete organization (soft delete)' })
  @ApiParam({ name: 'id', description: 'Organization ID' })
  @ApiResponse({
    status: 204,
    description: 'Organization deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  remove(@Param('id') id: string) {
    return this.organizationService.deleteOrganization(id);
  }

  // Location Management (FR-OM-FM-01)
  @Post(':id/locations')
  @ApiOperation({ summary: 'Create a new location for organization' })
  @ApiParam({ name: 'id', description: 'Organization ID' })
  @ApiResponse({ status: 201, description: 'Location created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  createLocation(
    @Param('id') id: string,
    @Body() createLocationDto: CreateLocationDto,
  ) {
    return this.organizationService.createLocation(id, createLocationDto);
  }

  @Get(':id/locations')
  @ApiOperation({ summary: 'Get all locations for organization' })
  @ApiParam({ name: 'id', description: 'Organization ID' })
  @ApiResponse({ status: 200, description: 'Locations retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  findLocations(@Param('id') id: string) {
    return this.organizationService.findLocationsByOrganization(id);
  }

  @Get(':id/locations/:locationId')
  @ApiOperation({ summary: 'Get location by ID' })
  @ApiParam({ name: 'id', description: 'Organization ID' })
  @ApiParam({ name: 'locationId', description: 'Location ID' })
  @ApiResponse({ status: 200, description: 'Location retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Location not found' })
  findLocation(
    @Param('id') id: string,
    @Param('locationId') locationId: string,
  ) {
    return this.organizationService.findLocationById(id, locationId);
  }

  @Patch(':id/locations/:locationId')
  @ApiOperation({ summary: 'Update location' })
  @ApiParam({ name: 'id', description: 'Organization ID' })
  @ApiParam({ name: 'locationId', description: 'Location ID' })
  @ApiResponse({ status: 200, description: 'Location updated successfully' })
  @ApiResponse({ status: 404, description: 'Location not found' })
  updateLocation(
    @Param('id') id: string,
    @Param('locationId') locationId: string,
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    return this.organizationService.updateLocation(
      id,
      locationId,
      updateLocationDto,
    );
  }

  @Delete(':id/locations/:locationId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete location (soft delete)' })
  @ApiParam({ name: 'id', description: 'Organization ID' })
  @ApiParam({ name: 'locationId', description: 'Location ID' })
  @ApiResponse({ status: 204, description: 'Location deleted successfully' })
  @ApiResponse({ status: 404, description: 'Location not found' })
  removeLocation(
    @Param('id') id: string,
    @Param('locationId') locationId: string,
  ) {
    return this.organizationService.deleteLocation(id, locationId);
  }

  // Resource Management (FR-OM-FM-02, FR-OM-FM-03)
  @Post(':id/resources')
  @ApiOperation({ summary: 'Create a new resource for organization' })
  @ApiParam({ name: 'id', description: 'Organization ID' })
  @ApiResponse({ status: 201, description: 'Resource created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  createResource(
    @Param('id') id: string,
    @Body() createResourceDto: CreateResourceDto,
  ) {
    return this.organizationService.createResource(id, createResourceDto);
  }

  @Get(':id/resources')
  @ApiOperation({ summary: 'Get all resources for organization' })
  @ApiParam({ name: 'id', description: 'Organization ID' })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: ResourceType,
    description: 'Filter by resource type',
  })
  @ApiQuery({
    name: 'locationId',
    required: false,
    description: 'Filter by location ID',
  })
  @ApiResponse({ status: 200, description: 'Resources retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  findResources(
    @Param('id') id: string,
    @Query('type') type?: ResourceType,
    @Query('locationId') locationId?: string,
  ) {
    return this.organizationService.findResourcesByOrganization(
      id,
      type,
      locationId,
    );
  }

  @Get(':id/resources/:resourceId')
  @ApiOperation({ summary: 'Get resource by ID' })
  @ApiParam({ name: 'id', description: 'Organization ID' })
  @ApiParam({ name: 'resourceId', description: 'Resource ID' })
  @ApiResponse({ status: 200, description: 'Resource retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Resource not found' })
  findResource(
    @Param('id') id: string,
    @Param('resourceId') resourceId: string,
  ) {
    return this.organizationService.findResourceById(id, resourceId);
  }

  @Patch(':id/resources/:resourceId')
  @ApiOperation({ summary: 'Update resource' })
  @ApiParam({ name: 'id', description: 'Organization ID' })
  @ApiParam({ name: 'resourceId', description: 'Resource ID' })
  @ApiResponse({ status: 200, description: 'Resource updated successfully' })
  @ApiResponse({ status: 404, description: 'Resource not found' })
  updateResource(
    @Param('id') id: string,
    @Param('resourceId') resourceId: string,
    @Body() updateResourceDto: UpdateResourceDto,
  ) {
    return this.organizationService.updateResource(
      id,
      resourceId,
      updateResourceDto,
    );
  }

  @Delete(':id/resources/:resourceId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete resource (soft delete)' })
  @ApiParam({ name: 'id', description: 'Organization ID' })
  @ApiParam({ name: 'resourceId', description: 'Resource ID' })
  @ApiResponse({ status: 204, description: 'Resource deleted successfully' })
  @ApiResponse({ status: 404, description: 'Resource not found' })
  removeResource(
    @Param('id') id: string,
    @Param('resourceId') resourceId: string,
  ) {
    return this.organizationService.deleteResource(id, resourceId);
  }

  // Organization Settings Management
  @Get(':id/settings')
  @ApiOperation({ summary: 'Get organization settings' })
  @ApiParam({ name: 'id', description: 'Organization ID' })
  @ApiResponse({ status: 200, description: 'Settings retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  getSettings(@Param('id') id: string) {
    return this.organizationService.getOrganizationSettings(id);
  }

  @Patch(':id/settings')
  @ApiOperation({ summary: 'Update organization settings' })
  @ApiParam({ name: 'id', description: 'Organization ID' })
  @ApiResponse({ status: 200, description: 'Settings updated successfully' })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  updateSettings(
    @Param('id') id: string,
    @Body() updateSettingsDto: UpdateOrganizationSettingsDto,
  ) {
    return this.organizationService.updateOrganizationSettings(
      id,
      updateSettingsDto,
    );
  }

  // Service Management (FR-OM-SC-01)
  @Post(':id/services')
  @ApiOperation({ summary: 'Create a new service/class' })
  @ApiParam({ name: 'id', description: 'Organization ID' })
  @ApiResponse({ status: 201, description: 'Service created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid service data' })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  @ApiResponse({ status: 409, description: 'Service name already exists' })
  createService(
    @Param('id') id: string,
    @Body() createServiceDto: CreateServiceDto,
  ) {
    return this.organizationService.createService(id, createServiceDto);
  }

  @Get(':id/services')
  @ApiOperation({ summary: 'Get all services for organization' })
  @ApiParam({ name: 'id', description: 'Organization ID' })
  @ApiResponse({ status: 200, description: 'Services retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  getServices(@Param('id') id: string) {
    return this.organizationService.findServicesByOrganization(id);
  }

  @Get(':id/services/:serviceId')
  @ApiOperation({ summary: 'Get service by ID' })
  @ApiParam({ name: 'id', description: 'Organization ID' })
  @ApiParam({ name: 'serviceId', description: 'Service ID' })
  @ApiResponse({ status: 200, description: 'Service retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  getService(@Param('id') id: string, @Param('serviceId') serviceId: string) {
    return this.organizationService.findServiceById(id, serviceId);
  }

  @Patch(':id/services/:serviceId')
  @ApiOperation({ summary: 'Update service' })
  @ApiParam({ name: 'id', description: 'Organization ID' })
  @ApiParam({ name: 'serviceId', description: 'Service ID' })
  @ApiResponse({ status: 200, description: 'Service updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid service data' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  @ApiResponse({ status: 409, description: 'Service name already exists' })
  updateService(
    @Param('id') id: string,
    @Param('serviceId') serviceId: string,
    @Body() updateServiceDto: UpdateServiceDto,
  ) {
    return this.organizationService.updateService(
      id,
      serviceId,
      updateServiceDto,
    );
  }

  @Delete(':id/services/:serviceId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete service (soft delete)' })
  @ApiParam({ name: 'id', description: 'Organization ID' })
  @ApiParam({ name: 'serviceId', description: 'Service ID' })
  @ApiResponse({ status: 204, description: 'Service deleted successfully' })
  @ApiResponse({ status: 400, description: 'Service has existing bookings' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  removeService(
    @Param('id') id: string,
    @Param('serviceId') serviceId: string,
  ) {
    return this.organizationService.deleteService(id, serviceId);
  }

  @Get(':id/services/type/:serviceType')
  @ApiOperation({ summary: 'Get services by type' })
  @ApiParam({ name: 'id', description: 'Organization ID' })
  @ApiParam({
    name: 'serviceType',
    description: 'Service type',
    enum: ['CLASS', 'APPOINTMENT', 'WORKSHOP', 'PERSONAL_TRAINING'],
  })
  @ApiResponse({ status: 200, description: 'Services retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  getServicesByType(
    @Param('id') id: string,
    @Param('serviceType') serviceType: string,
  ) {
    return this.organizationService.getServicesByType(id, serviceType as any);
  }
}
