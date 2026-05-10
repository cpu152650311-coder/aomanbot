#!/bin/bash
# n8n upgrade script for Hostinger VPS
# Run as root or with sudo
set -e

echo "=== n8n Upgrade Script ==="
echo "Current target: 2.51.1"
echo ""

# Detect n8n installation method
echo "[1/4] Detecting n8n installation..."

if command -v n8n &>/dev/null; then
    CURRENT=$(n8n --version 2>/dev/null || echo "unknown")
    echo "  n8n found via CLI: v$CURRENT"
    INSTALL_TYPE="npm"
elif docker ps 2>/dev/null | grep -q n8n; then
    echo "  n8n running in Docker"
    INSTALL_TYPE="docker"
elif pm2 list 2>/dev/null | grep -q n8n; then
    echo "  n8n running via PM2"
    INSTALL_TYPE="pm2"
elif systemctl is-active n8n 2>/dev/null; then
    echo "  n8n running via systemd"
    INSTALL_TYPE="systemd"
else
    echo "  Checking process list..."
    if ps aux | grep -q "[n]8n"; then
        echo "  n8n process found (unknown manager)"
        INSTALL_TYPE="process"
    else
        echo "  ERROR: n8n not detected. Is it running?"
        exit 1
    fi
fi

echo "  Installation type: $INSTALL_TYPE"

# Backup current workflows
echo ""
echo "[2/4] Backing up n8n data..."
BACKUP_DIR="/root/n8n-backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Common n8n data locations
for dir in ~/.n8n /root/.n8n /var/lib/n8n/.n8n; do
    if [ -d "$dir" ]; then
        echo "  Backing up $dir to $BACKUP_DIR"
        cp -r "$dir" "$BACKUP_DIR/"
        N8N_DIR="$dir"
        break
    fi
done

echo "  Backup saved to: $BACKUP_DIR"

# Upgrade
echo ""
echo "[3/4] Upgrading n8n..."

case "$INSTALL_TYPE" in
    npm)
        echo "  Stopping n8n process..."
        pm2 stop n8n 2>/dev/null || systemctl stop n8n 2>/dev/null || pkill n8n 2>/dev/null || true
        sleep 2
        echo "  Running: npm install -g n8n@2.51.1"
        npm install -g n8n@2.51.1
        NEW_VERSION=$(n8n --version)
        echo "  Upgraded to: v$NEW_VERSION"
        ;;
    pm2)
        echo "  Stopping via PM2..."
        pm2 stop n8n
        sleep 2
        echo "  Running: npm install -g n8n@2.51.1"
        npm install -g n8n@2.51.1
        NEW_VERSION=$(n8n --version)
        echo "  Upgraded to: v$NEW_VERSION"
        ;;
    docker)
        echo "  Pulling new Docker image..."
        docker pull n8nio/n8n:2.51.1
        echo "  Stopping old container..."
        cd "$(docker inspect n8n --format '{{.Config.Labels.com.docker.compose.project.working_dir}}' 2>/dev/null || echo '/opt/n8n')"
        docker compose down 2>/dev/null || docker stop n8n 2>/dev/null
        echo "  Please update your docker-compose.yml image to n8nio/n8n:2.51.1"
        echo "  Then run: docker compose up -d"
        ;;
    systemd)
        echo "  Stopping n8n service..."
        systemctl stop n8n
        sleep 2
        echo "  Running: npm install -g n8n@2.51.1"
        npm install -g n8n@2.51.1
        NEW_VERSION=$(n8n --version)
        echo "  Upgraded to: v$NEW_VERSION"
        ;;
esac

# Restart
echo ""
echo "[4/4] Restarting n8n..."

case "$INSTALL_TYPE" in
    npm)
        pm2 restart n8n 2>/dev/null || systemctl restart n8n 2>/dev/null || (
            nohup n8n start > /var/log/n8n.log 2>&1 &
            echo "  Started n8n in background"
        )
        ;;
    pm2)
        pm2 restart n8n
        pm2 save
        ;;
    docker)
        echo "  SKIPPED — update docker-compose.yml image tag to n8nio/n8n:2.51.1, then:"
        echo "    docker compose up -d"
        ;;
    systemd)
        systemctl start n8n
        systemctl status n8n --no-pager | head -10
        ;;
esac

echo ""
echo "=== Upgrade complete ==="
echo "Verify at: https://huaxingdrone.com"
echo "Backup at: $BACKUP_DIR"
