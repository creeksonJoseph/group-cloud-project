#!/bin/bash
# =============================================================================
# setup-nginx.sh — One-Time Server Setup Script
# Project 5: Static Website Deployment — Group 5
# =============================================================================
# Run this ONCE on the VM to install and configure NGINX.
# Usage: ssh into VM, then: bash setup-nginx.sh
# OR run remotely:
#   ssh -i static-_key.pem creeksonjoseph@4.222.216.97 'bash -s' < scripts/setup-nginx.sh
# =============================================================================

set -e

echo "============================================="
echo " Group 5 — NGINX Server Setup"
echo "============================================="

# ─── 0. IDEMPOTENCY CHECK ─────────────────────────────────────────────────────
if [ -f /etc/nginx/sites-available/portfolio ] && command -v nginx > /dev/null; then
    echo "✅ NGINX is already installed and configured. Skipping setup."
    exit 0
fi

# ─── 1. UPDATE PACKAGES ───────────────────────────────────────────────────────
echo "[1/5] Updating package list..."
sudo apt-get update -y
sudo apt-get upgrade -y

# ─── 2. INSTALL NGINX ─────────────────────────────────────────────────────────
echo "[2/5] Installing NGINX..."
sudo apt-get install -y nginx

# ─── 3. CREATE WEB ROOT ───────────────────────────────────────────────────────
echo "[3/5] Creating web root directory..."
sudo mkdir -p /var/www/portfolio
sudo chown -R "$USER":"$USER" /var/www/portfolio
sudo chmod -R 755 /var/www/portfolio

# ─── 4. CONFIGURE NGINX ───────────────────────────────────────────────────────
echo "[4/5] Configuring NGINX..."
sudo tee /etc/nginx/sites-available/portfolio > /dev/null << 'EOF'
server {
    listen 80;
    listen [::]:80;

    server_name _;

    root /var/www/portfolio;
    index index.html;

    # SPA support — all routes serve index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_min_length 256;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";
}
EOF

# Enable site and disable default
sudo ln -sf /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/portfolio
sudo rm -f /etc/nginx/sites-enabled/default

# ─── 5. START & ENABLE NGINX ──────────────────────────────────────────────────
echo "[5/5] Starting NGINX..."
sudo nginx -t
sudo systemctl enable nginx
sudo systemctl restart nginx

# ─── UFW FIREWALL ─────────────────────────────────────────────────────────────
echo "Configuring UFW firewall..."
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx HTTP'
sudo ufw --force enable

echo ""
echo "============================================="
echo " NGINX setup complete!"
echo " Visit: http://$(curl -s ifconfig.me)"
echo "============================================="
