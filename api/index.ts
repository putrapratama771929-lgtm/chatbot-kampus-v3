/* ============================================
   API/INDEX.TS — Vercel Serverless Function
   Wraps the Express app for Vercel deployment
   ============================================ */

import { createApp } from "../server/src/app.js";

const app = createApp();

export default app;
