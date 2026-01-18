# Local Development Setup

Simple Docker-based local development environment for Traya.

## Prerequisites

- Docker Desktop installed and running
- No other services running on ports 5173, 3001, or 5432

## Quick Start

### 1. Start the Environment

```bash
chmod +x start-local.sh
./start-local.sh
```

This will:
- Start PostgreSQL database
- Start backend API with hot reload
- Start frontend with hot reload
- Automatically load data from `backend/data/*.sql` (if files exist)

### 2. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Database**: localhost:5432
  - User: `traya_user`
  - Password: `traya_password`
  - Database: `traya_db`

### 3. Stop the Environment

```bash
chmod +x stop-local.sh
./stop-local.sh
```

## Features

✅ **Hot Reload**: Changes to code automatically reload the application
✅ **Data Persistence**: Database data is preserved between restarts
✅ **Auto Data Loading**: SQL files in `backend/data/` are loaded automatically on first run
✅ **Isolated Environment**: Everything runs in Docker containers

## Adding Initial Data

To add initial data to the database:

1. Place your SQL files in `backend/data/` directory:
   ```
   backend/data/
     ├── 01-schema.sql
     ├── 02-coaches.sql
     └── 03-quiz-data.sql
   ```

2. SQL files are executed in alphabetical order

3. Restart with fresh database:
   ```bash
   docker-compose -f docker-compose.local.yml down -v
   ./start-local.sh
   ```

## Useful Commands

### View Logs
```bash
# All services
docker-compose -f docker-compose.local.yml logs -f

# Specific service
docker-compose -f docker-compose.local.yml logs -f backend
docker-compose -f docker-compose.local.yml logs -f frontend
docker-compose -f docker-compose.local.yml logs -f postgres
```

### Restart Services
```bash
# Restart backend
docker-compose -f docker-compose.local.yml restart backend

# Restart frontend
docker-compose -f docker-compose.local.yml restart frontend
```

### Access Database
```bash
# Using psql
docker exec -it traya-postgres-local psql -U traya_user -d traya_db

# Run SQL query
docker exec -it traya-postgres-local psql -U traya_user -d traya_db -c "SELECT * FROM users;"
```

### Clean Everything
```bash
# Stop and remove all containers and volumes (fresh start)
docker-compose -f docker-compose.local.yml down -v

# Remove all Docker images
docker-compose -f docker-compose.local.yml down --rmi all -v
```

## Troubleshooting

### Port Already in Use
If you see "port is already allocated" error:

```bash
# Check what's using the port
lsof -i :5173  # Frontend
lsof -i :3001  # Backend
lsof -i :5432  # Database

# Stop the conflicting service or change the port in docker-compose.local.yml
```

### Database Connection Issues
```bash
# Check if postgres is healthy
docker-compose -f docker-compose.local.yml ps

# View postgres logs
docker-compose -f docker-compose.local.yml logs postgres

# Restart postgres
docker-compose -f docker-compose.local.yml restart postgres
```

### Code Changes Not Reflecting
```bash
# Restart the specific service
docker-compose -f docker-compose.local.yml restart backend

# Or rebuild if needed
docker-compose -f docker-compose.local.yml up --build -d backend
```

## Development Workflow

1. Start the environment: `./start-local.sh`
2. Make code changes in your editor
3. Changes are automatically reflected (hot reload)
4. View logs: `docker-compose -f docker-compose.local.yml logs -f`
5. Stop when done: `./stop-local.sh`

## Database Migrations

The backend automatically runs migrations on startup. To manually manage migrations:

```bash
# Enter backend container
docker exec -it traya-backend-local sh

# Run migrations
npm run migration:run

# Revert last migration
npm run migration:revert

# Generate new migration
npm run migration:generate -- -n MigrationName
```

## Environment Variables

Default values are set in `docker-compose.local.yml`. To override:

1. Create `.env.local` file in project root
2. Add your variables:
   ```
   DB_PASSWORD=custom_password
   VITE_API_URL=http://localhost:3001
   ```

## Notes

- Data in `postgres_local_data` volume persists between restarts
- SQL files in `backend/data/` only run when initializing a new database
- Hot reload works for most code changes (TypeScript, React components, etc.)
- For package.json changes, rebuild: `docker-compose -f docker-compose.local.yml up --build -d`

