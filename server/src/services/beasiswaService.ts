/* ============================================
   SERVICE: BEASISWA — Scholarship CRUD
   ============================================ */

import { db } from "../db/index.js";
import { beasiswa, type NewBeasiswa } from "../db/schema.js";
import { eq, asc } from "drizzle-orm";

export async function getAllActive() {
  return db.select().from(beasiswa).where(eq(beasiswa.isActive, true)).orderBy(asc(beasiswa.sortOrder));
}

export async function getAllAdmin() {
  return db.select().from(beasiswa).orderBy(asc(beasiswa.sortOrder));
}

export async function getById(id: number) {
  const [result] = await db.select().from(beasiswa).where(eq(beasiswa.id, id));
  return result ?? null;
}

export async function create(data: NewBeasiswa) {
  const [result] = await db.insert(beasiswa).values(data).returning();
  return result;
}

export async function update(id: number, data: Partial<NewBeasiswa>) {
  const [result] = await db
    .update(beasiswa)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(beasiswa.id, id))
    .returning();
  return result ?? null;
}

export async function remove(id: number) {
  const [result] = await db.delete(beasiswa).where(eq(beasiswa.id, id)).returning();
  return result ?? null;
}
