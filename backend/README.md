# Agentic Scheduling - Backend

A NestJS backend application for the Agentic Scheduling system with PostgreSQL database.

## Prerequisites

Before running this project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Docker](https://www.docker.com/) and Docker Compose
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Database

Start the PostgreSQL database using Docker Compose:

```bash
docker-compose up -d
```

This will start a PostgreSQL container with the following configuration:
- **Database:** agentic_scheduling
- **Username:** postgres
- **Password:** postgres
- **Port:** 5432

### 3. Set Up the Database

Run Prisma migrations to set up the database schema:

```bash
npx prisma migrate dev
```

Generate the Prisma client:

```bash
npx prisma generate
```

### 4. Start the Application

For development:
```bash
npm run start:dev
```

For production:
```bash
npm run build
npm run start:prod
```

The backend API will be available at `http://localhost:3000`

## Available Scripts

### Development
- `npm run start:dev` - Start the application in development mode with hot reload
- `npm run start:debug` - Start in debug mode

### Building
- `npm run build` - Build the application for production
- `npm run start:prod` - Start the production build

### Testing
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:cov` - Run tests with coverage
- `npm run test:e2e` - Run end-to-end tests

### Code Quality
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Database Commands

#### Prisma
- `npx prisma studio` - Open Prisma Studio to view/edit data
- `npx prisma migrate dev` - Create and apply new migration
- `npx prisma migrate reset` - Reset database and apply all migrations
- `npx prisma generate` - Generate Prisma client

#### Docker Database
- `docker-compose up -d` - Start PostgreSQL container
- `docker-compose down` - Stop PostgreSQL container
- `docker-compose down -v` - Stop and remove all data (⚠️ destructive)
- `docker-compose logs postgres` - View database logs

#### Direct Database Access
```bash
docker-compose exec postgres psql -U postgres -d agentic_scheduling
```

## Project Structure

```
backend/
├── src/                    # Source code
│   ├── app.controller.ts   # Main application controller
│   ├── app.module.ts       # Root module
│   ├── app.service.ts      # Main application service
│   └── main.ts            # Application entry point
├── prisma/                # Database schema and migrations
│   └── schema.prisma      # Prisma schema file
├── test/                  # Test files
├── docker-compose.yml     # PostgreSQL Docker setup
├── init.sql              # Database initialization script
└── README.md             # This file
```

## Environment Variables

The application uses environment variables defined in `.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/agentic_scheduling?schema=public"
```

## API Documentation

Once the application is running, you can access the API documentation at:
- Swagger UI: `http://localhost:3000/api` (if configured)

## Troubleshooting

### Database Connection Issues
1. Ensure Docker is running
2. Check if PostgreSQL container is up: `docker-compose ps`
3. Verify the DATABASE_URL in `.env` file
4. Try restarting the database: `docker-compose restart postgres`

### Migration Issues
1. Reset migrations: `npx prisma migrate reset`
2. Regenerate client: `npx prisma generate`
3. Check database connectivity

### Port Conflicts
If port 5432 is already in use, you can change it in `docker-compose.yml`:
```yaml
ports:
  - "5433:5432"  # Change 5432 to 5433 or any available port
```

Then update your DATABASE_URL accordingly.

## Development Workflow

1. Make your code changes
2. The application will automatically reload (in dev mode)
3. Run tests: `npm run test`
4. Format code: `npm run format`
5. Lint code: `npm run lint`
6. If you modify the database schema, create a migration: `npx prisma migrate dev`

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Create a pull request

## Tech Stack

- **Framework:** NestJS
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Language:** TypeScript
- **Testing:** Jest
- **Linting:** ESLint
- **Formatting:** Prettier