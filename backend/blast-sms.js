/**
 * One-time SMS blast to all paid orders.
 * Run: node blast-sms.js
 */
import "dotenv/config";
import pool from "./db.js";
import twilio from "twilio";

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const FROM = process.env.TWILIO_PHONE_FROM;

const { rows } = await pool.query(
  `SELECT DISTINCT ON (customer_contact)
     customer_name, customer_contact
   FROM orders
   WHERE status = 'paid'
     AND customer_contact IS NOT NULL
   ORDER BY customer_contact, created_at DESC`
);

console.log(`Sending to ${rows.length} customers...`);

for (const row of rows) {
  const firstName = (row.customer_name || 'Friend').split(' ')[0];
  const to = `+91${row.customer_contact}`;

  const body = `Hi ${firstName}! 🥭 Your Aamrutham order is confirmed!\n\nOur mangoes are ripening on the trees in Bobbili — harvested only when fully ripe, never early.\n\nWe'll start delivering from 10th May. You'll hear from us before your delivery with the exact date.\n\nThank you for trusting us with your first box. We can't wait for you to taste the difference.\n\n— Team Aamrutham`;

  try {
    await client.messages.create({ from: FROM, to, body });
    console.log(`✅ Sent to ${firstName} (${to})`);
  } catch (err) {
    console.error(`❌ Failed for ${to}: ${err.message}`);
  }

  // Small delay to avoid Twilio rate limits
  await new Promise(r => setTimeout(r, 300));
}

console.log('Done.');
await pool.end();
