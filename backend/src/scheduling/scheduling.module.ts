import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';

// Services
import { BookingService } from './services/booking.service';
import { RecurringScheduleService } from './services/recurring-schedule.service';
import { ConflictDetectionService } from './services/conflict-detection.service';
import { WaitlistService } from './services/waitlist.service';
import { CalendarService } from './services/calendar.service';

// Controllers
import { BookingController } from './controllers/booking.controller';
import { RecurringScheduleController } from './controllers/recurring-schedule.controller';
import { CalendarController } from './controllers/calendar.controller';

@Module({
  imports: [PrismaModule],
  controllers: [
    BookingController,
    RecurringScheduleController,
    CalendarController,
  ],
  providers: [
    BookingService,
    RecurringScheduleService,
    ConflictDetectionService,
    WaitlistService,
    CalendarService,
  ],
  exports: [
    BookingService,
    RecurringScheduleService,
    ConflictDetectionService,
    WaitlistService,
    CalendarService,
  ],
})
export class SchedulingModule {}
