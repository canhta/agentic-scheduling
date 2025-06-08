import { PrismaClient } from '../generated/prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const defaultPassword = 'password123'; // Default password for all users

// Helper function to hash passwords
async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

async function main() {
  console.log('🌱 Starting to seed the database...');

  // Hash the default password once for all users
  const hashedPassword = await hashPassword(defaultPassword);
  console.log(`🔒 Using hashed password for all users: ${defaultPassword}`);

  // Create Organizations with different types and tiers
  const organizations = await Promise.all([
    // Fitness Gym
    prisma.organization.create({
      data: {
        name: 'FitCore Gymnasium',
        slug: 'fitcore-gym',
        description:
          'Premium fitness facility offering comprehensive training programs and modern equipment.',
        website: 'https://fitcore-gym.com',
        phone: '+1 (555) 123-4567',
        email: 'info@fitcore-gym.com',
        address: '123 Fitness Avenue',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94105',
        country: 'US',
        timezone: 'America/Los_Angeles',
        currency: 'USD',
        businessType: 'gym',
        subscriptionTier: 'pro',
        organizationSettings: {
          create: {
            bookingWindowDays: 30,
            cancellationWindowHours: 24,
            lateCancelPenalty: true,
            noShowPenalty: true,
            waitlistEnabled: true,
            maxWaitlistSize: 15,
            defaultClassDuration: 60,
            allowRecurringBookings: true,
            maxBookingsPerMember: 12,
            sendConfirmationEmails: true,
            sendReminderEmails: true,
            reminderHours: 24,
            businessHours: [
              {
                dayOfWeek: 1,
                openTime: '05:00',
                closeTime: '23:00',
                isOpen: true,
              },
              {
                dayOfWeek: 2,
                openTime: '05:00',
                closeTime: '23:00',
                isOpen: true,
              },
              {
                dayOfWeek: 3,
                openTime: '05:00',
                closeTime: '23:00',
                isOpen: true,
              },
              {
                dayOfWeek: 4,
                openTime: '05:00',
                closeTime: '23:00',
                isOpen: true,
              },
              {
                dayOfWeek: 5,
                openTime: '05:00',
                closeTime: '23:00',
                isOpen: true,
              },
              {
                dayOfWeek: 6,
                openTime: '07:00',
                closeTime: '20:00',
                isOpen: true,
              },
              {
                dayOfWeek: 0,
                openTime: '08:00',
                closeTime: '18:00',
                isOpen: true,
              },
            ],
            primaryColor: '#FF6B35',
            secondaryColor: '#2E2E2E',
            requireMembershipForBooking: true,
            allowGuestBookings: false,
            minimumAdvanceBooking: 60, // 1 hour
            maximumAdvanceBooking: 43200, // 30 days
            defaultTimeZone: 'America/Los_Angeles',
            firstDayOfWeek: 1,
            dateFormat: 'MM/DD/YYYY',
            timeFormat: '12h',
            enableWaitlist: true,
            enableRecurringBookings: true,
            enableCheckIn: true,
            enableReviews: true,
            enablePayments: true,
            enableAnalytics: true,
            paymentGateway: 'stripe',
            emailProvider: 'sendgrid',
            smsProvider: 'twilio',
          },
        },
      },
    }),

    // Yoga Studio
    prisma.organization.create({
      data: {
        name: 'Zen Flow Yoga Studio',
        slug: 'zen-flow-yoga',
        description:
          'Peaceful yoga studio offering various styles of yoga for all levels in a serene environment.',
        website: 'https://zenflow-yoga.com',
        phone: '+1 (555) 987-6543',
        email: 'namaste@zenflow-yoga.com',
        address: '456 Serenity Lane',
        city: 'Portland',
        state: 'OR',
        zipCode: '97205',
        country: 'US',
        timezone: 'America/Los_Angeles',
        currency: 'USD',
        businessType: 'studio',
        subscriptionTier: 'basic',
        organizationSettings: {
          create: {
            bookingWindowDays: 21,
            cancellationWindowHours: 12,
            lateCancelPenalty: false,
            noShowPenalty: true,
            waitlistEnabled: true,
            maxWaitlistSize: 8,
            defaultClassDuration: 75,
            allowRecurringBookings: true,
            maxBookingsPerMember: 8,
            sendConfirmationEmails: true,
            sendReminderEmails: true,
            reminderHours: 12,
            businessHours: [
              {
                dayOfWeek: 1,
                openTime: '06:00',
                closeTime: '21:00',
                isOpen: true,
              },
              {
                dayOfWeek: 2,
                openTime: '06:00',
                closeTime: '21:00',
                isOpen: true,
              },
              {
                dayOfWeek: 3,
                openTime: '06:00',
                closeTime: '21:00',
                isOpen: true,
              },
              {
                dayOfWeek: 4,
                openTime: '06:00',
                closeTime: '21:00',
                isOpen: true,
              },
              {
                dayOfWeek: 5,
                openTime: '06:00',
                closeTime: '21:00',
                isOpen: true,
              },
              {
                dayOfWeek: 6,
                openTime: '08:00',
                closeTime: '18:00',
                isOpen: true,
              },
              {
                dayOfWeek: 0,
                openTime: '09:00',
                closeTime: '17:00',
                isOpen: true,
              },
            ],
            primaryColor: '#8B5A83',
            secondaryColor: '#F4F1BB',
            requireMembershipForBooking: false,
            allowGuestBookings: true,
            minimumAdvanceBooking: 30, // 30 minutes
            maximumAdvanceBooking: 30240, // 21 days
            defaultTimeZone: 'America/Los_Angeles',
            firstDayOfWeek: 1,
            dateFormat: 'MM/DD/YYYY',
            timeFormat: '12h',
            enableWaitlist: true,
            enableRecurringBookings: true,
            enableCheckIn: true,
            enableReviews: true,
            enablePayments: true,
            enableAnalytics: false,
            paymentGateway: 'square',
            emailProvider: 'sendgrid',
          },
        },
      },
    }),

    // Pilates Studio
    prisma.organization.create({
      data: {
        name: 'CoreStrength Pilates',
        slug: 'corestrength-pilates',
        description:
          'Boutique Pilates studio specializing in equipment-based classes and personal training.',
        website: 'https://corestrength-pilates.com',
        phone: '+1 (555) 456-7890',
        email: 'hello@corestrength-pilates.com',
        address: '789 Wellness Way',
        city: 'Austin',
        state: 'TX',
        zipCode: '73301',
        country: 'US',
        timezone: 'America/Chicago',
        currency: 'USD',
        businessType: 'studio',
        subscriptionTier: 'enterprise',
        organizationSettings: {
          create: {
            bookingWindowDays: 45,
            cancellationWindowHours: 48,
            lateCancelPenalty: true,
            noShowPenalty: true,
            waitlistEnabled: true,
            maxWaitlistSize: 5,
            defaultClassDuration: 50,
            allowRecurringBookings: true,
            maxBookingsPerMember: 15,
            sendConfirmationEmails: true,
            sendReminderEmails: true,
            reminderHours: 48,
            businessHours: [
              {
                dayOfWeek: 1,
                openTime: '06:30',
                closeTime: '20:00',
                isOpen: true,
              },
              {
                dayOfWeek: 2,
                openTime: '06:30',
                closeTime: '20:00',
                isOpen: true,
              },
              {
                dayOfWeek: 3,
                openTime: '06:30',
                closeTime: '20:00',
                isOpen: true,
              },
              {
                dayOfWeek: 4,
                openTime: '06:30',
                closeTime: '20:00',
                isOpen: true,
              },
              {
                dayOfWeek: 5,
                openTime: '06:30',
                closeTime: '20:00',
                isOpen: true,
              },
              {
                dayOfWeek: 6,
                openTime: '08:00',
                closeTime: '16:00',
                isOpen: true,
              },
              {
                dayOfWeek: 0,
                openTime: '09:00',
                closeTime: '15:00',
                isOpen: true,
              },
            ],
            primaryColor: '#2C5F2D',
            secondaryColor: '#97BC62',
            requireMembershipForBooking: true,
            allowGuestBookings: true,
            minimumAdvanceBooking: 120, // 2 hours
            maximumAdvanceBooking: 64800, // 45 days
            defaultTimeZone: 'America/Chicago',
            firstDayOfWeek: 1,
            dateFormat: 'MM/DD/YYYY',
            timeFormat: '12h',
            enableWaitlist: true,
            enableRecurringBookings: true,
            enableCheckIn: true,
            enableReviews: true,
            enablePayments: true,
            enableAnalytics: true,
            paymentGateway: 'stripe',
            emailProvider: 'sendgrid',
            smsProvider: 'twilio',
          },
        },
      },
    }),

    // CrossFit Box
    prisma.organization.create({
      data: {
        name: 'Iron Beast CrossFit',
        slug: 'iron-beast-crossfit',
        description:
          'High-intensity CrossFit training facility focused on building strength, endurance, and community.',
        website: 'https://ironbeast-crossfit.com',
        phone: '+1 (555) 321-9876',
        email: 'wod@ironbeast-crossfit.com',
        address: '321 Power Street',
        city: 'Denver',
        state: 'CO',
        zipCode: '80202',
        country: 'US',
        timezone: 'America/Denver',
        currency: 'USD',
        businessType: 'gym',
        subscriptionTier: 'pro',
        organizationSettings: {
          create: {
            bookingWindowDays: 14,
            cancellationWindowHours: 8,
            lateCancelPenalty: true,
            noShowPenalty: true,
            waitlistEnabled: true,
            maxWaitlistSize: 12,
            defaultClassDuration: 60,
            allowRecurringBookings: true,
            maxBookingsPerMember: 20,
            sendConfirmationEmails: true,
            sendReminderEmails: true,
            reminderHours: 8,
            businessHours: [
              {
                dayOfWeek: 1,
                openTime: '05:30',
                closeTime: '21:00',
                isOpen: true,
              },
              {
                dayOfWeek: 2,
                openTime: '05:30',
                closeTime: '21:00',
                isOpen: true,
              },
              {
                dayOfWeek: 3,
                openTime: '05:30',
                closeTime: '21:00',
                isOpen: true,
              },
              {
                dayOfWeek: 4,
                openTime: '05:30',
                closeTime: '21:00',
                isOpen: true,
              },
              {
                dayOfWeek: 5,
                openTime: '05:30',
                closeTime: '21:00',
                isOpen: true,
              },
              {
                dayOfWeek: 6,
                openTime: '08:00',
                closeTime: '17:00',
                isOpen: true,
              },
              {
                dayOfWeek: 0,
                openTime: '09:00',
                closeTime: '16:00',
                isOpen: true,
              },
            ],
            primaryColor: '#D32F2F',
            secondaryColor: '#424242',
            requireMembershipForBooking: true,
            allowGuestBookings: false,
            minimumAdvanceBooking: 30, // 30 minutes
            maximumAdvanceBooking: 20160, // 14 days
            defaultTimeZone: 'America/Denver',
            firstDayOfWeek: 1,
            dateFormat: 'MM/DD/YYYY',
            timeFormat: '24h',
            enableWaitlist: true,
            enableRecurringBookings: true,
            enableCheckIn: true,
            enableReviews: true,
            enablePayments: true,
            enableAnalytics: true,
            paymentGateway: 'stripe',
            emailProvider: 'sendgrid',
            smsProvider: 'twilio',
          },
        },
      },
    }),

    // Wellness Center
    prisma.organization.create({
      data: {
        name: 'Harmony Wellness Center',
        slug: 'harmony-wellness',
        description:
          'Holistic wellness center offering massage therapy, acupuncture, and therapeutic services.',
        website: 'https://harmony-wellness.com',
        phone: '+1 (555) 654-3210',
        email: 'wellness@harmony-wellness.com',
        address: '654 Healing Boulevard',
        city: 'Asheville',
        state: 'NC',
        zipCode: '28801',
        country: 'US',
        timezone: 'America/New_York',
        currency: 'USD',
        businessType: 'wellness',
        subscriptionTier: 'basic',
        organizationSettings: {
          create: {
            bookingWindowDays: 60,
            cancellationWindowHours: 24,
            lateCancelPenalty: true,
            noShowPenalty: true,
            waitlistEnabled: false,
            maxWaitlistSize: 3,
            defaultClassDuration: 90,
            allowRecurringBookings: true,
            maxBookingsPerMember: 6,
            sendConfirmationEmails: true,
            sendReminderEmails: true,
            reminderHours: 24,
            businessHours: [
              {
                dayOfWeek: 1,
                openTime: '09:00',
                closeTime: '19:00',
                isOpen: true,
              },
              {
                dayOfWeek: 2,
                openTime: '09:00',
                closeTime: '19:00',
                isOpen: true,
              },
              {
                dayOfWeek: 3,
                openTime: '09:00',
                closeTime: '19:00',
                isOpen: true,
              },
              {
                dayOfWeek: 4,
                openTime: '09:00',
                closeTime: '19:00',
                isOpen: true,
              },
              {
                dayOfWeek: 5,
                openTime: '09:00',
                closeTime: '19:00',
                isOpen: true,
              },
              {
                dayOfWeek: 6,
                openTime: '10:00',
                closeTime: '16:00',
                isOpen: true,
              },
              {
                dayOfWeek: 0,
                openTime: '10:00',
                closeTime: '16:00',
                isOpen: false,
              },
            ],
            primaryColor: '#4CAF50',
            secondaryColor: '#81C784',
            requireMembershipForBooking: false,
            allowGuestBookings: true,
            minimumAdvanceBooking: 240, // 4 hours
            maximumAdvanceBooking: 86400, // 60 days
            defaultTimeZone: 'America/New_York',
            firstDayOfWeek: 1,
            dateFormat: 'MM/DD/YYYY',
            timeFormat: '12h',
            enableWaitlist: false,
            enableRecurringBookings: true,
            enableCheckIn: true,
            enableReviews: true,
            enablePayments: true,
            enableAnalytics: false,
            paymentGateway: 'square',
            emailProvider: 'sendgrid',
          },
        },
      },
    }),
  ]);

  console.log(`✅ Created ${organizations.length} organizations`);

  // Create Locations for each organization
  const locations: any[] = [];

  // FitCore Gymnasium locations
  const fitcoreLocations = await Promise.all([
    prisma.location.create({
      data: {
        organizationId: organizations[0].id,
        name: 'Main Training Floor',
        description: 'Primary workout area with cardio and strength equipment',
        address: '123 Fitness Avenue',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94105',
        phone: '+1 (555) 123-4567',
        email: 'mainfloor@fitcore-gym.com',
        isPrimary: true,
      },
    }),
    prisma.location.create({
      data: {
        organizationId: organizations[0].id,
        name: 'Group Fitness Studio',
        description: 'Dedicated space for group fitness classes',
        address: '123 Fitness Avenue',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94105',
        phone: '+1 (555) 123-4567',
        email: 'studio@fitcore-gym.com',
        isPrimary: false,
      },
    }),
  ]);

  // Zen Flow Yoga locations
  const yogaLocations = await Promise.all([
    prisma.location.create({
      data: {
        organizationId: organizations[1].id,
        name: 'Main Studio',
        description: 'Primary yoga practice space with natural lighting',
        address: '456 Serenity Lane',
        city: 'Portland',
        state: 'OR',
        zipCode: '97205',
        phone: '+1 (555) 987-6543',
        email: 'studio@zenflow-yoga.com',
        isPrimary: true,
      },
    }),
    prisma.location.create({
      data: {
        organizationId: organizations[1].id,
        name: 'Meditation Room',
        description: 'Quiet space for meditation and restorative practices',
        address: '456 Serenity Lane',
        city: 'Portland',
        state: 'OR',
        zipCode: '97205',
        phone: '+1 (555) 987-6543',
        email: 'meditation@zenflow-yoga.com',
        isPrimary: false,
      },
    }),
  ]);

  // CoreStrength Pilates locations
  const pilatesLocations = await Promise.all([
    prisma.location.create({
      data: {
        organizationId: organizations[2].id,
        name: 'Reformer Studio A',
        description: 'Equipment-based Pilates studio with 8 reformers',
        address: '789 Wellness Way',
        city: 'Austin',
        state: 'TX',
        zipCode: '73301',
        phone: '+1 (555) 456-7890',
        email: 'reformera@corestrength-pilates.com',
        isPrimary: true,
      },
    }),
    prisma.location.create({
      data: {
        organizationId: organizations[2].id,
        name: 'Mat Studio',
        description: 'Open floor space for mat-based Pilates classes',
        address: '789 Wellness Way',
        city: 'Austin',
        state: 'TX',
        zipCode: '73301',
        phone: '+1 (555) 456-7890',
        email: 'mat@corestrength-pilates.com',
        isPrimary: false,
      },
    }),
  ]);

  // Iron Beast CrossFit locations
  const crossfitLocations = await Promise.all([
    prisma.location.create({
      data: {
        organizationId: organizations[3].id,
        name: 'Main Box',
        description: 'Primary CrossFit training area',
        address: '321 Power Street',
        city: 'Denver',
        state: 'CO',
        zipCode: '80202',
        phone: '+1 (555) 321-9876',
        email: 'mainbox@ironbeast-crossfit.com',
        isPrimary: true,
      },
    }),
  ]);

  // Harmony Wellness locations
  const wellnessLocations = await Promise.all([
    prisma.location.create({
      data: {
        organizationId: organizations[4].id,
        name: 'Treatment Rooms',
        description: 'Individual therapy and treatment rooms',
        address: '654 Healing Boulevard',
        city: 'Asheville',
        state: 'NC',
        zipCode: '28801',
        phone: '+1 (555) 654-3210',
        email: 'treatments@harmony-wellness.com',
        isPrimary: true,
      },
    }),
  ]);

  locations.push(
    ...fitcoreLocations,
    ...yogaLocations,
    ...pilatesLocations,
    ...crossfitLocations,
    ...wellnessLocations,
  );
  console.log(`✅ Created ${locations.length} locations`);

  // Create Resources for each location
  const resources: any[] = [];

  // FitCore Gymnasium resources
  const fitcoreResources = await Promise.all([
    // Main Training Floor resources
    prisma.resource.create({
      data: {
        organizationId: organizations[0].id,
        locationId: fitcoreLocations[0].id,
        name: 'Cardio Section',
        type: 'ROOM',
        description: 'Area with treadmills, ellipticals, and bikes',
        capacity: 25,
        isBookable: false,
      },
    }),
    prisma.resource.create({
      data: {
        organizationId: organizations[0].id,
        locationId: fitcoreLocations[0].id,
        name: 'Free Weight Area',
        type: 'ROOM',
        description: 'Dumbbells, barbells, and weight plates',
        capacity: 15,
        isBookable: false,
      },
    }),
    prisma.resource.create({
      data: {
        organizationId: organizations[0].id,
        locationId: fitcoreLocations[0].id,
        name: 'Squat Rack 1',
        type: 'EQUIPMENT',
        description: 'Olympic squat rack with safety bars',
        capacity: 1,
        isBookable: true,
      },
    }),
    prisma.resource.create({
      data: {
        organizationId: organizations[0].id,
        locationId: fitcoreLocations[0].id,
        name: 'Squat Rack 2',
        type: 'EQUIPMENT',
        description: 'Olympic squat rack with safety bars',
        capacity: 1,
        isBookable: true,
      },
    }),
    // Group Fitness Studio resources
    prisma.resource.create({
      data: {
        organizationId: organizations[0].id,
        locationId: fitcoreLocations[1].id,
        name: 'Group Fitness Room',
        type: 'ROOM',
        description:
          'Spacious room for group classes with mirrors and sound system',
        capacity: 30,
        isBookable: true,
      },
    }),
    prisma.resource.create({
      data: {
        organizationId: organizations[0].id,
        locationId: fitcoreLocations[1].id,
        name: 'Spinning Bikes',
        type: 'EQUIPMENT',
        description: 'Set of 20 spinning bikes',
        capacity: 20,
        isBookable: false,
      },
    }),
  ]);

  // Zen Flow Yoga resources
  const yogaResources = await Promise.all([
    prisma.resource.create({
      data: {
        organizationId: organizations[1].id,
        locationId: yogaLocations[0].id,
        name: 'Main Yoga Studio',
        type: 'ROOM',
        description: 'Heated yoga studio with bamboo floors',
        capacity: 24,
        isBookable: true,
      },
    }),
    prisma.resource.create({
      data: {
        organizationId: organizations[1].id,
        locationId: yogaLocations[0].id,
        name: 'Yoga Props',
        type: 'EQUIPMENT',
        description: 'Blocks, straps, bolsters, and blankets',
        capacity: 30,
        isBookable: false,
      },
    }),
    prisma.resource.create({
      data: {
        organizationId: organizations[1].id,
        locationId: yogaLocations[1].id,
        name: 'Meditation Space',
        type: 'ROOM',
        description: 'Quiet room for meditation and restorative practices',
        capacity: 12,
        isBookable: true,
      },
    }),
  ]);

  // CoreStrength Pilates resources
  const pilatesResources = await Promise.all([
    prisma.resource.create({
      data: {
        organizationId: organizations[2].id,
        locationId: pilatesLocations[0].id,
        name: 'Reformer Studio',
        type: 'ROOM',
        description: 'Studio equipped with 8 Pilates reformers',
        capacity: 8,
        isBookable: true,
      },
    }),
    prisma.resource.create({
      data: {
        organizationId: organizations[2].id,
        locationId: pilatesLocations[0].id,
        name: 'Reformer 1',
        type: 'EQUIPMENT',
        description: 'Professional Pilates reformer',
        capacity: 1,
        isBookable: true,
      },
    }),
    prisma.resource.create({
      data: {
        organizationId: organizations[2].id,
        locationId: pilatesLocations[0].id,
        name: 'Reformer 2',
        type: 'EQUIPMENT',
        description: 'Professional Pilates reformer',
        capacity: 1,
        isBookable: true,
      },
    }),
    prisma.resource.create({
      data: {
        organizationId: organizations[2].id,
        locationId: pilatesLocations[1].id,
        name: 'Mat Studio',
        type: 'ROOM',
        description: 'Open floor space for mat Pilates',
        capacity: 16,
        isBookable: true,
      },
    }),
  ]);

  // Iron Beast CrossFit resources
  const crossfitResources = await Promise.all([
    prisma.resource.create({
      data: {
        organizationId: organizations[3].id,
        locationId: crossfitLocations[0].id,
        name: 'Main Training Area',
        type: 'ROOM',
        description: 'Open floor space for CrossFit workouts',
        capacity: 20,
        isBookable: true,
      },
    }),
    prisma.resource.create({
      data: {
        organizationId: organizations[3].id,
        locationId: crossfitLocations[0].id,
        name: 'Pull-up Rig',
        type: 'EQUIPMENT',
        description: 'Large pull-up rig with multiple stations',
        capacity: 12,
        isBookable: false,
      },
    }),
    prisma.resource.create({
      data: {
        organizationId: organizations[3].id,
        locationId: crossfitLocations[0].id,
        name: 'Olympic Lifting Platform 1',
        type: 'EQUIPMENT',
        description: 'Dedicated platform for Olympic lifting',
        capacity: 1,
        isBookable: true,
      },
    }),
    prisma.resource.create({
      data: {
        organizationId: organizations[3].id,
        locationId: crossfitLocations[0].id,
        name: 'Olympic Lifting Platform 2',
        type: 'EQUIPMENT',
        description: 'Dedicated platform for Olympic lifting',
        capacity: 1,
        isBookable: true,
      },
    }),
  ]);

  // Harmony Wellness resources
  const wellnessResources = await Promise.all([
    prisma.resource.create({
      data: {
        organizationId: organizations[4].id,
        locationId: wellnessLocations[0].id,
        name: 'Treatment Room 1',
        type: 'ROOM',
        description: 'Private room for massage and therapy sessions',
        capacity: 1,
        isBookable: true,
      },
    }),
    prisma.resource.create({
      data: {
        organizationId: organizations[4].id,
        locationId: wellnessLocations[0].id,
        name: 'Treatment Room 2',
        type: 'ROOM',
        description: 'Private room for massage and therapy sessions',
        capacity: 1,
        isBookable: true,
      },
    }),
    prisma.resource.create({
      data: {
        organizationId: organizations[4].id,
        locationId: wellnessLocations[0].id,
        name: 'Acupuncture Room',
        type: 'ROOM',
        description: 'Specialized room for acupuncture treatments',
        capacity: 1,
        isBookable: true,
      },
    }),
  ]);

  resources.push(
    ...fitcoreResources,
    ...yogaResources,
    ...pilatesResources,
    ...crossfitResources,
    ...wellnessResources,
  );
  console.log(`✅ Created ${resources.length} resources`);

  // Create Services for each organization
  const services: any[] = [];

  // FitCore Gymnasium services
  const fitcoreServices = await Promise.all([
    prisma.service.create({
      data: {
        organizationId: organizations[0].id,
        locationId: fitcoreLocations[1].id,
        name: 'HIIT Training',
        description:
          'High-intensity interval training class to boost metabolism and build strength',
        type: 'CLASS',
        duration: 45,
        capacity: 25,
        price: 25.0,
        bookable: true,
        requiresApproval: false,
        allowWaitlist: true,
        color: '#FF6B35',
      },
    }),
    prisma.service.create({
      data: {
        organizationId: organizations[0].id,
        locationId: fitcoreLocations[1].id,
        name: 'Strength & Conditioning',
        description:
          'Build functional strength and improve athletic performance',
        type: 'CLASS',
        duration: 60,
        capacity: 20,
        price: 30.0,
        bookable: true,
        requiresApproval: false,
        allowWaitlist: true,
        color: '#2E2E2E',
      },
    }),
    prisma.service.create({
      data: {
        organizationId: organizations[0].id,
        locationId: fitcoreLocations[0].id,
        name: 'Personal Training Session',
        description:
          'One-on-one training session with certified personal trainer',
        type: 'PERSONAL_TRAINING',
        duration: 60,
        capacity: 1,
        price: 85.0,
        bookable: true,
        requiresApproval: true,
        allowWaitlist: false,
        color: '#FFB74D',
      },
    }),
    prisma.service.create({
      data: {
        organizationId: organizations[0].id,
        locationId: fitcoreLocations[1].id,
        name: 'Spin Class',
        description: 'High-energy cycling workout with motivating music',
        type: 'CLASS',
        duration: 45,
        capacity: 20,
        price: 22.0,
        bookable: true,
        requiresApproval: false,
        allowWaitlist: true,
        color: '#4FC3F7',
      },
    }),
  ]);

  // Zen Flow Yoga services
  const yogaServices = await Promise.all([
    prisma.service.create({
      data: {
        organizationId: organizations[1].id,
        locationId: yogaLocations[0].id,
        name: 'Vinyasa Flow',
        description:
          'Dynamic flowing yoga sequence connecting breath with movement',
        type: 'CLASS',
        duration: 75,
        capacity: 20,
        price: 28.0,
        bookable: true,
        requiresApproval: false,
        allowWaitlist: true,
        color: '#8B5A83',
      },
    }),
    prisma.service.create({
      data: {
        organizationId: organizations[1].id,
        locationId: yogaLocations[0].id,
        name: 'Hot Yoga',
        description:
          'Vigorous yoga practice in a heated room to enhance flexibility',
        type: 'CLASS',
        duration: 90,
        capacity: 18,
        price: 32.0,
        bookable: true,
        requiresApproval: false,
        allowWaitlist: true,
        color: '#D32F2F',
      },
    }),
    prisma.service.create({
      data: {
        organizationId: organizations[1].id,
        locationId: yogaLocations[1].id,
        name: 'Restorative Yoga',
        description:
          'Gentle, relaxing yoga practice focused on deep relaxation',
        type: 'CLASS',
        duration: 75,
        capacity: 12,
        price: 25.0,
        bookable: true,
        requiresApproval: false,
        allowWaitlist: true,
        color: '#81C784',
      },
    }),
    prisma.service.create({
      data: {
        organizationId: organizations[1].id,
        locationId: yogaLocations[0].id,
        name: 'Private Yoga Session',
        description: 'Personalized one-on-one yoga instruction',
        type: 'PERSONAL_TRAINING',
        duration: 60,
        capacity: 1,
        price: 95.0,
        bookable: true,
        requiresApproval: true,
        allowWaitlist: false,
        color: '#F4F1BB',
      },
    }),
  ]);

  // CoreStrength Pilates services
  const pilatesServices = await Promise.all([
    prisma.service.create({
      data: {
        organizationId: organizations[2].id,
        locationId: pilatesLocations[0].id,
        name: 'Reformer Pilates',
        description: 'Equipment-based Pilates class using reformer machines',
        type: 'CLASS',
        duration: 50,
        capacity: 8,
        price: 38.0,
        bookable: true,
        requiresApproval: false,
        allowWaitlist: true,
        color: '#2C5F2D',
      },
    }),
    prisma.service.create({
      data: {
        organizationId: organizations[2].id,
        locationId: pilatesLocations[1].id,
        name: 'Mat Pilates',
        description:
          'Classical Pilates workout on the mat focusing on core strength',
        type: 'CLASS',
        duration: 50,
        capacity: 16,
        price: 28.0,
        bookable: true,
        requiresApproval: false,
        allowWaitlist: true,
        color: '#97BC62',
      },
    }),
    prisma.service.create({
      data: {
        organizationId: organizations[2].id,
        locationId: pilatesLocations[0].id,
        name: 'Private Reformer Session',
        description: 'One-on-one Pilates training on the reformer',
        type: 'PERSONAL_TRAINING',
        duration: 55,
        capacity: 1,
        price: 110.0,
        bookable: true,
        requiresApproval: true,
        allowWaitlist: false,
        color: '#4CAF50',
      },
    }),
    prisma.service.create({
      data: {
        organizationId: organizations[2].id,
        locationId: pilatesLocations[0].id,
        name: 'Advanced Reformer',
        description: 'Challenging reformer class for experienced practitioners',
        type: 'CLASS',
        duration: 50,
        capacity: 6,
        price: 42.0,
        bookable: true,
        requiresApproval: true,
        allowWaitlist: true,
        color: '#1B5E20',
      },
    }),
  ]);

  // Iron Beast CrossFit services
  const crossfitServices = await Promise.all([
    prisma.service.create({
      data: {
        organizationId: organizations[3].id,
        locationId: crossfitLocations[0].id,
        name: 'WOD (Workout of the Day)',
        description: 'Daily varied functional fitness workout',
        type: 'CLASS',
        duration: 60,
        capacity: 16,
        price: 35.0,
        bookable: true,
        requiresApproval: false,
        allowWaitlist: true,
        color: '#D32F2F',
      },
    }),
    prisma.service.create({
      data: {
        organizationId: organizations[3].id,
        locationId: crossfitLocations[0].id,
        name: 'Olympic Lifting',
        description:
          'Focus on Olympic lifting techniques and strength building',
        type: 'CLASS',
        duration: 75,
        capacity: 8,
        price: 40.0,
        bookable: true,
        requiresApproval: false,
        allowWaitlist: true,
        color: '#FF5722',
      },
    }),
    prisma.service.create({
      data: {
        organizationId: organizations[3].id,
        locationId: crossfitLocations[0].id,
        name: 'CrossFit Foundations',
        description: 'Beginner-friendly introduction to CrossFit movements',
        type: 'CLASS',
        duration: 60,
        capacity: 12,
        price: 30.0,
        bookable: true,
        requiresApproval: false,
        allowWaitlist: true,
        color: '#FF9800',
      },
    }),
    prisma.service.create({
      data: {
        organizationId: organizations[3].id,
        locationId: crossfitLocations[0].id,
        name: 'Personal CrossFit Coaching',
        description: 'One-on-one CrossFit coaching and technique refinement',
        type: 'PERSONAL_TRAINING',
        duration: 60,
        capacity: 1,
        price: 90.0,
        bookable: true,
        requiresApproval: true,
        allowWaitlist: false,
        color: '#424242',
      },
    }),
  ]);

  // Harmony Wellness services
  const wellnessServices = await Promise.all([
    prisma.service.create({
      data: {
        organizationId: organizations[4].id,
        locationId: wellnessLocations[0].id,
        name: 'Swedish Massage',
        description:
          'Relaxing full-body massage to reduce stress and muscle tension',
        type: 'APPOINTMENT',
        duration: 60,
        capacity: 1,
        price: 120.0,
        bookable: true,
        requiresApproval: false,
        allowWaitlist: false,
        color: '#4CAF50',
      },
    }),
    prisma.service.create({
      data: {
        organizationId: organizations[4].id,
        locationId: wellnessLocations[0].id,
        name: 'Deep Tissue Massage',
        description: 'Therapeutic massage targeting deeper muscle layers',
        type: 'APPOINTMENT',
        duration: 90,
        capacity: 1,
        price: 160.0,
        bookable: true,
        requiresApproval: false,
        allowWaitlist: false,
        color: '#2E7D32',
      },
    }),
    prisma.service.create({
      data: {
        organizationId: organizations[4].id,
        locationId: wellnessLocations[0].id,
        name: 'Acupuncture Session',
        description:
          'Traditional Chinese medicine treatment for various conditions',
        type: 'APPOINTMENT',
        duration: 75,
        capacity: 1,
        price: 140.0,
        bookable: true,
        requiresApproval: true,
        allowWaitlist: false,
        color: '#388E3C',
      },
    }),
    prisma.service.create({
      data: {
        organizationId: organizations[4].id,
        locationId: wellnessLocations[0].id,
        name: 'Wellness Consultation',
        description: 'Comprehensive health and wellness assessment',
        type: 'APPOINTMENT',
        duration: 90,
        capacity: 1,
        price: 180.0,
        bookable: true,
        requiresApproval: true,
        allowWaitlist: false,
        color: '#81C784',
      },
    }),
  ]);

  services.push(
    ...fitcoreServices,
    ...yogaServices,
    ...pilatesServices,
    ...crossfitServices,
    ...wellnessServices,
  );
  console.log(`✅ Created ${services.length} services`);

  // Create Users for all organizations with different roles
  const users: any[] = [];

  // Create Super Admin (not tied to any organization)
  const superAdmin = await prisma.user.create({
    data: {
      email: 'admin@agenticsystem.com',
      password: hashedPassword,
      firstName: 'System',
      lastName: 'Administrator',
      preferredName: 'Admin',
      phone: '+1 (555) 000-0001',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      emailVerified: true,
      phoneVerified: true,
      lastLoginAt: new Date(),
      createdAt: new Date('2024-01-01'),
    },
  });
  users.push(superAdmin);

  // FitCore Gymnasium Users
  const fitcoreUsers = await Promise.all([
    // Organization Admin
    prisma.user.create({
      data: {
        organizationId: organizations[0].id,
        email: 'owner@fitcore-gym.com',
        password: hashedPassword,
        firstName: 'Marcus',
        lastName: 'Johnson',
        preferredName: 'Marc',
        phone: '+1 (555) 123-4501',
        dateOfBirth: new Date('1985-03-15'),
        gender: 'Male',
        address: '123 Fitness Avenue',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94105',
        country: 'US',
        role: 'ORGANIZATION_ADMIN',
        status: 'ACTIVE',
        emailVerified: true,
        phoneVerified: true,
        lastLoginAt: new Date(),
        employeeId: 'FC001',
        department: 'Management',
        specialty: 'Business Operations',
        certifications: ['CPR', 'First Aid', 'Business Management'],
        hourlyRate: 75,
        memberSince: new Date('2023-01-01'),
      },
    }),
    // Gym Manager
    prisma.user.create({
      data: {
        organizationId: organizations[0].id,
        email: 'manager@fitcore-gym.com',
        password: hashedPassword,
        firstName: 'Sarah',
        lastName: 'Chen',
        phone: '+1 (555) 123-4502',
        dateOfBirth: new Date('1988-07-22'),
        gender: 'Female',
        address: '456 Marina Boulevard',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94123',
        country: 'US',
        role: 'ADMIN',
        status: 'ACTIVE',
        emailVerified: true,
        phoneVerified: true,
        lastLoginAt: new Date(),
        employeeId: 'FC002',
        department: 'Operations',
        specialty: 'Facility Management',
        certifications: ['ACSM', 'CPR', 'First Aid'],
        hourlyRate: 45.0,
      },
    }),
    // Personal Trainers (Staff)
    prisma.user.create({
      data: {
        organizationId: organizations[0].id,
        email: 'alex.trainer@fitcore-gym.com',
        password: hashedPassword,
        firstName: 'Alex',
        lastName: 'Rodriguez',
        phone: '+1 (555) 123-4503',
        dateOfBirth: new Date('1992-11-08'),
        gender: 'Male',
        address: '789 Mission Street',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94103',
        country: 'US',
        emergencyContactName: 'Maria Rodriguez',
        emergencyContactPhone: '+1 (555) 123-9999',
        emergencyContactRelation: 'Spouse',
        role: 'STAFF',
        status: 'ACTIVE',
        emailVerified: true,
        phoneVerified: true,
        lastLoginAt: new Date(),
        employeeId: 'FC003',
        department: 'Personal Training',
        specialty: 'Strength Training, Weight Loss',
        certifications: ['NASM-CPT', 'CSCS', 'CPR', 'First Aid'],
        hourlyRate: 65.0,
      },
    }),
    prisma.user.create({
      data: {
        organizationId: organizations[0].id,
        email: 'jessica.fitness@fitcore-gym.com',
        password: hashedPassword,
        firstName: 'Jessica',
        lastName: 'Williams',
        phone: '+1 (555) 123-4504',
        dateOfBirth: new Date('1990-05-14'),
        gender: 'Female',
        address: '321 Valencia Street',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94110',
        country: 'US',
        emergencyContactName: 'Tom Williams',
        emergencyContactPhone: '+1 (555) 123-8888',
        emergencyContactRelation: 'Brother',
        role: 'STAFF',
        status: 'ACTIVE',
        emailVerified: true,
        phoneVerified: true,
        lastLoginAt: new Date(),
        employeeId: 'FC004',
        department: 'Group Fitness',
        specialty: 'HIIT, Spin, Group Training',
        certifications: ['ACE-GFI', 'Spinning Certified', 'CPR'],
        hourlyRate: 55.0,
      },
    }),
    // Members
    prisma.user.create({
      data: {
        organizationId: organizations[0].id,
        email: 'john.member@gmail.com',
        password: hashedPassword,
        firstName: 'John',
        lastName: 'Smith',
        phone: '+1 (555) 123-4505',
        dateOfBirth: new Date('1985-12-03'),
        gender: 'Male',
        address: '654 California Street',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94108',
        country: 'US',
        emergencyContactName: 'Jane Smith',
        emergencyContactPhone: '+1 (555) 123-7777',
        emergencyContactRelation: 'Spouse',
        role: 'MEMBER',
        status: 'ACTIVE',
        emailVerified: true,
        phoneVerified: true,
        lastLoginAt: new Date(),
        memberId: 'FC-M001',
        memberSince: new Date('2023-06-15'),
      },
    }),
    prisma.user.create({
      data: {
        organizationId: organizations[0].id,
        email: 'emily.active@gmail.com',
        password: hashedPassword,
        firstName: 'Emily',
        lastName: 'Davis',
        phone: '+1 (555) 123-4506',
        dateOfBirth: new Date('1993-09-18'),
        gender: 'Female',
        address: '987 Lombard Street',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94133',
        country: 'US',
        emergencyContactName: 'Michael Davis',
        emergencyContactPhone: '+1 (555) 123-6666',
        emergencyContactRelation: 'Father',
        role: 'MEMBER',
        status: 'ACTIVE',
        emailVerified: true,
        phoneVerified: true,
        lastLoginAt: new Date(),
        memberId: 'FC-M002',
        memberSince: new Date('2024-01-10'),
      },
    }),
  ]);

  // Zen Flow Yoga Users
  const yogaUsers = await Promise.all([
    // Organization Admin
    prisma.user.create({
      data: {
        organizationId: organizations[1].id,
        email: 'owner@zenflow-yoga.com',
        password: hashedPassword,
        firstName: 'Luna',
        lastName: 'Patel',
        phone: '+1 (555) 987-6501',
        dateOfBirth: new Date('1980-04-12'),
        gender: 'Female',
        address: '456 Serenity Lane',
        city: 'Portland',
        state: 'OR',
        zipCode: '97205',
        country: 'US',
        role: 'ORGANIZATION_ADMIN',
        status: 'ACTIVE',
        emailVerified: true,
        phoneVerified: true,
        lastLoginAt: new Date(),
        employeeId: 'ZF001',
        department: 'Management',
        specialty: 'Yoga Philosophy, Business',
        certifications: ['RYT-500', 'Yoga Alliance', 'CPR'],
        hourlyRate: 85.0,
        memberSince: new Date('2022-03-01'),
      },
    }),
    // Yoga Instructors
    prisma.user.create({
      data: {
        organizationId: organizations[1].id,
        email: 'maya.yoga@zenflow-yoga.com',
        password: hashedPassword,
        firstName: 'Maya',
        lastName: 'Thompson',
        phone: '+1 (555) 987-6502',
        dateOfBirth: new Date('1987-08-25'),
        gender: 'Female',
        address: '123 Peaceful Ave',
        city: 'Portland',
        state: 'OR',
        zipCode: '97201',
        country: 'US',
        role: 'STAFF',
        status: 'ACTIVE',
        emailVerified: true,
        phoneVerified: true,
        lastLoginAt: new Date(),
        employeeId: 'ZF002',
        department: 'Instruction',
        specialty: 'Vinyasa, Hot Yoga',
        certifications: ['RYT-200', 'Hot Yoga Certified', 'CPR'],
        hourlyRate: 70.0,
      },
    }),
    prisma.user.create({
      data: {
        organizationId: organizations[1].id,
        email: 'david.zen@zenflow-yoga.com',
        password: hashedPassword,
        firstName: 'David',
        lastName: 'Kim',
        phone: '+1 (555) 987-6503',
        dateOfBirth: new Date('1984-02-17'),
        gender: 'Male',
        address: '789 Mindful Street',
        city: 'Portland',
        state: 'OR',
        zipCode: '97203',
        country: 'US',
        role: 'STAFF',
        status: 'ACTIVE',
        emailVerified: true,
        phoneVerified: true,
        lastLoginAt: new Date(),
        employeeId: 'ZF003',
        department: 'Instruction',
        specialty: 'Restorative, Meditation',
        certifications: ['RYT-200', 'Meditation Teacher', 'Reiki Level 2'],
        hourlyRate: 65.0,
      },
    }),
    // Members
    prisma.user.create({
      data: {
        organizationId: organizations[1].id,
        email: 'sophie.zen@gmail.com',
        password: hashedPassword,
        firstName: 'Sophie',
        lastName: 'Anderson',
        phone: '+1 (555) 987-6504',
        dateOfBirth: new Date('1991-06-30'),
        gender: 'Female',
        address: '456 Harmony Way',
        city: 'Portland',
        state: 'OR',
        zipCode: '97209',
        country: 'US',
        role: 'MEMBER',
        status: 'ACTIVE',
        emailVerified: true,
        phoneVerified: true,
        lastLoginAt: new Date(),
        memberId: 'ZF-M001',
        memberSince: new Date('2023-04-20'),
      },
    }),
  ]);

  // CoreStrength Pilates Users
  const pilatesUsers = await Promise.all([
    // Organization Admin
    prisma.user.create({
      data: {
        organizationId: organizations[2].id,
        email: 'owner@corestrength-pilates.com',
        password: hashedPassword,
        firstName: 'Victoria',
        lastName: 'Martinez',
        phone: '+1 (555) 456-7801',
        dateOfBirth: new Date('1982-09-05'),
        gender: 'Female',
        address: '789 Wellness Way',
        city: 'Austin',
        state: 'TX',
        zipCode: '73301',
        country: 'US',
        role: 'ORGANIZATION_ADMIN',
        status: 'ACTIVE',
        emailVerified: true,
        phoneVerified: true,
        lastLoginAt: new Date(),
        employeeId: 'CS001',
        department: 'Management',
        specialty: 'Pilates Method, Business Operations',
        certifications: ['PMA-CPT', 'Comprehensive Pilates', 'CPR'],
        hourlyRate: 95.0,
        memberSince: new Date('2021-11-01'),
      },
    }),
    // Pilates Instructors
    prisma.user.create({
      data: {
        organizationId: organizations[2].id,
        email: 'amanda.pilates@corestrength-pilates.com',
        password: hashedPassword,
        firstName: 'Amanda',
        lastName: 'Wilson',
        phone: '+1 (555) 456-7802',
        dateOfBirth: new Date('1989-01-12'),
        gender: 'Female',
        address: '321 Core Street',
        city: 'Austin',
        state: 'TX',
        zipCode: '73304',
        country: 'US',
        role: 'STAFF',
        status: 'ACTIVE',
        emailVerified: true,
        phoneVerified: true,
        lastLoginAt: new Date(),
        employeeId: 'CS002',
        department: 'Instruction',
        specialty: 'Reformer, Mat Pilates',
        certifications: ['PMA-CPT', 'BASI Pilates', 'CPR'],
        hourlyRate: 80.0,
      },
    }),
    // Members
    prisma.user.create({
      data: {
        organizationId: organizations[2].id,
        email: 'rachel.strong@gmail.com',
        password: hashedPassword,
        firstName: 'Rachel',
        lastName: 'Brown',
        phone: '+1 (555) 456-7803',
        dateOfBirth: new Date('1986-11-22'),
        gender: 'Female',
        address: '654 Strength Ave',
        city: 'Austin',
        state: 'TX',
        zipCode: '73302',
        country: 'US',
        role: 'MEMBER',
        status: 'ACTIVE',
        emailVerified: true,
        phoneVerified: true,
        lastLoginAt: new Date(),
        memberId: 'CS-M001',
        memberSince: new Date('2023-08-15'),
      },
    }),
  ]);

  // Iron Beast CrossFit Users
  const crossfitUsers = await Promise.all([
    // Organization Admin
    prisma.user.create({
      data: {
        organizationId: organizations[3].id,
        email: 'owner@ironbeast-crossfit.com',
        password: hashedPassword,
        firstName: 'Jake',
        lastName: 'Thompson',
        phone: '+1 (555) 321-9801',
        dateOfBirth: new Date('1983-05-18'),
        gender: 'Male',
        address: '321 Power Street',
        city: 'Denver',
        state: 'CO',
        zipCode: '80202',
        country: 'US',
        role: 'ORGANIZATION_ADMIN',
        status: 'ACTIVE',
        emailVerified: true,
        phoneVerified: true,
        lastLoginAt: new Date(),
        employeeId: 'IB001',
        department: 'Management',
        specialty: 'CrossFit, Olympic Lifting',
        certifications: ['CF-L3', 'USAW-L1', 'CPR', 'First Aid'],
        hourlyRate: 85.0,
        memberSince: new Date('2022-01-01'),
      },
    }),
    // CrossFit Coaches
    prisma.user.create({
      data: {
        organizationId: organizations[3].id,
        email: 'mike.beast@ironbeast-crossfit.com',
        password: hashedPassword,
        firstName: 'Mike',
        lastName: 'Santos',
        phone: '+1 (555) 321-9802',
        dateOfBirth: new Date('1990-03-07'),
        gender: 'Male',
        address: '123 Beast Ave',
        city: 'Denver',
        state: 'CO',
        zipCode: '80204',
        country: 'US',
        role: 'STAFF',
        status: 'ACTIVE',
        emailVerified: true,
        phoneVerified: true,
        lastLoginAt: new Date(),
        employeeId: 'IB002',
        department: 'Coaching',
        specialty: 'CrossFit, Strength & Conditioning',
        certifications: ['CF-L2', 'CSCS', 'CPR'],
        hourlyRate: 70.0,
      },
    }),
    // Members
    prisma.user.create({
      data: {
        organizationId: organizations[3].id,
        email: 'tyler.strong@gmail.com',
        password: hashedPassword,
        firstName: 'Tyler',
        lastName: 'Johnson',
        phone: '+1 (555) 321-9803',
        dateOfBirth: new Date('1988-07-11'),
        gender: 'Male',
        address: '456 Power Lane',
        city: 'Denver',
        state: 'CO',
        zipCode: '80203',
        country: 'US',
        role: 'MEMBER',
        status: 'ACTIVE',
        emailVerified: true,
        phoneVerified: true,
        lastLoginAt: new Date(),
        memberId: 'IB-M001',
        memberSince: new Date('2023-02-14'),
      },
    }),
  ]);

  // Harmony Wellness Users
  const wellnessUsers = await Promise.all([
    // Organization Admin
    prisma.user.create({
      data: {
        organizationId: organizations[4].id,
        email: 'owner@harmony-wellness.com',
        password: hashedPassword,
        firstName: 'Dr. Elena',
        lastName: 'Foster',
        phone: '+1 (555) 654-3201',
        dateOfBirth: new Date('1975-10-28'),
        gender: 'Female',
        address: '654 Healing Boulevard',
        city: 'Asheville',
        state: 'NC',
        zipCode: '28801',
        country: 'US',
        role: 'ORGANIZATION_ADMIN',
        status: 'ACTIVE',
        emailVerified: true,
        phoneVerified: true,
        lastLoginAt: new Date(),
        employeeId: 'HW001',
        department: 'Management',
        specialty: 'Holistic Wellness, Acupuncture',
        certifications: ['LAc', 'NCCAOM', 'LMT', 'CPR'],
        hourlyRate: 120.0,
        memberSince: new Date('2020-05-01'),
      },
    }),
    // Therapists
    prisma.user.create({
      data: {
        organizationId: organizations[4].id,
        email: 'sarah.massage@harmony-wellness.com',
        password: hashedPassword,
        firstName: 'Sarah',
        lastName: 'Mitchell',
        phone: '+1 (555) 654-3202',
        dateOfBirth: new Date('1986-12-15'),
        gender: 'Female',
        address: '123 Wellness Street',
        city: 'Asheville',
        state: 'NC',
        zipCode: '28803',
        country: 'US',
        role: 'STAFF',
        status: 'ACTIVE',
        emailVerified: true,
        phoneVerified: true,
        lastLoginAt: new Date(),
        employeeId: 'HW002',
        department: 'Therapy',
        specialty: 'Swedish Massage, Deep Tissue',
        certifications: ['LMT', 'Deep Tissue Certified', 'CPR'],
        hourlyRate: 85.0,
      },
    }),
    // Members/Clients
    prisma.user.create({
      data: {
        organizationId: organizations[4].id,
        email: 'jennifer.wellness@gmail.com',
        password: hashedPassword,
        firstName: 'Jennifer',
        lastName: 'Taylor',
        phone: '+1 (555) 654-3203',
        dateOfBirth: new Date('1979-04-08'),
        gender: 'Female',
        address: '789 Harmony Road',
        city: 'Asheville',
        state: 'NC',
        zipCode: '28804',
        country: 'US',
        role: 'MEMBER',
        status: 'ACTIVE',
        emailVerified: true,
        phoneVerified: true,
        lastLoginAt: new Date(),
        memberId: 'HW-M001',
        memberSince: new Date('2023-03-10'),
      },
    }),
  ]);

  users.push(
    ...fitcoreUsers,
    ...yogaUsers,
    ...pilatesUsers,
    ...crossfitUsers,
    ...wellnessUsers,
  );

  console.log(`✅ Created ${users.length} users across all organizations`);

  // Summary
  console.log('\n🎉 Database seeding completed successfully!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📊 Summary:`);
  console.log(`   • ${organizations.length} Organizations created`);
  console.log(`   • ${locations.length} Locations created`);
  console.log(`   • ${resources.length} Resources created`);
  console.log(`   • ${services.length} Services created`);
  console.log(`   • ${users.length} Users created`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  console.log('\n🏢 Organizations created:');
  organizations.forEach((org, index) => {
    console.log(
      `   ${index + 1}. ${org.name} (${org.slug}) - ${org.businessType} - ${org.subscriptionTier}`,
    );
  });

  console.log('\n👥 Users created by role:');
  const usersByRole = users.reduce(
    (acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  Object.entries(usersByRole).forEach(([role, count]) => {
    console.log(`   • ${role}: ${count as number} users`);
  });

  console.log('\n🔐 Sample login credentials:');
  console.log('   Super Admin: admin@agenticsystem.com');
  console.log('   FitCore Owner: owner@fitcore-gym.com');
  console.log('   Yoga Owner: owner@zenflow-yoga.com');
  console.log('   Pilates Owner: owner@corestrength-pilates.com');
  console.log('   CrossFit Owner: owner@ironbeast-crossfit.com');
  console.log('   Wellness Owner: owner@harmony-wellness.com');
  console.log('   (All passwords can be set via authentication system)');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
  })
  .finally(() => {
    prisma.$disconnect();
  });
