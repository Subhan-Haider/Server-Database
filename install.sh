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

echo ""
echo "=> 📦 Installing system dependencies..."
sudo apt update -y > /dev/null 2>&1
sudo apt install -y curl git openssl > /dev/null 2>&1

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

# 4. Generate secure secrets
echo "=> 🔐 Generating secure credentials..."
MONGO_PASS=$(openssl rand -hex 16)
JWT_SECRET_KEY=$(openssl rand -hex 32)

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
sudo systemctl stop nginx 2>/dev/null || true

# Generate certs
sudo certbot certonly --standalone --non-interactive --agree-tos --email $SSL_EMAIL -d $FRONTEND_DOMAIN -d www.$FRONTEND_DOMAIN -d $API_DOMAIN

# Replace domain placeholders in nginx config if necessary
# Assuming the repo's nginx.conf uses aetherbase.com, let's substitute it for user's domain
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
