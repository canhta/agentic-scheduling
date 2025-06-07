import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { OrganizationModule } from './organization/organization.module';

@Module({
  imports: [PrismaModule, OrganizationModule],
})
export class AppModule {}
