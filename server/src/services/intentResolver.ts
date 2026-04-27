/* ============================================
   SERVICE: INTENT RESOLVER
   Resolves a matched intent into a full response
   by querying the appropriate database table.
   ============================================ */

import * as prodiService from "./prodiService.js";
import * as jurusanService from "./jurusanService.js";
import * as pendaftaranService from "./pendaftaranService.js";
import * as beasiswaService from "./beasiswaService.js";
import * as fasilitasService from "./fasilitasService.js";
import * as kontakService from "./kontakService.js";
import * as kampusService from "./kampusService.js";
import type { Intent } from "../db/schema.js";

export interface BotResponse {
  type: string;
  text: string;
  card?: {
    title: string;
    items: Array<{ icon: string; name: string; detail: string }>;
  };
  contacts?: Record<string, { label: string; value: string; url: string | null; icon: string | null }>;
}

/**
 * Given a matched intent, build the full response
 * in the same format the frontend expects.
 */
export async function resolveIntent(intent: Intent): Promise<BotResponse> {
  const { responseType, responseTemplate, introText, dataSource } = intent;

  // Static text response (no data_source)
  if (responseTemplate && !dataSource) {
    return { type: responseType, text: responseTemplate };
  }

  // Dynamic responses based on data_source
  switch (dataSource) {
    case "jurusan":
      return resolveJurusan(introText);
    case "biaya":
      return resolveBiaya(introText);
    case "pendaftaran":
      return resolvePendaftaran(introText);
    case "beasiswa":
      return resolveBeasiswa(introText);
    case "fasilitas":
      return resolveFasilitas();
    case "lokasi":
      return resolveLokasi();
    case "kontak":
      return resolveKontak(responseTemplate);
    case "akreditasi":
      return resolveAkreditasi();
    case "visi_misi":
      return resolveVisiMisi();
    default:
      if (responseTemplate) {
        return { type: responseType, text: responseTemplate };
      }
      return { type: "text", text: "Maaf, saya belum bisa memproses permintaan tersebut." };
  }
}

async function resolveJurusan(introText: string | null): Promise<BotResponse> {
  const allProdi = await prodiService.getAllWithJurusan();

  // Group by jurusan
  const grouped = new Map<string, Array<{ icon: string; nama: string; jenjang: string }>>();
  for (const p of allProdi) {
    const key = `${p.jurusanIcon} ${p.jurusanNama}`;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push({ icon: p.icon || "🎓", nama: p.nama, jenjang: p.jenjang });
  }

  const items: Array<{ icon: string; name: string; detail: string }> = [];
  for (const [jurusanName, prodis] of grouped) {
    items.push({
      icon: jurusanName.split(" ")[0],
      name: jurusanName.substring(jurusanName.indexOf(" ") + 1),
      detail: prodis.map((p) => `${p.icon} ${p.nama} (${p.jenjang})`).join("\n"),
    });
  }

  return {
    type: "info-card",
    text: introText || "Berikut daftar jurusan dan program studi di Polimdo:",
    card: {
      title: "🎓 Program Studi Polimdo (21 Prodi)",
      items,
    },
  };
}

async function resolveBiaya(introText: string | null): Promise<BotResponse> {
  const allProdi = await prodiService.getAllWithJurusan();

  // Group by jurusan
  const grouped = new Map<string, Array<{ nama: string; jenjang: string; biaya: string | null }>>();
  for (const p of allProdi) {
    const key = p.jurusanNama!;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push({ nama: p.nama, jenjang: p.jenjang, biaya: p.biaya });
  }

  const items: Array<{ icon: string; name: string; detail: string }> = [];
  for (const [jurusanName, prodis] of grouped) {
    items.push({
      icon: "💰",
      name: jurusanName,
      detail: prodis.map((p) => `${p.nama} (${p.jenjang}): ${p.biaya || "Hubungi kampus"}`).join("\n"),
    });
  }

  return {
    type: "info-card",
    text: (introText || "Berikut rincian estimasi UKT per semester:") +
      "\n\n📌 Jalur Mandiri: Ada tambahan SPI (Sumbangan Pengembangan Institusi).\n🎓 KIP-Kuliah: Dibebaskan dari biaya UKT.\n🔗 Registrasi: sim.polimdo.ac.id/spmb/",
    card: {
      title: "💰 Estimasi UKT per Semester",
      items,
    },
  };
}

async function resolvePendaftaran(introText: string | null): Promise<BotResponse> {
  const data = await pendaftaranService.getAllActive();
  return {
    type: "info-card",
    text: introText || "Polimdo membuka pendaftaran melalui beberapa jalur:",
    card: {
      title: "📝 Jalur Pendaftaran",
      items: data.map((p) => ({
        icon: p.icon || "📝",
        name: `${p.jalur} — ${p.nama}`,
        detail: `📅 ${p.periode} | Biaya: ${p.biayaPendaftaran}\n📋 ${p.syarat}`,
      })),
    },
  };
}

async function resolveBeasiswa(introText: string | null): Promise<BotResponse> {
  const data = await beasiswaService.getAllActive();
  return {
    type: "info-card",
    text: introText || "Polimdo menyediakan beberapa program beasiswa:",
    card: {
      title: "🏅 Beasiswa Tersedia",
      items: data.map((b) => ({
        icon: b.icon || "🏅",
        name: b.nama,
        detail: b.deskripsi || "",
      })),
    },
  };
}

async function resolveFasilitas(): Promise<BotResponse> {
  const data = await fasilitasService.getAllActive();
  const list = data.map((f) => `${f.icon} ${f.nama}`).join("\n");
  return {
    type: "text",
    text: `🏫 **Fasilitas Kampus Polimdo:**\n\n${list}`,
  };
}

async function resolveLokasi(): Promise<BotResponse> {
  const k = await kampusService.get();
  if (!k) {
    return { type: "text", text: "Maaf, data lokasi kampus belum tersedia." };
  }
  return {
    type: "text",
    text: `📍 **Lokasi Kampus Polimdo**\n\n${k.alamat}\n\n📞 Telepon: ${k.telepon}\n📧 Email: ${k.email}\n🌐 Website: ${k.website}\n\n🗺️ Lihat di Google Maps:\n${k.mapsUrl}`,
  };
}

async function resolveKontak(introText: string | null): Promise<BotResponse> {
  const contacts = await kontakService.getAsObject();
  return {
    type: "fallback",
    text: introText || "Berikut kontak yang bisa kamu hubungi:",
    contacts,
  };
}

async function resolveAkreditasi(): Promise<BotResponse> {
  const allProdi = await prodiService.getAllWithJurusan();

  // Group by jurusan
  const grouped = new Map<string, Array<{ icon: string; nama: string; akreditasi: string | null }>>();
  for (const p of allProdi) {
    const key = `${p.jurusanIcon} ${p.jurusanNama}`;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push({ icon: p.icon || "🎓", nama: p.nama, akreditasi: p.akreditasi });
  }

  let list = "";
  for (const [jurusanName, prodis] of grouped) {
    list += `\n**${jurusanName}**\n`;
    list += prodis.map((p) => `  ${p.icon} ${p.nama} — Akreditasi **${p.akreditasi || "-"}**`).join("\n");
    list += "\n";
  }

  return {
    type: "text",
    text: `📋 **Akreditasi Program Studi Polimdo:**\n${list}\nPolimdo secara institusi terakreditasi **B** oleh BAN-PT.`,
  };
}

async function resolveVisiMisi(): Promise<BotResponse> {
  const k = await kampusService.get();
  if (!k) {
    return { type: "text", text: "Maaf, data visi misi belum tersedia." };
  }

  const misiList = Array.isArray(k.misi)
    ? k.misi.map((m, i) => `${i + 1}. ${m}`).join("\n")
    : "Data misi belum tersedia.";

  return {
    type: "text",
    text: `🎯 **Visi Polimdo:**\n${k.visi}\n\n📋 **Misi:**\n${misiList}`,
  };
}
