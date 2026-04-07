#!/bin/bash

# AetherBase 1-Click Installer
# Run this on a fresh Ubuntu 22.04+ VPS

echo "======================================"
echo "    🚀 AetherBase 1-Click Installer   "
echo "======================================"
echo ""

# 1. Ask for domains up front
read -p "Enter your Main Domain (e.g., aetherbase.com): " FRONTEND_DOMAIN
read -p "Enter your API Domain (e.g., api.aetherbase.com): " API_DOMAIN
read -p "Enter an email for SSL registration: " SSL_EMAIL
read -p "Enter a MongoDB Password (press enter to auto-generate): " MONGO_PASS
read -p "Enter a JWT Secret Key (press enter to auto-generate): " JWT_SECRET_KEY
read -p "Enter Public HTTP Port (default 80): " HTTP_PORT
read -p "Enter Public SSL/HTTPS Port (default 443): " HTTPS_PORT

# Set defaults for ports
HTTP_PORT=${HTTP_PORT:-80}
HTTPS_PORT=${HTTPS_PORT:-443}

# 1.1 DNS Pre-verification
echo ""
echo "=> 🔍 Verifying DNS configuration..."
PUBLIC_IP=$(curl -s https://ifconfig.me)
echo "Your server's Public IP is: $PUBLIC_IP"

# Check main domain
MAIN_IP=$(dig +short $FRONTEND_DOMAIN | tail -n1)
if [ "$MAIN_IP" != "$PUBLIC_IP" ]; then
    echo "⚠️ Warning: $FRONTEND_DOMAIN points to $MAIN_IP, but your server IP is $PUBLIC_IP"
    read -p "DNS might not be ready. Continue anyway? (y/n): " PROCEED
    if [ "$PROCEED" != "y" ]; then exit 1; fi
else
    echo "✅ Main Domain DNS verified ($MAIN_IP)"
fi

# Check API domain
API_IP=$(dig +short $API_DOMAIN | tail -n1)
if [ "$API_IP" != "$PUBLIC_IP" ]; then
    echo "⚠️ Warning: $API_DOMAIN points to $API_IP, but your server IP is $PUBLIC_IP"
    read -p "DNS might not be ready. Continue anyway? (y/n): " PROCEED
    if [ "$PROCEED" != "y" ]; then exit 1; fi
else
    echo "✅ API Domain DNS verified ($API_IP)"
fi

echo ""
echo "=> 📦 Installing system dependencies..."
sudo apt update -y > /dev/null 2>&1
sudo apt install -y curl git openssl dnsutils > /dev/null 2>&1

# 2. Check for Docker
if ! command -v docker &> /dev/null; then
    echo "=> 🐳 Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh > /dev/null 2>&1
    sudo usermod -aG docker $USER
    rm get-docker.sh
else
    echo "=> 🐳 Docker already installed."
fi

# 3. Clone Repository
echo "=> 📥 Cloning AetherBase repository..."
if [ -d "aetherbase" ]; then
    echo "Directory 'aetherbase' already exists. Pulling latest changes..."
    cd aetherbase
    git pull
else
    git clone https://github.com/Subhan-Haider/Server-Database.git aetherbase
    cd aetherbase
fi

# 4. Configure secure secrets
echo "=> 🔐 Setting up secure credentials..."
if [ -z "$MONGO_PASS" ]; then
    MONGO_PASS=$(openssl rand -hex 16)
    echo "  -> Auto-generated MongoDB Password."
fi

if [ -z "$JWT_SECRET_KEY" ]; then
    JWT_SECRET_KEY=$(openssl rand -hex 32)
    echo "  -> Auto-generated JWT Secret Key."
fi

echo "MONGO_PASSWORD=$MONGO_PASS" > .env
echo "JWT_SECRET=$JWT_SECRET_KEY" >> .env
echo "CORS_ORIGIN=https://$FRONTEND_DOMAIN" >> .env
echo "NEXT_PUBLIC_API_URL=https://$API_DOMAIN" >> .env

echo "=> ✅ .env file created securely!"

# 5. SSL / Nginx Configuration
echo "=> 🔒 Setting up SSL..."
if ! command -v certbot &> /dev/null; then
    sudo apt install -y certbot > /dev/null 2>&1
fi

# Stop anything on port 80 just in case
echo "=> 🛑 Freeing Port 80..."
sudo fuser -k 80/tcp 2>/dev/null || true
docker stop aetherbase-proxy 2>/dev/null || true
sudo systemctl stop nginx 2>/dev/null || true
sudo systemctl stop apache2 2>/dev/null || true
docker compose -f docker-compose.prod.yml down 2>/dev/null || true
sleep 2

# Generate certs
sudo certbot certonly --standalone --non-interactive --agree-tos --email $SSL_EMAIL -d $FRONTEND_DOMAIN -d www.$FRONTEND_DOMAIN -d $API_DOMAIN

# Replace port placeholders in docker-compose if necessary
sed -i "s/80:80/$HTTP_PORT:80/g" docker-compose.prod.yml
sed -i "s/443:443/$HTTPS_PORT:443/g" docker-compose.prod.yml

# Replace domain and port placeholders in nginx config
sed -i "s/listen 80;/listen 80;/g" nginx.conf
sed -i "s/listen 443 ssl http2;/listen 443 ssl http2;/g" nginx.conf
sed -i "s/aetherbase.com/$FRONTEND_DOMAIN/g" nginx.conf
sed -i "s/api.aetherbase.com/$API_DOMAIN/g" nginx.conf

# 6. Start the platform
echo "=> 🚀 Building and Starting AetherBase..."
docker compose -f docker-compose.prod.yml up -d --build

echo "======================================"
echo " 🎉 INSTALLATION COMPLETE!"
echo "======================================"
echo "Dashboard: https://$FRONTEND_DOMAIN"
echo "API Route: https://$API_DOMAIN"
echo ""
echo "System Secrets (Save these!):"
echo "Mongo Password: $MONGO_PASS"
echo "JWT Secret: $JWT_SECRET_KEY"
echo "======================================"
echo "Note: Next.js might take a minute or two to finish compiling inside the container."
