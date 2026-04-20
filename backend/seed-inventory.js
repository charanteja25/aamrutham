/**
 * seed-inventory.js
 * Run once to populate the inventory table with initial stock.
 * Safe to re-run — uses INSERT … ON CONFLICT DO UPDATE so it won't duplicate rows.
 *
 *   node backend/seed-inventory.js
 */
import "dotenv/config";
import pool from "./db.js";

const rows = [
  // ── Premium (3 pack sizes each) ─────────────────────────────────────────
  { product_id: 'mettavalasa-peechu', pack_label: '6 pcs',  stock: 50 },
  { product_id: 'mettavalasa-peechu', pack_label: '12 pcs', stock: 50 },
  { product_id: 'mettavalasa-peechu', pack_label: '18 pcs', stock: 30 },

  { product_id: 'bobbili-peechu',     pack_label: '6 pcs',  stock: 50 },
  { product_id: 'bobbili-peechu',     pack_label: '12 pcs', stock: 50 },
  { product_id: 'bobbili-peechu',     pack_label: '18 pcs', stock: 30 },

  { product_id: 'kothapalli-kobbari', pack_label: '6 pcs',  stock: 40 },
  { product_id: 'kothapalli-kobbari', pack_label: '12 pcs', stock: 40 },
  { product_id: 'kothapalli-kobbari', pack_label: '18 pcs', stock: 20 },

  { product_id: 'imam-pasand',        pack_label: '6 pcs',  stock: 30 },
  { product_id: 'imam-pasand',        pack_label: '12 pcs', stock: 30 },
  { product_id: 'imam-pasand',        pack_label: '18 pcs', stock: 20 },

  // ── Heritage Box ────────────────────────────────────────────────────────
  { product_id: 'heritage-box', pack_label: 'Pack of 12', stock: 20 },
  { product_id: 'heritage-box', pack_label: 'Pack of 24', stock: 15 },

  // ── More varieties (12 pcs only) ────────────────────────────────────────
  { product_id: 'suvarnarekha',   pack_label: '12 pcs', stock: 60 },
  { product_id: 'banganapalli',   pack_label: '12 pcs', stock: 80 },
  { product_id: 'chinna-rasalu',  pack_label: '12 pcs', stock: 60 },
  { product_id: 'pedda-rasalu',   pack_label: '12 pcs', stock: 60 },
  { product_id: 'panduri-mavidi', pack_label: '12 pcs', stock: 50 },
];

async function seed() {
  const client = await pool.connect();
  try {
    for (const row of rows) {
      await client.query(
        `INSERT INTO inventory (product_id, pack_label, stock)
         VALUES ($1, $2, $3)
         ON CONFLICT (product_id, pack_label)
         DO UPDATE SET stock = EXCLUDED.stock`,
        [row.product_id, row.pack_label, row.stock]
      );
    }
    console.log(`✅  Seeded ${rows.length} inventory rows.`);
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
