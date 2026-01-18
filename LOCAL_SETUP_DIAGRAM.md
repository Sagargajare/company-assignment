# Local Docker Setup - Visual Guide

## 📁 File Structure

```
traya/
│
├── 🚀 START HERE
│   └── ./start-local.sh          ← Run this to start everything!
│
├── 🛠️ HELPER SCRIPTS
│   ├── start-local.sh             ← Start all services
│   ├── stop-local.sh              ← Stop all services
│   ├── logs-local.sh              ← View logs
│   ├── db-shell.sh                ← Connect to database
│   └── test-local.sh              ← Test all services
│
├── 🐳 DOCKER CONFIGURATION
│   ├── docker-compose.local.yml   ← Main Docker config
│   ├── backend/Dockerfile.local   ← Backend container
│   └── frontend/Dockerfile.local  ← Frontend container
│
├── 📊 DATA
│   └── backend/data/
│       ├── README.md              ← Data loading guide
│       └── sample-data.sql.example ← Example data
│
└── 📚 DOCUMENTATION
    ├── LOCAL_SETUP_COMPLETE.md    ← Completion summary (read this!)
    ├── LOCAL_SETUP.md             ← Complete guide
    ├── QUICK_REFERENCE.md         ← Quick commands
    └── LOCAL_DOCKER_SETUP_SUMMARY.md ← Architecture details
```

---

## 🔄 Service Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     ./start-local.sh                        │
│                            │                                │
│                            ▼                                │
│    ┌───────────────────────────────────────────────┐       │
│    │     docker-compose.local.yml                  │       │
│    └───────────────────────────────────────────────┘       │
│                            │                                │
│         ┌──────────────────┼──────────────────┐            │
│         ▼                  ▼                  ▼            │
│    ┌─────────┐       ┌─────────┐       ┌─────────┐       │
│    │PostgreSQL│       │ Backend │       │Frontend │       │
│    │  :5432  │       │  :3001  │       │  :5173  │       │
│    └─────────┘       └─────────┘       └─────────┘       │
│         │                  │                  │            │
│         │                  │                  │            │
│         ▼                  ▼                  ▼            │
│    Loads SQL         Runs Migrations    Vite Dev Server   │
│    from data/        Auto-restarts      Hot Reload        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Quick Start Flow

```
Step 1: Start
┌──────────────────────┐
│  ./start-local.sh    │
└──────────┬───────────┘
           │
           ▼
Step 2: Wait 30 seconds
┌──────────────────────┐
│  Services starting   │
│  ⏳ PostgreSQL       │
│  ⏳ Backend          │
│  ⏳ Frontend         │
└──────────┬───────────┘
           │
           ▼
Step 3: Test (Optional)
┌──────────────────────┐
│  ./test-local.sh     │
│  ✓ All checks pass   │
└──────────┬───────────┘
           │
           ▼
Step 4: Access
┌──────────────────────────────────┐
│  http://localhost:5173 (Frontend)│
│  http://localhost:3001 (Backend) │
│  localhost:5432 (Database)       │
└──────────────────────────────────┘
```

---

## 🗄️ Data Loading Flow

```
First Time Start:
┌─────────────────────────────────────────────┐
│  PostgreSQL Container Starts                │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│  Check: Is database empty?                  │
└──────────────┬──────────────────────────────┘
               │
        ┌──────┴──────┐
        │             │
        ▼             ▼
    YES (empty)    NO (has data)
        │             │
        │             └──> Skip data loading
        │
        ▼
┌─────────────────────────────────────────────┐
│  Load all *.sql files from backend/data/    │
│  in alphabetical order:                     │
│  - 01-sample-data.sql                       │
│  - 02-more-data.sql                         │
│  - etc.                                     │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│  Data loaded! ✓                             │
│  - Coaches                                  │
│  - Quiz Questions                           │
│  - Time Slots                               │
└─────────────────────────────────────────────┘

Subsequent Starts:
┌─────────────────────────────────────────────┐
│  PostgreSQL Container Starts                │
│  Data already exists → Skip loading         │
│  Use existing data ✓                        │
└─────────────────────────────────────────────┘

To Reset:
┌─────────────────────────────────────────────┐
│  docker-compose -f docker-compose.local.yml │
│  down -v                                    │
│  (Deletes volume)                           │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│  ./start-local.sh                           │
│  (Loads data again)                         │
└─────────────────────────────────────────────┘
```

---

## 🔥 Hot Reload Flow

```
Backend Hot Reload:
┌─────────────────────────────────────────────┐
│  Edit: backend/src/controllers/user.ts      │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│  Nodemon detects change                     │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│  Restart backend server                     │
│  (Takes ~2 seconds)                         │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│  Backend ready with new code ✓              │
└─────────────────────────────────────────────┘

Frontend Hot Reload:
┌─────────────────────────────────────────────┐
│  Edit: frontend/src/App.tsx                 │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│  Vite HMR detects change                    │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│  Update browser instantly                   │
│  (No page refresh needed!)                  │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│  Browser shows new UI ✓                     │
└─────────────────────────────────────────────┘
```

---

## 🧪 Testing Flow

```
┌──────────────────────┐
│  ./test-local.sh     │
└──────────┬───────────┘
           │
           ▼
┌────────────────────────────────────┐
│  1. Check Containers Running       │
│     ✓ PostgreSQL                   │
│     ✓ Backend                      │
│     ✓ Frontend                     │
└──────────┬─────────────────────────┘
           │
           ▼
┌────────────────────────────────────┐
│  2. Check Service Health           │
│     ✓ Backend API responding       │
│     ✓ Database connected           │
│     ✓ Frontend accessible          │
└──────────┬─────────────────────────┘
           │
           ▼
┌────────────────────────────────────┐
│  3. Test API Endpoints             │
│     ✓ Quiz schema                  │
│     ✓ Coaches list                 │
└──────────┬─────────────────────────┘
           │
           ▼
┌────────────────────────────────────┐
│  All tests passed! ✓               │
│  Environment is ready              │
└────────────────────────────────────┘
```

---

## 🔍 Debugging Flow

```
Problem: Something not working
           │
           ▼
┌────────────────────────────────────┐
│  Step 1: Check Container Status    │
│  docker-compose -f                 │
│  docker-compose.local.yml ps       │
└──────────┬─────────────────────────┘
           │
           ▼
┌────────────────────────────────────┐
│  Step 2: View Logs                 │
│  ./logs-local.sh                   │
│  or                                │
│  ./logs-local.sh backend           │
└──────────┬─────────────────────────┘
           │
           ▼
┌────────────────────────────────────┐
│  Step 3: Identify Issue            │
│  - Port conflict?                  │
│  - Database connection?            │
│  - Code error?                     │
└──────────┬─────────────────────────┘
           │
           ▼
┌────────────────────────────────────┐
│  Step 4: Fix                       │
│  - Restart: restart backend        │
│  - Rebuild: up --build -d          │
│  - Reset: down -v && start         │
└────────────────────────────────────┘
```

---

## 📊 Port Mapping

```
┌─────────────────────────────────────────────┐
│  Your Machine                               │
│                                             │
│  Browser                                    │
│  └─> localhost:5173 ──────────┐            │
│                                │            │
│  API Client                    │            │
│  └─> localhost:3001 ──────┐   │            │
│                            │   │            │
│  Database Client           │   │            │
│  └─> localhost:5432 ───┐  │   │            │
│                         │  │   │            │
└─────────────────────────┼──┼───┼────────────┘
                          │  │   │
                          │  │   │
┌─────────────────────────┼──┼───┼────────────┐
│  Docker Network         │  │   │            │
│                         │  │   │            │
│  ┌──────────────────────┼──┼───┼─────────┐  │
│  │ PostgreSQL Container │  │   │         │  │
│  │ Port: 5432 <─────────┘  │   │         │  │
│  └─────────────────────────┼───┼─────────┘  │
│                            │   │            │
│  ┌─────────────────────────┼───┼─────────┐  │
│  │ Backend Container       │   │         │  │
│  │ Port: 3001 <────────────┘   │         │  │
│  │ Connects to: postgres:5432  │         │  │
│  └─────────────────────────────┼─────────┘  │
│                                │            │
│  ┌─────────────────────────────┼─────────┐  │
│  │ Frontend Container          │         │  │
│  │ Port: 5173 <────────────────┘         │  │
│  │ Proxies to: backend:3001              │  │
│  └───────────────────────────────────────┘  │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🎯 Command Cheat Sheet

```
┌─────────────────────────────────────────────────┐
│  ESSENTIAL COMMANDS                             │
├─────────────────────────────────────────────────┤
│  ./start-local.sh     Start everything          │
│  ./stop-local.sh      Stop everything           │
│  ./test-local.sh      Test all services         │
│  ./logs-local.sh      View all logs             │
│  ./db-shell.sh        Connect to database       │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  SERVICE MANAGEMENT                             │
├─────────────────────────────────────────────────┤
│  Restart backend:                               │
│  docker-compose -f docker-compose.local.yml     │
│  restart backend                                │
│                                                 │
│  Rebuild after package.json change:             │
│  docker-compose -f docker-compose.local.yml     │
│  up --build -d                                  │
│                                                 │
│  Reset database:                                │
│  docker-compose -f docker-compose.local.yml     │
│  down -v && ./start-local.sh                    │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  DEBUGGING                                      │
├─────────────────────────────────────────────────┤
│  View backend logs:                             │
│  ./logs-local.sh backend                        │
│                                                 │
│  Check container status:                        │
│  docker-compose -f docker-compose.local.yml ps  │
│                                                 │
│  Execute command in container:                  │
│  docker exec -it traya-backend-local sh         │
└─────────────────────────────────────────────────┘
```

---

## 🎓 Learning Path

```
Day 1: Setup
├─ Run ./start-local.sh
├─ Load sample data
├─ Run ./test-local.sh
└─ Access http://localhost:5173

Day 2: Explore
├─ View logs with ./logs-local.sh
├─ Connect to DB with ./db-shell.sh
├─ Test API endpoints with curl
└─ Browse the code

Day 3: Develop
├─ Make code changes
├─ See hot reload in action
├─ Debug with logs
└─ Test your changes

Day 4: Master
├─ Understand Docker Compose config
├─ Customize for your needs
├─ Add your own data
└─ Share with team
```

---

## ✅ Success Indicators

```
Everything is working when:

✓ ./start-local.sh completes without errors
✓ ./test-local.sh shows all checks passing
✓ http://localhost:5173 shows the frontend
✓ http://localhost:3001/health returns {"status":"ok"}
✓ ./db-shell.sh connects to database
✓ ./logs-local.sh shows no error messages
✓ Code changes trigger hot reload
✓ API endpoints return data
```

---

## 🚀 Ready to Start?

```bash
# Just run this:
./start-local.sh

# Wait 30 seconds, then visit:
# http://localhost:5173
```

**That's it!** Your local development environment is ready.

For detailed documentation, see:
- **[LOCAL_SETUP_COMPLETE.md](LOCAL_SETUP_COMPLETE.md)** - Start here!
- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Quick commands
- **[LOCAL_SETUP.md](LOCAL_SETUP.md)** - Full guide

