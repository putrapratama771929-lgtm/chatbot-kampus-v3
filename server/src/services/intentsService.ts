/* ============================================
   SERVICE: INTENTS — Intent Management CRUD
   ============================================ */

import { db } from "../db/index.js";
import { intents, type NewIntent } from "../db/schema.js";
import { eq, desc, asc } from "drizzle-orm";

export async function getAllActive() {
  return db.select().from(intents).where(eq(intents.isActive, true)).orderBy(desc(intents.priority));
}

export async function getAllAdmin() {
  return db.select().from(intents).orderBy(desc(intents.priority));
}

export async function getById(id: number) {
  const [result] = await db.select().from(intents).where(eq(intents.id, id));
  return result ?? null;
}

export async function getByName(name: string) {
  const [result] = await db.select().from(intents).where(eq(intents.name, name));
  return result ?? null;
}

export async function create(data: NewIntent) {
  const [result] = await db.insert(intents).values(data).returning();
  return result;
}

export async function update(id: number, data: Partial<NewIntent>) {
  const [result] = await db
    .update(intents)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(intents.id, id))
    .returning();
  return result ?? null;
}

export async function remove(id: number) {
  const [result] = await db.delete(intents).where(eq(intents.id, id)).returning();
  return result ?? null;
}
