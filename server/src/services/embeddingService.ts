/* ============================================
   SERVICE: EMBEDDINGS — OpenRouter Embeddings API
   ============================================ */

const OPENROUTER_EMBEDDINGS_URL = "https://openrouter.ai/api/v1/embeddings";
const DEFAULT_EMBEDDING_MODEL = "openai/text-embedding-3-small";
const DEFAULT_TIMEOUT_MS = 20_000;
export const EMBEDDING_DIMENSIONS = 1536;

interface OpenRouterEmbeddingItem {
  embedding?: number[];
  index?: number;
}

interface OpenRouterEmbeddingsResponse {
  data?: OpenRouterEmbeddingItem[];
  error?: {
    message?: string;
  };
}

export function isEmbeddingEnabled() {
  return Boolean(process.env.OPENROUTER_API_KEY);
}

export async function embedTexts(texts: string[]): Promise<number[][] | null> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey || texts.length === 0) {
    return null;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const response = await fetch(OPENROUTER_EMBEDDINGS_URL, {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.OPENROUTER_SITE_URL || process.env.FRONTEND_URL || "",
        "X-OpenRouter-Title": process.env.OPENROUTER_APP_NAME || "Chatbot Kampus",
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_EMBEDDING_MODEL || DEFAULT_EMBEDDING_MODEL,
        input: texts,
      }),
    });

    const data = (await response.json().catch(() => null)) as OpenRouterEmbeddingsResponse | null;
    if (!response.ok) {
      console.error("OpenRouter embeddings request failed:", response.status, data?.error?.message || response.statusText);
      return null;
    }

    const embeddings = data?.data
      ?.slice()
      .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
      .map((item) => item.embedding);

    if (!embeddings || embeddings.length !== texts.length || embeddings.some((item) => !isValidEmbedding(item))) {
      console.error("OpenRouter embeddings returned invalid dimensions or empty data");
      return null;
    }

    return embeddings as number[][];
  } catch (error) {
    if (error instanceof Error) {
      console.error("OpenRouter embeddings request error:", error.message);
    } else {
      console.error("OpenRouter embeddings request error:", error);
    }
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function isValidEmbedding(value: unknown): value is number[] {
  return (
    Array.isArray(value) &&
    value.length === EMBEDDING_DIMENSIONS &&
    value.every((item) => typeof item === "number" && Number.isFinite(item))
  );
}
