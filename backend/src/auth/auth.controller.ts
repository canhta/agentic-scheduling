import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Req,
  Res,
  Query,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetUser } from './decorators/get-user.decorator';
import { User } from 'generated/prisma';
import {
  LoginDto,
  RegisterDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  RefreshTokenDto,
  OAuthCallbackDto,
} from './dto/auth.dto';
import {
  LoginResponseDto,
  RegisterResponseDto,
  MessageResponseDto,
  RefreshTokenResponseDto,
  OAuthUrlResponseDto,
} from './dto/auth-response.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const result = this.authService.login(user);
    return {
      ...result,
      expires_in: 86400, // 24 hours in seconds
    };
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({
    status: 201,
    description: 'Registration successful',
    type: RegisterResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<RegisterResponseDto> {
    // Validate password confirmation
    if (registerDto.password !== registerDto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const { confirmPassword, ...userData } = registerDto;
    const result = await this.authService.register(userData);

    return {
      ...result,
      expires_in: 86400, // 24 hours in seconds
    };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({
    status: 200,
    description: 'Logout successful',
    type: MessageResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  logout(@GetUser() user: User): MessageResponseDto {
    // In a real application, you might want to blacklist the token
    // For now, we'll just return a success message
    return { message: 'Logout successful' };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    type: RefreshTokenResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<RefreshTokenResponseDto> {
    // This would need to be implemented in the AuthService
    // For now, return a placeholder response
    const result = await this.authService.refreshToken(
      refreshTokenDto.refreshToken,
    );
    return result;
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({
    status: 200,
    description: 'Password reset email sent',
    type: MessageResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid email' })
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<MessageResponseDto> {
    // This would need to be implemented in the AuthService
    // For now, return a placeholder response
    const result = await this.authService.forgotPassword(
      forgotPasswordDto.email,
    );
    return result;
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiResponse({
    status: 200,
    description: 'Password reset successful',
    type: MessageResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid token or password' })
  resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): MessageResponseDto {
    // Validate password confirmation
    if (resetPasswordDto.password !== resetPasswordDto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // This would need to be implemented in the AuthService
    // For now, return a placeholder response
    this.authService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.password,
    );
    return { message: 'Password reset successful' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user information' })
  @ApiResponse({
    status: 200,
    description: 'User information retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProfile(@GetUser() user: User) {
    const { password, ...userWithoutPassword } = user as any;
    return userWithoutPassword;
  }

  // OAuth endpoints (Google example)
  @Get('google')
  @ApiOperation({ summary: 'Initiate Google OAuth flow' })
  @ApiResponse({
    status: 200,
    description: 'OAuth URL generated',
    type: OAuthUrlResponseDto,
  })
  @ApiQuery({
    name: 'organizationId',
    required: false,
    description: 'Organization ID for registration',
  })
  googleAuth(
    @Query('organizationId') organizationId?: string,
  ): OAuthUrlResponseDto {
    // This would generate the Google OAuth URL
    // For now, return a placeholder
    return this.authService.generateOAuthUrl('google', organizationId);
  }

  @Post('google/callback')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Handle Google OAuth callback' })
  @ApiResponse({
    status: 200,
    description: 'OAuth authentication successful',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 400, description: 'OAuth authentication failed' })
  googleCallback(@Body() callbackDto: OAuthCallbackDto): LoginResponseDto {
    // This would handle the Google OAuth callback
    // For now, return a placeholder response
    return this.authService.handleOAuthCallback(
      'google',
      callbackDto.code,
      callbackDto.state,
    );
  }

  // Development endpoint for creating tokens (remove in production)
  @Post('dev-token')
  @ApiOperation({ summary: 'Create development token (DEV ONLY)' })
  @ApiResponse({
    status: 200,
    description: 'Development token created',
    type: LoginResponseDto,
  })
  async createDevToken(
    @Body('userId') userId: string,
  ): Promise<LoginResponseDto> {
    if (process.env.NODE_ENV === 'production') {
      throw new BadRequestException(
        'Development endpoint not available in production',
      );
    }

    const result = await this.authService.createDevToken(userId);
    return {
      ...result,
      expires_in: 86400,
    };
  }
}
