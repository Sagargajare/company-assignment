#!/bin/bash

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Traya Local Development Environment     ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo ""

# Check if docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker and try again.${NC}"
    exit 1
fi

# Check if data files exist
DATA_DIR="./backend/data"
if [ -d "$DATA_DIR" ] && [ "$(ls -A $DATA_DIR/*.sql 2>/dev/null)" ]; then
    echo -e "${GREEN}✓${NC} Found SQL data files in backend/data/"
    echo -e "${YELLOW}ℹ${NC}  Data will be automatically loaded on first run"
else
    echo -e "${YELLOW}⚠${NC}  No SQL files found in backend/data/"
    echo -e "${YELLOW}ℹ${NC}  Database will start empty (migrations will create schema)"
fi

echo ""
echo -e "${BLUE}🚀 Starting services...${NC}"
echo ""

# Stop any existing containers
docker-compose -f docker-compose.local.yml down 2>/dev/null

# Build and start services
docker-compose -f docker-compose.local.yml up --build -d

# Wait for services to be ready
echo ""
echo -e "${YELLOW}⏳ Waiting for services to start...${NC}"
sleep 5

# Check service health
echo ""
echo -e "${BLUE}📊 Service Status:${NC}"
docker-compose -f docker-compose.local.yml ps

echo ""
echo -e "${GREEN}✓ Local development environment is ready!${NC}"
echo ""
echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo -e "${GREEN}📱 Frontend:${NC}  http://localhost:3000"
echo -e "${GREEN}🔧 Backend:${NC}   http://localhost:3001"
echo -e "${GREEN}🗄️  Database:${NC} localhost:5432"
echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}Useful commands:${NC}"
echo -e "  Test services:    ${BLUE}./test-local.sh${NC}"
echo -e "  View logs:        ${BLUE}./logs-local.sh${NC}"
echo -e "  Stop services:    ${BLUE}./stop-local.sh${NC}"
echo -e "  Database shell:   ${BLUE}./db-shell.sh${NC}"
echo -e "  Restart backend:  ${BLUE}docker-compose -f docker-compose.local.yml restart backend${NC}"
echo -e "  Clean database:   ${BLUE}docker-compose -f docker-compose.local.yml down -v${NC}"
echo ""

