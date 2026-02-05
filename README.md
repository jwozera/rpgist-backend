# RPGist Backend

Backend scaffold for the RPGist project built with Node.js 20, TypeScript, Express, Sequelize, PostgreSQL, Docker, and Swagger.

## Prerequisites

- Node.js 20+
- npm 9+
- Docker and Docker Compose

## Environment Configuration

1. Create an `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
2. Update the variables as needed for your local or containerized environment.

## Installation

Install dependencies locally:

```bash
npm install
```

## Running the Application

### Local Development

```bash
npm run dev
```

The API listens on `http://localhost:3000`. Swagger UI is available at `http://localhost:3000/docs`. A health endpoint responds at `GET /health`.

### Docker Compose

To run both the API and PostgreSQL services:

```bash
docker-compose up --build
```

This maps the API to `localhost:3000` and PostgreSQL to `localhost:5432`.

## Database Commands

The project uses Sequelize CLI for migrations and seeders. Ensure environment variables are set before running these commands.

```bash
npm run db:create
npm run db:migrate
npm run db:seed
```

To undo changes:

```bash
npm run db:migrate:undo
npm run db:seed:undo
npm run db:drop
```

## Project Structure

```
src/
  app.ts
  server.ts
  config/
    database.ts
    swagger.ts
  database/
    index.ts
    migrations/
    seeders/
  modules/
    character/
      character.controller.ts
      character.service.ts
      character.routes.ts
      character.model.ts
  shared/
    errors/
    middleware/
    utils/
```

## Linting and Build

```bash
npm run lint
npm run build
npm start
```

`npm start` executes the compiled output from the `dist` directory.
