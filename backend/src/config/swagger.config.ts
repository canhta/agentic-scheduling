import { INestApplication, Type } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { OrganizationModule } from '../organization/organization.module';
import { SchedulingModule } from '../scheduling/scheduling.module';
import { SWAGGER_CONSTANTS } from './swagger.constants';

// Types and interfaces for better type safety
interface SwaggerTag {
  name: string;
  description: string;
}

interface SwaggerModuleConfig {
  title: string;
  description: string;
  path: string;
  module: Type<any>;
  tags: SwaggerTag[];
}

// Constants for reusable values
const SWAGGER_CONFIG = {
  version: SWAGGER_CONSTANTS.VERSION,
  basePath: SWAGGER_CONSTANTS.BASE_PATH,
  bearerAuth: SWAGGER_CONSTANTS.ENABLE_BEARER_AUTH,
} as const;

// Centralized module configurations
const SWAGGER_MODULES: Record<string, SwaggerModuleConfig> = {
  auth: {
    title: SWAGGER_CONSTANTS.API_INFO.AUTH.TITLE,
    description: SWAGGER_CONSTANTS.API_INFO.AUTH.DESCRIPTION,
    path: SWAGGER_CONSTANTS.PATHS.AUTH,
    module: AuthModule,
    tags: [
      {
        name: SWAGGER_CONSTANTS.TAGS.AUTHENTICATION.NAME,
        description: SWAGGER_CONSTANTS.TAGS.AUTHENTICATION.DESCRIPTION,
      },
    ],
  },
  users: {
    title: SWAGGER_CONSTANTS.API_INFO.USERS.TITLE,
    description: SWAGGER_CONSTANTS.API_INFO.USERS.DESCRIPTION,
    path: SWAGGER_CONSTANTS.PATHS.USERS,
    module: UsersModule,
    tags: [
      {
        name: SWAGGER_CONSTANTS.TAGS.USER_MANAGEMENT.NAME,
        description: SWAGGER_CONSTANTS.TAGS.USER_MANAGEMENT.DESCRIPTION,
      },
    ],
  },
  organizations: {
    title: SWAGGER_CONSTANTS.API_INFO.ORGANIZATIONS.TITLE,
    description: SWAGGER_CONSTANTS.API_INFO.ORGANIZATIONS.DESCRIPTION,
    path: SWAGGER_CONSTANTS.PATHS.ORGANIZATIONS,
    module: OrganizationModule,
    tags: [
      {
        name: SWAGGER_CONSTANTS.TAGS.ORGANIZATION_MANAGEMENT.NAME,
        description: SWAGGER_CONSTANTS.TAGS.ORGANIZATION_MANAGEMENT.DESCRIPTION,
      },
    ],
  },
  scheduling: {
    title: SWAGGER_CONSTANTS.API_INFO.SCHEDULING.TITLE,
    description: SWAGGER_CONSTANTS.API_INFO.SCHEDULING.DESCRIPTION,
    path: SWAGGER_CONSTANTS.PATHS.SCHEDULING,
    module: SchedulingModule,
    tags: [
      {
        name: SWAGGER_CONSTANTS.TAGS.BOOKINGS.NAME,
        description: SWAGGER_CONSTANTS.TAGS.BOOKINGS.DESCRIPTION,
      },
      {
        name: SWAGGER_CONSTANTS.TAGS.CALENDAR.NAME,
        description: SWAGGER_CONSTANTS.TAGS.CALENDAR.DESCRIPTION,
      },
      {
        name: SWAGGER_CONSTANTS.TAGS.RECURRING_SCHEDULES.NAME,
        description: SWAGGER_CONSTANTS.TAGS.RECURRING_SCHEDULES.DESCRIPTION,
      },
    ],
  },
};

/**
 * Creates a Swagger document configuration for a specific module
 */
function createModuleDocumentConfig(config: SwaggerModuleConfig) {
  const builder = new DocumentBuilder()
    .setTitle(config.title)
    .setDescription(config.description)
    .setVersion(SWAGGER_CONFIG.version);

  if (SWAGGER_CONFIG.bearerAuth) {
    builder.addBearerAuth();
  }

  // Add all tags for this module
  config.tags.forEach((tag) => {
    builder.addTag(tag.name, tag.description);
  });

  return builder.build();
}

/**
 * Sets up Swagger documentation for a single module
 */
function setupModuleSwagger(
  app: INestApplication,
  moduleKey: string,
  config: SwaggerModuleConfig,
): void {
  const documentConfig = createModuleDocumentConfig(config);
  const document = SwaggerModule.createDocument(app, documentConfig, {
    include: [config.module],
  });

  const fullPath = `${SWAGGER_CONFIG.basePath}/${config.path}`;
  SwaggerModule.setup(fullPath, app, document);
}

/**
 * Sets up all Swagger documentation modules
 */
export function setupSwagger(app: INestApplication): void {
  Object.entries(SWAGGER_MODULES).forEach(([moduleKey, config]) => {
    setupModuleSwagger(app, moduleKey, config);
  });
}

/**
 * Logs all available Swagger documentation URLs
 */
export function logSwaggerUrls(port: number | string): void {
  console.log(`📖 Module-specific documentation:`);

  Object.entries(SWAGGER_MODULES).forEach(([moduleKey, config]) => {
    const url = `http://localhost:${port}/${SWAGGER_CONFIG.basePath}/${config.path}`;
    const capitalizedKey = config.title.split(' ')[0];
    console.log(`   • ${capitalizedKey}: ${url}`);
  });
}

/**
 * Gets all configured Swagger module information
 * Useful for testing or external integrations
 */
export function getSwaggerModuleInfo() {
  return {
    modules: SWAGGER_MODULES,
    config: SWAGGER_CONFIG,
  };
}

/**
 * Adds a new Swagger module configuration at runtime
 * Useful for dynamic module registration
 */
export function addSwaggerModule(
  key: string,
  config: SwaggerModuleConfig,
): void {
  SWAGGER_MODULES[key] = config;
}
