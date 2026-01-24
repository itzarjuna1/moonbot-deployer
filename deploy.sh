#!/bin/bash

#===============================================================================
# UPPERMOON DEVS - VPS DEPLOYMENT SCRIPT
# 
# This script contains all functions to deploy the website and bot on a VPS.
# 
# Usage:
#   chmod +x deploy.sh
#   ./deploy.sh [command]
#
# Commands:
#   install     - Install Docker and dependencies on fresh VPS
#   setup       - Clone repos and configure environment
#   build       - Build Docker images
#   start       - Start all services
#   stop        - Stop all services
#   restart     - Restart all services
#   logs        - View logs
#   update      - Pull latest changes and rebuild
#   status      - Check service status
#   ssl         - Setup SSL with Let's Encrypt
#   backup      - Backup configuration
#   clean       - Remove unused Docker resources
#   help        - Show this help message
#===============================================================================

set -e

# Configuration
PROJECT_NAME="uppermoon"
WEBSITE_REPO="https://github.com/YOUR_USERNAME/uppermoon-website.git"
BOT_REPO="https://github.com/YOUR_USERNAME/uppermoon-bot.git"
DEPLOY_DIR="/opt/uppermoon"
DOMAIN="your-domain.com"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

#===============================================================================
# INSTALLATION FUNCTIONS
#===============================================================================

install_docker() {
    log_info "Installing Docker..."
    
    # Update system
    apt-get update && apt-get upgrade -y
    
    # Install prerequisites
    apt-get install -y \
        apt-transport-https \
        ca-certificates \
        curl \
        gnupg \
        lsb-release \
        git \
        ufw
    
    # Add Docker's official GPG key
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    
    # Set up the stable repository
    echo \
        "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
        $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    # Install Docker Engine
    apt-get update
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
    
    # Start and enable Docker
    systemctl start docker
    systemctl enable docker
    
    # Add current user to docker group
    usermod -aG docker $USER
    
    log_success "Docker installed successfully!"
}

install_dependencies() {
    log_info "Installing additional dependencies..."
    
    # Install certbot for SSL
    apt-get install -y certbot python3-certbot-nginx
    
    # Install htop for monitoring
    apt-get install -y htop
    
    log_success "Dependencies installed!"
}

setup_firewall() {
    log_info "Configuring firewall..."
    
    ufw default deny incoming
    ufw default allow outgoing
    ufw allow ssh
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw --force enable
    
    log_success "Firewall configured!"
}

#===============================================================================
# SETUP FUNCTIONS
#===============================================================================

setup_directories() {
    log_info "Setting up directories..."
    
    mkdir -p $DEPLOY_DIR
    mkdir -p $DEPLOY_DIR/website
    mkdir -p $DEPLOY_DIR/bot
    mkdir -p $DEPLOY_DIR/backups
    mkdir -p $DEPLOY_DIR/logs
    
    log_success "Directories created!"
}

clone_repos() {
    log_info "Cloning repositories..."
    
    cd $DEPLOY_DIR
    
    if [ -d "website/.git" ]; then
        log_info "Website repo exists, pulling latest..."
        cd website && git pull && cd ..
    else
        git clone $WEBSITE_REPO website
    fi
    
    if [ -d "bot/.git" ]; then
        log_info "Bot repo exists, pulling latest..."
        cd bot && git pull && cd ..
    else
        git clone $BOT_REPO bot
    fi
    
    log_success "Repositories cloned!"
}

setup_env() {
    log_info "Setting up environment variables..."
    
    if [ ! -f "$DEPLOY_DIR/.env" ]; then
        cat > $DEPLOY_DIR/.env << EOF
# Telegram Configuration
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here

# Supabase Configuration (from Lovable Cloud)
VITE_SUPABASE_URL=https://geivgnyebocxjphdvibm.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key_here

# Domain
DOMAIN=$DOMAIN
EOF
        log_warning "Please edit $DEPLOY_DIR/.env with your actual credentials!"
    else
        log_info "Environment file already exists"
    fi
    
    log_success "Environment setup complete!"
}

#===============================================================================
# DOCKER FUNCTIONS
#===============================================================================

build_images() {
    log_info "Building Docker images..."
    
    cd $DEPLOY_DIR/website
    docker compose build --no-cache
    
    # Uncomment when bot is ready
    # cd $DEPLOY_DIR/bot
    # docker compose build --no-cache
    
    log_success "Images built successfully!"
}

start_services() {
    log_info "Starting services..."
    
    cd $DEPLOY_DIR/website
    docker compose --env-file $DEPLOY_DIR/.env up -d
    
    # Uncomment when bot is ready
    # cd $DEPLOY_DIR/bot
    # docker compose --env-file $DEPLOY_DIR/.env up -d
    
    log_success "Services started!"
    show_status
}

stop_services() {
    log_info "Stopping services..."
    
    cd $DEPLOY_DIR/website
    docker compose down
    
    # Uncomment when bot is ready
    # cd $DEPLOY_DIR/bot
    # docker compose down
    
    log_success "Services stopped!"
}

restart_services() {
    log_info "Restarting services..."
    stop_services
    start_services
}

show_logs() {
    log_info "Showing logs (Ctrl+C to exit)..."
    
    cd $DEPLOY_DIR/website
    docker compose logs -f
}

show_status() {
    log_info "Service Status:"
    echo ""
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    echo ""
}

#===============================================================================
# UPDATE FUNCTIONS
#===============================================================================

update_deployment() {
    log_info "Updating deployment..."
    
    # Pull latest code
    cd $DEPLOY_DIR/website
    git pull
    
    # Rebuild and restart
    docker compose build
    docker compose --env-file $DEPLOY_DIR/.env up -d
    
    log_success "Deployment updated!"
}

#===============================================================================
# SSL FUNCTIONS
#===============================================================================

setup_ssl() {
    log_info "Setting up SSL certificate..."
    
    if [ -z "$DOMAIN" ] || [ "$DOMAIN" == "your-domain.com" ]; then
        log_error "Please set your domain in the DOMAIN variable first!"
        exit 1
    fi
    
    certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN
    
    # Auto-renewal cron job
    (crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -
    
    log_success "SSL certificate installed!"
}

#===============================================================================
# MAINTENANCE FUNCTIONS
#===============================================================================

backup_config() {
    log_info "Creating backup..."
    
    BACKUP_FILE="$DEPLOY_DIR/backups/backup_$(date +%Y%m%d_%H%M%S).tar.gz"
    
    tar -czvf $BACKUP_FILE \
        $DEPLOY_DIR/.env \
        $DEPLOY_DIR/website/docker-compose.yml \
        $DEPLOY_DIR/website/nginx.conf
    
    log_success "Backup created: $BACKUP_FILE"
}

clean_docker() {
    log_info "Cleaning unused Docker resources..."
    
    docker system prune -af --volumes
    
    log_success "Docker cleanup complete!"
}

#===============================================================================
# HEALTH CHECK FUNCTIONS
#===============================================================================

health_check() {
    log_info "Running health checks..."
    
    # Check website
    if curl -s http://localhost/health > /dev/null; then
        log_success "Website: Healthy"
    else
        log_error "Website: Unhealthy"
    fi
    
    # Check Docker containers
    echo ""
    docker ps --format "table {{.Names}}\t{{.Status}}"
}

#===============================================================================
# QUICK DEPLOY (All-in-one)
#===============================================================================

quick_deploy() {
    log_info "Starting quick deployment..."
    
    install_docker
    install_dependencies
    setup_firewall
    setup_directories
    clone_repos
    setup_env
    
    log_warning "Please edit $DEPLOY_DIR/.env with your credentials, then run:"
    echo "  ./deploy.sh build"
    echo "  ./deploy.sh start"
}

#===============================================================================
# HELP
#===============================================================================

show_help() {
    echo ""
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo "║           UPPERMOON DEVS - VPS DEPLOYMENT SCRIPT               ║"
    echo "╠════════════════════════════════════════════════════════════════╣"
    echo "║ Usage: ./deploy.sh [command]                                   ║"
    echo "╠════════════════════════════════════════════════════════════════╣"
    echo "║ Commands:                                                      ║"
    echo "║   install   - Install Docker and dependencies                  ║"
    echo "║   setup     - Clone repos and configure environment            ║"
    echo "║   build     - Build Docker images                              ║"
    echo "║   start     - Start all services                               ║"
    echo "║   stop      - Stop all services                                ║"
    echo "║   restart   - Restart all services                             ║"
    echo "║   logs      - View container logs                              ║"
    echo "║   update    - Pull latest and rebuild                          ║"
    echo "║   status    - Check service status                             ║"
    echo "║   ssl       - Setup Let's Encrypt SSL                          ║"
    echo "║   backup    - Backup configuration                             ║"
    echo "║   clean     - Remove unused Docker resources                   ║"
    echo "║   health    - Run health checks                                ║"
    echo "║   quick     - Quick deploy (install + setup)                   ║"
    echo "║   help      - Show this help message                           ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
    echo ""
}

#===============================================================================
# MAIN
#===============================================================================

case "$1" in
    install)
        install_docker
        install_dependencies
        setup_firewall
        ;;
    setup)
        setup_directories
        clone_repos
        setup_env
        ;;
    build)
        build_images
        ;;
    start)
        start_services
        ;;
    stop)
        stop_services
        ;;
    restart)
        restart_services
        ;;
    logs)
        show_logs
        ;;
    update)
        update_deployment
        ;;
    status)
        show_status
        ;;
    ssl)
        setup_ssl
        ;;
    backup)
        backup_config
        ;;
    clean)
        clean_docker
        ;;
    health)
        health_check
        ;;
    quick)
        quick_deploy
        ;;
    help|--help|-h|"")
        show_help
        ;;
    *)
        log_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac
