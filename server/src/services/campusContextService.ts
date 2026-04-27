/* ============================================
   SERVICE: CAMPUS CONTEXT
   Builds a compact public knowledge context for AI fallback.
   ============================================ */

import * as kampusService from "./kampusService.js";
import * as jurusanService from "./jurusanService.js";
import * as prodiService from "./prodiService.js";
import * as pendaftaranService from "./pendaftaranService.js";
import * as beasiswaService from "./beasiswaService.js";
import * as fasilitasService from "./fasilitasService.js";
import * as faqService from "./faqService.js";
import * as kontakService from "./kontakService.js";

let cachedContext: string | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60_000;

export function invalidateCampusContextCache() {
  cachedContext = null;
  cacheTimestamp = 0;
}

export async function getCampusContext(): Promise<string> {
  const now = Date.now();
  if (cachedContext && now - cacheTimestamp < CACHE_TTL) {
    return cachedContext;
  }

  const [kampus, allJurusan, allProdi, pendaftaran, beasiswa, fasilitas, faq, kontak] = await Promise.all([
    kampusService.get(),
    jurusanService.getAllActive(),
    prodiService.getAllWithJurusan(),
    pendaftaranService.getAllActive(),
    beasiswaService.getAllActive(),
    fasilitasService.getAllActive(),
    faqService.getAllActive(),
    kontakService.getAllActive(),
  ]);

  // Group prodi by jurusan
  const prodiByJurusan = new Map<string, Array<{ nama: string; jenjang: string; biaya: string | null; akreditasi: string | null }>>();
  for (const p of allProdi) {
    const key = p.jurusanNama!;
    if (!prodiByJurusan.has(key)) prodiByJurusan.set(key, []);
    prodiByJurusan.get(key)!.push({ nama: p.nama, jenjang: p.jenjang, biaya: p.biaya, akreditasi: p.akreditasi });
  }

  const context = [
    "KONTEKS PUBLIK KAMPUS",
    kampus
      ? [
          `Nama: ${kampus.nama}${kampus.singkatan ? ` (${kampus.singkatan})` : ""}`,
          kampus.alamat ? `Alamat: ${kampus.alamat}` : "",
          kampus.telepon ? `Telepon: ${kampus.telepon}` : "",
          kampus.email ? `Email: ${kampus.email}` : "",
          kampus.website ? `Website: ${kampus.website}` : "",
          kampus.whatsapp ? `WhatsApp/Grup: ${kampus.whatsapp}` : "",
          kampus.mapsUrl ? `Maps: ${kampus.mapsUrl}` : "",
          kampus.visi ? `Visi: ${kampus.visi}` : "",
          Array.isArray(kampus.misi) && kampus.misi.length ? `Misi: ${kampus.misi.join("; ")}` : "",
        ]
          .filter(Boolean)
          .join("\n")
      : "Info kampus belum tersedia.",
    "",
    `JURUSAN DAN PROGRAM STUDI (${allJurusan.length} Jurusan, ${allProdi.length} Prodi)`,
    ...Array.from(prodiByJurusan.entries()).map(([jurusanName, prodis]) =>
      `Jurusan ${jurusanName}:\n` +
      prodis.map((p) => `  - ${p.nama} (${p.jenjang}; akreditasi ${p.akreditasi || "-"}; UKT ${p.biaya || "hubungi kampus"})`).join("\n")
    ),
    "",
    "PENDAFTARAN",
    pendaftaran
      .map((p) => `${p.jalur} - ${p.nama}: periode ${p.periode || "-"}, biaya ${p.biayaPendaftaran || "-"}, syarat ${p.syarat || "-"}`)
      .join("\n"),
    "Catatan: Jalur Mandiri ada tambahan SPI. KIP-Kuliah dibebaskan dari UKT. Registrasi online: sim.polimdo.ac.id/spmb/",
    "",
    "BEASISWA",
    beasiswa.map((b) => `${b.nama}: ${b.deskripsi || "-"}`).join("\n"),
    "",
    "FASILITAS",
    fasilitas.map((f) => f.nama).join(", "),
    "",
    "FAQ",
    faq.map((item) => `Q: ${item.pertanyaan}\nA: ${item.jawaban}`).join("\n"),
    "",
    "KONTAK",
    kontak.map((k) => `${k.label}: ${k.value}${k.url ? ` (${k.url})` : ""}`).join("\n"),
  ].join("\n");

  cachedContext = context.slice(0, 12_000);
  cacheTimestamp = now;
  return cachedContext;
}
