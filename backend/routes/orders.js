import { Router } from "express";
import Razorpay from "razorpay";
import pool from "../db.js";

const router = Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /api/orders/create
// Body: { amount: number (rupees), cartItems: array }
router.post("/create", async (req, res) => {
  const { amount, cartItems } = req.body;

  if (!amount || !Array.isArray(cartItems) || cartItems.length === 0) {
    return res.status(400).json({ error: "amount and cartItems are required" });
  }

  const amountPaise = Math.round(amount * 100);

  try {
    const rzpOrder = await razorpay.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });

    await pool.query(
      `INSERT INTO orders
         (razorpay_order_id, amount, currency, cart_items)
       VALUES ($1, $2, $3, $4)`,
      [rzpOrder.id, amountPaise, "INR", JSON.stringify(cartItems)]
    );

    res.json({
      orderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("Order creation failed:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

export default router;
