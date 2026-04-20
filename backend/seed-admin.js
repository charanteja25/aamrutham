import "dotenv/config";
import bcrypt from "bcryptjs";
import pool from "./db.js";

const username = process.env.ADMIN_USERNAME || "admin";
const password = process.env.ADMIN_PASSWORD || "admin123";

async function seedAdmin() {
  const hash = await bcrypt.hash(password, 10);
  await pool.query(
    `INSERT INTO admin_users (username, password_hash)
     VALUES ($1, $2)
     ON CONFLICT (username) DO UPDATE SET password_hash = $2`,
    [username, hash]
  );
  console.log(`Admin user '${username}' created/updated.`);
  console.log("IMPORTANT: Change the default password in production via ADMIN_PASSWORD env var.");
  await pool.end();
}

seedAdmin().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
