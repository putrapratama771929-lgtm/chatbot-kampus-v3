/* ============================================
   SERVICE: FASILITAS — Facility CRUD
   ============================================ */

import { db } from "../db/index.js";
import { fasilitas, type NewFasilitas } from "../db/schema.js";
import { eq, asc } from "drizzle-orm";

export async function getAllActive() {
  return db.select().from(fasilitas).where(eq(fasilitas.isActive, true)).orderBy(asc(fasilitas.sortOrder));
}

export async function getAllAdmin() {
  return db.select().from(fasilitas).orderBy(asc(fasilitas.sortOrder));
}

export async function getById(id: number) {
  const [result] = await db.select().from(fasilitas).where(eq(fasilitas.id, id));
  return result ?? null;
}

export async function create(data: NewFasilitas) {
  const [result] = await db.insert(fasilitas).values(data).returning();
  return result;
}

export async function update(id: number, data: Partial<NewFasilitas>) {
  const [result] = await db
    .update(fasilitas)
    .set(data)
    .where(eq(fasilitas.id, id))
    .returning();
  return result ?? null;
}

export async function remove(id: number) {
  const [result] = await db.delete(fasilitas).where(eq(fasilitas.id, id)).returning();
  return result ?? null;
}
