#!/bin/bash

# Color codes for output
BLUE='\033[0;34m'
NC='\033[0m' # No Color

SERVICE=${1:-all}

echo -e "${BLUE}📋 Viewing logs for: ${SERVICE}${NC}"
echo ""

if [ "$SERVICE" == "all" ]; then
    docker-compose -f docker-compose.local.yml logs -f
else
    docker-compose -f docker-compose.local.yml logs -f "$SERVICE"
fi

