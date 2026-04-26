/* ============================================
   SERVICE: JURUSAN — Study Programs CRUD
   ============================================ */

import { db } from "../db/index.js";
import { jurusan, type NewJurusan } from "../db/schema.js";
import { eq, asc } from "drizzle-orm";

export async function getAllActive() {
  return db.select().from(jurusan).where(eq(jurusan.isActive, true)).orderBy(asc(jurusan.sortOrder));
}

export async function getAllAdmin() {
  return db.select().from(jurusan).orderBy(asc(jurusan.sortOrder));
}

export async function getById(id: number) {
  const [result] = await db.select().from(jurusan).where(eq(jurusan.id, id));
  return result ?? null;
}

export async function create(data: NewJurusan) {
  const [result] = await db.insert(jurusan).values(data).returning();
  return result;
}

export async function update(id: number, data: Partial<NewJurusan>) {
  const [result] = await db
    .update(jurusan)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(jurusan.id, id))
    .returning();
  return result ?? null;
}

export async function remove(id: number) {
  const [result] = await db.delete(jurusan).where(eq(jurusan.id, id)).returning();
  return result ?? null;
}
