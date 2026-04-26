/* ============================================
   SERVICE: KONTAK — Contact Info CRUD
   ============================================ */

import { db } from "../db/index.js";
import { kontak, type NewKontak } from "../db/schema.js";
import { eq, asc } from "drizzle-orm";

export async function getAllActive() {
  return db.select().from(kontak).where(eq(kontak.isActive, true)).orderBy(asc(kontak.sortOrder));
}

/** Get contacts as object keyed by tipe (matches frontend campusData.kontak format) */
export async function getAsObject() {
  const rows = await getAllActive();
  const result: Record<string, { label: string; value: string; url: string | null; icon: string | null }> = {};
  for (const row of rows) {
    result[row.tipe] = { label: row.label, value: row.value, url: row.url, icon: row.icon };
  }
  return result;
}

export async function getAllAdmin() {
  return db.select().from(kontak).orderBy(asc(kontak.sortOrder));
}

export async function getById(id: number) {
  const [result] = await db.select().from(kontak).where(eq(kontak.id, id));
  return result ?? null;
}

export async function create(data: NewKontak) {
  const [result] = await db.insert(kontak).values(data).returning();
  return result;
}

export async function update(id: number, data: Partial<NewKontak>) {
  const [result] = await db
    .update(kontak)
    .set(data)
    .where(eq(kontak.id, id))
    .returning();
  return result ?? null;
}

export async function remove(id: number) {
  const [result] = await db.delete(kontak).where(eq(kontak.id, id)).returning();
  return result ?? null;
}
