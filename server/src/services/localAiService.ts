/* ============================================
   SERVICE: LOCAL AI — disabled in production
   ============================================ */

import type { BotResponse } from "./intentResolver.js";

export interface OpenRouterMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export function isAiFallbackEnabled() {
  return false;
}

export async function askLocalAi(_messages: OpenRouterMessage[]): Promise<BotResponse | null> {
  console.warn("Local AI is disabled for Vercel deployment. Use OpenRouter API fallback instead.");
  return null;
}
