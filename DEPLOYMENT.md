# AetherBase Production Deployment Guide

This guide will walk you through deploying AetherBase (the API, Dashboard, MongoDB, and Redis) on a clean VPS (Ubuntu 22.04 or similar) using Docker Compose and NGINX for domain routing and SSL.

---

### Prerequisites
1. **A Linux VPS** (e.g., DigitalOcean, AWS EC2, Hetzner) with at least 2GB RAM.
2. **Domain Names**: Two domains or subdomains pointed to your VPS IP:
   - `aetherbase.com` / `dashboard.aetherbase.com` (Frontend Dashboard)
   - `api.aetherbase.com` (Backend API)
3. **SSH Access** to your server as a `sudo` user.

---

### Step 1: Install Dependencies
SSH into your server and install Docker, Docker Compose, and Git:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common git

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER
```
*(Logout and log back in for the group changes to take effect).*

---

### Step 2: Clone the Project
Fetch the source code for AetherBase onto your server:

```bash
git clone https://github.com/yourusername/aetherbase-monorepo.git
cd aetherbase-monorepo
```

---

### Step 3: Configure Environment Variables
Inside the `aetherbase-monorepo` directory, you'll need to set the variables for production. The `docker-compose.prod.yml` file uses `.env` files automatically if present, or you can provide a global `.env` file at the root.

Create a `.env` file in the root directory:
```bash
MONGO_PASSWORD=super_secure_mongodb_password
JWT_SECRET=super_secret_production_key_for_jwt
CORS_ORIGIN=https://aetherbase.com
NEXT_PUBLIC_API_URL=https://api.aetherbase.com
```

---

### Step 4: Issue SSL Certificates (Let's Encrypt)
Before starting NGINX, obtain your SSL certificates. The `nginx.conf` provided in the repository expects certs to exist inside `/etc/letsencrypt`.

Install **Certbot**:
```bash
sudo apt install -y certbot
```

Generate the certificates using the standalone mode (ensure port 80 is not currently in use by another web server):
```bash
sudo certbot certonly --standalone -d aetherbase.com -d www.aetherbase.com -d api.aetherbase.com
```

This will create certificates located at `/etc/letsencrypt/live/aetherbase.com/fullchain.pem`.

---

### Step 5: Update Next.js Configuration (Optional but Recommended)
To optimize the dashboard for Docker deployment, ensure that Next.js creates a standalone build. Verify that `next.config.js` in `apps/dashboard/next.config.js` has:
```javascript
module.exports = {
  output: 'standalone',
  // ...other config
}
```

---

### Step 6: Start the Production Stack
With the SSL certificates generated and network ports ready, boot up the entire infrastructure. This command will build the Next.js frontend, the Fastify backend, and orchestrate MongoDB and Redis databases via the `docker-compose.prod.yml` file.

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

---

### Step 7: Post-Installation Validation
1. Verify the containers are running without crash loops:
   ```bash
   docker compose -f docker-compose.prod.yml ps
   ```
2. Run the Initial Setup: 
   Trigger the `setupController` by visiting `https://api.aetherbase.com/api/system/setup` to generate the root Platform Administrator account.
3. Access your Dashboard: Navigate to `https://aetherbase.com` and log in with your new platform admin credentials.

### Maintenance Commands
* **View Logs for API**: `docker logs aetherbase-api -f`
* **Restart NGINX Proxy**: `docker restart aetherbase-proxy`
* **Update Stack**: Pull the latest code via `git pull` and run `docker compose -f docker-compose.prod.yml up -d --build` again.
