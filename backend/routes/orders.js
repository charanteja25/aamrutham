/**
 * POST /api/orders/create
 *
 * Body: { amount: number (rupees), cartItems: Array<{ productId, packLabel, qty }> }
 *
 * 1. Check available stock for every cart line (atomic with advisory lock).
 * 2. Create Razorpay order.
 * 3. Insert inventory_reservations rows (5-minute expiry).
 * 4. Insert orders row.
 * 5. Return orderId + lockExpiresAt so the frontend can show a countdown.
 */
import { Router } from "express";
import Razorpay from "razorpay";
import pool from "../db.js";

const router = Router();

function getRazorpay() {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

const LOCK_MINUTES = 5;

router.post("/create", async (req, res) => {
  const { amount, cartItems } = req.body;

  if (!amount || !Array.isArray(cartItems) || cartItems.length === 0) {
    return res.status(400).json({ error: "amount and cartItems are required" });
  }

  const amountPaise = Math.round(amount * 100);
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // ── 1. Check stock for every line ──────────────────────────────────────
    for (const item of cartItems) {
      const { productId, packLabel, qty = 1 } = item;

      await client.query(
        `SELECT stock FROM inventory WHERE product_id = $1 AND pack_label = $2 FOR UPDATE`,
        [productId, packLabel]
      );

      const { rows } = await client.query(
        `SELECT
           i.stock,
           COALESCE(SUM(r.qty) FILTER (
             WHERE r.status = 'active' AND r.expires_at > NOW()
           ), 0) AS reserved
         FROM inventory i
         LEFT JOIN inventory_reservations r
           ON r.product_id = i.product_id AND r.pack_label = i.pack_label
         WHERE i.product_id = $1 AND i.pack_label = $2
         GROUP BY i.stock`,
        [productId, packLabel]
      );

      if (rows.length === 0) {
        await client.query("ROLLBACK");
        return res.status(400).json({
          error: `Product not found: ${productId} / ${packLabel}`,
        });
      }

      const available = Number(rows[0].stock) - Number(rows[0].reserved);

      if (available < qty) {
        await client.query("ROLLBACK");
        return res.status(409).json({
          error: "insufficient_stock",
          productId,
          packLabel,
          available,
          requested: qty,
        });
      }
    }

    // ── 2. Create Razorpay order ────────────────────────────────────────────
    let rzpOrder;
    try {
      rzpOrder = await getRazorpay().orders.create({
        amount: amountPaise,
        currency: "INR",
        receipt: `rcpt_${Date.now()}`,
      });
    } catch (rzpErr) {
      await client.query("ROLLBACK");
      console.error("Razorpay order creation failed:", rzpErr);
      return res.status(500).json({ error: "Failed to create payment order" });
    }

    const expiresAt = new Date(Date.now() + LOCK_MINUTES * 60 * 1000);

    // ── 3. Insert reservations ──────────────────────────────────────────────
    for (const item of cartItems) {
      const { productId, packLabel, qty = 1 } = item;
      await client.query(
        `INSERT INTO inventory_reservations
           (razorpay_order_id, product_id, pack_label, qty, expires_at, status)
         VALUES ($1, $2, $3, $4, $5, 'active')`,
        [rzpOrder.id, productId, packLabel, qty, expiresAt]
      );
    }

    // ── 4. Insert orders row ────────────────────────────────────────────────
    await client.query(
      `INSERT INTO orders
         (razorpay_order_id, amount, currency, cart_items)
       VALUES ($1, $2, $3, $4)`,
      [rzpOrder.id, amountPaise, "INR", JSON.stringify(cartItems)]
    );

    await client.query("COMMIT");

    res.json({
      orderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      lockExpiresAt: expiresAt.toISOString(),
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Order creation failed:", err);
    res.status(500).json({ error: "Failed to create order" });
  } finally {
    client.release();
  }
});

export default router;
