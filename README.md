# Aamrutham

Heritage mango e-commerce — React + Vite frontend, Node/Express backend, PostgreSQL, Razorpay payments.

**Live site:** [aamrutham.com](https://aamrutham.com)  
**Stack:** React (Vite) · Express · PostgreSQL · Razorpay · Twilio SMS · Resend email  
**Hosting:** Vercel (frontend) · Railway (backend + DB)

---

## Local Development

### Prerequisites

- Node.js 20+
- PostgreSQL running locally
- Twilio account (for SMS OTP + order confirmations)
- Razorpay account (test keys for local dev)
- Resend account (for email OTP)

### 1. Clone & install

```bash
git clone https://github.com/charanteja25/aamrutham.git
cd aamrutham

# Frontend deps
npm install

# Backend deps
cd backend && npm install && cd ..
```

### 2. Set up environment variables

**Frontend** — create `.env` in repo root:
```env
VITE_API_URL=http://localhost:3001
```

**Backend** — create `backend/.env`:
```env
PORT=3001
DATABASE_URL=postgresql://localhost:5432/aamrutham
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_test_secret
JWT_SECRET=any_random_string_for_local
FRONTEND_URL=http://localhost:5173
ADMIN_USERNAME=admin
ADMIN_PASSWORD=yourpassword
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_FROM=+17439014443
RESEND_API_KEY=re_xxxxxxxxxxxx
```

### 3. Set up the database

```bash
createdb aamrutham
cd backend
node migrate.js      # creates all tables
node seed.js         # seeds admin user + inventory
cd ..
```

### 4. Run dev servers

```bash
# Terminal 1 — backend (port 3001, auto-restarts on changes)
cd backend && npm run dev

# Terminal 2 — frontend (port 5173)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

Admin dashboard: [http://localhost:5173/admin](http://localhost:5173/admin)  
Login: `admin` / whatever you set in `ADMIN_PASSWORD`

---

## Project Structure

```
aamrutham/
├── src/                        # React frontend
│   ├── components/             # Navbar, CartDrawer, HelpBot, etc.
│   ├── context/                # CartContext, InventoryContext
│   ├── pages/                  # One file per route
│   ├── data/products.js        # All products, packs, prices (static)
│   └── styles.css              # All styles — no Tailwind
├── backend/
│   ├── index.js                # Express entry point
│   ├── db.js                   # PostgreSQL pool
│   ├── migrate.js              # DB schema (run once)
│   ├── seed.js                 # Seed admin + inventory
│   ├── blast-sms.js            # One-time SMS blast to all paid orders
│   ├── routes/
│   │   ├── orders.js           # POST /api/orders/create
│   │   ├── payments.js         # POST /api/payments/verify|release
│   │   ├── inventory.js        # GET /api/inventory
│   │   ├── admin.js            # Admin CRUD (orders, inventory, stats)
│   │   ├── order-history.js    # OTP send/verify for /my-orders
│   │   └── season-pass.js      # Season pass slot management
│   └── middleware/auth.js      # JWT requireAdmin middleware
└── public/assets/              # Product images, team photos
```

---

## Key Concepts

### Products & Inventory
- Products, pack sizes and prices are **hardcoded** in `src/data/products.js`
- Stock levels live in the **DB** (`inventory` table) — managed via admin dashboard
- Pack labels (e.g. `"6 pcs"`, `"12 pcs"`) must match exactly between `products.js` and DB rows

### Checkout Flow
1. Customer adds items → cart stored in `localStorage`
2. `CartDrawer` → `POST /api/orders/create` → locks inventory for 5 min, creates Razorpay order
3. Razorpay modal opens → customer pays
4. `POST /api/payments/verify` → confirms payment, decrements stock, sends SMS + email confirmation
5. On dismiss/failure → `POST /api/payments/release` frees the inventory lock

### Order History
- Customer goes to `/my-orders`, enters phone or email
- Phone → SMS OTP via Twilio · Email → OTP via Resend
- OTP valid 10 minutes, rate-limited to 1 per 60 seconds

### Admin Dashboard
- Route: `/admin` (no Navbar/Footer)
- JWT auth — token stored in `localStorage` as `admin_token`
- Features: order list, status updates, inventory management, season pass slots

---

## Deployment

### Frontend — Vercel
- Auto-deploys from `main` branch
- Set `VITE_API_URL` in Vercel environment variables → Railway backend URL

### Backend — Railway
- Deploys from `backend/` directory
- Set all env vars in Railway → Variables tab
- After first deploy: run `node migrate.js` and `node seed.js` via Railway shell

### Required Railway Variables
| Variable | Description |
|---|---|
| `DATABASE_URL` | Auto-set by Railway Postgres |
| `RAZORPAY_KEY_ID` | Razorpay live key |
| `RAZORPAY_KEY_SECRET` | Razorpay live secret |
| `JWT_SECRET` | Random secret string |
| `FRONTEND_URL` | `https://aamrutham.com` |
| `ADMIN_USERNAME` | Admin login username |
| `ADMIN_PASSWORD` | Admin login password |
| `TWILIO_ACCOUNT_SID` | Twilio account SID |
| `TWILIO_AUTH_TOKEN` | Twilio auth token |
| `TWILIO_PHONE_FROM` | Twilio SMS number e.g. `+17439014443` |
| `RESEND_API_KEY` | Resend API key for email OTP |

---

## Common Tasks

### Reset admin password
```bash
cd backend
node --input-type=module << 'EOF'
import pool from './db.js';
import bcrypt from 'bcryptjs';
const hash = await bcrypt.hash('newpassword', 10);
await pool.query("UPDATE admin_users SET password_hash = $1 WHERE username = 'admin'", [hash]);
console.log('Done');
await pool.end();
EOF
```

### Send SMS blast to all paid customers
```bash
cd backend
TWILIO_ACCOUNT_SID=ACxxx TWILIO_AUTH_TOKEN=xxx TWILIO_PHONE_FROM=+1xxx node blast-sms.js
```

### Update stock manually
```bash
psql $DATABASE_URL -c "UPDATE inventory SET stock = 100 WHERE product_id = 'mettavalasa-peechu' AND pack_label = '12 pcs';"
```

---

## Uptime

Railway backend is kept awake via **UptimeRobot** pinging `/api/health` every 15 minutes.  
Health check: `https://aamrutham-backend-production.up.railway.app/api/health`

---

## Brand

**Colors:** `--mango: #F5A623` · `--leaf: #2D5016` · `--cream: #FFF8EC`  
**Fonts:** Playfair Display (headings) · Inter (body) · Noto Serif Telugu (Telugu text)
