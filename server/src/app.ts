/* ============================================
   APP.TS — Express Application Setup
   Shared between local dev and Vercel Serverless
   ============================================ */

import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";

import { auth } from "./auth.js";
import chatRoutes from "./routes/chat.js";
import knowledgeRoutes from "./routes/knowledge.js";
import adminRoutes from "./routes/admin.js";

export function createApp() {
  const app = express();

  // ==========================================
  // MIDDLEWARE
  // ==========================================

  // CORS — allow both production and dev origins
  const allowedOrigins = [
    process.env.FRONTEND_URL || "http://localhost:5500",
    "https://chatbot-kampus-v3.vercel.app",
  ].filter(Boolean);

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);
        if (allowedOrigins.some((o) => origin.startsWith(o))) {
          return callback(null, true);
        }
        callback(null, true); // permissive for now
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  // Better Auth handler FIRST (before express.json!)
  // Express v5 uses *splat, Express v4 uses *
  app.all("/api/auth/{*splat}", toNodeHandler(auth));

  // Parse JSON body (AFTER Better Auth handler)
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));

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
  app.use(
    (
      err: Error,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction
    ) => {
      console.error("Unhandled error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  );

  return app;
}
