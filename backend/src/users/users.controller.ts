import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserRole, User, UserNote } from 'generated/prisma';
import { UsersService } from './users.service';
import { MemberService } from './member.service';
import { StaffService } from './staff.service';
import { AdminService } from './admin.service';
import { UserNotesService } from './user-notes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import {
  GetUser,
  GetOrganizationId,
} from '../auth/decorators/get-user.decorator';
import {
  CreateUserDto,
  UpdateUserDto,
  UserSearchDto,
  BulkUserOperationDto,
  ChangePasswordDto,
  ResetPasswordDto,
  CreateUserNoteDto,
  UpdateUserNoteDto,
} from './dto/user.dto';
import {
  UserResponseDto,
  PaginatedUsersResponseDto,
  OrganizationStatsResponseDto,
  OrganizationActivityResponseDto,
  BulkOperationResponseDto,
  UserNoteResponseDto,
  UserWithAlertsResponseDto,
  AttentionUsersResponseDto,
  NotesStatsResponseDto,
} from './dto/user-response.dto';

@ApiTags('User Management')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly memberService: MemberService,
    private readonly staffService: StaffService,
    private readonly adminService: AdminService,
    private readonly userNotesService: UserNotesService,
  ) {}

  // =============================================================================
  // GENERAL USER MANAGEMENT
  // =============================================================================

  @Post()
  @Roles(UserRole.ADMIN, UserRole.ORGANIZATION_ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid user data' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async create(
    @Body() createUserDto: CreateUserDto,
    @GetUser() currentUser: User,
    @GetOrganizationId() organizationId: string,
  ): Promise<UserResponseDto> {
    // Set organization ID from current user context
    createUserDto.organizationId = organizationId;

    const user = await this.usersService.create(createUserDto);
    return this.mapToUserResponse(user);
  }

  @Get()
  @Roles(
    UserRole.STAFF,
    UserRole.ADMIN,
    UserRole.ORGANIZATION_ADMIN,
    UserRole.SUPER_ADMIN,
  )
  @ApiOperation({ summary: 'Get all users with search and filtering' })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
    type: PaginatedUsersResponseDto,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search term for name or email',
  })
  @ApiQuery({
    name: 'role',
    required: false,
    enum: UserRole,
    description: 'Filter by user role',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by user status',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (default: 20)',
  })
  async findAll(
    @Query() searchDto: UserSearchDto,
    @GetOrganizationId() organizationId: string,
  ): Promise<PaginatedUsersResponseDto> {
    const result = await this.usersService.findAll(organizationId, searchDto);

    return {
      users: result.users.map((user) => this.mapToUserResponse(user)),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: Math.ceil(result.total / result.limit),
    };
  }

  @Get(':id')
  @Roles(
    UserRole.STAFF,
    UserRole.ADMIN,
    UserRole.ORGANIZATION_ADMIN,
    UserRole.SUPER_ADMIN,
  )
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User found',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiParam({ name: 'id', description: 'User ID' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @GetOrganizationId() organizationId: string,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.findOne(id, organizationId);
    return this.mapToUserResponse(user);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZATION_ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiParam({ name: 'id', description: 'User ID' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @GetOrganizationId() organizationId: string,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.update(
      id,
      updateUserDto,
      organizationId,
    );
    return this.mapToUserResponse(user);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZATION_ADMIN, UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 204, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiParam({ name: 'id', description: 'User ID' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @GetOrganizationId() organizationId: string,
  ): Promise<void> {
    await this.usersService.remove(id, organizationId);
  }

  // =============================================================================
  // MEMBER MANAGEMENT
  // =============================================================================

  @Post('members')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZATION_ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new member' })
  @ApiResponse({
    status: 201,
    description: 'Member created successfully',
    type: UserResponseDto,
  })
  async createMember(
    @Body() createUserDto: CreateUserDto,
    @GetOrganizationId() organizationId: string,
  ): Promise<UserResponseDto> {
    createUserDto.role = UserRole.MEMBER;
    const member = await this.memberService.createMember(
      createUserDto,
      organizationId,
    );
    return this.mapToUserResponse(member);
  }

  @Get('members')
  @Roles(
    UserRole.STAFF,
    UserRole.ADMIN,
    UserRole.ORGANIZATION_ADMIN,
    UserRole.SUPER_ADMIN,
  )
  @ApiOperation({ summary: 'Get all members' })
  @ApiResponse({
    status: 200,
    description: 'Members retrieved successfully',
    type: PaginatedUsersResponseDto,
  })
  async getAllMembers(
    @Query() searchDto: UserSearchDto,
    @GetOrganizationId() organizationId: string,
  ): Promise<PaginatedUsersResponseDto> {
    const result = await this.memberService.getAllMembers(
      organizationId,
      searchDto,
    );

    return {
      users: result.members.map((member) => this.mapToUserResponse(member)),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: Math.ceil(result.total / result.limit),
    };
  }

  @Get('members/:id')
  @Roles(
    UserRole.STAFF,
    UserRole.ADMIN,
    UserRole.ORGANIZATION_ADMIN,
    UserRole.SUPER_ADMIN,
  )
  @ApiOperation({ summary: 'Get member by ID' })
  @ApiResponse({
    status: 200,
    description: 'Member found',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Member not found' })
  @ApiParam({ name: 'id', description: 'Member ID' })
  async getMemberById(
    @Param('id', ParseUUIDPipe) id: string,
    @GetOrganizationId() organizationId: string,
  ): Promise<UserResponseDto> {
    const member = await this.memberService.getMemberById(id, organizationId);
    return this.mapToUserResponse(member);
  }

  @Get('members/member-id/:memberId')
  @Roles(
    UserRole.STAFF,
    UserRole.ADMIN,
    UserRole.ORGANIZATION_ADMIN,
    UserRole.SUPER_ADMIN,
  )
  @ApiOperation({ summary: 'Get member by member ID' })
  @ApiResponse({
    status: 200,
    description: 'Member found',
    type: UserResponseDto,
  })
  @ApiParam({ name: 'memberId', description: 'Member ID' })
  async getMemberByMemberId(
    @Param('memberId') memberId: string,
    @GetOrganizationId() organizationId: string,
  ): Promise<UserResponseDto> {
    const member = await this.memberService.getMemberByMemberId(
      memberId,
      organizationId,
    );
    return this.mapToUserResponse(member);
  }

  @Patch('members/:id')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZATION_ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update member' })
  @ApiResponse({
    status: 200,
    description: 'Member updated successfully',
    type: UserResponseDto,
  })
  async updateMember(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @GetOrganizationId() organizationId: string,
  ): Promise<UserResponseDto> {
    const member = await this.memberService.updateMember(
      id,
      updateUserDto,
      organizationId,
    );
    return this.mapToUserResponse(member);
  }

  @Delete('members/:id')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZATION_ADMIN, UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete member' })
  @ApiResponse({ status: 204, description: 'Member deleted successfully' })
  async deleteMember(
    @Param('id', ParseUUIDPipe) id: string,
    @GetOrganizationId() organizationId: string,
  ): Promise<void> {
    await this.memberService.deleteMember(id, organizationId);
  }

  @Get('members/:id/booking-history')
  @Roles(
    UserRole.STAFF,
    UserRole.ADMIN,
    UserRole.ORGANIZATION_ADMIN,
    UserRole.SUPER_ADMIN,
  )
  @ApiOperation({ summary: 'Get member booking history' })
  @ApiResponse({
    status: 200,
    description: 'Booking history retrieved successfully',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of records to return',
  })
  async getMemberBookingHistory(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('limit') limit: number = 50,
    @GetOrganizationId() organizationId: string,
  ) {
    return this.memberService.getMemberBookingHistory(
      id,
      organizationId,
      limit,
    );
  }

  @Get('members/:id/attendance-stats')
  @Roles(
    UserRole.STAFF,
    UserRole.ADMIN,
    UserRole.ORGANIZATION_ADMIN,
    UserRole.SUPER_ADMIN,
  )
  @ApiOperation({ summary: 'Get member attendance statistics' })
  @ApiResponse({
    status: 200,
    description: 'Attendance statistics retrieved successfully',
  })
  async getMemberAttendanceStats(
    @Param('id', ParseUUIDPipe) id: string,
    @GetOrganizationId() organizationId: string,
  ) {
    return this.memberService.getMemberAttendanceStats(id, organizationId);
  }

  @Post('members/:id/activate')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZATION_ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Activate member' })
  @ApiResponse({
    status: 200,
    description: 'Member activated successfully',
    type: UserResponseDto,
  })
  async activateMember(
    @Param('id', ParseUUIDPipe) id: string,
    @GetOrganizationId() organizationId: string,
  ): Promise<UserResponseDto> {
    const member = await this.memberService.activateMember(id, organizationId);
    return this.mapToUserResponse(member);
  }

  @Post('members/:id/deactivate')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZATION_ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Deactivate member' })
  @ApiResponse({
    status: 200,
    description: 'Member deactivated successfully',
    type: UserResponseDto,
  })
  async deactivateMember(
    @Param('id', ParseUUIDPipe) id: string,
    @GetOrganizationId() organizationId: string,
  ): Promise<UserResponseDto> {
    const member = await this.memberService.deactivateMember(
      id,
      organizationId,
    );
    return this.mapToUserResponse(member);
  }

  @Post('members/:id/suspend')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZATION_ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Suspend member' })
  @ApiResponse({
    status: 200,
    description: 'Member suspended successfully',
    type: UserResponseDto,
  })
  async suspendMember(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('reason') reason: string,
    @GetOrganizationId() organizationId: string,
  ): Promise<UserResponseDto> {
    const member = await this.memberService.suspendMember(
      id,
      organizationId,
      reason,
    );
    return this.mapToUserResponse(member);
  }

  // =============================================================================
  // STAFF MANAGEMENT
  // =============================================================================

  @Post('staff')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZATION_ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new staff member' })
  @ApiResponse({
    status: 201,
    description: 'Staff member created successfully',
    type: UserResponseDto,
  })
  async createStaff(
    @Body() createUserDto: CreateUserDto,
    @GetOrganizationId() organizationId: string,
  ): Promise<UserResponseDto> {
    createUserDto.role = UserRole.STAFF;
    const staff = await this.staffService.createStaff(
      createUserDto,
      organizationId,
    );
    return this.mapToUserResponse(staff);
  }

  @Get('staff')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZATION_ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get all staff members' })
  @ApiResponse({
    status: 200,
    description: 'Staff members retrieved successfully',
    type: PaginatedUsersResponseDto,
  })
  async getAllStaff(
    @Query() searchDto: UserSearchDto,
    @GetOrganizationId() organizationId: string,
  ): Promise<PaginatedUsersResponseDto> {
    const result = await this.staffService.getAllStaff(
      organizationId,
      searchDto,
    );

    return {
      users: result.staff.map((staff) => this.mapToUserResponse(staff)),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: Math.ceil(result.total / result.limit),
    };
  }

  @Get('staff/:id')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZATION_ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get staff member by ID' })
  @ApiResponse({
    status: 200,
    description: 'Staff member found',
    type: UserResponseDto,
  })
  async getStaffById(
    @Param('id', ParseUUIDPipe) id: string,
    @GetOrganizationId() organizationId: string,
  ): Promise<UserResponseDto> {
    const staff = await this.staffService.getStaffById(id, organizationId);
    return this.mapToUserResponse(staff);
  }

  @Patch('staff/:id')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZATION_ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update staff member' })
  @ApiResponse({
    status: 200,
    description: 'Staff member updated successfully',
    type: UserResponseDto,
  })
  async updateStaff(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @GetOrganizationId() organizationId: string,
  ): Promise<UserResponseDto> {
    const staff = await this.staffService.updateStaff(
      id,
      updateUserDto,
      organizationId,
    );
    return this.mapToUserResponse(staff);
  }

  @Delete('staff/:id')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZATION_ADMIN, UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete staff member' })
  @ApiResponse({
    status: 204,
    description: 'Staff member deleted successfully',
  })
  async deleteStaff(
    @Param('id', ParseUUIDPipe) id: string,
    @GetOrganizationId() organizationId: string,
  ): Promise<void> {
    await this.staffService.deleteStaff(id, organizationId);
  }

  @Get('staff/:id/availability')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZATION_ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get staff availability' })
  @ApiResponse({
    status: 200,
    description: 'Staff availability retrieved successfully',
  })
  async getStaffAvailability(
    @Param('id', ParseUUIDPipe) id: string,
    @GetOrganizationId() organizationId: string,
  ) {
    return this.staffService.getStaffAvailability(id, organizationId);
  }

  @Post('staff/:id/availability')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZATION_ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Set staff availability' })
  @ApiResponse({
    status: 200,
    description: 'Staff availability set successfully',
  })
  async setStaffAvailability(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() availability: any,
    @GetOrganizationId() organizationId: string,
  ) {
    return this.staffService.setStaffAvailability(
      id,
      organizationId,
      availability,
    );
  }

  // =============================================================================
  // ADMIN MANAGEMENT
  // =============================================================================

  @Post('admins')
  @Roles(UserRole.ORGANIZATION_ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new admin' })
  @ApiResponse({
    status: 201,
    description: 'Admin created successfully',
    type: UserResponseDto,
  })
  async createAdmin(
    @Body() createUserDto: CreateUserDto,
    @GetUser() currentUser: User,
    @GetOrganizationId() organizationId: string,
  ): Promise<UserResponseDto> {
    createUserDto.role = UserRole.ADMIN;
    const admin = await this.adminService.createAdmin(
      createUserDto,
      organizationId,
      currentUser.role,
    );
    return this.mapToUserResponse(admin);
  }

  @Get('admins')
  @Roles(UserRole.ORGANIZATION_ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get all admins' })
  @ApiResponse({
    status: 200,
    description: 'Admins retrieved successfully',
    type: PaginatedUsersResponseDto,
  })
  async getAllAdmins(
    @Query() searchDto: UserSearchDto,
    @GetOrganizationId() organizationId: string,
  ): Promise<PaginatedUsersResponseDto> {
    const result = await this.adminService.getAllAdmins(
      organizationId,
      searchDto,
    );

    return {
      users: result.admins.map((admin) => this.mapToUserResponse(admin)),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: Math.ceil(result.total / result.limit),
    };
  }

  @Get('admins/:id')
  @Roles(UserRole.ORGANIZATION_ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get admin by ID' })
  @ApiResponse({
    status: 200,
    description: 'Admin found',
    type: UserResponseDto,
  })
  async getAdminById(
    @Param('id', ParseUUIDPipe) id: string,
    @GetOrganizationId() organizationId: string,
  ): Promise<UserResponseDto> {
    const admin = await this.adminService.getAdminById(id, organizationId);
    return this.mapToUserResponse(admin);
  }

  @Patch('admins/:id')
  @Roles(UserRole.ORGANIZATION_ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update admin' })
  @ApiResponse({
    status: 200,
    description: 'Admin updated successfully',
    type: UserResponseDto,
  })
  async updateAdmin(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @GetUser() currentUser: User,
    @GetOrganizationId() organizationId: string,
  ): Promise<UserResponseDto> {
    const admin = await this.adminService.updateAdmin(
      id,
      updateUserDto,
      organizationId,
      currentUser.role,
    );
    return this.mapToUserResponse(admin);
  }

  @Delete('admins/:id')
  @Roles(UserRole.ORGANIZATION_ADMIN, UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete admin' })
  @ApiResponse({ status: 204, description: 'Admin deleted successfully' })
  async deleteAdmin(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() currentUser: User,
    @GetOrganizationId() organizationId: string,
  ): Promise<void> {
    await this.adminService.deleteAdmin(id, organizationId, currentUser.role);
  }

  // =============================================================================
  // ORGANIZATION MANAGEMENT & STATISTICS
  // =============================================================================

  @Get('organization/stats')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZATION_ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get organization user statistics' })
  @ApiResponse({
    status: 200,
    description: 'Organization statistics retrieved successfully',
    type: OrganizationStatsResponseDto,
  })
  async getOrganizationStats(
    @GetUser() currentUser: User,
    @GetOrganizationId() organizationId: string,
  ): Promise<OrganizationStatsResponseDto> {
    return this.adminService.getOrganizationUsers(
      organizationId,
      currentUser.role,
    );
  }

  @Get('organization/activity')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZATION_ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get organization activity report' })
  @ApiResponse({
    status: 200,
    description: 'Organization activity retrieved successfully',
    type: OrganizationActivityResponseDto,
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Start date for activity report',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'End date for activity report',
  })
  async getOrganizationActivity(
    @GetUser() currentUser: User,
    @GetOrganizationId() organizationId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<OrganizationActivityResponseDto> {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;

    return this.adminService.getOrganizationActivity(
      organizationId,
      currentUser.role,
      start,
      end,
    );
  }

  @Get('organization/recent-signups')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZATION_ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get recent user signups' })
  @ApiResponse({
    status: 200,
    description: 'Recent signups retrieved successfully',
    type: [UserResponseDto],
  })
  @ApiQuery({
    name: 'days',
    required: false,
    type: Number,
    description: 'Number of days to look back (default: 30)',
  })
  async getRecentSignups(
    @GetUser() currentUser: User,
    @GetOrganizationId() organizationId: string,
    @Query('days') days: number = 30,
  ): Promise<UserResponseDto[]> {
    const users = await this.adminService.getRecentSignups(
      organizationId,
      currentUser.role,
      days,
    );
    return users.map((user) => this.mapToUserResponse(user));
  }

  @Get('organization/attention-required')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZATION_ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get users requiring attention' })
  @ApiResponse({
    status: 200,
    description: 'Users requiring attention retrieved successfully',
    type: AttentionUsersResponseDto,
  })
  async getUsersRequiringAttention(
    @GetUser() currentUser: User,
    @GetOrganizationId() organizationId: string,
  ): Promise<AttentionUsersResponseDto> {
    const result = await this.adminService.getUsersRequiringAttention(
      organizationId,
      currentUser.role,
    );

    return {
      pendingVerification: result.pendingVerification.map((user) =>
        this.mapToUserResponse(user),
      ),
      suspendedUsers: result.suspendedUsers.map((user) =>
        this.mapToUserResponse(user),
      ),
      usersWithAlerts: result.usersWithAlerts.map((user) =>
        this.mapToUserResponse(user),
      ),
    };
  }

  // =============================================================================
  // BULK OPERATIONS
  // =============================================================================

  @Post('bulk-operations')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZATION_ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Perform bulk operations on users' })
  @ApiResponse({
    status: 200,
    description: 'Bulk operation completed successfully',
    type: BulkOperationResponseDto,
  })
  async bulkUserOperations(
    @Body() bulkDto: BulkUserOperationDto,
    @GetUser() currentUser: User,
    @GetOrganizationId() organizationId: string,
  ): Promise<BulkOperationResponseDto> {
    return this.adminService.bulkUserOperations(
      bulkDto,
      organizationId,
      currentUser.role,
    );
  }

  // =============================================================================
  // ROLE MANAGEMENT
  // =============================================================================

  @Post(':id/promote')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZATION_ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Promote user role' })
  @ApiResponse({
    status: 200,
    description: 'User role promoted successfully',
    type: UserResponseDto,
  })
  async promoteUserRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('newRole') newRole: UserRole,
    @GetUser() currentUser: User,
    @GetOrganizationId() organizationId: string,
  ): Promise<UserResponseDto> {
    const user = await this.adminService.promoteUserRole(
      id,
      newRole,
      organizationId,
      currentUser.role,
    );
    return this.mapToUserResponse(user);
  }

  @Post(':id/demote')
  @Roles(UserRole.ORGANIZATION_ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Demote user role' })
  @ApiResponse({
    status: 200,
    description: 'User role demoted successfully',
    type: UserResponseDto,
  })
  async demoteUserRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('newRole') newRole: UserRole,
    @GetUser() currentUser: User,
    @GetOrganizationId() organizationId: string,
  ): Promise<UserResponseDto> {
    const user = await this.adminService.demoteUserRole(
      id,
      newRole,
      organizationId,
      currentUser.role,
    );
    return this.mapToUserResponse(user);
  }

  // =============================================================================
  // AUTHENTICATION & VERIFICATION
  // =============================================================================

  @Post(':id/change-password')
  @Roles(
    UserRole.MEMBER,
    UserRole.STAFF,
    UserRole.ADMIN,
    UserRole.ORGANIZATION_ADMIN,
    UserRole.SUPER_ADMIN,
  )
  @ApiOperation({ summary: 'Change user password' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid password data' })
  async changePassword(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() changePasswordDto: ChangePasswordDto,
    @GetUser() currentUser: User,
  ): Promise<{ message: string }> {
    // Users can only change their own password, admins can change any password
    if (
      currentUser.id !== id &&
      !(
        [
          UserRole.ADMIN,
          UserRole.ORGANIZATION_ADMIN,
          UserRole.SUPER_ADMIN,
        ] as UserRole[]
      ).includes(currentUser.role)
    ) {
      throw new Error('Unauthorized to change this password');
    }

    await this.usersService.changePassword(id, changePasswordDto);
    return { message: 'Password changed successfully' };
  }

  @Post(':id/reset-password')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZATION_ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Reset user password' })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  async resetPassword(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() resetPasswordDto: ResetPasswordDto,
    @GetOrganizationId() organizationId: string,
  ): Promise<{ message: string }> {
    await this.usersService.resetPassword(id, resetPasswordDto, organizationId);
    return { message: 'Password reset successfully' };
  }

  @Post(':id/verify-email')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZATION_ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Verify user email' })
  @ApiResponse({
    status: 200,
    description: 'Email verified successfully',
    type: UserResponseDto,
  })
  async verifyEmail(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.verifyEmail(id);
    return this.mapToUserResponse(user);
  }

  @Post(':id/verify-phone')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZATION_ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Verify user phone' })
  @ApiResponse({
    status: 200,
    description: 'Phone verified successfully',
    type: UserResponseDto,
  })
  async verifyPhone(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.verifyPhone(id);
    return this.mapToUserResponse(user);
  }

  // =============================================================================
  // USER NOTES & ALERTS
  // =============================================================================

  @Post(':userId/notes')
  @Roles(
    UserRole.STAFF,
    UserRole.ADMIN,
    UserRole.ORGANIZATION_ADMIN,
    UserRole.SUPER_ADMIN,
  )
  @ApiOperation({ summary: 'Create user note' })
  @ApiResponse({
    status: 201,
    description: 'Note created successfully',
    type: UserNoteResponseDto,
  })
  async createUserNote(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() createNoteDto: CreateUserNoteDto,
    @GetUser() currentUser: User,
    @GetOrganizationId() organizationId: string,
  ): Promise<UserNoteResponseDto> {
    const note = await this.userNotesService.create(
      userId,
      currentUser.id,
      createNoteDto,
      organizationId,
      currentUser.role,
    );
    return this.mapToUserNoteResponse(note);
  }

  @Get(':userId/notes')
  @Roles(
    UserRole.STAFF,
    UserRole.ADMIN,
    UserRole.ORGANIZATION_ADMIN,
    UserRole.SUPER_ADMIN,
  )
  @ApiOperation({ summary: 'Get user notes' })
  @ApiResponse({
    status: 200,
    description: 'Notes retrieved successfully',
    type: [UserNoteResponseDto],
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getUserNotes(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @GetUser() currentUser: User,
    @GetOrganizationId() organizationId: string,
  ): Promise<UserNoteResponseDto[]> {
    const notes = await this.userNotesService.findAllForUser(
      userId,
      organizationId,
      currentUser.role,
      currentUser.id,
    );
    return notes.map((note) => this.mapToUserNoteResponse(note));
  }

  @Get('notes/:noteId')
  @Roles(
    UserRole.STAFF,
    UserRole.ADMIN,
    UserRole.ORGANIZATION_ADMIN,
    UserRole.SUPER_ADMIN,
  )
  @ApiOperation({ summary: 'Get specific note' })
  @ApiResponse({
    status: 200,
    description: 'Note retrieved successfully',
    type: UserNoteResponseDto,
  })
  async getNote(
    @Param('noteId', ParseUUIDPipe) noteId: string,
    @GetUser() currentUser: User,
    @GetOrganizationId() organizationId: string,
  ): Promise<UserNoteResponseDto> {
    const note = await this.userNotesService.findOne(
      noteId,
      organizationId,
      currentUser.role,
      currentUser.id,
    );
    return this.mapToUserNoteResponse(note);
  }

  @Patch('notes/:noteId')
  @Roles(
    UserRole.STAFF,
    UserRole.ADMIN,
    UserRole.ORGANIZATION_ADMIN,
    UserRole.SUPER_ADMIN,
  )
  @ApiOperation({ summary: 'Update user note' })
  @ApiResponse({
    status: 200,
    description: 'Note updated successfully',
    type: UserNoteResponseDto,
  })
  async updateUserNote(
    @Param('noteId', ParseUUIDPipe) noteId: string,
    @Body() updateNoteDto: UpdateUserNoteDto,
    @GetUser() currentUser: User,
    @GetOrganizationId() organizationId: string,
  ): Promise<UserNoteResponseDto> {
    const note = await this.userNotesService.update(
      noteId,
      updateNoteDto,
      organizationId,
      currentUser.role,
      currentUser.id,
    );
    return this.mapToUserNoteResponse(note);
  }

  @Delete('notes/:noteId')
  @Roles(
    UserRole.STAFF,
    UserRole.ADMIN,
    UserRole.ORGANIZATION_ADMIN,
    UserRole.SUPER_ADMIN,
  )
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user note' })
  @ApiResponse({ status: 204, description: 'Note deleted successfully' })
  async deleteUserNote(
    @Param('noteId', ParseUUIDPipe) noteId: string,
    @GetUser() currentUser: User,
    @GetOrganizationId() organizationId: string,
  ): Promise<void> {
    await this.userNotesService.remove(
      noteId,
      organizationId,
      currentUser.role,
      currentUser.id,
    );
  }

  @Get('organization/alerts')
  @Roles(
    UserRole.STAFF,
    UserRole.ADMIN,
    UserRole.ORGANIZATION_ADMIN,
    UserRole.SUPER_ADMIN,
  )
  @ApiOperation({ summary: 'Get all alerts for organization' })
  @ApiResponse({
    status: 200,
    description: 'Alerts retrieved successfully',
    type: [UserNoteResponseDto],
  })
  async getAlerts(
    @GetUser() currentUser: User,
    @GetOrganizationId() organizationId: string,
  ): Promise<UserNoteResponseDto[]> {
    const alerts = await this.userNotesService.getAlerts(
      organizationId,
      currentUser.role,
    );
    return alerts.map((alert) => this.mapToUserNoteResponse(alert));
  }

  @Get('organization/users-with-alerts')
  @Roles(
    UserRole.STAFF,
    UserRole.ADMIN,
    UserRole.ORGANIZATION_ADMIN,
    UserRole.SUPER_ADMIN,
  )
  @ApiOperation({ summary: 'Get users with alerts' })
  @ApiResponse({
    status: 200,
    description: 'Users with alerts retrieved successfully',
    type: [UserWithAlertsResponseDto],
  })
  async getUsersWithAlerts(
    @GetUser() currentUser: User,
    @GetOrganizationId() organizationId: string,
  ): Promise<UserWithAlertsResponseDto[]> {
    return this.userNotesService.getUsersWithAlerts(
      organizationId,
      currentUser.role,
    );
  }

  @Post('alerts/:alertId/mark-read')
  @Roles(
    UserRole.STAFF,
    UserRole.ADMIN,
    UserRole.ORGANIZATION_ADMIN,
    UserRole.SUPER_ADMIN,
  )
  @ApiOperation({ summary: 'Mark alert as read' })
  @ApiResponse({
    status: 200,
    description: 'Alert marked as read successfully',
    type: UserNoteResponseDto,
  })
  async markAlertAsRead(
    @Param('alertId', ParseUUIDPipe) alertId: string,
    @GetUser() currentUser: User,
    @GetOrganizationId() organizationId: string,
  ): Promise<UserNoteResponseDto> {
    const alert = await this.userNotesService.markAlertAsRead(
      alertId,
      organizationId,
      currentUser.role,
    );
    return this.mapToUserNoteResponse(alert);
  }

  @Get('organization/notes-stats')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZATION_ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get notes statistics' })
  @ApiResponse({
    status: 200,
    description: 'Notes statistics retrieved successfully',
    type: NotesStatsResponseDto,
  })
  async getNotesStats(
    @GetUser() currentUser: User,
    @GetOrganizationId() organizationId: string,
  ): Promise<NotesStatsResponseDto> {
    return this.userNotesService.getNotesStats(
      organizationId,
      currentUser.role,
    );
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  private mapToUserNoteResponse(
    note: UserNote & { author?: any },
  ): UserNoteResponseDto {
    return {
      id: note.id,
      content: note.content,
      isAlert: note.isAlert,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
      author: note.author || {
        id: note.authorId,
        firstName: 'Unknown',
        lastName: 'User',
        role: 'MEMBER' as any,
      },
    };
  }

  private mapToUserResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      status: user.status,
      organizationId: user.organizationId || '',
      memberId: user.memberId || undefined,
      phone: user.phone || undefined,
      dateOfBirth: user.dateOfBirth || undefined,
      emergencyContactName: user.emergencyContactName || undefined,
      emergencyContactPhone: user.emergencyContactPhone || undefined,
      emailVerified: user.emailVerified,
      phoneVerified: user.phoneVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastLoginAt: user.lastLoginAt || undefined,
    };
  }
}
