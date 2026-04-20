import "dotenv/config";
import pool from "./db.js";

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

CREATE INDEX IF NOT EXISTS idx_orders_razorpay_order_id ON orders (razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);

-- Inventory: base stock per product+pack combination
CREATE TABLE IF NOT EXISTS inventory (
  product_id  VARCHAR(255) NOT NULL,
  pack_label  VARCHAR(100) NOT NULL,
  stock       INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  PRIMARY KEY (product_id, pack_label)
);

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
`;

async function migrate() {
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
