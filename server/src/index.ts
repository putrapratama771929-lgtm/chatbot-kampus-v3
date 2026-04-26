/* ============================================
   INDEX.TS — Express Application Entry Point
   Chatbot Polimdo Backend API
   Express + DrizzleORM + PostgreSQL + Better Auth
   ============================================ */

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { toNodeHandler } from "better-auth/node";
import "dotenv/config";

import { auth } from "./auth.js";
import chatRoutes from "./routes/chat.js";
import knowledgeRoutes from "./routes/knowledge.js";
import adminRoutes from "./routes/admin.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || "3000");

// ==========================================
// MIDDLEWARE
// ==========================================

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5500",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Better Auth handler FIRST (before express.json!)
// Express v5 uses *splat, Express v4 uses *
app.all("/api/auth/{*splat}", toNodeHandler(auth));

// Parse JSON body (AFTER Better Auth handler)
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files from parent directory
app.use(express.static(path.join(__dirname, "..", "..")));

// Request logging
app.use((req, _res, next) => {
  if (req.path.startsWith("/api/")) {
    console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  }
  next();
});

// ==========================================
// ROUTES
// ==========================================

// Chat API
app.use("/api/chat", chatRoutes);

// Public Knowledge Base API
app.use("/api", knowledgeRoutes);

// Admin API (Better Auth protected)
app.use("/api/admin", adminRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ==========================================
// ERROR HANDLING
// ==========================================

// 404 for unknown API routes
app.use("/api/{*splat}", (_req, res) => {
  res.status(404).json({ error: "API endpoint not found" });
});

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// ==========================================
// START SERVER
// ==========================================

console.log("\n🤖 Chatbot Polimdo — Backend API");
console.log("================================");
console.log("   Stack: Express + DrizzleORM + PostgreSQL + Better Auth\n");

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📁 Frontend served from: ${path.join(__dirname, "..", "..")}`);
  console.log(`📡 API base: http://localhost:${PORT}/api`);
  console.log(`🔐 Auth: http://localhost:${PORT}/api/auth/ok`);
  console.log(`\n   Chat:      POST /api/chat/message`);
  console.log(`   Knowledge: GET  /api/jurusan, /api/faq, etc.`);
  console.log(`   Admin:     GET  /api/admin/dashboard`);
  console.log(`   Health:    GET  /api/health\n`);
});
