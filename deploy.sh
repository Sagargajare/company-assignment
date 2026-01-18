#!/bin/bash

# Production Deployment Script for Traya Clinical Onboarding Hub
# This script installs Docker/Docker Compose and deploys all services
# Designed to run on a fresh Ubuntu EC2 instance without any prerequisites

set -e  # Exit on error

echo "🚀 Starting Production Deployment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print section headers
print_section() {
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if running as root or with sudo
check_sudo() {
    if [ "$EUID" -eq 0 ]; then
        SUDO=""
    elif sudo -n true 2>/dev/null; then
        SUDO="sudo"
    else
        echo -e "${RED}❌ This script requires sudo privileges.${NC}"
        echo "Please run with sudo or ensure your user has sudo access."
        exit 1
    fi
}

# Detect OS
detect_os() {
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        OS=$ID
        OS_VERSION=$VERSION_ID
    else
        echo -e "${RED}❌ Cannot detect OS. This script is designed for Ubuntu/Debian.${NC}"
        exit 1
    fi

    if [[ "$OS" != "ubuntu" && "$OS" != "debian" ]]; then
        echo -e "${YELLOW}⚠️  Detected OS: $OS${NC}"
        echo -e "${YELLOW}This script is optimized for Ubuntu/Debian. Proceeding anyway...${NC}"
    else
        echo -e "${GREEN}✅ Detected OS: $OS $OS_VERSION${NC}"
    fi
}

# Install Docker
install_docker() {
    print_section "🐳 Installing Docker"
    
    # Check if Docker is already installed and accessible
    if command_exists docker; then
        if docker info >/dev/null 2>&1 || $SUDO docker info >/dev/null 2>&1; then
            echo -e "${GREEN}✅ Docker is already installed and running${NC}"
            docker --version 2>/dev/null || $SUDO docker --version
            return 0
        fi
    fi

    echo -e "${YELLOW}📦 Installing Docker...${NC}"

    # Remove old versions
    $SUDO apt-get remove -y docker docker-engine docker.io containerd runc 2>/dev/null || true

    # Update package index
    echo -e "${BLUE}📥 Updating package index...${NC}"
    $SUDO apt-get update -qq

    # Install prerequisites
    echo -e "${BLUE}📦 Installing prerequisites...${NC}"
    $SUDO apt-get install -y \
        ca-certificates \
        curl \
        gnupg \
        lsb-release

    # Add Docker's official GPG key
    echo -e "${BLUE}🔑 Adding Docker's official GPG key...${NC}"
    $SUDO install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/$OS/gpg | $SUDO gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    $SUDO chmod a+r /etc/apt/keyrings/docker.gpg

    # Set up Docker repository
    echo -e "${BLUE}📝 Setting up Docker repository...${NC}"
    echo \
        "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/$OS \
        $(lsb_release -cs) stable" | $SUDO tee /etc/apt/sources.list.d/docker.list > /dev/null

    # Install Docker Engine
    echo -e "${BLUE}📦 Installing Docker Engine...${NC}"
    $SUDO apt-get update -qq
    $SUDO apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

    # Start and enable Docker
    echo -e "${BLUE}🚀 Starting Docker service...${NC}"
    $SUDO systemctl start docker
    $SUDO systemctl enable docker

    # Add current user to docker group (if not root)
    if [ "$EUID" -ne 0 ]; then
        echo -e "${BLUE}👤 Adding user to docker group...${NC}"
        $SUDO usermod -aG docker "$USER"
        echo -e "${YELLOW}⚠️  You may need to log out and back in for group changes to take effect.${NC}"
        echo -e "${YELLOW}   For now, using sudo for docker commands...${NC}"
    fi

    # Verify installation
    if $SUDO docker info >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Docker installed successfully${NC}"
        $SUDO docker --version
    else
        echo -e "${RED}❌ Docker installation failed${NC}"
        exit 1
    fi
}

# Install Docker Compose (if not using plugin)
install_docker_compose() {
    print_section "🐙 Checking Docker Compose"
    
    # Check for Docker Compose V2 plugin (preferred)
    if docker compose version >/dev/null 2>&1 || $SUDO docker compose version >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Docker Compose V2 plugin is available${NC}"
        docker compose version || $SUDO docker compose version
        return 0
    fi

    # Check for standalone docker-compose
    if command_exists docker-compose; then
        echo -e "${GREEN}✅ Docker Compose (standalone) is available${NC}"
        docker-compose --version
        return 0
    fi

    # If we reach here, Docker Compose plugin should have been installed with Docker
    # But let's verify and provide helpful message
    echo -e "${YELLOW}⚠️  Docker Compose plugin should be installed with Docker.${NC}"
    echo -e "${YELLOW}   If issues occur, the plugin may need to be enabled.${NC}"
}

# Determine docker compose command
setup_compose_command() {
    if docker compose version >/dev/null 2>&1; then
        COMPOSE_CMD="docker compose"
    elif $SUDO docker compose version >/dev/null 2>&1; then
        COMPOSE_CMD="$SUDO docker compose"
    elif command_exists docker-compose; then
        COMPOSE_CMD="docker-compose"
    elif $SUDO docker-compose version >/dev/null 2>&1; then
        COMPOSE_CMD="$SUDO docker-compose"
    else
        echo -e "${RED}❌ Docker Compose is not available${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Using: $COMPOSE_CMD${NC}"
}

# Main installation flow
print_section "🔍 System Check"
detect_os
check_sudo

# Install Docker and Docker Compose
install_docker
install_docker_compose
setup_compose_command

# Check if .env exists
print_section "⚙️  Environment Configuration"
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from example...${NC}"
    if [ -f .env.production.example ]; then
        cp .env.production.example .env
        echo -e "${RED}⚠️  IMPORTANT: Edit .env and update production values before continuing!${NC}"
        exit 1
    else
        echo -e "${RED}❌ .env.production.example not found. Cannot create .env file.${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ .env file found${NC}"
fi

# Verify Docker is accessible
if ! $SUDO docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not accessible. Please check installation.${NC}"
    exit 1
fi

# Build images
print_section "📦 Building Docker Images"
echo -e "${GREEN}📦 Building Docker images...${NC}"
$COMPOSE_CMD -f docker-compose.prod.yml build --no-cache

# Stop existing containers
print_section "🛑 Stopping Existing Containers"
echo -e "${YELLOW}🛑 Stopping existing containers...${NC}"
$COMPOSE_CMD -f docker-compose.prod.yml down

# Start services
print_section "🚀 Starting Services"
echo -e "${GREEN}🚀 Starting services...${NC}"
$COMPOSE_CMD -f docker-compose.prod.yml up -d

# Wait for services to be healthy
print_section "⏳ Waiting for Services"
echo -e "${YELLOW}⏳ Waiting for services to be healthy...${NC}"
sleep 10

# Check service health
print_section "🏥 Health Checks"

# Check database
echo -e "${BLUE}🔍 Checking database...${NC}"
if $SUDO docker exec traya-postgres-prod pg_isready -U traya_user -d traya_db > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Database is healthy${NC}"
else
    echo -e "${RED}❌ Database health check failed${NC}"
    $COMPOSE_CMD -f docker-compose.prod.yml logs postgres
    exit 1
fi

# Check backend
echo -e "${BLUE}🔍 Checking backend...${NC}"
MAX_RETRIES=30
RETRY_COUNT=0
while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if curl -f http://localhost:3001/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend is healthy${NC}"
        break
    fi
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
        echo -e "${RED}❌ Backend health check failed after $MAX_RETRIES attempts${NC}"
        $COMPOSE_CMD -f docker-compose.prod.yml logs backend
        exit 1
    fi
    sleep 2
done

# Check frontend
echo -e "${BLUE}🔍 Checking frontend...${NC}"
RETRY_COUNT=0
while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Frontend is healthy${NC}"
        break
    fi
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
        echo -e "${RED}❌ Frontend health check failed after $MAX_RETRIES attempts${NC}"
        $COMPOSE_CMD -f docker-compose.prod.yml logs frontend
        exit 1
    fi
    sleep 2
done

# Prompt for migrations
print_section "📊 Database Migrations"
echo -e "${YELLOW}📊 Do you want to run database migrations? (y/N)${NC}"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo -e "${GREEN}🔄 Running migrations...${NC}"
    $SUDO docker exec traya-backend-prod npm run migration:run
    echo -e "${GREEN}✅ Migrations completed${NC}"
fi

# Final summary
print_section "✅ Deployment Complete"
echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo ""
echo "Services are running:"
echo "  📊 Database:  localhost:5432"
echo "  🔧 Backend:   http://localhost:3001"
echo "  🌐 Frontend:  http://localhost:3000"
echo ""
echo "Useful commands:"
echo "  View logs:    $COMPOSE_CMD -f docker-compose.prod.yml logs -f"
echo "  Stop services: $COMPOSE_CMD -f docker-compose.prod.yml down"
echo "  Service status: $COMPOSE_CMD -f docker-compose.prod.yml ps"
echo ""
echo -e "${YELLOW}💡 Note: If you were added to the docker group, you may need to${NC}"
echo -e "${YELLOW}   log out and back in, or run 'newgrp docker' to use docker without sudo.${NC}"
echo ""

