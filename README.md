# Clinical Onboarding Hub - SDE-2 Fullstack Assignment

## 📁 Project Structure

```
traya/
├── frontend/          # Next.js app
│   ├── app/
│   ├── components/
│   ├── hooks/
│   └── lib/
├── backend/           # Express.js app
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── entities/
│   │   └── dto/
│   └── migrations/
├── docker-compose.yml
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Docker** and **Docker Compose** (for PostgreSQL database)
- **Git**

### Setup Instructions

1. **Clone the repository** (if applicable)
   ```bash
   git clone <repository-url>
   cd traya
   ```

2. **Start the PostgreSQL database**
   ```bash
   # Start PostgreSQL container
   docker-compose up -d
   
   # Verify it's running
   docker-compose ps
   ```

3. **Setup Backend**
   ```bash
   cd backend
   
   # Install dependencies
   npm install
   
   # Copy environment variables
   cp .env.example .env
   
   # Edit .env file with your database credentials (if different from defaults)
   # Default values work with docker-compose defaults
   ```

4. **Setup Frontend**
   ```bash
   cd frontend
   
   # Install dependencies
   npm install
   
   # Copy environment variables
   cp .env.example .env
   
   # Edit .env file if needed (defaults should work for local development)
   ```

## 🏃 Running the Project

### Option 1: Run Everything Separately (Recommended for Development)

**Terminal 1 - Database:**
```bash
# Make sure PostgreSQL is running
docker-compose up -d
```

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
```
Backend will run on: `http://localhost:3001`

**Terminal 3 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend will run on: `http://localhost:3000`

### Option 2: Quick Start Script (Coming Soon)

You can create a script to run everything at once.

## 🔍 Verify Installation

1. **Check Database:**
   ```bash
   docker-compose ps
   # Should show traya-postgres as "Up"
   ```

2. **Check Backend:**
   ```bash
   curl http://localhost:3001/health
   # Should return: {"status":"ok","message":"Backend server is running"}
   ```

3. **Check Frontend:**
   - Open browser: `http://localhost:3000`
   - Should see Next.js default page

## 🛠️ Available Scripts

### Backend Scripts
```bash
cd backend

npm run dev      # Start development server with hot reload
npm run build    # Build for production
npm run start    # Start production server
```

### Frontend Scripts
```bash
cd frontend

npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🐳 Docker Commands

```bash
# Start database
docker-compose up -d

# Stop database
docker-compose down

# View logs
docker-compose logs -f postgres

# Restart database
docker-compose restart postgres

# Remove database and volumes (⚠️ deletes all data)
docker-compose down -v
```

## 📝 Environment Variables

### Root `.env` (for Docker Compose)
```env
DB_USER=traya_user
DB_PASSWORD=traya_password
DB_NAME=traya_db
DB_PORT=5432
DB_HOST=localhost
```

### Backend `.env`
```env
PORT=3001
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USER=traya_user
DB_PASSWORD=traya_password
DB_NAME=traya_db
DB_URL=postgresql://traya_user:traya_password@localhost:5432/traya_db
API_PREFIX=/api
```

### Frontend `.env`
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_NAME=Clinical Onboarding Hub
```

## 🐛 Troubleshooting

### Database Connection Issues
- Ensure Docker is running: `docker ps`
- Check if PostgreSQL container is up: `docker-compose ps`
- Verify database credentials in `.env` files match

### Port Already in Use
- Backend (3001): Change `PORT` in `backend/.env`
- Frontend (3000): Change port in `frontend/package.json` scripts
- Database (5432): Change `DB_PORT` in root `.env`

### Module Not Found Errors
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear npm cache: `npm cache clean --force`

## 📚 Next Steps

Once the project is running:
1. Database migrations will be set up (Phase 2)
2. API endpoints will be implemented (Phase 3)
3. Frontend components will be built (Phase 4)
