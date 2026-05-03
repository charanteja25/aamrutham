/**
 * One-time patch: inserts missing inventory rows.
 * Safe to re-run — uses ON CONFLICT DO NOTHING.
 * Run with: npm run patch-inventory
 */
import "dotenv/config";
import pool from "./db.js";

const MISSING_ROWS = [
  // panduri, suvarnarekha, banganapalli, chinna-rasalu, pedda-rasalu
  // were seeded with only 12 pcs — adding 6 pcs and 18 pcs
  { product_id: 'panduri-mavidi',   pack_label: '6 pcs',  stock: 60 },
  { product_id: 'panduri-mavidi',   pack_label: '18 pcs', stock: 30 },
  { product_id: 'suvarnarekha',     pack_label: '6 pcs',  stock: 60 },
  { product_id: 'suvarnarekha',     pack_label: '18 pcs', stock: 30 },
  { product_id: 'banganapalli',     pack_label: '6 pcs',  stock: 60 },
  { product_id: 'banganapalli',     pack_label: '18 pcs', stock: 30 },
  { product_id: 'chinna-rasalu',    pack_label: '6 pcs',  stock: 60 },
  { product_id: 'chinna-rasalu',    pack_label: '18 pcs', stock: 30 },
  { product_id: 'pedda-rasalu',     pack_label: '6 pcs',  stock: 60 },
  { product_id: 'pedda-rasalu',     pack_label: '18 pcs', stock: 30 },

  // rajula-mamidi, cheruku-rasalu, children-mango-pack — fully missing
  { product_id: 'rajula-mamidi',    pack_label: '6 pcs',  stock: 60 },
  { product_id: 'rajula-mamidi',    pack_label: '12 pcs', stock: 60 },
  { product_id: 'rajula-mamidi',    pack_label: '18 pcs', stock: 30 },
  { product_id: 'cheruku-rasalu',   pack_label: '6 pcs',  stock: 60 },
  { product_id: 'cheruku-rasalu',   pack_label: '12 pcs', stock: 60 },
  { product_id: 'cheruku-rasalu',   pack_label: '18 pcs', stock: 30 },
  { product_id: 'children-mango-pack', pack_label: '6 pcs',  stock: 60 },
  { product_id: 'children-mango-pack', pack_label: '12 pcs', stock: 60 },
  { product_id: 'children-mango-pack', pack_label: '18 pcs', stock: 30 },
];

async function patch() {
  let inserted = 0;
  let skipped  = 0;

  for (const row of MISSING_ROWS) {
    const result = await pool.query(
      `INSERT INTO inventory (product_id, pack_label, stock)
       VALUES ($1, $2, $3)
       ON CONFLICT (product_id, pack_label) DO NOTHING`,
      [row.product_id, row.pack_label, row.stock]
    );
    if (result.rowCount > 0) { inserted++; console.log(`  ✅ inserted  ${row.product_id} / ${row.pack_label}`); }
    else                      { skipped++;  console.log(`  ⏭  exists   ${row.product_id} / ${row.pack_label}`); }
  }

  console.log(`\nDone — ${inserted} inserted, ${skipped} already present.`);
  await pool.end();
}

patch().catch((err) => { console.error(err); process.exit(1); });
