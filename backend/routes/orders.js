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
// Reuse the single source of truth from the frontend — pure ESM data module.
import { HYD_PINCODES } from "../../src/data/products.js";

const SERVICEABLE_PINCODES = new Set(HYD_PINCODES);
const isServiceablePincode = (pin) => {
  const n = Number(String(pin).trim());
  return Number.isFinite(n) && SERVICEABLE_PINCODES.has(n);
};

const router = Router();

function getRazorpay() {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

const LOCK_MINUTES = 5;

router.post("/create", async (req, res) => {
  const { amount, cartItems, customer = {} } = req.body;

  if (!amount || !Array.isArray(cartItems) || cartItems.length === 0) {
    return res.status(400).json({ error: "amount and cartItems are required" });
  }

  // Address + contact are mandatory so we can ship the order. These are also
  // prefilled into Razorpay so the customer doesn't retype them.
  const required = ["name", "contact", "address_line1", "city", "state", "pincode"];
  const missing = required.filter((k) => !customer[k] || String(customer[k]).trim() === "");
  if (missing.length) {
    return res.status(400).json({
      error: "Missing customer fields",
      fields: missing,
    });
  }

  if (!/^[0-9]{6}$/.test(String(customer.pincode).trim())) {
    return res.status(400).json({ error: "Pincode must be 6 digits" });
  }
  if (!isServiceablePincode(customer.pincode)) {
    return res.status(400).json({
      error: "Sorry, we currently deliver within Hyderabad only.",
      code: "pincode_not_serviceable",
    });
  }
  if (!/^[0-9]{10}$/.test(String(customer.contact).replace(/\D/g, "").slice(-10))) {
    return res.status(400).json({ error: "Contact must be a 10-digit mobile number" });
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
         (razorpay_order_id, amount, currency, cart_items,
          customer_name, customer_email, customer_contact,
          address_line1, address_line2, address_city, address_state, address_pincode, address_landmark)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
      [
        rzpOrder.id,
        amountPaise,
        "INR",
        JSON.stringify(cartItems),
        customer.name?.trim() || null,
        customer.email?.trim() || null,
        String(customer.contact).replace(/\D/g, "").slice(-10),
        customer.address_line1?.trim() || null,
        customer.address_line2?.trim() || null,
        customer.city?.trim() || null,
        customer.state?.trim() || null,
        String(customer.pincode).trim(),
        customer.landmark?.trim() || null,
      ]
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
