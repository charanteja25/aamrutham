/**
 * Public Season Pass endpoints.
 *
 * GET /api/season-pass/slots — returns the current season's slot counts so
 * the MaaS page's scarcity bar renders live data instead of hard-coded values.
 */
import { Router } from "express";
import pool from "../db.js";

const router = Router();

// Pick the season year to show. Defaults to the latest row in the table so
// admins don't have to remember to bump a constant every year.
async function currentSlots() {
  const { rows } = await pool.query(
    `SELECT season_year, total, claimed, updated_at
       FROM season_pass_slots
      ORDER BY season_year DESC
      LIMIT 1`
  );
  return rows[0] || null;
}

router.get("/slots", async (_req, res) => {
  try {
    const row = await currentSlots();
    if (!row) {
      return res.json({ seasonYear: null, total: 0, claimed: 0, available: 0 });
    }
    const available = Math.max(0, Number(row.total) - Number(row.claimed));
    res.json({
      seasonYear: row.season_year,
      total: Number(row.total),
      claimed: Number(row.claimed),
      available,
      updatedAt: row.updated_at,
    });
  } catch (err) {
    console.error("Season-pass slots fetch failed:", err);
    res.status(500).json({ error: "Failed to fetch slots" });
  }
});

export default router;
