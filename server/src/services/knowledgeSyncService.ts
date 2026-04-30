/* ============================================
   SERVICE: KNOWLEDGE SYNC — DB content to RAG sources
   ============================================ */

import * as kampusService from "./kampusService.js";
import * as jurusanService from "./jurusanService.js";
import * as prodiService from "./prodiService.js";
import * as pendaftaranService from "./pendaftaranService.js";
import * as beasiswaService from "./beasiswaService.js";
import * as fasilitasService from "./fasilitasService.js";
import * as faqService from "./faqService.js";
import * as kontakService from "./kontakService.js";
import { deactivateSource, listSources, upsertKnowledgeSource, type RagSourceInput } from "./ragService.js";

interface SyncSummary {
  processed: number;
  changed: number;
  skipped: number;
  chunks: number;
  deactivated: number;
}

export async function syncDatabaseKnowledge(): Promise<SyncSummary> {
  const sources = await buildDatabaseSources();
  const activeKeys = new Set(sources.map((source) => source.sourceKey!));
  const summary: SyncSummary = { processed: 0, changed: 0, skipped: 0, chunks: 0, deactivated: 0 };

  for (const source of sources) {
    const result = await upsertKnowledgeSource(source);
    summary.processed += 1;
    summary.chunks += result.chunks;
    if (result.changed) summary.changed += 1;
    else summary.skipped += 1;
  }

  const existingSources = await listSources();
  for (const source of existingSources) {
    if (source.sourceType === "db_sync" && !activeKeys.has(source.sourceKey) && source.isActive) {
      await deactivateSource(source.id);
      summary.deactivated += 1;
    }
  }

  return summary;
}

async function buildDatabaseSources(): Promise<RagSourceInput[]> {
  const [kampus, jurusan, prodi, pendaftaran, beasiswa, fasilitas, faq, kontak] = await Promise.all([
    kampusService.get(),
    jurusanService.getAllActive(),
    prodiService.getAllWithJurusan(),
    pendaftaranService.getAllActive(),
    beasiswaService.getAllActive(),
    fasilitasService.getAllActive(),
    faqService.getAllActive(),
    kontakService.getAllActive(),
  ]);

  const sources: RagSourceInput[] = [];

  if (kampus) {
    sources.push({
      sourceKey: `db_sync:kampus_info:${kampus.id}`,
      sourceType: "db_sync",
      referenceTable: "kampus_info",
      referenceId: kampus.id,
      title: `Profil Kampus ${kampus.singkatan || kampus.nama}`,
      content: compactLines([
        `Nama kampus: ${kampus.nama}`,
        kampus.singkatan ? `Singkatan: ${kampus.singkatan}` : "",
        kampus.alamat ? `Alamat: ${kampus.alamat}` : "",
        kampus.telepon ? `Telepon: ${kampus.telepon}` : "",
        kampus.email ? `Email: ${kampus.email}` : "",
        kampus.website ? `Website: ${kampus.website}` : "",
        kampus.whatsapp ? `WhatsApp: ${kampus.whatsapp}` : "",
        kampus.mapsUrl ? `Google Maps: ${kampus.mapsUrl}` : "",
        kampus.visi ? `Visi: ${kampus.visi}` : "",
        Array.isArray(kampus.misi) && kampus.misi.length ? `Misi: ${kampus.misi.join("; ")}` : "",
      ]),
      metadata: { table: "kampus_info", id: kampus.id },
    });
  }

  for (const item of jurusan) {
    sources.push({
      sourceKey: `db_sync:jurusan:${item.id}`,
      sourceType: "db_sync",
      referenceTable: "jurusan",
      referenceId: item.id,
      title: `Jurusan ${item.nama}`,
      content: compactLines([
        `Jurusan: ${item.nama}`,
        item.deskripsi ? `Deskripsi: ${item.deskripsi}` : "",
      ]),
      metadata: { table: "jurusan", id: item.id },
    });
  }

  for (const item of prodi) {
    sources.push({
      sourceKey: `db_sync:prodi:${item.id}`,
      sourceType: "db_sync",
      referenceTable: "prodi",
      referenceId: item.id,
      title: `Program Studi ${item.nama}`,
      content: compactLines([
        `Program studi: ${item.nama}`,
        `Jenjang: ${item.jenjang}`,
        item.jurusanNama ? `Jurusan: ${item.jurusanNama}` : "",
        item.akreditasi ? `Akreditasi: ${item.akreditasi}` : "",
        item.biaya ? `UKT/biaya: ${item.biaya}` : "",
        item.deskripsi ? `Deskripsi: ${item.deskripsi}` : "",
      ]),
      metadata: { table: "prodi", id: item.id, jurusanId: item.jurusanId },
    });
  }

  for (const item of pendaftaran) {
    sources.push({
      sourceKey: `db_sync:pendaftaran:${item.id}`,
      sourceType: "db_sync",
      referenceTable: "pendaftaran",
      referenceId: item.id,
      title: `Pendaftaran ${item.jalur} - ${item.nama}`,
      content: compactLines([
        `Jalur pendaftaran: ${item.jalur}`,
        `Nama jalur: ${item.nama}`,
        item.periode ? `Periode: ${item.periode}` : "",
        item.biayaPendaftaran ? `Biaya pendaftaran: ${item.biayaPendaftaran}` : "",
        item.syarat ? `Syarat: ${item.syarat}` : "",
      ]),
      metadata: { table: "pendaftaran", id: item.id },
    });
  }

  for (const item of beasiswa) {
    sources.push({
      sourceKey: `db_sync:beasiswa:${item.id}`,
      sourceType: "db_sync",
      referenceTable: "beasiswa",
      referenceId: item.id,
      title: `Beasiswa ${item.nama}`,
      content: compactLines([`Beasiswa: ${item.nama}`, item.deskripsi ? `Deskripsi: ${item.deskripsi}` : ""]),
      metadata: { table: "beasiswa", id: item.id },
    });
  }

  for (const item of fasilitas) {
    sources.push({
      sourceKey: `db_sync:fasilitas:${item.id}`,
      sourceType: "db_sync",
      referenceTable: "fasilitas",
      referenceId: item.id,
      title: `Fasilitas ${item.nama}`,
      content: `Fasilitas kampus: ${item.nama}`,
      metadata: { table: "fasilitas", id: item.id },
    });
  }

  for (const item of faq) {
    sources.push({
      sourceKey: `db_sync:faq:${item.id}`,
      sourceType: "db_sync",
      referenceTable: "faq",
      referenceId: item.id,
      title: `FAQ: ${item.pertanyaan}`,
      content: compactLines([`Pertanyaan: ${item.pertanyaan}`, `Jawaban: ${item.jawaban}`]),
      metadata: { table: "faq", id: item.id },
    });
  }

  for (const item of kontak) {
    sources.push({
      sourceKey: `db_sync:kontak:${item.id}`,
      sourceType: "db_sync",
      referenceTable: "kontak",
      referenceId: item.id,
      title: `Kontak ${item.label}`,
      content: compactLines([
        `Kontak: ${item.label}`,
        `Tipe: ${item.tipe}`,
        `Nilai: ${item.value}`,
        item.url ? `URL: ${item.url}` : "",
      ]),
      metadata: { table: "kontak", id: item.id },
    });
  }

  return sources.filter((source) => source.content.trim().length > 0);
}

function compactLines(lines: string[]) {
  return lines.filter((line) => line.trim().length > 0).join("\n");
}
