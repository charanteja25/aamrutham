/**
 * seed.js
 * Run once after "npm run db:setup" to populate the database with initial data.
 * Combines seed-admin and seed-inventory into a single command.
 * 
 * Usage:
 *   npm run db:setup     # Run migration + seed
 *   or
 *   npm run seed        # Run seed only (if database already exists)
 *
 * Safe to re-run — uses INSERT … ON CONFLICT DO UPDATE so it won't duplicate rows.
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import pool from "./db.js";
// Import the single source of truth from the frontend so inventory rows can
// never drift from the product catalogue shown to customers.
import { products, seasonPassProducts } from "../src/data/products.js";

// ===== Admin User Data =====
const adminUsername = process.env.ADMIN_USERNAME || "admin";
const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

// ===== Inventory Data =====
// Default starting stock by pack size. Admins tweak real values via the
// Inventory tab — this is only the first-run / new-product baseline.
const DEFAULT_STOCK_BY_PACK = {
  '6 pcs':   60,
  '12 pcs':  60,
  '24 pcs':  30,
};
const FALLBACK_STOCK = 30;

// Extra non-products.js items that still need inventory rows.
const EXTRA_ROWS = [
  // Curated gift box (used by SignatureBoxPage; not in products.js).
  { product_id: 'signature-box', pack_label: '12 pcs', stock: 30 },
  { product_id: 'signature-box', pack_label: '24 pcs', stock: 20 },
];

function buildInventoryRows() {
  const rows = [];
  for (const p of products) {
    for (const pack of p.packPrices) {
      rows.push({
        product_id: p.id,
        pack_label: pack.label,
        stock: DEFAULT_STOCK_BY_PACK[pack.label] ?? FALLBACK_STOCK,
      });
    }
  }
  // Season-pass items: season_pass_slots tracks real availability, but keep
  // inventory rows generous so the order-create check won't reject subscriptions.
  for (const p of seasonPassProducts || []) {
    for (const pack of p.packPrices) {
      rows.push({ product_id: p.id, pack_label: pack.label, stock: 100 });
    }
  }
  return [...rows, ...EXTRA_ROWS];
}

const inventoryRows = buildInventoryRows();

async function seedAdmin() {
  const hash = await bcrypt.hash(adminPassword, 10);
  await pool.query(
    `INSERT INTO admin_users (username, password_hash)
     VALUES ($1, $2)
     ON CONFLICT (username) DO UPDATE SET password_hash = $2`,
    [adminUsername, hash]
  );
  console.log(`✅ Admin user '${adminUsername}' created/updated.`);
}

async function seedInventory() {
  let inserted = 0;
  let skipped = 0;
  for (const row of inventoryRows) {
    // DO NOTHING on conflict so re-running seed never overwrites admin edits.
    // Use the Inventory admin tab to adjust stock going forward.
    const result = await pool.query(
      `INSERT INTO inventory (product_id, pack_label, stock)
       VALUES ($1, $2, $3)
       ON CONFLICT (product_id, pack_label) DO NOTHING`,
      [row.product_id, row.pack_label, row.stock]
    );
    if (result.rowCount > 0) inserted++; else skipped++;
  }
  console.log(
    `✅ Inventory seed: inserted ${inserted} new row(s), ` +
    `${skipped} already present (left untouched).`
  );
}

async function seedSeasonPassSlots() {
  // Only insert if this year doesn't already have a row — don't stomp edits.
  await pool.query(
    `INSERT INTO season_pass_slots (season_year, total, claimed)
     VALUES (2026, 18, 11)
     ON CONFLICT (season_year) DO NOTHING`
  );
  console.log("✅ Season-pass slots (2026) seeded.");
}

async function seed() {
  const client = await pool.connect();
  try {
    console.log("Starting seed process...");

    // Seed admin user
    await seedAdmin();

    // Seed inventory
    await seedInventory();

    // Seed season-pass slot counts
    await seedSeasonPassSlots();

    console.log("\n🎉 Seed completed successfully!");
    console.log("   - Admin credentials:", adminUsername, "/", adminPassword);
    console.log("   - Inventory items:", inventoryRows.length, "rows");
    console.log("\n   IMPORTANT: Change the default password in production via ADMIN_PASSWORD env var.");
  } catch (err) {
    console.error("Seed failed:", err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});