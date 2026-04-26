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

/**
 * Match a user message against database intents.
 * Returns the best matching intent + score, or null.
 */
export async function matchIntent(text: string): Promise<MatchResult | null> {
  const lower = text.toLowerCase().trim();
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
