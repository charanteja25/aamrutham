import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import ordersRouter from "./routes/orders.js";
import paymentsRouter from "./routes/payments.js";
import inventoryRouter from "./routes/inventory.js";
import adminRouter from "./routes/admin.js";
import seasonPassRouter from "./routes/season-pass.js";
import orderHistoryRouter from "./routes/order-history.js";
import waitlistRouter from "./routes/waitlist.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Secure HTTP headers
app.use(helmet());

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

// General rate limit — 100 requests per minute per IP
app.use(rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
}));

// Stricter limit on sensitive endpoints
const sensitiveLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/orders/create', sensitiveLimit);
app.use('/api/order-history/send-otp', sensitiveLimit);
app.use('/api/admin/login', sensitiveLimit);

app.use("/api/orders", ordersRouter);
app.use("/api/payments", paymentsRouter);
app.use("/api/inventory", inventoryRouter);
app.use("/api/admin", adminRouter);
app.use("/api/season-pass", seasonPassRouter);
app.use("/api/order-history", orderHistoryRouter);
app.use("/api/waitlist", waitlistRouter);

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
