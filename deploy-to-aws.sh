#!/bin/bash

# Helper script to deploy Traya to AWS EC2
# This script uploads your code and deploys on the EC2 instance

set -e

# Configuration
EC2_HOST="ec2-54-167-43-94.compute-1.amazonaws.com"
EC2_USER="ubuntu"
SSH_KEY="$HOME/Downloads/aws-traya.pem"
PROJECT_DIR="traya"
LOCAL_DIR="."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 AWS EC2 Deployment Helper${NC}"
echo ""

# Check if SSH key exists
if [ ! -f "$SSH_KEY" ]; then
    echo -e "${RED}❌ SSH key not found at: $SSH_KEY${NC}"
    echo "Please update SSH_KEY variable in this script or place your key at that location."
    exit 1
fi

# Set correct permissions for SSH key
chmod 400 "$SSH_KEY"

echo -e "${YELLOW}📤 Step 1: Uploading project files to EC2...${NC}"
echo ""

# Upload project using rsync (excludes node_modules, .git, etc.)
rsync -avz --exclude 'node_modules' \
           --exclude '.git' \
           --exclude '.next' \
           --exclude '.vite' \
           --exclude 'dist' \
           --exclude 'build' \
           --exclude '*.log' \
           --exclude '.env' \
           --exclude '.env.local' \
           --exclude 'package-lock.json' \
           -e "ssh -i $SSH_KEY -o StrictHostKeyChecking=no" \
           "$LOCAL_DIR/" "$EC2_USER@$EC2_HOST:~/$PROJECT_DIR/"

echo ""
echo -e "${GREEN}✅ Files uploaded successfully!${NC}"
echo ""
echo -e "${YELLOW}📋 Step 2: Instructions for deployment on EC2${NC}"
echo ""
echo "Run these commands on your EC2 instance:"
echo ""
echo "  1. SSH into EC2:"
echo -e "     ${BLUE}ssh -i $SSH_KEY $EC2_USER@$EC2_HOST${NC}"
echo ""
echo "  2. Navigate to project:"
echo -e "     ${BLUE}cd ~/$PROJECT_DIR${NC}"
echo ""
echo "  3. Create .env file:"
echo -e "     ${BLUE}cp .env.production.example .env${NC}"
echo -e "     ${BLUE}nano .env${NC}"
echo "     (Update DB_PASSWORD to a strong password)"
echo ""
echo "  4. Deploy:"
echo -e "     ${BLUE}chmod +x deploy.sh${NC}"
echo -e "     ${BLUE}./deploy.sh${NC}"
echo ""
echo -e "${GREEN}✨ Deployment will:${NC}"
echo "   - Install Docker & Docker Compose (if not present)"
echo "   - Build Docker images"
echo "   - Start all services"
echo "   - Run health checks"
echo ""
echo "After deployment, access:"
echo -e "  ${BLUE}Frontend:${NC} http://$EC2_HOST:3000"
echo -e "  ${BLUE}Backend:${NC}  http://$EC2_HOST:3001/health"
echo ""

