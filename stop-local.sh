#!/bin/bash

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🛑 Stopping local development environment...${NC}"
echo ""

# Stop and remove containers
docker-compose -f docker-compose.local.yml down

echo ""
echo -e "${GREEN}✓ All services stopped${NC}"
echo ""
echo -e "${YELLOW}Note:${NC} Database volume is preserved. To remove it, run:"
echo -e "  ${BLUE}docker-compose -f docker-compose.local.yml down -v${NC}"
echo ""

