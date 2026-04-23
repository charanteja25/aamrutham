import "dotenv/config";
import express from "express";
import cors from "cors";
import ordersRouter from "./routes/orders.js";
import paymentsRouter from "./routes/payments.js";
import inventoryRouter from "./routes/inventory.js";
import adminRouter from "./routes/admin.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());

app.use("/api/orders", ordersRouter);
app.use("/api/payments", paymentsRouter);
app.use("/api/inventory", inventoryRouter);
app.use("/api/admin", adminRouter);

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
