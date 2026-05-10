/**
 * WhatsApp blast to stall contacts from CSV via MSG91.
 * Run: node blast-sms.js /path/to/contacts.csv
 * CSV format: Phone Number, Name, Time
 */
import "dotenv/config";
import fs from "fs";
import { sendBlastWhatsApp } from "./msg91.js";

const CSV = process.argv[2] || "/Users/charanteja/Downloads/Aamrutham_Contacts - Sheet1.csv";

const lines = fs.readFileSync(CSV, "utf8").trim().split("\n").slice(1);

const contacts = lines
  .map(line => {
    const [phone, name] = line.split(",");
    return { phone: phone?.trim(), name: name?.trim() };
  })
  .filter(c => /^[0-9]{10}$/.test(c.phone));

console.log(`Sending to ${contacts.length} contacts...`);

for (const { phone, name } of contacts) {
  const firstName = (name || "Friend").split(" ")[0];
  try {
    await sendBlastWhatsApp({ phone, firstName });
    console.log(`✅ ${firstName} (${phone})`);
  } catch (err) {
    console.error(`❌ ${phone}: ${err.message}`);
  }
  await new Promise(r => setTimeout(r, 300));
}

console.log("Done.");
