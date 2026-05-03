/**
 * POST /api/order-history/send-otp
 *   Body: { identifier }  — phone (10 digits) OR email address
 *   Phone  → OTP via WhatsApp (Twilio)
 *   Email  → OTP via email (Resend)
 *
 * POST /api/order-history/verify-otp
 *   Body: { identifier, otp }
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

function isEmail(val) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
}

function cleanPhone(val) {
  return String(val).replace(/\D/g, "").slice(-10);
}

function maskEmail(email) {
  const [user, domain] = email.split("@");
  return user.slice(0, 2) + "***@" + domain;
}

// ── Send OTP ────────────────────────────────────────────────────────────────
router.post("/send-otp", async (req, res) => {
  const raw = (req.body.identifier || "").trim();
  if (!raw) return res.status(400).json({ error: "Enter your mobile number or email." });

  const byEmail = isEmail(raw);
  const identifier = byEmail ? raw.toLowerCase() : cleanPhone(raw);

  if (!byEmail && identifier.length !== 10) {
    return res.status(400).json({ error: "Enter a valid 10-digit mobile number or email." });
  }

  // Rate limit: 1 OTP per identifier per 60 seconds
  const { rows: recent } = await pool.query(
    `SELECT id FROM otp_requests
     WHERE contact = $1 AND created_at > NOW() - INTERVAL '60 seconds'
     LIMIT 1`,
    [identifier]
  );
  if (recent.length > 0) {
    return res.status(429).json({ error: "Please wait 60 seconds before requesting another code." });
  }

  const otp = crypto.randomInt(100000, 999999).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await pool.query(
    `INSERT INTO otp_requests (contact, otp, expires_at) VALUES ($1, $2, $3)`,
    [identifier, otp, expiresAt]
  );

  if (byEmail) {
    try {
      await sendOtpEmail({ to: identifier, otp });
    } catch (err) {
      console.error("Email OTP failed:", err.message);
      return res.status(500).json({ error: "Failed to send email. Please try again." });
    }
    return res.json({ sent: true, channel: "email", maskedEmail: maskEmail(identifier) });
  }

  // WhatsApp via Twilio
  if (!process.env.TWILIO_ACCOUNT_SID) {
    return res.status(503).json({ error: "WhatsApp OTP is not configured yet. Please use your email instead." });
  }
  try {
    await getTwilio().messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to:   `whatsapp:+91${identifier}`,
      body: `Your Aamrutham order history code is: *${otp}*\n\nValid for 10 minutes. Do not share this code.`,
    });
  } catch (err) {
    console.error("WhatsApp OTP failed:", err.message);
    return res.status(500).json({ error: "Failed to send WhatsApp message. Please try again." });
  }

  res.json({ sent: true, channel: "whatsapp" });
});

// ── Verify OTP ──────────────────────────────────────────────────────────────
router.post("/verify-otp", async (req, res) => {
  const raw = (req.body.identifier || "").trim();
  const otp  = String(req.body.otp || "").trim();
  if (!raw || !otp) return res.status(400).json({ error: "identifier and otp are required" });

  const byEmail  = isEmail(raw);
  const identifier = byEmail ? raw.toLowerCase() : cleanPhone(raw);

  const { rows } = await pool.query(
    `SELECT id FROM otp_requests
     WHERE contact = $1 AND otp = $2 AND expires_at > NOW() AND used = FALSE
     ORDER BY created_at DESC LIMIT 1`,
    [identifier, otp]
  );

  if (rows.length === 0) {
    return res.status(401).json({ error: "Invalid or expired code. Please try again." });
  }

  await pool.query(`UPDATE otp_requests SET used = TRUE WHERE id = $1`, [rows[0].id]);

  // Fetch orders by the matching field
  const { rows: orders } = await pool.query(
    `SELECT
       id, aam_order_id, amount, status, cart_items,
       customer_name, address_city, address_pincode, created_at
     FROM orders
     WHERE ${byEmail ? "customer_email = $1" : "customer_contact = $1"}
       AND status IN ('paid', 'shipped', 'delivered', 'cancelled')
     ORDER BY created_at DESC
     LIMIT 50`,
    [identifier]
  );

  res.json({ orders });
});

export default router;
