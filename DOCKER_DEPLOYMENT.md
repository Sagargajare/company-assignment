# 🐳 Docker Production Deployment Guide

This guide covers deploying the Traya Clinical Onboarding Hub using Docker containers in production.

## 📋 Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- 2GB+ RAM available
- 10GB+ disk space

## 🚀 Quick Start

### 1. Setup Environment Variables

```bash
# Copy the example environment file
cp .env.production.example .env

# Edit .env and update production values
nano .env

# IMPORTANT: Change the database password!
# DB_PASSWORD=your_secure_password_here
```

### 2. Build and Start Services

```bash
# Build all services
docker-compose -f docker-compose.prod.yml build

# Start all services in detached mode
docker-compose -f docker-compose.prod.yml up -d

# Check service health
docker-compose -f docker-compose.prod.yml ps
```

### 3. Run Database Migrations

```bash
# Access the backend container
docker exec -it traya-backend-prod sh

# Run migrations
npm run typeorm migration:run

# Exit container
exit
```

### 4. Verify Deployment

```bash
# Check backend health
curl http://localhost:3001/health

# Check frontend
curl http://localhost:3000

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

## 📦 Services

The production setup includes:

| Service | Port | Description |
|---------|------|-------------|
| **PostgreSQL** | 5432 | Database |
| **Backend** | 3001 | Express.js API |
| **Frontend** | 3000 | Next.js App |
| **Nginx** (optional) | 80/443 | Reverse Proxy |

## 🔧 Configuration

### Backend Environment

The backend container is configured with:
- `NODE_ENV=production`
- Database connection to `postgres` service
- Health checks every 30s
- Auto-restart on failure

### Frontend Environment

The frontend container is configured with:
- `NODE_ENV=production`
- Standalone Next.js output
- Optimized production build
- Health checks every 30s

### Database

PostgreSQL configuration:
- Persistent volume for data
- Health checks
- Alpine-based image for smaller size

## 🌐 Using Nginx (Optional)

To serve both frontend and backend through a single domain:

### 1. Uncomment Nginx Service

Edit `docker-compose.prod.yml` and uncomment the nginx service.

### 2. Configure Domain

Edit `nginx/nginx.conf`:
```nginx
server_name your-domain.com;
```

### 3. Add SSL Certificates

```bash
# Create SSL directory
mkdir -p nginx/ssl

# Copy your SSL certificates
cp /path/to/cert.pem nginx/ssl/
cp /path/to/key.pem nginx/ssl/
```

### 4. Restart Services

```bash
docker-compose -f docker-compose.prod.yml up -d nginx
```

## 🔒 Security Best Practices

### 1. Change Default Credentials

```bash
# Generate strong password
openssl rand -base64 32

# Update .env file
DB_PASSWORD=<generated-password>
```

### 2. Use SSL/TLS

- Obtain SSL certificate (Let's Encrypt recommended)
- Configure HTTPS in Nginx
- Redirect HTTP to HTTPS

### 3. Firewall Rules

```bash
# Only expose necessary ports
# Block direct access to database port (5432) from outside
```

### 4. Regular Updates

```bash
# Update base images
docker-compose -f docker-compose.prod.yml pull

# Rebuild services
docker-compose -f docker-compose.prod.yml build --no-cache

# Restart with new images
docker-compose -f docker-compose.prod.yml up -d
```

## 📊 Monitoring

### View Logs

```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
docker-compose -f docker-compose.prod.yml logs -f postgres
```

### Check Resource Usage

```bash
# Container stats
docker stats

# Disk usage
docker system df
```

### Health Checks

```bash
# Backend health
curl http://localhost:3001/health
curl http://localhost:3001/health/db

# Frontend health
curl http://localhost:3000
```

## 🔄 Maintenance

### Backup Database

```bash
# Create backup
docker exec traya-postgres-prod pg_dump -U traya_user traya_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
docker exec -i traya-postgres-prod psql -U traya_user traya_db < backup.sql
```

### Update Application

```bash
# Pull latest code
git pull origin main

# Rebuild services
docker-compose -f docker-compose.prod.yml build

# Restart services (zero-downtime with recreate)
docker-compose -f docker-compose.prod.yml up -d --force-recreate --no-deps backend
docker-compose -f docker-compose.prod.yml up -d --force-recreate --no-deps frontend
```

### Scale Services

```bash
# Scale backend (requires load balancer)
docker-compose -f docker-compose.prod.yml up -d --scale backend=3
```

## 🐛 Troubleshooting

### Services Won't Start

```bash
# Check logs for errors
docker-compose -f docker-compose.prod.yml logs

# Check service status
docker-compose -f docker-compose.prod.yml ps

# Restart specific service
docker-compose -f docker-compose.prod.yml restart backend
```

### Database Connection Issues

```bash
# Check database health
docker exec traya-postgres-prod pg_isready -U traya_user -d traya_db

# Check database logs
docker-compose -f docker-compose.prod.yml logs postgres

# Verify environment variables
docker exec traya-backend-prod env | grep DB_
```

### Frontend/Backend Connection Issues

```bash
# Check network connectivity
docker exec traya-frontend-prod ping backend

# Verify API URL
docker exec traya-frontend-prod env | grep API_URL
```

## 🛑 Stopping Services

```bash
# Stop all services
docker-compose -f docker-compose.prod.yml down

# Stop and remove volumes (⚠️ deletes database data)
docker-compose -f docker-compose.prod.yml down -v
```

## 📈 Performance Tuning

### PostgreSQL

Edit `docker-compose.prod.yml` to add:
```yaml
postgres:
  command:
    - "postgres"
    - "-c"
    - "max_connections=200"
    - "-c"
    - "shared_buffers=256MB"
```

### Node.js

Adjust memory limits:
```yaml
backend:
  environment:
    NODE_OPTIONS: "--max-old-space-size=2048"
```

## 🔗 Production Checklist

- [ ] Changed default database password
- [ ] Configured environment variables
- [ ] Set up SSL/TLS certificates
- [ ] Configured firewall rules
- [ ] Set up automated backups
- [ ] Configured monitoring/logging
- [ ] Tested health check endpoints
- [ ] Configured domain DNS
- [ ] Set up error alerting
- [ ] Documented deployment process
- [ ] Tested rollback procedure

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Best Practices](https://docs.docker.com/compose/production/)
- [Next.js Docker Documentation](https://nextjs.org/docs/deployment#docker-image)
- [PostgreSQL Docker Hub](https://hub.docker.com/_/postgres)

## 🆘 Support

For issues or questions:
1. Check logs: `docker-compose -f docker-compose.prod.yml logs`
2. Check health: `docker-compose -f docker-compose.prod.yml ps`
3. Review configuration files
4. Consult documentation

---

**Last Updated:** 2026-01-18
**Version:** 1.0.0

