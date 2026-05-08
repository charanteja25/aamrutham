## 2026-05-08 - Fixed Overly Permissive CORS Configuration
**Vulnerability:** The backend CORS configuration allowed any origin ending in `.vercel.app`. This is a critical vulnerability because an attacker could create a Vercel app (e.g., `malicious-app.vercel.app`) and bypass the CORS policy to read sensitive data.
**Learning:** Never trust entire Platform-as-a-Service domains (like `.vercel.app`, `.herokuapp.com`) in CORS policies, as any user can register subdomains on them.
**Prevention:** Strictly allow list origins using exact string matching or checking against trusted environment variables like `FRONTEND_URL`.
