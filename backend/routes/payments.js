/**
 * POST /api/payments/verify  — verify Razorpay signature, confirm reservation, decrement stock
 * POST /api/payments/release — immediately release reservation on payment failure / modal dismiss
 */
import { Router } from "express";
import crypto from "crypto";
import pool from "../db.js";

const router = Router();

// ── Verify ─────────────────────────────────────────────────────────────────
router.post("/verify", async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    customer = {},
  } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: "Missing payment fields" });
  }

  // Verify HMAC signature
  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ error: "Invalid payment signature" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Mark order as paid
    const orderResult = await client.query(
      `UPDATE orders
       SET status              = 'paid',
           razorpay_payment_id = $1,
           customer_name       = $2,
           customer_email      = $3,
           customer_contact    = $4,
           updated_at          = NOW()
       WHERE razorpay_order_id = $5
       RETURNING id`,
      [
        razorpay_payment_id,
        customer.name    || null,
        customer.email   || null,
        customer.contact || null,
        razorpay_order_id,
      ]
    );

    if (orderResult.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Order not found" });
    }

    // Fetch active reservations for this order
    const { rows: reservations } = await client.query(
      `SELECT id, product_id, pack_label, qty
       FROM inventory_reservations
       WHERE razorpay_order_id = $1 AND status = 'active'`,
      [razorpay_order_id]
    );

    for (const r of reservations) {
      // Decrement base stock (floor at 0 — shouldn't go below, but safety first)
      await client.query(
        `UPDATE inventory
         SET stock = GREATEST(0, stock - $1)
         WHERE product_id = $2 AND pack_label = $3`,
        [r.qty, r.product_id, r.pack_label]
      );

      // Mark reservation as confirmed
      await client.query(
        `UPDATE inventory_reservations SET status = 'confirmed' WHERE id = $1`,
        [r.id]
      );
    }

    await client.query("COMMIT");
    res.json({ success: true, orderId: orderResult.rows[0].id });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Payment verification failed:", err);
    res.status(500).json({ error: "Failed to verify payment" });
  } finally {
    client.release();
  }
});

// ── Release ────────────────────────────────────────────────────────────────
// Called by the frontend when the user closes the Razorpay modal or payment fails
router.post("/release", async (req, res) => {
  const { razorpay_order_id } = req.body;

  if (!razorpay_order_id) {
    return res.status(400).json({ error: "razorpay_order_id is required" });
  }

  try {
    const result = await pool.query(
      `UPDATE inventory_reservations
       SET status = 'released'
       WHERE razorpay_order_id = $1 AND status = 'active'
       RETURNING id`,
      [razorpay_order_id]
    );

    res.json({ released: result.rowCount });
  } catch (err) {
    console.error("Reservation release failed:", err);
    res.status(500).json({ error: "Failed to release reservation" });
  }
});

export default router;
