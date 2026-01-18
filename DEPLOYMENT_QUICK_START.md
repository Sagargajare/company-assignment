# 🚀 Quick Deployment Guide

## Production Deployment (2 Minutes)

### 1. Setup Environment (30 seconds)
```bash
cp .env.production.example .env
nano .env  # Change DB_PASSWORD to a strong password
```

### 2. Deploy (60 seconds)
```bash
./deploy.sh
```

### 3. Access Application (30 seconds)
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **Database:** localhost:5432

## Common Commands

```bash
# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop services
docker-compose -f docker-compose.prod.yml down

# Restart services
docker-compose -f docker-compose.prod.yml restart

# Check status
docker-compose -f docker-compose.prod.yml ps
```

## Need More Details?

📖 **Full Guide:** See `DOCKER_DEPLOYMENT.md`

## Architecture

- **Frontend:** React + Vite + Nginx (Port 3000)
- **Backend:** Express.js + TypeORM (Port 3001)
- **Database:** PostgreSQL 15 (Port 5432)
- **Optional:** Nginx Reverse Proxy (Port 80/443)

## What's Included?

✅ Production-optimized Docker images  
✅ Multi-stage builds for security  
✅ Health checks & auto-restart  
✅ Persistent database storage  
✅ Non-root users  
✅ Network isolation  
✅ Automated deployment script  
✅ Nginx reverse proxy (optional)  
✅ Complete documentation  

---

**For detailed deployment instructions, troubleshooting, and maintenance:**  
👉 Read `DOCKER_DEPLOYMENT.md`

