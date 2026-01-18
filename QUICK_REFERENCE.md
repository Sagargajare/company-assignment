# Quick Reference - Local Development

## 🚀 Start/Stop

```bash
./start-local.sh        # Start everything
./stop-local.sh         # Stop everything
./logs-local.sh         # View all logs
./logs-local.sh backend # View backend logs only
./db-shell.sh          # Connect to database
```

## 📍 URLs

- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- Database: localhost:5432

## 🗄️ Database

### Connect to Database
```bash
./db-shell.sh
```

### Quick SQL Commands
```sql
-- List all tables
\dt

-- Show table structure
\d+ users
\d+ coaches
\d+ slots

-- Query examples
SELECT * FROM coaches;
SELECT * FROM quiz_schema ORDER BY order_number;
SELECT COUNT(*) FROM slots;

-- Exit
\q
```

### Reset Database
```bash
# This will delete all data and reload from SQL files
docker-compose -f docker-compose.local.yml down -v
./start-local.sh
```

## 🔧 Common Tasks

### View Logs
```bash
# All services
./logs-local.sh

# Specific service
./logs-local.sh backend
./logs-local.sh frontend
./logs-local.sh postgres
```

### Restart Services
```bash
# Restart backend
docker-compose -f docker-compose.local.yml restart backend

# Restart frontend
docker-compose -f docker-compose.local.yml restart frontend

# Restart everything
docker-compose -f docker-compose.local.yml restart
```

### Rebuild After Dependencies Change
```bash
# Rebuild backend (after package.json changes)
docker-compose -f docker-compose.local.yml up --build -d backend

# Rebuild frontend
docker-compose -f docker-compose.local.yml up --build -d frontend

# Rebuild everything
docker-compose -f docker-compose.local.yml up --build -d
```

### Execute Commands in Containers
```bash
# Backend container
docker exec -it traya-backend-local sh
npm run migration:run

# Frontend container
docker exec -it traya-frontend-local sh
npm run build
```

## 📦 Load Sample Data

1. Copy or rename the example file:
```bash
cp backend/data/sample-data.sql.example backend/data/01-sample-data.sql
```

2. Reset database to load the data:
```bash
docker-compose -f docker-compose.local.yml down -v
./start-local.sh
```

## 🧪 Test Endpoints

### Health Check
```bash
curl http://localhost:3001/health
```

### Get Quiz Schema
```bash
curl http://localhost:3001/api/quiz/schema
```

### Get Available Coaches
```bash
curl http://localhost:3001/api/coaches/available
```

### Get Available Slots
```bash
curl "http://localhost:3001/api/slots/available?date=2026-01-20&timezone=Asia/Kolkata"
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Check what's using the port
lsof -i :5173  # Frontend
lsof -i :3001  # Backend
lsof -i :5432  # Database

# Kill the process
kill -9 <PID>
```

### Container Won't Start
```bash
# View container logs
docker logs traya-backend-local
docker logs traya-frontend-local
docker logs traya-postgres-local

# Remove and recreate
docker-compose -f docker-compose.local.yml down
docker-compose -f docker-compose.local.yml up -d
```

### Database Connection Issues
```bash
# Check if postgres is running
docker ps | grep postgres

# Check postgres logs
docker logs traya-postgres-local

# Test connection
docker exec -it traya-postgres-local pg_isready -U traya_user
```

### Code Changes Not Reflecting
```bash
# Restart the service
docker-compose -f docker-compose.local.yml restart backend

# Or check if volume mounts are working
docker-compose -f docker-compose.local.yml ps
docker inspect traya-backend-local | grep Mounts -A 20
```

## 📁 File Structure

```
traya/
├── start-local.sh              # 🚀 Start script
├── stop-local.sh               # 🛑 Stop script
├── logs-local.sh               # 📋 View logs
├── db-shell.sh                 # 🗄️  Database access
├── docker-compose.local.yml    # 🐳 Docker config
├── LOCAL_SETUP.md              # 📖 Full documentation
├── QUICK_REFERENCE.md          # 📝 This file
├── backend/
│   ├── Dockerfile.local        # Backend Docker config
│   └── data/                   # SQL data files
│       ├── README.md
│       └── sample-data.sql.example
└── frontend/
    └── Dockerfile.local        # Frontend Docker config
```

## 💡 Tips

- Use `./logs-local.sh` to see real-time output
- Changes to `.ts`, `.tsx`, `.css` files auto-reload
- After changing `package.json`, rebuild: `--build -d`
- Database data persists unless you use `down -v`
- SQL files only run on fresh database

