import "dotenv/config";
import express from "express";
import cors from "cors";
import ordersRouter from "./routes/orders.js";
import paymentsRouter from "./routes/payments.js";
import inventoryRouter from "./routes/inventory.js";
import adminRouter from "./routes/admin.js";
import seasonPassRouter from "./routes/season-pass.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    const allowed = (process.env.FRONTEND_URL || '').split(',').map(s => s.trim());
    if (
      allowed.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      origin === 'http://localhost:5173'
    ) return cb(null, true);
    cb(new Error('CORS: ' + origin + ' not allowed'));
  },
  credentials: true,
}));
app.use(express.json());

app.use("/api/orders", ordersRouter);
app.use("/api/payments", paymentsRouter);
app.use("/api/inventory", inventoryRouter);
app.use("/api/admin", adminRouter);
app.use("/api/season-pass", seasonPassRouter);

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
