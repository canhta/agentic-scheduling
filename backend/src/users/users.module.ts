import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MemberService } from './member.service';
import { StaffService } from './staff.service';
import { AdminService } from './admin.service';
import { UserNotesService } from './user-notes.service';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    MemberService,
    StaffService,
    AdminService,
    UserNotesService,
  ],
  exports: [
    UsersService,
    MemberService,
    StaffService,
    AdminService,
    UserNotesService,
  ],
})
export class UsersModule {}
