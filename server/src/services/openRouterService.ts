/* ============================================
   SERVICE: OPENROUTER AI
   Calls OpenRouter Chat Completions for AI fallback.
   ============================================ */

import type { BotResponse } from "./intentResolver.js";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = "google/gemini-2.5-flash";
const DEFAULT_TIMEOUT_MS = 12_000;

interface OpenRouterMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface OpenRouterChoice {
  message?: {
    content?: string | null;
  };
  error?: {
    message?: string;
  };
}

interface OpenRouterResponse {
  choices?: OpenRouterChoice[];
  error?: {
    message?: string;
  };
}

export function isAiFallbackEnabled() {
  return process.env.AI_FALLBACK_ENABLED !== "false" && Boolean(process.env.OPENROUTER_API_KEY);
}

export async function askOpenRouter(messages: OpenRouterMessage[]): Promise<BotResponse | null> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey || process.env.AI_FALLBACK_ENABLED === "false") {
    return null;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.OPENROUTER_SITE_URL || process.env.FRONTEND_URL || "",
        "X-OpenRouter-Title": process.env.OPENROUTER_APP_NAME || "Chatbot Kampus",
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || DEFAULT_MODEL,
        messages,
        max_tokens: 450,
        temperature: 0.3,
      }),
    });

    const data = (await response.json().catch(() => null)) as OpenRouterResponse | null;
    if (!response.ok) {
      console.error("OpenRouter request failed:", response.status, data?.error?.message || response.statusText);
      return null;
    }

    const text = data?.choices?.[0]?.message?.content?.trim();
    if (!text) {
      console.error("OpenRouter returned an empty response");
      return null;
    }

    return { type: "text", text };
  } catch (error) {
    if (error instanceof Error) {
      console.error("OpenRouter request error:", error.message);
    } else {
      console.error("OpenRouter request error:", error);
    }
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
