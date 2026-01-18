#!/bin/bash

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🗄️  Connecting to PostgreSQL database...${NC}"
echo ""

# Check if container is running
if ! docker ps | grep -q traya-postgres-local; then
    echo -e "${YELLOW}⚠️  PostgreSQL container is not running.${NC}"
    echo -e "${YELLOW}   Start it with: ./start-local.sh${NC}"
    exit 1
fi

# Connect to database
docker exec -it traya-postgres-local psql -U traya_user -d traya_db

echo ""
echo -e "${GREEN}✓ Disconnected from database${NC}"

