/**
 * POST /api/order-history/send-otp   — generate & send OTP via WhatsApp
 * POST /api/order-history/verify-otp — verify OTP, return orders
 */
import { Router } from "express";
import crypto from "crypto";
import pool from "../db.js";
import twilio from "twilio";
import { sendOtpEmail } from "../email.js";

const router = Router();

function getTwilio() {
  return twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

function cleanContact(raw) {
  return String(raw).replace(/\D/g, "").slice(-10);
}

function maskEmail(email) {
  const [user, domain] = email.split('@');
  return user.slice(0, 2) + '***@' + domain;
}

// ── Send OTP ────────────────────────────────────────────────────────────────
// Body: { contact, channel: 'whatsapp' | 'email' }
router.post("/send-otp", async (req, res) => {
  const { contact, channel = 'whatsapp' } = req.body;
  if (!contact) return res.status(400).json({ error: "contact is required" });

  const digits = cleanContact(contact);
  if (digits.length !== 10) {
    return res.status(400).json({ error: "Enter a valid 10-digit mobile number" });
  }

  // For email channel, look up the address on file
  let emailAddress = null;
  if (channel === 'email') {
    const { rows } = await pool.query(
      `SELECT customer_email FROM orders
       WHERE customer_contact = $1 AND customer_email IS NOT NULL
       ORDER BY created_at DESC LIMIT 1`,
      [digits]
    );
    if (rows.length === 0 || !rows[0].customer_email) {
      return res.status(404).json({ error: "No email address found for this number. Try WhatsApp instead." });
    }
    emailAddress = rows[0].customer_email;
  }

  // Rate limit: 1 OTP per number per 60 seconds
  const { rows: recent } = await pool.query(
    `SELECT id FROM otp_requests
     WHERE contact = $1 AND created_at > NOW() - INTERVAL '60 seconds'
     LIMIT 1`,
    [digits]
  );
  if (recent.length > 0) {
    return res.status(429).json({ error: "Please wait 60 seconds before requesting another code." });
  }

  const otp = crypto.randomInt(100000, 999999).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await pool.query(
    `INSERT INTO otp_requests (contact, otp, expires_at) VALUES ($1, $2, $3)`,
    [digits, otp, expiresAt]
  );

  if (channel === 'email') {
    try {
      await sendOtpEmail({ to: emailAddress, otp });
    } catch (err) {
      console.error("Email OTP send failed:", err.message);
      return res.status(500).json({ error: "Failed to send email. Please try WhatsApp instead." });
    }
    return res.json({ sent: true, channel: 'email', maskedEmail: maskEmail(emailAddress) });
  }

  // WhatsApp
  try {
    await getTwilio().messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to:   `whatsapp:+91${digits}`,
      body: `Your Aamrutham order history code is: *${otp}*\n\nValid for 10 minutes. Do not share this code.`,
    });
  } catch (err) {
    console.error("WhatsApp OTP send failed:", err.message);
    return res.status(500).json({ error: "Failed to send WhatsApp message. Please try again." });
  }

  res.json({ sent: true, channel: 'whatsapp' });
});

// ── Verify OTP + return orders ──────────────────────────────────────────────
router.post("/verify-otp", async (req, res) => {
  const { contact, otp } = req.body;
  if (!contact || !otp) return res.status(400).json({ error: "contact and otp are required" });

  const digits = cleanContact(contact);

  const { rows } = await pool.query(
    `SELECT id FROM otp_requests
     WHERE contact = $1
       AND otp = $2
       AND expires_at > NOW()
       AND used = FALSE
     ORDER BY created_at DESC
     LIMIT 1`,
    [digits, String(otp).trim()]
  );

  if (rows.length === 0) {
    return res.status(401).json({ error: "Invalid or expired code. Please try again." });
  }

  // Mark used so it can't be replayed
  await pool.query(`UPDATE otp_requests SET used = TRUE WHERE id = $1`, [rows[0].id]);

  const { rows: orders } = await pool.query(
    `SELECT
       id, aam_order_id, amount, status, cart_items,
       customer_name, address_city, address_pincode,
       created_at
     FROM orders
     WHERE customer_contact = $1
       AND status IN ('paid', 'shipped', 'delivered', 'cancelled')
     ORDER BY created_at DESC
     LIMIT 50`,
    [digits]
  );

  res.json({ orders });
});

export default router;
