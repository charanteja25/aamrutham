# Aamrutham — Production Setup Guide


Stack: **React (Vite) + Node/Express + PostgreSQL + Razorpay**  
Deployment target: **AWS EC2 (Ubuntu 22.04) + PostgreSQL** *(local on EC2 or RDS — both covered)*

---

## Table of Contents

1. [Architecture overview](#1-architecture-overview)
2. [Prerequisites](#2-prerequisites)
3. [Launch & configure EC2](#3-launch--configure-ec2)
4. [Install system dependencies](#4-install-system-dependencies)
5. [Set up PostgreSQL](#5-set-up-postgresql)
6. [Deploy the backend](#6-deploy-the-backend)
7. [Run migrations & seed inventory](#7-run-migrations--seed-inventory)
8. [Build & serve the frontend](#8-build--serve-the-frontend)
9. [Keep the backend alive with PM2](#9-keep-the-backend-alive-with-pm2)
10. [HTTPS with Let's Encrypt](#10-https-with-lets-encrypt)
11. [Environment variables reference](#11-environment-variables-reference)
12. [Razorpay go-live checklist](#12-razorpay-go-live-checklist)
13. [Updating the app](#13-updating-the-app)
14. [Useful commands](#14-useful-commands)
15. [Local development](#15-local-development)

---

## 1. Architecture overview

```
Browser
  │
  ├─► nginx :443 ──► /        → serves React build (dist/)
  │                └► /api/*  → proxy → Node/Express :3001
  │
  └─► EC2 instance (Ubuntu 22.04)
        ├─ Node.js 20 + PM2  (backend/index.js)
        └─ PostgreSQL 15      (local)  ← OR → AWS RDS
```

- The React app is built once (`npm run build`) and nginx serves the static files from `dist/`.
- All `/api/*` requests are reverse-proxied by nginx to the Express server on port 3001.
- Port 3001 is never exposed publicly — nginx is the only public entry point.

---

## 2. Prerequisites

| What | Where to get it |
|---|---|
| AWS account | console.aws.amazon.com |
| Domain name | Route 53, Namecheap, GoDaddy, etc. |
| Razorpay **live** keys | dashboard.razorpay.com → Settings → API Keys |
| SSH key pair | EC2 → Key Pairs → Create key pair |
| GitHub repo access | github.com/charanteja25/aamrutham |

---

## 3. Launch & configure EC2

### 3a. Launch instance

1. Go to **EC2 → Launch Instance**
2. AMI: **Ubuntu Server 22.04 LTS (HVM), SSD** (64-bit x86)
3. Instance type: **t3.small** minimum (**t3.medium** recommended)
4. Key pair: select your key or create one — download the `.pem` file
5. Storage: **20 GB** gp3

### 3b. Security Group — inbound rules

| Type | Protocol | Port | Source | Purpose |
|---|---|---|---|---|
| SSH | TCP | 22 | Your IP only | Admin SSH access |
| HTTP | TCP | 80 | 0.0.0.0/0, ::/0 | Let's Encrypt + HTTP→HTTPS redirect |
| HTTPS | TCP | 443 | 0.0.0.0/0, ::/0 | Production traffic |

> Do **not** open port 3001 publicly — nginx proxies all API traffic internally.

### 3c. Point your domain to EC2

In your DNS provider add two **A records**:

```
Type  Name              Value
A     aamrutham.in      <EC2 Elastic IP>
A     www.aamrutham.in  <EC2 Elastic IP>
```

> Use an **Elastic IP** (EC2 → Elastic IPs → Allocate, then associate to your instance).  
> This ensures the IP never changes if the instance restarts.

DNS propagation typically takes 5–15 minutes.

---

## 4. Install system dependencies

SSH into the instance:

```bash
ssh -i ~/your-key.pem ubuntu@<EC2-PUBLIC-IP>
```

Run all at once:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Node.js 20 via NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify
node -v   # v20.x.x
npm -v

# PM2 — production process manager
sudo npm install -g pm2

# Nginx
sudo apt install -y nginx

# Git
sudo apt install -y git

# Certbot (Let's Encrypt SSL)
sudo apt install -y certbot python3-certbot-nginx
```

---

## 5. Set up PostgreSQL

### Option A — PostgreSQL on the same EC2 (simpler, free)

```bash
sudo apt install -y postgresql postgresql-contrib
sudo systemctl enable postgresql
sudo systemctl start postgresql

# Create database and user
sudo -u postgres psql <<SQL
CREATE USER aamrutham_user WITH PASSWORD 'choose_a_strong_password';
CREATE DATABASE aamrutham OWNER aamrutham_user;
GRANT ALL PRIVILEGES ON DATABASE aamrutham TO aamrutham_user;
SQL
```

Your `DATABASE_URL`:
```
postgresql://aamrutham_user:choose_a_strong_password@localhost:5432/aamrutham
```

### Option B — AWS RDS PostgreSQL (managed, recommended for scale)

1. **RDS → Create database**
2. Engine: **PostgreSQL 15**
3. DB instance identifier: `aamrutham-db`
4. Master username: `aamrutham_user`, set a strong password
5. VPC: **same VPC as your EC2**
6. Public access: **No**
7. VPC security group: allow port `5432` from your EC2's security group

After creation your `DATABASE_URL`:
```
postgresql://aamrutham_user:password@<rds-endpoint>.rds.amazonaws.com:5432/aamrutham
```

---

## 6. Deploy the backend

```bash
cd /home/ubuntu
git clone https://github.com/charanteja25/aamrutham.git
cd aamrutham

# Switch to the production branch
git checkout dev       # change to 'main' when merged

# Install backend dependencies (production only, no devDeps)
cd backend
npm install --omit=dev

# Create environment file
cp .env.example .env
nano .env
```

Fill in all values (see [Section 11](#11-environment-variables-reference)):

```dotenv
PORT=3001
DATABASE_URL=postgresql://aamrutham_user:your_password@localhost:5432/aamrutham
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_live_razorpay_secret
FRONTEND_URL=https://aamrutham.in
```

Save: `Ctrl+X` → `Y` → `Enter`

---

## 7. Run migrations & seed inventory

```bash
# Still inside /home/ubuntu/aamrutham/backend

# Create all tables (safe to re-run — CREATE TABLE IF NOT EXISTS)
node migrate.js

# Seed initial stock (safe to re-run — INSERT … ON CONFLICT DO UPDATE)
node seed-inventory.js
```

Expected output:

```
Migration complete — orders, inventory, and inventory_reservations tables ready.
✅  Seeded 19 inventory rows.
```

To adjust stock later without re-seeding everything:

```bash
psql -U aamrutham_user -d aamrutham -c \
  "UPDATE inventory SET stock = 100
   WHERE product_id = 'mettavalasa-peechu' AND pack_label = '12 pcs';"
```

---

## 8. Build & serve the frontend

### 8a. Build

```bash
cd /home/ubuntu/aamrutham

# Install frontend dependencies
npm install --omit=dev

# Create frontend env file
nano .env
```

```dotenv
VITE_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxx
```

```bash
npm run build
# Output: dist/
```

### 8b. Configure nginx

```bash
sudo nano /etc/nginx/sites-available/aamrutham
```

Paste (replace `aamrutham.in` with your actual domain):

```nginx
server {
    listen 80;
    server_name aamrutham.in www.aamrutham.in;
    # Certbot will insert the HTTPS redirect here automatically
}

server {
    listen 443 ssl;
    server_name aamrutham.in www.aamrutham.in;

    # Certbot fills these in:
    # ssl_certificate     /etc/letsencrypt/live/aamrutham.in/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/aamrutham.in/privkey.pem;

    root /home/ubuntu/aamrutham/dist;
    index index.html;

    # React Router — all non-asset paths serve index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API reverse proxy → Express backend
    location /api/ {
        proxy_pass         http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_read_timeout 30s;
    }

    # Cache static assets aggressively (Vite adds content hashes)
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff2?)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript
               text/xml application/xml image/svg+xml;
    gzip_min_length 1024;
}
```

Enable and reload:

```bash
sudo ln -s /etc/nginx/sites-available/aamrutham /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default   # remove the default placeholder
sudo nginx -t                                  # must say: syntax is ok
sudo systemctl reload nginx
```

---

## 9. Keep the backend alive with PM2

```bash
cd /home/ubuntu/aamrutham/backend

# setup DB
npm run db:setup

# Start under PM2
pm2 start index.js --name aamrutham-api

# Save the process list (survives reboots)
pm2 save

# Register PM2 to start on system boot
pm2 startup
# Copy-paste the command it outputs and run it (it looks like: sudo env PATH=... pm2 startup ...)
```

---

## 10. HTTPS with Let's Encrypt

Your domain must already resolve to the EC2 IP before running this.

```bash
sudo certbot --nginx -d aamrutham.in -d www.aamrutham.in
```

Certbot will:
- Obtain free SSL certificates
- Automatically edit your nginx config with certificate paths
- Add an HTTP → HTTPS redirect

Auto-renewal runs via a systemd timer. Verify it:

```bash
sudo systemctl status certbot.timer
# Test renewal (dry run, makes no changes):
sudo certbot renew --dry-run
```

---

## 11. Environment variables reference

### Backend — `backend/.env`

| Variable | Required | Description | Example |
|---|---|---|---|
| `PORT` | yes | Express listen port | `3001` |
| `DATABASE_URL` | yes | PostgreSQL connection string | `postgresql://user:pw@localhost:5432/aamrutham` |
| `RAZORPAY_KEY_ID` | yes | Razorpay Key ID (live) | `rzp_live_xxxx` |
| `RAZORPAY_KEY_SECRET` | yes | Razorpay Key Secret (live) | `your_secret` |
| `FRONTEND_URL` | yes | CORS allowed origin | `https://aamrutham.in` |

### Frontend — `.env` (root)

| Variable | Required | Description | Example |
|---|---|---|---|
| `VITE_RAZORPAY_KEY_ID` | yes | Razorpay public key embedded in the JS bundle | `rzp_live_xxxx` |

> The backend also returns `keyId` dynamically from `/api/orders/create`, so the frontend env var acts as a fallback. Both should match.

---

## 12. Razorpay go-live checklist

- [ ] Complete KYC on the Razorpay dashboard
- [ ] Add a bank account for settlements
- [ ] Replace `rzp_test_*` keys with `rzp_live_*` in both `.env` files
- [ ] Restart the backend: `pm2 restart aamrutham-api`
- [ ] Rebuild the frontend: `cd /home/ubuntu/aamrutham && npm run build`
- [ ] (Optional) Add a Webhook in Razorpay dashboard:
  - URL: `https://aamrutham.in/api/payments/verify`
  - Events: `payment.captured`
- [ ] Do a real small-value test transaction end-to-end

---

## 13. Updating the app

Every time you push changes:

```bash
cd /home/ubuntu/aamrutham
git pull origin dev

# Backend changed?
cd backend
npm install --omit=dev
pm2 restart aamrutham-api

# Frontend changed?
cd /home/ubuntu/aamrutham
npm install --omit=dev
npm run build
# nginx serves dist/ immediately — no nginx reload needed

# DB schema changed?
cd backend && node migrate.js

# Inventory stock needs resetting?
cd backend && node seed-inventory.js
```

---

## 14. Useful commands

### Check everything is running

```bash
pm2 status                          # backend process
sudo systemctl status nginx         # nginx
sudo systemctl status postgresql    # postgres (Option A only)
curl http://localhost:3001/api/health   # → {"ok":true}
```

### View live inventory (API)

```bash
curl http://localhost:3001/api/inventory | python3 -m json.tool
```

### View stock + reservations in psql

```bash
psql -U aamrutham_user -d aamrutham -c "
SELECT
  i.product_id,
  i.pack_label,
  i.stock,
  COALESCE(SUM(r.qty) FILTER (WHERE r.status='active' AND r.expires_at > NOW()), 0) AS reserved,
  i.stock - COALESCE(SUM(r.qty) FILTER (WHERE r.status='active' AND r.expires_at > NOW()), 0) AS available
FROM inventory i
LEFT JOIN inventory_reservations r USING (product_id, pack_label)
GROUP BY i.product_id, i.pack_label, i.stock
ORDER BY i.product_id, i.pack_label;
"
```

### Release all expired reservations manually

```bash
psql -U aamrutham_user -d aamrutham -c "
UPDATE inventory_reservations
SET status = 'released'
WHERE status = 'active' AND expires_at < NOW();
"
```

### View recent orders

```bash
psql -U aamrutham_user -d aamrutham -c "
SELECT id, razorpay_order_id, amount/100.0 AS rupees, status, created_at
FROM orders ORDER BY created_at DESC LIMIT 20;
"
```

### nginx logs

```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Backend logs

```bash
pm2 logs aamrutham-api --lines 100
pm2 logs aamrutham-api          # live tail
```

---

## 15. Local development

```bash
# Terminal 1 — backend (auto-restarts on file changes)
cd backend
cp .env.example .env   # fill in test Razorpay keys + local DB
npm install
npm run dev            # :3001

# Terminal 2 — frontend (proxies /api → :3001 automatically via vite.config.js)
cp .env.example .env   # fill in VITE_RAZORPAY_KEY_ID test key
npm install
npm run dev            # :5173
```

First-time DB setup locally:

```bash
createdb aamrutham
cd backend
node migrate.js
node seed-inventory.js
```
