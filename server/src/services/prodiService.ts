/* ============================================
   SERVICE: PRODI — Study Programs CRUD
   ============================================ */

import { db } from "../db/index.js";
import { prodi, jurusan, type NewProdi } from "../db/schema.js";
import { eq, asc } from "drizzle-orm";

export async function getAllActive() {
  return db.select().from(prodi).where(eq(prodi.isActive, true)).orderBy(asc(prodi.sortOrder));
}

export async function getAllWithJurusan() {
  return db
    .select({
      id: prodi.id,
      nama: prodi.nama,
      jenjang: prodi.jenjang,
      akreditasi: prodi.akreditasi,
      biaya: prodi.biaya,
      deskripsi: prodi.deskripsi,
      icon: prodi.icon,
      sortOrder: prodi.sortOrder,
      isActive: prodi.isActive,
      jurusanId: prodi.jurusanId,
      jurusanNama: jurusan.nama,
      jurusanIcon: jurusan.icon,
    })
    .from(prodi)
    .innerJoin(jurusan, eq(prodi.jurusanId, jurusan.id))
    .where(eq(prodi.isActive, true))
    .orderBy(asc(jurusan.sortOrder), asc(prodi.sortOrder));
}

export async function getByJurusan(jurusanId: number) {
  return db
    .select()
    .from(prodi)
    .where(eq(prodi.jurusanId, jurusanId))
    .orderBy(asc(prodi.sortOrder));
}

export async function getAllAdmin() {
  return db.select().from(prodi).orderBy(asc(prodi.sortOrder));
}

export async function getById(id: number) {
  const [result] = await db.select().from(prodi).where(eq(prodi.id, id));
  return result ?? null;
}

export async function create(data: NewProdi) {
  const [result] = await db.insert(prodi).values(data).returning();
  return result;
}

export async function update(id: number, data: Partial<NewProdi>) {
  const [result] = await db
    .update(prodi)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(prodi.id, id))
    .returning();
  return result ?? null;
}

export async function remove(id: number) {
  const [result] = await db.delete(prodi).where(eq(prodi.id, id)).returning();
  return result ?? null;
}
