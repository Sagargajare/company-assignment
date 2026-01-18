#!/bin/bash

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Testing Local Development Environment   ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo ""

# Function to check if a service is responding
check_service() {
    local name=$1
    local url=$2
    local max_attempts=30
    local attempt=1

    echo -e "${YELLOW}⏳ Checking ${name}...${NC}"
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s -f "$url" > /dev/null 2>&1; then
            echo -e "${GREEN}✓ ${name} is responding${NC}"
            return 0
        fi
        
        if [ $attempt -eq $max_attempts ]; then
            echo -e "${RED}✗ ${name} is not responding after ${max_attempts} attempts${NC}"
            return 1
        fi
        
        sleep 1
        attempt=$((attempt + 1))
    done
}

# Check if containers are running
echo -e "${BLUE}1. Checking if containers are running...${NC}"
if ! docker ps | grep -q traya-postgres-local; then
    echo -e "${RED}✗ PostgreSQL container is not running${NC}"
    echo -e "${YELLOW}   Run: ./start-local.sh${NC}"
    exit 1
fi
echo -e "${GREEN}✓ PostgreSQL container is running${NC}"

if ! docker ps | grep -q traya-backend-local; then
    echo -e "${RED}✗ Backend container is not running${NC}"
    echo -e "${YELLOW}   Run: ./start-local.sh${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Backend container is running${NC}"

if ! docker ps | grep -q traya-frontend-local; then
    echo -e "${RED}✗ Frontend container is not running${NC}"
    echo -e "${YELLOW}   Run: ./start-local.sh${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Frontend container is running${NC}"

echo ""
echo -e "${BLUE}2. Checking service health...${NC}"

# Check backend health
check_service "Backend API" "http://localhost:3001/health"
BACKEND_STATUS=$?

# Check database health
check_service "Database" "http://localhost:3001/health/db"
DB_STATUS=$?

# Check frontend
check_service "Frontend" "http://localhost:3000"
FRONTEND_STATUS=$?

echo ""
echo -e "${BLUE}3. Testing API endpoints...${NC}"

# Test quiz schema endpoint
if curl -s "http://localhost:3001/api/quiz/schema" | grep -q "question"; then
    echo -e "${GREEN}✓ Quiz schema endpoint working${NC}"
else
    echo -e "${YELLOW}⚠ Quiz schema endpoint returned no data (may need sample data)${NC}"
fi

# Test coaches endpoint
if curl -s "http://localhost:3001/api/coaches/available" | grep -q "\["; then
    echo -e "${GREEN}✓ Coaches endpoint working${NC}"
else
    echo -e "${YELLOW}⚠ Coaches endpoint returned no data (may need sample data)${NC}"
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════${NC}"

# Final summary
if [ $BACKEND_STATUS -eq 0 ] && [ $DB_STATUS -eq 0 ] && [ $FRONTEND_STATUS -eq 0 ]; then
    echo -e "${GREEN}✓ All services are healthy!${NC}"
    echo ""
    echo -e "${GREEN}📱 Frontend:${NC}  http://localhost:3000"
    echo -e "${GREEN}🔧 Backend:${NC}   http://localhost:3001"
    echo -e "${GREEN}🗄️  Database:${NC} localhost:5432"
    echo ""
    echo -e "${YELLOW}💡 Tip:${NC} Load sample data with:"
    echo -e "   ${BLUE}cp backend/data/sample-data.sql.example backend/data/01-sample-data.sql${NC}"
    echo -e "   ${BLUE}docker-compose -f docker-compose.local.yml down -v && ./start-local.sh${NC}"
    exit 0
else
    echo -e "${RED}✗ Some services are not healthy${NC}"
    echo ""
    echo -e "${YELLOW}Troubleshooting:${NC}"
    echo -e "  1. View logs: ${BLUE}./logs-local.sh${NC}"
    echo -e "  2. Restart: ${BLUE}docker-compose -f docker-compose.local.yml restart${NC}"
    echo -e "  3. Clean start: ${BLUE}docker-compose -f docker-compose.local.yml down && ./start-local.sh${NC}"
    exit 1
fi

