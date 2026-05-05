import { Router } from "express";
import pool from "../db.js";

const router = Router();

// POST /api/waitlist
router.post("/", async (req, res) => {
  const { name, whatsapp, source } = req.body;

  if (!name?.trim()) return res.status(400).json({ error: "Name is required" });

  const cleaned = String(whatsapp || "").replace(/\D/g, "").slice(-10);
  if (cleaned.length !== 10) return res.status(400).json({ error: "Enter a valid 10-digit WhatsApp number" });

  try {
    await pool.query(
      `INSERT INTO waitlist (name, whatsapp, source) VALUES ($1, $2, $3)`,
      [name.trim(), cleaned, source?.trim() || null]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error("Waitlist insert failed:", err.message);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

export default router;
