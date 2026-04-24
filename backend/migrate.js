import "dotenv/config";
import pg from "pg";
import pool from "./db.js";

const { Client } = pg;

const sql = `
CREATE TABLE IF NOT EXISTS orders (
  id                  SERIAL PRIMARY KEY,
  razorpay_order_id   VARCHAR(255) UNIQUE NOT NULL,
  razorpay_payment_id VARCHAR(255),
  amount              INTEGER NOT NULL,      -- total in paise
  currency            VARCHAR(10) NOT NULL DEFAULT 'INR',
  status              VARCHAR(50) NOT NULL DEFAULT 'pending',
  cart_items          JSONB NOT NULL,
  customer_name       VARCHAR(255),
  customer_email      VARCHAR(255),
  customer_contact    VARCHAR(20),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Shipping address columns (added by later migration — kept together for clarity).
ALTER TABLE orders ADD COLUMN IF NOT EXISTS address_line1 VARCHAR(500);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS address_line2 VARCHAR(500);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS address_city VARCHAR(120);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS address_state VARCHAR(120);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS address_pincode VARCHAR(20);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS address_landmark VARCHAR(255);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS aam_order_id VARCHAR(100);

CREATE INDEX IF NOT EXISTS idx_orders_razorpay_order_id ON orders (razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);

-- Inventory: base stock per product+pack combination
CREATE TABLE IF NOT EXISTS inventory (
  product_id  VARCHAR(255) NOT NULL,
  pack_label  VARCHAR(100) NOT NULL,
  stock       INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  PRIMARY KEY (product_id, pack_label)
);

-- Admin UI wants to show "last edited" on stock updates.
ALTER TABLE inventory ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Reservations: 5-minute locks created at order time
CREATE TABLE IF NOT EXISTS inventory_reservations (
  id                SERIAL PRIMARY KEY,
  razorpay_order_id VARCHAR(255) NOT NULL,
  product_id        VARCHAR(255) NOT NULL,
  pack_label        VARCHAR(100) NOT NULL,
  qty               INTEGER NOT NULL DEFAULT 1 CHECK (qty > 0),
  expires_at        TIMESTAMPTZ NOT NULL,
  status            VARCHAR(20) NOT NULL DEFAULT 'active'
                      CHECK (status IN ('active', 'confirmed', 'released'))
);

CREATE INDEX IF NOT EXISTS idx_reservations_order    ON inventory_reservations (razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_reservations_product  ON inventory_reservations (product_id, pack_label);
CREATE INDEX IF NOT EXISTS idx_reservations_expires  ON inventory_reservations (expires_at) WHERE status = 'active';

CREATE TABLE IF NOT EXISTS admin_users (
  id            SERIAL PRIMARY KEY,
  username      VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Season Pass slot counter. One row per season_year; UPSERT-friendly.
-- Admin edits "total" and "claimed" from the dashboard; the MaaS page reads it live.
CREATE TABLE IF NOT EXISTS season_pass_slots (
  season_year INTEGER PRIMARY KEY,
  total       INTEGER NOT NULL DEFAULT 0 CHECK (total >= 0),
  claimed     INTEGER NOT NULL DEFAULT 0 CHECK (claimed >= 0),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`;

// Quote a Postgres identifier (role, database, schema, table name).
const quoteIdent = (n) => '"' + String(n).replace(/"/g, '""') + '"';
// Quote a Postgres string literal (inline DDL where parameters aren't allowed).
const quoteLiteral = (v) => "'" + String(v).replace(/'/g, "''") + "'";

// Codes that indicate the target role or database is missing or rejected.
const BOOTSTRAP_ERROR_CODES = new Set(["28000", "3D000", "28P01"]);

function parseTargetUrl() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }
  const t = new URL(process.env.DATABASE_URL);
  const user = decodeURIComponent(t.username);
  const database = t.pathname.replace(/^\//, "");
  if (!user || !database) {
    throw new Error("DATABASE_URL must include both a user and a database name");
  }
  return {
    user,
    password: decodeURIComponent(t.password || ""),
    host: t.hostname || "localhost",
    port: Number(t.port) || 5432,
    database,
  };
}

function buildAdminConfig(target) {
  if (process.env.ADMIN_DATABASE_URL) {
    const a = new URL(process.env.ADMIN_DATABASE_URL);
    return {
      host: a.hostname,
      port: Number(a.port) || 5432,
      user: decodeURIComponent(a.username),
      password: a.password ? decodeURIComponent(a.password) : undefined,
      database: a.pathname.replace(/^\//, "") || "postgres",
    };
  }
  return {
    host: target.host,
    port: target.port,
    user: process.env.PGUSER || process.env.USER || "postgres",
    password: process.env.PGPASSWORD || undefined,
    database: "postgres",
  };
}

async function probeTarget() {
  const c = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await c.connect();
    await c.end();
    return { ok: true };
  } catch (err) {
    await c.end().catch(() => {});
    return { ok: false, err };
  }
}

async function bootstrapRoleAndDatabase(target) {
  const adminBase = buildAdminConfig(target);
  const admin = new Client(adminBase);
  try {
    await admin.connect();
  } catch (err) {
    console.error(
      "\nCould not connect as admin to bootstrap the database.\n" +
        "Set ADMIN_DATABASE_URL to a superuser connection string, for example:\n" +
        "  ADMIN_DATABASE_URL=postgresql://postgres@localhost:5432/postgres\n"
    );
    throw err;
  }

  try {
    const { rows: roleRows } = await admin.query(
      `SELECT 1 FROM pg_roles WHERE rolname = $1`,
      [target.user]
    );
    if (roleRows.length === 0) {
      await admin.query(
        `CREATE ROLE ${quoteIdent(target.user)} LOGIN CREATEDB PASSWORD ${quoteLiteral(target.password)}`
      );
      console.log(`✅ Created role "${target.user}".`);
    } else {
      await admin.query(
        `ALTER ROLE ${quoteIdent(target.user)} WITH LOGIN PASSWORD ${quoteLiteral(target.password)}`
      );
      console.log(`ℹ️  Role "${target.user}" already existed — login/password refreshed.`);
    }

    const { rows: dbRows } = await admin.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [target.database]
    );
    if (dbRows.length === 0) {
      await admin.query(
        `CREATE DATABASE ${quoteIdent(target.database)} OWNER ${quoteIdent(target.user)}`
      );
      console.log(`✅ Created database "${target.database}" owned by "${target.user}".`);
    } else {
      console.log(`ℹ️  Database "${target.database}" already existed.`);
    }

    await admin.query(
      `GRANT ALL PRIVILEGES ON DATABASE ${quoteIdent(target.database)} TO ${quoteIdent(target.user)}`
    );
  } finally {
    await admin.end();
  }
}

// Fix ownership of public schema + any pre-existing tables/sequences/views so
// the target role can add indexes / alter tables during migration. Runs as
// admin against the target database. Safe to re-run.
async function fixOwnership(target) {
  const adminBase = buildAdminConfig(target);
  const c = new Client({ ...adminBase, database: target.database });
  try {
    await c.connect();
  } catch (err) {
    console.log(`ℹ️  Skipping ownership fix (no admin connection): ${err.message.trim()}`);
    return;
  }

  try {
    await c.query(`GRANT ALL ON SCHEMA public TO ${quoteIdent(target.user)}`);
    await c.query(`ALTER SCHEMA public OWNER TO ${quoteIdent(target.user)}`);

    await c.query(
      `DO $$
       DECLARE r record;
       BEGIN
         FOR r IN SELECT tablename    FROM pg_tables    WHERE schemaname = 'public' LOOP
           EXECUTE format('ALTER TABLE public.%I OWNER TO %I', r.tablename, ${quoteLiteral(target.user)});
         END LOOP;
         FOR r IN SELECT sequencename FROM pg_sequences WHERE schemaname = 'public' LOOP
           EXECUTE format('ALTER SEQUENCE public.%I OWNER TO %I', r.sequencename, ${quoteLiteral(target.user)});
         END LOOP;
         FOR r IN SELECT viewname     FROM pg_views     WHERE schemaname = 'public' LOOP
           EXECUTE format('ALTER VIEW public.%I OWNER TO %I', r.viewname, ${quoteLiteral(target.user)});
         END LOOP;
       END $$;`
    );
  } finally {
    await c.end().catch(() => {});
  }
}

async function ensureRoleAndDatabase() {
  const target = parseTargetUrl();

  const probe = await probeTarget();
  if (!probe.ok) {
    if (!BOOTSTRAP_ERROR_CODES.has(probe.err.code)) throw probe.err;
    console.log(`Bootstrap needed (pg error ${probe.err.code}: ${probe.err.message.trim()}). Connecting as admin…`);
    await bootstrapRoleAndDatabase(target);
  }

  // Always run ownership fix — cheap, idempotent, and needed when the DB
  // pre-existed with tables owned by a different role.
  await fixOwnership(target);
}

async function migrate() {
  await ensureRoleAndDatabase();

  const client = await pool.connect();
  try {
    await client.query(sql);
    console.log("Migration complete — orders, inventory, and inventory_reservations tables ready.");
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
