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
router.patch("/orders/:id/status", requireAdmin, async (req, res) => {
  const { status } = req.body;
  const allowed = ["pending", "paid", "cancelled", "shipped", "delivered"];
  if (!allowed.includes(status)) {
    return res
      .status(400)
      .json({ error: `status must be one of: ${allowed.join(", ")}` });
  }
  try {
    const { rows } = await pool.query(
      `UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [status, req.params.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ error: "Order not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("Order status update error:", err);
    res.status(500).json({ error: "Server error" });
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

// PUT /api/admin/inventory/:productId
router.put("/inventory/:productId", requireAdmin, async (req, res) => {
  const { stock } = req.body;
  if (typeof stock !== "number" || stock < 0 || !Number.isInteger(stock)) {
    return res
      .status(400)
      .json({ error: "stock must be a non-negative integer" });
  }
  try {
    const { rows } = await pool.query(
      `UPDATE inventory SET stock = $1, updated_at = NOW() WHERE product_id = $2 RETURNING *`,
      [stock, req.params.productId]
    );
    if (rows.length === 0)
      return res
        .status(404)
        .json({ error: "Product not found in inventory" });
    res.json(rows[0]);
  } catch (err) {
    console.error("Inventory update error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
