# Uppermoon Devs - VPS Deployment Guide

## 📦 Files Created

| File | Purpose |
|------|---------|
| `Dockerfile` | Multi-stage build for the React website |
| `docker-compose.yml` | Service orchestration |
| `nginx.conf` | Nginx web server configuration |
| `.dockerignore` | Files to exclude from Docker build |
| `deploy.sh` | **All deployment functions in one file** |
| `DEPLOYMENT.md` | This documentation |

---

## 🚀 Quick Start

### 1. Prerequisites

- A VPS with Ubuntu 20.04+ (DigitalOcean, Vultr, Linode, etc.)
- SSH access to your VPS
- Your domain pointed to your VPS IP

### 2. Upload Files to VPS

```bash
# On your local machine
scp -r ./* root@your-vps-ip:/opt/uppermoon/
```

### 3. Run Deployment

```bash
# SSH into your VPS
ssh root@your-vps-ip

# Navigate to project
cd /opt/uppermoon

# Make script executable
chmod +x deploy.sh

# Quick install (Docker + dependencies + firewall)
./deploy.sh install

# Setup directories and environment
./deploy.sh setup

# Edit environment variables
nano .env

# Build and start
./deploy.sh build
./deploy.sh start

# (Optional) Setup SSL
./deploy.sh ssl
```

---

## 📋 All Commands

```bash
./deploy.sh install   # Install Docker and dependencies
./deploy.sh setup     # Clone repos and configure environment
./deploy.sh build     # Build Docker images
./deploy.sh start     # Start all services
./deploy.sh stop      # Stop all services
./deploy.sh restart   # Restart all services
./deploy.sh logs      # View container logs
./deploy.sh update    # Pull latest and rebuild
./deploy.sh status    # Check service status
./deploy.sh ssl       # Setup Let's Encrypt SSL
./deploy.sh backup    # Backup configuration
./deploy.sh clean     # Remove unused Docker resources
./deploy.sh health    # Run health checks
./deploy.sh quick     # Quick deploy (install + setup)
./deploy.sh help      # Show help message
```

---

## 🔧 Configuration

### Environment Variables (.env)

Create `/opt/uppermoon/.env`:

```env
# Telegram Configuration
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHAT_ID=-1001234567890

# Supabase Configuration
VITE_SUPABASE_URL=https://geivgnyebocxjphdvibm.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Domain
DOMAIN=uppermoon.example.com
```

---

## 🤖 Adding Your Bot

### 1. Create Bot Dockerfile

Create `bot/Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python", "bot.py"]
```

### 2. Update docker-compose.yml

Uncomment the bot service in `docker-compose.yml`:

```yaml
bot:
  build:
    context: ./bot
    dockerfile: Dockerfile
  container_name: uppermoon-bot
  restart: unless-stopped
  environment:
    - TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN}
    - TELEGRAM_CHAT_ID=${TELEGRAM_CHAT_ID}
  networks:
    - uppermoon-network
```

---

## 🔒 SSL/HTTPS Setup

```bash
# Ensure your domain points to your VPS IP
# Then run:
./deploy.sh ssl
```

This will:
- Install a Let's Encrypt certificate
- Configure Nginx for HTTPS
- Set up auto-renewal

---

## 📊 Monitoring

### View Logs
```bash
./deploy.sh logs
```

### Check Status
```bash
./deploy.sh status
```

### Health Check
```bash
./deploy.sh health
```

---

## 🔄 Updating

When you push changes to your repository:

```bash
./deploy.sh update
```

This will pull the latest code and rebuild containers.

---

## 🛡️ Security Checklist

- [ ] Firewall configured (UFW)
- [ ] SSH key authentication enabled
- [ ] Root login disabled
- [ ] SSL certificate installed
- [ ] Environment variables secured
- [ ] Regular backups configured

---

## 📁 Directory Structure on VPS

```
/opt/uppermoon/
├── .env                 # Environment variables
├── website/             # Website repository
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── nginx.conf
│   └── ...
├── bot/                 # Bot repository
│   ├── Dockerfile
│   └── ...
├── backups/             # Configuration backups
└── logs/                # Application logs
```

---

## ❓ Troubleshooting

### Container won't start
```bash
docker logs uppermoon-website
```

### Port already in use
```bash
sudo lsof -i :80
sudo kill -9 <PID>
```

### Permission denied
```bash
sudo chmod +x deploy.sh
```

### Out of disk space
```bash
./deploy.sh clean
```

---

## 📞 Support

Join our Telegram support group: [@snowy_hometown](https://t.me/snowy_hometown)
