/* ============================================
   SERVICE: CHAT SESSION — Session & Message Logging
   ============================================ */

import { db } from "../db/index.js";
import { chatSessions, chatMessages } from "../db/schema.js";
import { eq, desc, sql, count } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

// ── Sessions ──

export async function createSession(ipAddress?: string, userAgent?: string) {
  const sessionUuid = uuidv4();
  const [result] = await db
    .insert(chatSessions)
    .values({ sessionUuid, ipAddress: ipAddress ?? null, userAgent: userAgent ?? null })
    .returning();
  return result;
}

export async function getSessionByUuid(uuid: string) {
  const [result] = await db
    .select()
    .from(chatSessions)
    .where(eq(chatSessions.sessionUuid, uuid));
  return result ?? null;
}

export async function touchSession(uuid: string) {
  await db
    .update(chatSessions)
    .set({ lastActivity: new Date() })
    .where(eq(chatSessions.sessionUuid, uuid));
}

export async function deleteSession(uuid: string) {
  const [result] = await db
    .delete(chatSessions)
    .where(eq(chatSessions.sessionUuid, uuid))
    .returning();
  return result ?? null;
}

// ── Messages ──

export async function logMessage(
  sessionId: number,
  sender: string,
  message: string,
  matchedIntent?: string | null,
  confidenceScore?: number | null,
  responseType?: string | null
) {
  const [result] = await db
    .insert(chatMessages)
    .values({
      sessionId,
      sender,
      message,
      matchedIntent: matchedIntent ?? null,
      confidenceScore: confidenceScore ?? null,
      responseType: responseType ?? null,
    })
    .returning();
  return result;
}

export async function getMessagesBySession(sessionId: number) {
  return db
    .select()
    .from(chatMessages)
    .where(eq(chatMessages.sessionId, sessionId))
    .orderBy(chatMessages.createdAt);
}

// ── Analytics ──

export async function getSessionCount() {
  const [result] = await db.select({ count: count() }).from(chatSessions);
  return result?.count ?? 0;
}

export async function getMessageCount() {
  const [result] = await db.select({ count: count() }).from(chatMessages);
  return result?.count ?? 0;
}

export async function getPopularIntents(limit = 10) {
  return db
    .select({
      matchedIntent: chatMessages.matchedIntent,
      count: count(),
    })
    .from(chatMessages)
    .where(sql`${chatMessages.matchedIntent} IS NOT NULL AND ${chatMessages.sender} = 'bot'`)
    .groupBy(chatMessages.matchedIntent)
    .orderBy(desc(count()))
    .limit(limit);
}

export async function getRecentSessions(limit = 20) {
  return db
    .select()
    .from(chatSessions)
    .orderBy(desc(chatSessions.lastActivity))
    .limit(limit);
}

export async function getRecentMessages(limit = 50, offset = 0) {
  return db
    .select({
      id: chatMessages.id,
      sessionId: chatMessages.sessionId,
      sender: chatMessages.sender,
      message: chatMessages.message,
      matchedIntent: chatMessages.matchedIntent,
      confidenceScore: chatMessages.confidenceScore,
      responseType: chatMessages.responseType,
      createdAt: chatMessages.createdAt,
      sessionUuid: chatSessions.sessionUuid,
    })
    .from(chatMessages)
    .innerJoin(chatSessions, eq(chatMessages.sessionId, chatSessions.id))
    .orderBy(desc(chatMessages.createdAt))
    .limit(limit)
    .offset(offset);
}
