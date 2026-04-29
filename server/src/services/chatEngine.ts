/* ============================================
   SERVICE: CHAT ENGINE — Server-Side Keyword Matching
   Ported from frontend chatEngine.js
   ============================================ */

import * as intentsService from "./intentsService.js";
import type { Intent } from "../db/schema.js";

// In-memory cache for intents (refreshed every 60s)
let cachedIntents: Intent[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60_000;

async function getIntents(): Promise<Intent[]> {
  const now = Date.now();
  if (!cachedIntents || now - cacheTimestamp > CACHE_TTL) {
    cachedIntents = await intentsService.getAllActive();
    cacheTimestamp = now;
  }
  return cachedIntents;
}

/** Force refresh after admin edits */
export function invalidateCache() {
  cachedIntents = null;
  cacheTimestamp = 0;
}

export interface MatchResult {
  intent: Intent;
  score: number;
}

const COMPETITOR_UNIVERSITIES = [
  "samratulangi", "sam ratulangi", "unsrat", 
  "unima", "universitas negeri manado",
  "ugm", "ui", "itb", "ipb", "unpad", "brawijaya", "undip", "unhas",
  "universitas lain", "kampus lain", "universitas terbuka", "ut",
  "binus", "telkom"
];

/**
 * Match a user message against database intents.
 * Returns the best matching intent + score, or null.
 */
export async function matchIntent(text: string): Promise<MatchResult | null> {
  const lower = text.toLowerCase().trim();

  // Bypass keyword matching if user is asking about other universities
  // This forces the request to go to the AI fallback which can handle out-of-scope rejections politely
  for (const comp of COMPETITOR_UNIVERSITIES) {
    if (lower.includes(comp)) {
      return null;
    }
  }

  const allIntents = await getIntents();

  let bestIntent: Intent | null = null;
  let bestScore = 0;

  for (const intent of allIntents) {
    // Check exact matches first
    const exactMatches = intent.exactMatch as string[] | null;
    if (exactMatches && Array.isArray(exactMatches)) {
      for (const exact of exactMatches) {
        if (lower === exact) {
          return { intent, score: 100 };
        }
      }
    }

    // Score by keyword substring match (longer keyword = higher score)
    let score = 0;
    const keywords = intent.keywords as string[];
    if (keywords && Array.isArray(keywords)) {
      for (const keyword of keywords) {
        if (lower.indexOf(keyword) !== -1) {
          score += keyword.length;
        }
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestIntent = intent;
    }
  }

  if (bestIntent) {
    return { intent: bestIntent, score: bestScore };
  }

  return null;
}
