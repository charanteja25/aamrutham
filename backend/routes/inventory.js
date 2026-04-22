/**
 * GET /api/inventory
 * Returns available stock for every product+pack combination.
 * Available = stock − SUM(qty of active, non-expired reservations).
 * Expired reservations are automatically ignored in the query — no cleanup job needed.
 */
import { Router } from "express";
import pool from "../db.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        i.product_id,
        i.pack_label,
        i.stock,
        COALESCE(r.reserved, 0)                   AS reserved,
        GREATEST(0, i.stock - COALESCE(r.reserved, 0)) AS available
      FROM inventory i
      LEFT JOIN (
        SELECT product_id, pack_label, SUM(qty) AS reserved
        FROM   inventory_reservations
        WHERE  status = 'active'
          AND  expires_at > NOW()
        GROUP BY product_id, pack_label
      ) r USING (product_id, pack_label)
      ORDER BY i.product_id, i.pack_label
    `);

    // Shape: { "mettavalasa-peechu|6 pcs": 48, … }
    const map = {};
    for (const row of rows) {
      map[`${row.product_id}|${row.pack_label}`] = Number(row.available);
    }

    res.json({ inventory: map });
  } catch (err) {
    console.error("Inventory fetch failed:", err);
    res.status(500).json({ error: "Failed to fetch inventory" });
  }
});

export default router;
