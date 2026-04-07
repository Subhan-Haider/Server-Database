# 🌌 AetherBase

**Production-grade Backend-as-a-Service (BaaS) for Modern Scalable Applications.**

AetherBase is a self-hostable alternative to Firebase, offering a powerful NoSQL database, real-time sync engine, secure authentication, and cloud storage—all controllable via a premium admin dashboard and a developer-friendly CLI.

---

## 🚀 Quick Start

### 1. Requirements
- Docker & Docker Compose
- Node.js 18+
- NPM / PNPM

### 2. Infrastructure Setup
Spin up the core infrastructure (MongoDB, Redis, MongoExpress):
```bash
docker-compose up -d
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Start Development Servers
```bash
# Start API (Port 3001)
npm run dev:api

# Start Dashboard (Port 3000)
npm run dev:dashboard
```

---

## 🛠️ System Architecture

- **Frontend**: Next.js 13 (App Router), Tailwind CSS, Shadcn UI, Framer Motion.
- **Backend**: Express.js, Socket.io (Realtime), Redis (Pub/Sub adapter).
- **Storage**: Project-isolated disk storage with security rule evaluation.
- **Security**: Custom Rule Engine with safe VM context evaluation.
- **SDK**: Unified JS/TS Client for Web and Node environments.

---

## 🔐 Security Rules

AetherBase uses a Firestore-like declarative rules system.

**Example:**
```aether
service aether.storage {
  match /users/{userId} {
    allow read, write: if request.auth.uid == userId;
  }
}
```

---

## 🧰 CLI Commands

```bash
# Build the CLI
cd packages/cli && npm run build

# Link for global use
npm link

# Usage
aether init
aether deploy
```

---

## 📊 Feature Matrix

| Feature | Status | Description |
|---|---|---|
| **NoSQL DB** | ✅ | Collection-Document JSON structure |
| **Auth** | ✅ | JWT-based Multi-Project Auth |
| **Realtime** | ✅ | Socket.io Snapshots & Subscriptions |
| **Storage** | ✅ | Secure File Uploads & CDN URLs |
| **CLI** | ✅ | Zero-config project management |
| **Rules Engine** | ✅ | Dynamic JS-like condition evaluator |
| **Usage API** | ✅ | Automated quota & operation tracking |

---

## 🌍 Deployment

AetherBase is designed to be deployed on a single VPS using Docker Compose. For scaling, the Realtime engine uses Redis Pub/Sub, and the API can be load-balanced behind NGINX.

---

*Built with ❤️ by the AetherBase Team.*
