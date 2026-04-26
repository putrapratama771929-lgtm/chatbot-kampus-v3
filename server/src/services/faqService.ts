/* ============================================
   SERVICE: FAQ — FAQ CRUD
   ============================================ */

import { db } from "../db/index.js";
import { faq, type NewFAQ } from "../db/schema.js";
import { eq, asc } from "drizzle-orm";

export async function getAllActive() {
  return db.select().from(faq).where(eq(faq.isActive, true)).orderBy(asc(faq.sortOrder));
}

export async function getAllAdmin() {
  return db.select().from(faq).orderBy(asc(faq.sortOrder));
}

export async function getById(id: number) {
  const [result] = await db.select().from(faq).where(eq(faq.id, id));
  return result ?? null;
}

export async function create(data: NewFAQ) {
  const [result] = await db.insert(faq).values(data).returning();
  return result;
}

export async function update(id: number, data: Partial<NewFAQ>) {
  const [result] = await db
    .update(faq)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(faq.id, id))
    .returning();
  return result ?? null;
}

export async function remove(id: number) {
  const [result] = await db.delete(faq).where(eq(faq.id, id)).returning();
  return result ?? null;
}
