/* ============================================
   SERVICE: PENDAFTARAN — Admission Paths CRUD
   ============================================ */

import { db } from "../db/index.js";
import { pendaftaran, type NewPendaftaran } from "../db/schema.js";
import { eq, asc } from "drizzle-orm";

export async function getAllActive() {
  return db.select().from(pendaftaran).where(eq(pendaftaran.isActive, true)).orderBy(asc(pendaftaran.sortOrder));
}

export async function getAllAdmin() {
  return db.select().from(pendaftaran).orderBy(asc(pendaftaran.sortOrder));
}

export async function getById(id: number) {
  const [result] = await db.select().from(pendaftaran).where(eq(pendaftaran.id, id));
  return result ?? null;
}

export async function create(data: NewPendaftaran) {
  const [result] = await db.insert(pendaftaran).values(data).returning();
  return result;
}

export async function update(id: number, data: Partial<NewPendaftaran>) {
  const [result] = await db
    .update(pendaftaran)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(pendaftaran.id, id))
    .returning();
  return result ?? null;
}

export async function remove(id: number) {
  const [result] = await db.delete(pendaftaran).where(eq(pendaftaran.id, id)).returning();
  return result ?? null;
}
