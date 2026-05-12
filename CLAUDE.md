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

**Backend** — Express on Railway. Single `backend/index.js` entry point mounting route files under `/api/*`. PostgreSQL via `pg` pool (`backend/db.js`). No ORM. `app.set("trust proxy", 1)` is required for `express-rate-limit` to work correctly behind Railway's proxy.

**API base URL** — `src/config.js` exports `API_BASE = import.meta.env.VITE_API_URL || ""`. On Vercel, `VITE_API_URL` must be set to the Railway backend URL. Without it, API calls are relative and fail in production.

### Key data flows

**Cart** — `CartContext` persists to `localStorage` (`aamrutham_cart`). Cart item key is `${productId}||${packLabel}`. Inventory availability is polled every 30s by `InventoryContext` from `/api/inventory`.

**Checkout** — `CartDrawer` calls `POST /api/orders/create` which locks inventory for 5 minutes via `inventory_reservations`, creates a Razorpay order, and returns the order ID. Payment is verified at `POST /api/payments/verify`. On dismiss/failure, `POST /api/payments/release` frees the lock.

**Inventory** — Backend returns `{ inventory: { [productId]: { [packLabel]: qty } } }`. A value of `0` means "Coming Soon"; `999` means the product has no DB row and is treated as available.

**Admin** — `/admin` routes are outside `InventoryProvider` and render without Navbar/Footer. JWT token stored in `localStorage` as `admin_token`. `requireAdmin` middleware hard-fails at startup if `JWT_SECRET` is the default in production.

**Order history / OTP** — `POST /api/order-history/send-otp` accepts phone (10 digits) or email. Phone → WhatsApp OTP via Twilio. Email → OTP via Resend. Verified at `POST /api/order-history/verify-otp`.

**Messaging** — `backend/msg91.js` handles all MSG91 WhatsApp outbound messages. Order confirmation (on payment verify) and stall blast (admin dashboard) both go through MSG91 WhatsApp templates. OTP remains on Twilio. MSG91 authkey is passed as a query param (`?authkey=`) due to Railway dynamic IPs.

**Blast** — Admin dashboard sends WhatsApp blast via `POST /api/admin/blast-sms`. Local CSV blast available via `node backend/blast-sms.js /path/to/contacts.csv`. Both log results to `sms_blast_log` table.

### Product data

All products, pack sizes, and prices are defined statically in `src/data/products.js`. Inventory stock levels live in the DB. Pack labels (e.g. `"6 pcs"`, `"12 pcs"`, `"18 pcs"`) must match exactly between `products.js` and DB rows. WhatsApp business number is exported as `whatsappPhone = '917670826759'` from `products.js`.

### DB tables

| Table | Purpose |
|---|---|
| `orders` | Razorpay order + customer details + status |
| `inventory` | Stock per `(product_id, pack_label)` |
| `inventory_reservations` | 5-min locks during active checkout |
| `admin_users` | bcrypt-hashed credentials for the admin dashboard |
| `season_pass_slots` | Total/claimed slots for the Maas season pass |
| `otp_requests` | Rate-limited OTP tokens for order history |
| `sms_blast_log` | Log of all blast messages sent (name, phone, status, error) |
| `waitlist` | WhatsApp number + name collected from /hello page |

### Floating UI elements

Three fixed-position elements coexist:
- `WhatsAppFloat` — bottom-right, links to business WhatsApp chat
- `CommunityFloat` — bottom-left below HelpBot, links to `/hello` page (green pill)
- `HelpBot` — bottom-left pill, opens contextual help drawer

## Environment variables

### Backend (`backend/.env`)
`DATABASE_URL`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `JWT_SECRET`, `FRONTEND_URL`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_FROM`, `RESEND_API_KEY`, `MSG91_AUTH_KEY`, `MSG91_WHATSAPP_NUMBER`, `MSG91_NAMESPACE`, `MSG91_ORDER_TEMPLATE`, `MSG91_BLAST_TEMPLATE`

### Frontend (`.env`)
`VITE_API_URL` (Railway backend URL)

## Deployment

- **Frontend** → Vercel (auto-deploys from `main`). Build: `npm run build`, output: `dist/`.
- **Backend** → Railway (`backend/` directory). Start: `node index.js`. Config: `backend/nixpacks.toml` + `backend/railway.json`.
