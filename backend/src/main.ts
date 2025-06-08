import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: false,
    }),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Agentic Scheduling API')
    .setDescription(
      'Multi-Tenant SaaS Gym Scheduling and Management System API',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag(
      'User Management',
      'Endpoints for managing users, members, staff, and admins',
    )
    .addTag(
      'Organization Management',
      'Endpoints for managing organizations, locations, and resources',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(
    `🚀 Application is running on: http://localhost:${process.env.PORT ?? 3000}`,
  );
  console.log(
    `📚 Swagger documentation: http://localhost:${process.env.PORT ?? 3000}/api`,
  );
}
bootstrap();
