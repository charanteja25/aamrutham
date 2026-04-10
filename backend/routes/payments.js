import { Router } from "express";
import crypto from "crypto";
import pool from "../db.js";

const router = Router();

// POST /api/payments/verify
// Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature, customer }
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

  try {
    const result = await pool.query(
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
        customer.name || null,
        customer.email || null,
        customer.contact || null,
        razorpay_order_id,
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ success: true, orderId: result.rows[0].id });
  } catch (err) {
    console.error("Payment verification failed:", err);
    res.status(500).json({ error: "Failed to verify payment" });
  }
});

export default router;
