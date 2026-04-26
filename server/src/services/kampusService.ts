/* ============================================
   SERVICE: KAMPUS — Campus Info Operations
   ============================================ */

import { db } from "../db/index.js";
import { kampusInfo } from "../db/schema.js";
import { eq } from "drizzle-orm";

export async function get() {
  const [result] = await db.select().from(kampusInfo).limit(1);
  return result ?? null;
}

export async function update(data: Partial<typeof kampusInfo.$inferInsert>) {
  const existing = await get();

  if (!existing) {
    const [result] = await db.insert(kampusInfo).values(data as any).returning();
    return result;
  }

  const [result] = await db
    .update(kampusInfo)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(kampusInfo.id, existing.id))
    .returning();
  return result;
}
