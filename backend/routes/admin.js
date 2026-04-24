import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "change-me-in-production";

// POST /api/admin/login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "username and password required" });
  }
  try {
    const { rows } = await pool.query(
      "SELECT * FROM admin_users WHERE username = $1",
      [username]
    );
    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const valid = await bcrypt.compare(password, rows[0].password_hash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: rows[0].id, username: rows[0].username },
      JWT_SECRET,
      { expiresIn: "24h" }
    );
    res.json({ token, username: rows[0].username });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/admin/stats
router.get("/stats", requireAdmin, async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        COUNT(*)                                                    AS total_orders,
        COUNT(*) FILTER (WHERE status = 'paid')                    AS paid_orders,
        COUNT(*) FILTER (WHERE status = 'pending')                 AS pending_orders,
        COUNT(*) FILTER (WHERE status = 'shipped')                 AS shipped_orders,
        COUNT(*) FILTER (WHERE status = 'delivered')               AS delivered_orders,
        COALESCE(SUM(amount) FILTER (WHERE status = 'paid'), 0)    AS total_revenue
      FROM orders
    `);
    const s = rows[0];
    res.json({
      totalOrders: parseInt(s.total_orders),
      paidOrders: parseInt(s.paid_orders),
      pendingOrders: parseInt(s.pending_orders),
      shippedOrders: parseInt(s.shipped_orders),
      deliveredOrders: parseInt(s.delivered_orders),
      totalRevenue: parseInt(s.total_revenue), // in paise
    });
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/admin/orders?page=1&limit=20&status=paid
router.get("/orders", requireAdmin, async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, parseInt(req.query.limit) || 20);
  const offset = (page - 1) * limit;
  const { status } = req.query;

  try {
    const whereClause = status ? "WHERE status = $3" : "";
    const params = status ? [limit, offset, status] : [limit, offset];

    const { rows } = await pool.query(
      `SELECT * FROM orders ${whereClause} ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
      params
    );

    const countParams = status ? [status] : [];
    const countWhere = status ? "WHERE status = $1" : "";
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM orders ${countWhere}`,
      countParams
    );

    res.json({
      orders: rows,
      total: parseInt(countResult.rows[0].count),
      page,
      limit,
    });
  } catch (err) {
    console.error("Orders fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/admin/orders/:id
router.get("/orders/:id", requireAdmin, async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM orders WHERE id = $1", [
      req.params.id,
    ]);
    if (rows.length === 0)
      return res.status(404).json({ error: "Order not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("Order fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// PATCH /api/admin/orders/:id/status
// If transitioning from paid → cancelled, restore the previously-decremented
// stock so the inventory count stays accurate.
router.patch("/orders/:id/status", requireAdmin, async (req, res) => {
  const { status } = req.body;
  const allowed = ["pending", "paid", "cancelled", "shipped", "delivered"];
  if (!allowed.includes(status)) {
    return res.status(400).json({ error: `status must be one of: ${allowed.join(", ")}` });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { rows: existing } = await client.query(
      `SELECT status, razorpay_order_id FROM orders WHERE id = $1 FOR UPDATE`,
      [req.params.id]
    );
    if (existing.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Order not found" });
    }

    const prevStatus = existing[0].status;
    const rzpOrderId = existing[0].razorpay_order_id;

    // paid → cancelled: return the confirmed reservations back to stock.
    if (prevStatus === "paid" && status === "cancelled") {
      const { rows: confirmed } = await client.query(
        `SELECT product_id, pack_label, qty
           FROM inventory_reservations
          WHERE razorpay_order_id = $1 AND status = 'confirmed'`,
        [rzpOrderId]
      );
      for (const r of confirmed) {
        await client.query(
          `UPDATE inventory SET stock = stock + $1, updated_at = NOW()
            WHERE product_id = $2 AND pack_label = $3`,
          [r.qty, r.product_id, r.pack_label]
        );
      }
      await client.query(
        `UPDATE inventory_reservations SET status = 'released'
          WHERE razorpay_order_id = $1 AND status = 'confirmed'`,
        [rzpOrderId]
      );
    }

    const { rows } = await client.query(
      `UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [status, req.params.id]
    );

    await client.query("COMMIT");
    res.json(rows[0]);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Order status update error:", err);
    res.status(500).json({ error: "Server error" });
  } finally {
    client.release();
  }
});

// GET /api/admin/inventory
router.get("/inventory", requireAdmin, async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM inventory ORDER BY product_id"
    );
    res.json(rows);
  } catch (err) {
    console.error("Inventory fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/admin/inventory
// Body: { product_id, pack_label, stock }
// Inventory is keyed by (product_id, pack_label), so both are required.
router.put("/inventory", requireAdmin, async (req, res) => {
  const { product_id, pack_label, stock } = req.body;
  if (!product_id || !pack_label) {
    return res.status(400).json({ error: "product_id and pack_label are required" });
  }
  if (typeof stock !== "number" || stock < 0 || !Number.isInteger(stock)) {
    return res.status(400).json({ error: "stock must be a non-negative integer" });
  }
  try {
    const { rows } = await pool.query(
      `UPDATE inventory
         SET stock = $1, updated_at = NOW()
       WHERE product_id = $2 AND pack_label = $3
       RETURNING *`,
      [stock, product_id, pack_label]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Product/pack not found in inventory" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("Inventory update error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ── Season Pass slot admin ────────────────────────────────────────────────
// GET /api/admin/season-pass/slots — list every season's row (history view).
router.get("/season-pass/slots", requireAdmin, async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT season_year, total, claimed, updated_at
         FROM season_pass_slots
        ORDER BY season_year DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error("Admin slots fetch failed:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/admin/season-pass/slots — upsert for a given season_year.
// Body: { season_year, total, claimed }. Either value can be updated alone.
router.put("/season-pass/slots", requireAdmin, async (req, res) => {
  const { season_year, total, claimed } = req.body || {};
  const year = parseInt(season_year, 10);
  const totalInt = parseInt(total, 10);
  const claimedInt = parseInt(claimed, 10);

  if (!Number.isInteger(year) || year < 2000 || year > 2100) {
    return res.status(400).json({ error: "season_year must be a valid year" });
  }
  if (!Number.isInteger(totalInt) || totalInt < 0) {
    return res.status(400).json({ error: "total must be a non-negative integer" });
  }
  if (!Number.isInteger(claimedInt) || claimedInt < 0) {
    return res.status(400).json({ error: "claimed must be a non-negative integer" });
  }
  if (claimedInt > totalInt) {
    return res.status(400).json({ error: "claimed cannot exceed total" });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO season_pass_slots (season_year, total, claimed, updated_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (season_year) DO UPDATE
         SET total = EXCLUDED.total,
             claimed = EXCLUDED.claimed,
             updated_at = NOW()
       RETURNING season_year, total, claimed, updated_at`,
      [year, totalInt, claimedInt]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error("Admin slots update failed:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
