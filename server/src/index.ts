/* ============================================
   INDEX.TS — Express Application Entry Point
   Chatbot Polimdo Backend API
   Express + DrizzleORM + PostgreSQL + Better Auth
   ============================================ */

import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

import { createApp } from "./app.js";
import express from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = createApp();
const PORT = parseInt(process.env.PORT || "3000");

// Serve static frontend files from parent directory (local dev only)
app.use(express.static(path.join(__dirname, "..", "..")));

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
