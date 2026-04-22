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

// ===== Admin User Data =====
const adminUsername = process.env.ADMIN_USERNAME || "admin";
const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

// ===== Inventory Data =====
const inventoryRows = [
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

  // ── More varieties (12 pcs only) ───────────────────────────────────────
  { product_id: 'suvarnarekha',   pack_label: '12 pcs', stock: 60 },
  { product_id: 'banganapalli',   pack_label: '12 pcs', stock: 80 },
  { product_id: 'chinna-rasalu',  pack_label: '12 pcs', stock: 60 },
  { product_id: 'pedda-rasalu',   pack_label: '12 pcs', stock: 60 },
  { product_id: 'panduri-mavidi', pack_label: '12 pcs', stock: 50 },
  { product_id: 'children-pack',  pack_label: '6 pcs', stock: 50 },
];

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
  for (const row of inventoryRows) {
    await pool.query(
      `INSERT INTO inventory (product_id, pack_label, stock)
       VALUES ($1, $2, $3)
       ON CONFLICT (product_id, pack_label)
       DO UPDATE SET stock = EXCLUDED.stock`,
      [row.product_id, row.pack_label, row.stock]
    );
  }
  console.log(`✅ Seeded ${inventoryRows.length} inventory rows.`);
}

async function seed() {
  const client = await pool.connect();
  try {
    console.log("Starting seed process...");
    
    // Seed admin user
    await seedAdmin();
    
    // Seed inventory
    await seedInventory();
    
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