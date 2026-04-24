import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "change-me-in-production";

// Hard-fail at startup if the default secret would be used in production.
// Anyone with the source could forge admin tokens otherwise.
if (process.env.NODE_ENV === "production" && JWT_SECRET === "change-me-in-production") {
  throw new Error(
    "JWT_SECRET is not set in production. Refusing to start with default value."
  );
}

export function requireAdmin(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = auth.slice(7);
  try {
    req.admin = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
