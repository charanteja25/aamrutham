# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Frontend (repo root)
```bash
npm run dev        # Vite dev server at :5173
npm run build      # production build → dist/
npm run preview    # preview the production build
```

### Backend (`backend/`)
```bash
npm run dev        # Express with --watch (auto-restart) at :3001
npm start          # production start
node migrate.js    # create/update DB tables (safe to re-run)
node seed.js       # seed admin user + inventory (uses ADMIN_USERNAME / ADMIN_PASSWORD env vars)
```

### Local dev — first time
```bash
createdb aamrutham
cd backend && node migrate.js && node seed.js
```

## Architecture

**Frontend** — React + Vite SPA deployed on Vercel. All styles live in `src/styles.css` (no Tailwind; brand tokens defined as CSS variables). No TypeScript.

**Backend** — Express on Railway. Single `backend/index.js` entry point mounting six route files under `/api/*`. PostgreSQL via `pg` pool (`backend/db.js`). No ORM.

**API base URL** — `src/config.js` exports `API_BASE = import.meta.env.VITE_API_URL || ""`. On Vercel, `VITE_API_URL` must be set to the Railway backend URL (e.g. `https://aamrutham-backend-production.up.railway.app`). Without it, API calls are relative and fail in production.

### Key data flows

**Cart** — `CartContext` persists to `localStorage` (`aamrutham_cart`). Cart item key is `${productId}||${packLabel}`. Inventory availability is polled every 30s by `InventoryContext` from `/api/inventory`.

**Checkout** — `CartDrawer` calls `POST /api/orders/create` which locks inventory for 5 minutes via `inventory_reservations`, creates a Razorpay order, and returns the order ID. Payment is verified at `POST /api/payments/verify`. On dismiss/failure, `POST /api/payments/release` frees the lock.

**Inventory** — Backend returns `{ inventory: { [productId]: { [packLabel]: qty } } }`. A value of `0` means "Coming Soon"; `999` means the product has no DB row and is treated as available.

**Admin** — `/admin` routes are outside `InventoryProvider` and render without Navbar/Footer. JWT token stored in `localStorage` as `admin_token`. `requireAdmin` middleware hard-fails at startup if `JWT_SECRET` is the default in production.

**Order history / OTP** — `POST /api/order-history/send-otp` accepts phone (10 digits) or email. Phone → WhatsApp OTP via Twilio. Email → Resend. Verified at `POST /api/order-history/verify-otp`.

### Product data

All products, pack sizes, and prices are defined statically in `src/data/products.js`. Inventory stock levels live in the DB and are managed via the admin dashboard. Pack labels (e.g. `"6 pcs"`, `"12 pcs"`, `"18 pcs"`) must match exactly between `products.js` and the DB rows.

### DB tables

| Table | Purpose |
|---|---|
| `orders` | Razorpay order + customer details + status |
| `inventory` | Stock per `(product_id, pack_label)` |
| `inventory_reservations` | 5-min locks during active checkout |
| `admin_users` | bcrypt-hashed credentials for the admin dashboard |
| `season_pass_slots` | Total/claimed slots for the Maas season pass |
| `otp_requests` | Rate-limited OTP tokens for order history |

## Environment variables

### Backend (`backend/.env`)
`DATABASE_URL`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `JWT_SECRET`, `FRONTEND_URL`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_FROM`, `RESEND_API_KEY`

### Frontend (`.env`)
`VITE_API_URL` (Railway backend URL)

## Deployment

- **Frontend** → Vercel (auto-deploys from `main`). Build: `npm run build`, output: `dist/`.
- **Backend** → Railway (`backend/` directory). Start: `node index.js`. Config: `backend/nixpacks.toml` + `backend/railway.json`.
- **Active dev branch** → `Charan-newchanges`. PR #14 targets `main`.
