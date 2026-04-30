/* ============================================
   SERVICE: RAG — Knowledge ingestion and retrieval
   ============================================ */

import crypto from "node:crypto";
import { db, queryClient } from "../db/index.js";
import { knowledgeChunks, knowledgeSources, type KnowledgeSource } from "../db/schema.js";
import { desc, eq } from "drizzle-orm";
import { embedTexts } from "./embeddingService.js";

const DEFAULT_TOP_K = 5;
const DEFAULT_MIN_SCORE = 0.65;
const MAX_CHUNK_CHARS = 900;
const CHUNK_OVERLAP_CHARS = 120;

export interface RagSourceInput {
  sourceKey?: string;
  title: string;
  sourceType: "db_sync" | "admin_text";
  referenceTable?: string | null;
  referenceId?: string | number | null;
  content: string;
  metadata?: Record<string, unknown> | null;
  isActive?: boolean | null;
}

export interface RagSearchResult {
  context: string;
  score: number;
  chunks: Array<{
    chunkId: number;
    sourceId: number;
    title: string;
    sourceType: string;
    content: string;
    score: number;
  }>;
  sources: Array<{
    id: number;
    title: string;
    sourceType: string;
  }>;
}

interface RagSearchRow {
  chunk_id: number;
  source_id: number;
  title: string;
  source_type: string;
  content: string;
  score: number;
}

export function isRagEnabled() {
  return process.env.RAG_ENABLED !== "false";
}

export function hashContent(content: string) {
  return crypto.createHash("sha256").update(content).digest("hex");
}

export function chunkText(content: string) {
  const normalized = content
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (!normalized) return [];

  const paragraphs = normalized.split(/\n\s*\n/).map((item) => item.trim()).filter(Boolean);
  const chunks: string[] = [];
  let current = "";

  for (const paragraph of paragraphs) {
    if (paragraph.length > MAX_CHUNK_CHARS) {
      if (current) {
        chunks.push(current);
        current = "";
      }
      chunks.push(...splitLongText(paragraph));
      continue;
    }

    const next = current ? `${current}\n\n${paragraph}` : paragraph;
    if (next.length <= MAX_CHUNK_CHARS) {
      current = next;
    } else {
      if (current) chunks.push(current);
      current = paragraph;
    }
  }

  if (current) chunks.push(current);
  return chunks.map((text, index) => ({ index, content: text, contentHash: hashContent(text) }));
}

export async function listSources() {
  return db.select().from(knowledgeSources).orderBy(desc(knowledgeSources.updatedAt));
}

export async function getSourceById(id: number) {
  const [result] = await db.select().from(knowledgeSources).where(eq(knowledgeSources.id, id));
  return result ?? null;
}

export async function upsertKnowledgeSource(input: RagSourceInput) {
  const sourceKey =
    input.sourceKey ||
    `${input.sourceType}:${input.referenceTable || "manual"}:${input.referenceId ?? crypto.randomUUID()}`;
  const content = input.content.trim();
  const contentHash = hashContent(content);
  const isActive = input.isActive ?? true;

  const [existing] = await db.select().from(knowledgeSources).where(eq(knowledgeSources.sourceKey, sourceKey));
  const values = {
    sourceKey,
    title: input.title,
    sourceType: input.sourceType,
    referenceTable: input.referenceTable ?? null,
    referenceId: input.referenceId === undefined || input.referenceId === null ? null : String(input.referenceId),
    content,
    contentHash,
    metadata: input.metadata ?? null,
    isActive,
    updatedAt: new Date(),
  };

  if (existing && existing.contentHash === contentHash && existing.isActive === isActive) {
    const metadataChanged = JSON.stringify(existing.metadata ?? null) !== JSON.stringify(values.metadata);
    const sourceDetailsChanged =
      existing.title !== values.title ||
      existing.sourceType !== values.sourceType ||
      existing.referenceTable !== values.referenceTable ||
      existing.referenceId !== values.referenceId ||
      metadataChanged;

    if (!sourceDetailsChanged) {
      return { source: existing, changed: false, chunks: 0 };
    }

    const [source] = await db.update(knowledgeSources).set(values).where(eq(knowledgeSources.id, existing.id)).returning();
    return { source: source ?? existing, changed: true, chunks: 0 };
  }

  const [source] = existing
    ? await db.update(knowledgeSources).set(values).where(eq(knowledgeSources.id, existing.id)).returning()
    : await db.insert(knowledgeSources).values(values).returning();

  if (!source) {
    throw new Error("Failed to save knowledge source");
  }

  if (!source.isActive) {
    await db.delete(knowledgeChunks).where(eq(knowledgeChunks.sourceId, source.id));
    return { source, changed: true, chunks: 0 };
  }

  const chunks = await rebuildSourceChunks(source);
  return { source, changed: true, chunks };
}

export async function createAdminSource(input: {
  title: string;
  content: string;
  metadata?: Record<string, unknown> | null;
  isActive?: boolean | null;
}) {
  return upsertKnowledgeSource({
    sourceKey: `admin_text:${crypto.randomUUID()}`,
    title: input.title,
    content: input.content,
    metadata: input.metadata,
    isActive: input.isActive,
    sourceType: "admin_text",
  });
}

export async function updateSource(
  id: number,
  input: Partial<{
    title: string;
    content: string;
    metadata: Record<string, unknown> | null;
    isActive: boolean;
  }>
) {
  const existing = await getSourceById(id);
  if (!existing) return null;

  return upsertKnowledgeSource({
    sourceKey: existing.sourceKey,
    sourceType: existing.sourceType as "db_sync" | "admin_text",
    referenceTable: existing.referenceTable,
    referenceId: existing.referenceId,
    title: input.title ?? existing.title,
    content: input.content ?? existing.content,
    metadata: input.metadata === undefined ? existing.metadata : input.metadata,
    isActive: input.isActive ?? existing.isActive,
  });
}

export async function deactivateSource(id: number) {
  const existing = await getSourceById(id);
  if (!existing) return null;

  const [source] = await db
    .update(knowledgeSources)
    .set({ isActive: false, updatedAt: new Date() })
    .where(eq(knowledgeSources.id, id))
    .returning();

  await db.delete(knowledgeChunks).where(eq(knowledgeChunks.sourceId, id));
  return source ?? null;
}

export async function searchRelevantContext(query: string): Promise<RagSearchResult | null> {
  if (!isRagEnabled()) return null;

  const embeddings = await embedTexts([query]);
  const queryEmbedding = embeddings?.[0];
  if (!queryEmbedding) return null;

  const topK = parseIntegerEnv("RAG_TOP_K", DEFAULT_TOP_K);
  const minScore = parseFloatEnv("RAG_MIN_SCORE", DEFAULT_MIN_SCORE);
  const vectorLiteral = formatPgVector(queryEmbedding);

  const rows = (await queryClient`
    SELECT
      kc.id AS chunk_id,
      ks.id AS source_id,
      ks.title,
      ks.source_type,
      kc.content,
      1 - (kc.embedding <=> ${vectorLiteral}::vector) AS score
    FROM knowledge_chunks kc
    INNER JOIN knowledge_sources ks ON ks.id = kc.source_id
    WHERE ks.is_active = true
    ORDER BY kc.embedding <=> ${vectorLiteral}::vector
    LIMIT ${topK}
  `) as unknown as RagSearchRow[];

  const chunks = rows
    .map((row) => ({
      chunkId: Number(row.chunk_id),
      sourceId: Number(row.source_id),
      title: row.title,
      sourceType: row.source_type,
      content: row.content,
      score: Number(row.score),
    }))
    .filter((row) => Number.isFinite(row.score));

  const bestScore = chunks[0]?.score ?? 0;
  if (!chunks.length || bestScore < minScore) {
    return null;
  }

  const sources = Array.from(
    new Map(chunks.map((chunk) => [chunk.sourceId, { id: chunk.sourceId, title: chunk.title, sourceType: chunk.sourceType }])).values()
  );

  return {
    context: chunks.map((chunk, index) => `[${index + 1}] ${chunk.title}\n${chunk.content}`).join("\n\n"),
    score: bestScore,
    chunks,
    sources,
  };
}

async function rebuildSourceChunks(source: KnowledgeSource) {
  const chunks = chunkText(source.content);
  if (!chunks.length) {
    await db.delete(knowledgeChunks).where(eq(knowledgeChunks.sourceId, source.id));
    return 0;
  }

  const embeddings = await embedTexts(chunks.map((chunk) => chunk.content));
  if (!embeddings) {
    throw new Error("Failed to generate embeddings for knowledge source");
  }

  await db.delete(knowledgeChunks).where(eq(knowledgeChunks.sourceId, source.id));
  await db.insert(knowledgeChunks).values(
    chunks.map((chunk, index) => ({
      sourceId: source.id,
      chunkIndex: chunk.index,
      content: chunk.content,
      contentHash: chunk.contentHash,
      embedding: embeddings[index],
      metadata: source.metadata,
      updatedAt: new Date(),
    }))
  );

  return chunks.length;
}

function splitLongText(text: string) {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + MAX_CHUNK_CHARS, text.length);
    chunks.push(text.slice(start, end).trim());
    if (end === text.length) break;
    start = Math.max(0, end - CHUNK_OVERLAP_CHARS);
  }

  return chunks.filter(Boolean);
}

function parseIntegerEnv(name: string, fallback: number) {
  const value = Number.parseInt(process.env[name] || "", 10);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function parseFloatEnv(name: string, fallback: number) {
  const value = Number.parseFloat(process.env[name] || "");
  return Number.isFinite(value) ? value : fallback;
}

function formatPgVector(values: number[]) {
  return `[${values.map((value) => Number(value).toFixed(8)).join(",")}]`;
}
