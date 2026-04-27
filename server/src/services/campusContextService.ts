/* ============================================
   SERVICE: CAMPUS CONTEXT
   Builds a compact public knowledge context for AI fallback.
   ============================================ */

import * as kampusService from "./kampusService.js";
import * as jurusanService from "./jurusanService.js";
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

  const [kampus, jurusan, pendaftaran, beasiswa, fasilitas, faq, kontak] = await Promise.all([
    kampusService.get(),
    jurusanService.getAllActive(),
    pendaftaranService.getAllActive(),
    beasiswaService.getAllActive(),
    fasilitasService.getAllActive(),
    faqService.getAllActive(),
    kontakService.getAllActive(),
  ]);

  const context = [
    "KONTEKS PUBLIK KAMPUS",
    kampus
      ? [
          `Nama: ${kampus.nama}${kampus.singkatan ? ` (${kampus.singkatan})` : ""}`,
          kampus.alamat ? `Alamat: ${kampus.alamat}` : "",
          kampus.telepon ? `Telepon: ${kampus.telepon}` : "",
          kampus.email ? `Email: ${kampus.email}` : "",
          kampus.website ? `Website: ${kampus.website}` : "",
          kampus.whatsapp ? `WhatsApp: ${kampus.whatsapp}` : "",
          kampus.mapsUrl ? `Maps: ${kampus.mapsUrl}` : "",
          kampus.visi ? `Visi: ${kampus.visi}` : "",
          Array.isArray(kampus.misi) && kampus.misi.length ? `Misi: ${kampus.misi.join("; ")}` : "",
        ]
          .filter(Boolean)
          .join("\n")
      : "Info kampus belum tersedia.",
    "",
    "PROGRAM STUDI",
    jurusan
      .map((j) => `${j.nama} (${j.jenjang}; akreditasi ${j.akreditasi || "-"}; biaya ${j.biaya || "-"}) - ${j.deskripsi || "-"}`)
      .join("\n"),
    "",
    "PENDAFTARAN",
    pendaftaran
      .map((p) => `${p.jalur} - ${p.nama}: periode ${p.periode || "-"}, biaya ${p.biayaPendaftaran || "-"}, syarat ${p.syarat || "-"}`)
      .join("\n"),
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
