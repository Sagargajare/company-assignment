# 🐳 Local Docker Setup - Summary

## What Was Created

A simplified Docker-based local development environment that:

✅ Runs everything in Docker containers (PostgreSQL, Backend, Frontend)  
✅ Provides hot reload for both backend and frontend  
✅ Automatically loads SQL data from `backend/data/` on first run  
✅ Uses local PostgreSQL database (no external dependencies)  
✅ Minimal setup - just one command to start everything  

---

## 📁 New Files Created

### Main Scripts (Executable)
- **`start-local.sh`** - Start all services with one command
- **`stop-local.sh`** - Stop all services
- **`logs-local.sh`** - View logs (all or specific service)
- **`db-shell.sh`** - Connect to PostgreSQL database

### Configuration Files
- **`docker-compose.local.yml`** - Docker Compose configuration for local dev
- **`backend/Dockerfile.local`** - Backend development Dockerfile
- **`frontend/Dockerfile.local`** - Frontend development Dockerfile
- **`.env.local.example`** - Example environment variables

### Documentation
- **`LOCAL_SETUP.md`** - Complete setup guide with troubleshooting
- **`QUICK_REFERENCE.md`** - Quick command reference
- **`backend/data/README.md`** - How to add initial data
- **`backend/data/sample-data.sql.example`** - Example data file

---

## 🚀 How to Use

### Start Everything
```bash
./start-local.sh
```

This will:
1. Start PostgreSQL database
2. Start backend API (with hot reload)
3. Start frontend (with hot reload)
4. Load any SQL files from `backend/data/`

### Access Your Application
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001
- **Database**: localhost:5432

### View Logs
```bash
./logs-local.sh           # All services
./logs-local.sh backend   # Backend only
./logs-local.sh frontend  # Frontend only
```

### Connect to Database
```bash
./db-shell.sh
```

### Stop Everything
```bash
./stop-local.sh
```

---

## 🗄️ Loading Initial Data

### Option 1: Use Sample Data
```bash
# Copy the example file
cp backend/data/sample-data.sql.example backend/data/01-sample-data.sql

# Reset database to load it
docker-compose -f docker-compose.local.yml down -v
./start-local.sh
```

### Option 2: Add Your Own SQL Files
1. Place `.sql` files in `backend/data/`
2. Files run in alphabetical order
3. Reset database: `docker-compose -f docker-compose.local.yml down -v && ./start-local.sh`

---

## 🎯 Key Features

### 1. Hot Reload
- Edit `.ts`, `.tsx`, `.css` files
- Changes automatically reflect in the browser
- No need to restart containers

### 2. Data Persistence
- Database data persists between restarts
- Use `down -v` to reset database

### 3. Automatic Data Loading
- SQL files in `backend/data/` load automatically
- Only runs when database is empty (first start)

### 4. Isolated Environment
- Everything runs in Docker
- No conflicts with other projects
- Clean separation of concerns

---

## 📊 Architecture

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  Frontend (http://localhost:5173)              │
│  - React + Vite                                 │
│  - Hot Reload Enabled                           │
│  - Volume Mounted: ./frontend/src               │
│                                                 │
└────────────────┬────────────────────────────────┘
                 │
                 │ API Calls
                 ▼
┌─────────────────────────────────────────────────┐
│                                                 │
│  Backend (http://localhost:3001)                │
│  - Express + TypeORM                            │
│  - Hot Reload Enabled (nodemon)                 │
│  - Volume Mounted: ./backend/src                │
│  - Auto-runs migrations on startup              │
│                                                 │
└────────────────┬────────────────────────────────┘
                 │
                 │ SQL Queries
                 ▼
┌─────────────────────────────────────────────────┐
│                                                 │
│  PostgreSQL (localhost:5432)                    │
│  - postgres:15-alpine                           │
│  - Data Volume: postgres_local_data             │
│  - Auto-loads: ./backend/data/*.sql             │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 🔧 Common Commands

### Service Management
```bash
# Start all services
./start-local.sh

# Stop all services
./stop-local.sh

# Restart a specific service
docker-compose -f docker-compose.local.yml restart backend
docker-compose -f docker-compose.local.yml restart frontend

# Rebuild after package.json changes
docker-compose -f docker-compose.local.yml up --build -d
```

### Logs & Debugging
```bash
# View all logs
./logs-local.sh

# View specific service logs
./logs-local.sh backend
./logs-local.sh frontend
./logs-local.sh postgres

# Check service status
docker-compose -f docker-compose.local.yml ps
```

### Database Operations
```bash
# Connect to database
./db-shell.sh

# Reset database (deletes all data)
docker-compose -f docker-compose.local.yml down -v
./start-local.sh

# Backup database
docker exec traya-postgres-local pg_dump -U traya_user traya_db > backup.sql

# Restore database
cat backup.sql | docker exec -i traya-postgres-local psql -U traya_user -d traya_db
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Check what's using the port
lsof -i :5173  # Frontend
lsof -i :3001  # Backend
lsof -i :5432  # Database

# Stop the conflicting process
kill -9 <PID>
```

### Database Connection Failed
```bash
# Check if postgres is healthy
docker-compose -f docker-compose.local.yml ps

# View postgres logs
docker logs traya-postgres-local

# Restart postgres
docker-compose -f docker-compose.local.yml restart postgres
```

### Code Changes Not Reflecting
```bash
# Check if volumes are mounted correctly
docker inspect traya-backend-local | grep Mounts -A 10

# Restart the service
docker-compose -f docker-compose.local.yml restart backend

# Rebuild if needed
docker-compose -f docker-compose.local.yml up --build -d backend
```

### Clean Start (Nuclear Option)
```bash
# Stop everything and remove all containers, volumes, images
docker-compose -f docker-compose.local.yml down -v --rmi all

# Start fresh
./start-local.sh
```

---

## 📚 Documentation

- **[LOCAL_SETUP.md](LOCAL_SETUP.md)** - Complete setup guide
- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Quick command reference
- **[backend/data/README.md](backend/data/README.md)** - Data loading guide

---

## 🎉 Benefits Over Manual Setup

| Aspect | Manual Setup | Docker Setup |
|--------|-------------|--------------|
| **Setup Time** | ~15 minutes | ~2 minutes |
| **Dependencies** | Node.js, PostgreSQL | Just Docker |
| **Isolation** | Shared system | Containerized |
| **Data Loading** | Manual SQL execution | Automatic |
| **Hot Reload** | Manual setup | Built-in |
| **Cleanup** | Manual uninstall | One command |
| **Consistency** | Varies by machine | Same everywhere |

---

## 💡 Tips

1. **First Time Setup**: Run `./start-local.sh` and wait 30 seconds for services to initialize
2. **Sample Data**: Copy `sample-data.sql.example` to load coaches, quiz questions, and slots
3. **Logs**: Keep `./logs-local.sh` running in a separate terminal for debugging
4. **Database**: Use `./db-shell.sh` to quickly inspect data
5. **Clean State**: Use `down -v` to reset database when testing migrations

---

## 🔄 Comparison with Production Setup

| Feature | Local Setup | Production Setup |
|---------|-------------|------------------|
| **File** | `docker-compose.local.yml` | `docker-compose.prod.yml` |
| **Mode** | Development | Production |
| **Hot Reload** | ✅ Yes | ❌ No |
| **Volumes** | Source code mounted | None |
| **Build** | Development | Optimized |
| **Nginx** | ❌ Not needed | ✅ Reverse proxy |
| **SSL** | ❌ No | ✅ Yes |
| **Port** | Frontend: 5173, Backend: 3001 | 80, 443 |

---

## ✅ What's Next?

1. **Start the environment**: `./start-local.sh`
2. **Load sample data**: Copy `sample-data.sql.example`
3. **Open frontend**: http://localhost:5173
4. **Start coding**: Changes auto-reload!

For detailed instructions, see [LOCAL_SETUP.md](LOCAL_SETUP.md)

