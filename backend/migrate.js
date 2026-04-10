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
`;

async function migrate() {
  const client = await pool.connect();
  try {
    await client.query(sql);
    console.log("Migration complete — orders table ready.");
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
