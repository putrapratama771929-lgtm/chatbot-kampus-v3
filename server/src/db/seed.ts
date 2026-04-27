/* ============================================
   SEED.TS — Populate Postgres with initial data
   Migrates data from frontend data.js into DB
   Usage: npm run db:seed  (or npx tsx src/db/seed.ts)
   ============================================ */

import { db, queryClient } from "./index.js";
import {
  kampusInfo,
  jurusan,
  pendaftaran,
  beasiswa,
  fasilitas,
  faq,
  kontak,
  intents,
} from "./schema.js";

async function seed() {
  console.log("🌱 Starting database seed...\n");

  // ── Kampus Info ──
  console.log("🏫 Seeding kampus_info...");
  await db.delete(kampusInfo);
  await db.insert(kampusInfo).values({
    nama: "Politeknik Negeri Manado",
    singkatan: "Polimdo",
    alamat: "Jl. Politeknik, Buha, Kec. Mapanget, Kota Manado, Sulawesi Utara 95252",
    telepon: "(0431) 812 635",
    email: "info@polimdo.ac.id",
    website: "https://polimdo.ac.id",
    whatsapp: "081234567890",
    mapsUrl: "https://maps.google.com/?q=Politeknik+Negeri+Manado",
    visi: "Menjadi politeknik unggul yang menghasilkan lulusan berkompeten, inovatif, dan berdaya saing global.",
    misi: [
      "Menyelenggarakan pendidikan vokasi berkualitas tinggi.",
      "Melaksanakan penelitian terapan yang bermanfaat bagi masyarakat.",
      "Menjalin kerjasama dengan industri dan institusi dalam dan luar negeri.",
      "Membentuk lulusan berkarakter dan siap kerja.",
    ],
  });
  console.log("  ✅ kampus_info seeded");

  // ── Jurusan ──
  console.log("🎓 Seeding jurusan...");
  await db.delete(jurusan);
  await db.insert(jurusan).values([
    { nama: "Teknik Sipil", jenjang: "D-III / D-IV", akreditasi: "B", icon: "🏗️", biaya: "Rp 3.500.000 - 6.000.000 / semester", deskripsi: "Mempelajari perencanaan, perancangan, dan pelaksanaan konstruksi bangunan sipil.", sortOrder: 1 },
    { nama: "Teknik Elektro", jenjang: "D-III / D-IV", akreditasi: "B", icon: "⚡", biaya: "Rp 3.500.000 - 6.000.000 / semester", deskripsi: "Mempelajari sistem kelistrikan, elektronika, dan teknologi telekomunikasi.", sortOrder: 2 },
    { nama: "Teknik Mesin", jenjang: "D-III / D-IV", akreditasi: "B", icon: "⚙️", biaya: "Rp 3.500.000 - 6.000.000 / semester", deskripsi: "Mempelajari perancangan, pembuatan, dan pemeliharaan mesin dan peralatan industri.", sortOrder: 3 },
    { nama: "Akuntansi", jenjang: "D-III / D-IV", akreditasi: "B", icon: "📊", biaya: "Rp 3.000.000 - 5.500.000 / semester", deskripsi: "Mempelajari pencatatan, pelaporan, dan analisis keuangan sesuai standar akuntansi.", sortOrder: 4 },
    { nama: "Administrasi Bisnis", jenjang: "D-III / D-IV", akreditasi: "B", icon: "💼", biaya: "Rp 3.000.000 - 5.500.000 / semester", deskripsi: "Mempelajari manajemen, pemasaran, dan administrasi bisnis modern.", sortOrder: 5 },
    { nama: "Pariwisata", jenjang: "D-III / D-IV", akreditasi: "B", icon: "🌴", biaya: "Rp 3.000.000 - 5.500.000 / semester", deskripsi: "Mempelajari manajemen hospitality, tour planning, dan pengembangan destinasi wisata.", sortOrder: 6 },
  ]);
  console.log("  ✅ 6 jurusan seeded");

  // ── Pendaftaran ──
  console.log("📝 Seeding pendaftaran...");
  await db.delete(pendaftaran);
  await db.insert(pendaftaran).values([
    { jalur: "SNBP", nama: "Seleksi Nasional Berdasarkan Prestasi", periode: "Januari - Februari 2026", syarat: "Nilai rapor semester 1-5, ranking sekolah, prestasi akademik/non-akademik.", biayaPendaftaran: "Gratis", icon: "🏆", sortOrder: 1 },
    { jalur: "SNBT", nama: "Seleksi Nasional Berdasarkan Tes", periode: "Maret - Juni 2026", syarat: "Lulus SMA/SMK/sederajat, mengikuti ujian UTBK.", biayaPendaftaran: "Rp 200.000", icon: "📝", sortOrder: 2 },
    { jalur: "Mandiri", nama: "Seleksi Mandiri Polimdo", periode: "Juli - Agustus 2026", syarat: "Lulus SMA/SMK/sederajat, mengisi formulir online, tes tertulis/wawancara.", biayaPendaftaran: "Rp 250.000", icon: "📋", sortOrder: 3 },
  ]);
  console.log("  ✅ 3 pendaftaran seeded");

  // ── Beasiswa ──
  console.log("🏅 Seeding beasiswa...");
  await db.delete(beasiswa);
  await db.insert(beasiswa).values([
    { nama: "KIP Kuliah", deskripsi: "Bantuan biaya pendidikan dari pemerintah untuk mahasiswa kurang mampu.", icon: "🎓", sortOrder: 1 },
    { nama: "Beasiswa Prestasi", deskripsi: "Beasiswa untuk mahasiswa berprestasi akademik dan non-akademik.", icon: "🏅", sortOrder: 2 },
    { nama: "Beasiswa Daerah", deskripsi: "Beasiswa dari pemerintah daerah Sulawesi Utara.", icon: "🏛️", sortOrder: 3 },
    { nama: "Beasiswa PPA", deskripsi: "Peningkatan Prestasi Akademik dari Kemendikbud.", icon: "📚", sortOrder: 4 },
  ]);
  console.log("  ✅ 4 beasiswa seeded");

  // ── Fasilitas ──
  console.log("🏫 Seeding fasilitas...");
  await db.delete(fasilitas);
  await db.insert(fasilitas).values([
    { nama: "Laboratorium Komputer", icon: "💻", sortOrder: 1 },
    { nama: "Perpustakaan", icon: "📚", sortOrder: 2 },
    { nama: "Lab Bahasa", icon: "🗣️", sortOrder: 3 },
    { nama: "Aula Serbaguna", icon: "🏛️", sortOrder: 4 },
    { nama: "Lapangan Olahraga", icon: "⚽", sortOrder: 5 },
    { nama: "Masjid", icon: "🕌", sortOrder: 6 },
    { nama: "Kantin", icon: "🍽️", sortOrder: 7 },
    { nama: "Bengkel Praktik", icon: "🔧", sortOrder: 8 },
    { nama: "Hotspot WiFi", icon: "📶", sortOrder: 9 },
  ]);
  console.log("  ✅ 9 fasilitas seeded");

  // ── FAQ ──
  console.log("❓ Seeding faq...");
  await db.delete(faq);
  await db.insert(faq).values([
    { pertanyaan: "Bagaimana cara mendaftar di Polimdo?", jawaban: "Pendaftaran bisa melalui 3 jalur: SNBP (berdasarkan prestasi), SNBT (berdasarkan tes), dan Seleksi Mandiri. Kunjungi website resmi Polimdo untuk informasi lengkap.", sortOrder: 1 },
    { pertanyaan: "Berapa biaya kuliah di Polimdo?", jawaban: "Biaya kuliah bervariasi antara Rp 3.000.000 - 6.000.000 per semester tergantung jurusan dan jalur masuk. Tersedia juga beasiswa KIP Kuliah.", sortOrder: 2 },
    { pertanyaan: "Apa saja jurusan yang tersedia?", jawaban: "Polimdo memiliki 6 jurusan: Teknik Sipil, Teknik Elektro, Teknik Mesin, Akuntansi, Administrasi Bisnis, dan Pariwisata.", sortOrder: 3 },
    { pertanyaan: "Apakah ada beasiswa?", jawaban: "Ya! Tersedia KIP Kuliah, Beasiswa Prestasi, Beasiswa Daerah, dan Beasiswa PPA.", sortOrder: 4 },
    { pertanyaan: "Dimana lokasi kampus Polimdo?", jawaban: "Polimdo berlokasi di Jl. Politeknik, Buha, Kec. Mapanget, Kota Manado, Sulawesi Utara.", sortOrder: 5 },
    { pertanyaan: "Kapan jadwal pendaftaran mahasiswa baru?", jawaban: "SNBP: Jan-Feb, SNBT: Mar-Jun, Mandiri: Jul-Agu. Kunjungi website resmi untuk tanggal pasti.", sortOrder: 6 },
  ]);
  console.log("  ✅ 6 FAQ seeded");

  // ── Kontak ──
  console.log("📞 Seeding kontak...");
  await db.delete(kontak);
  await db.insert(kontak).values([
    { tipe: "whatsapp", label: "WhatsApp Admin", value: "081234567890", url: "https://wa.me/6281234567890", icon: "💬", sortOrder: 1 },
    { tipe: "email", label: "Email BAAK", value: "baak@polimdo.ac.id", url: "mailto:baak@polimdo.ac.id", icon: "📧", sortOrder: 2 },
    { tipe: "telepon", label: "Telepon Kampus", value: "(0431) 812 635", url: "tel:+62431812635", icon: "📞", sortOrder: 3 },
  ]);
  console.log("  ✅ 3 kontak seeded");

  // ── Intents ──
  console.log("🧠 Seeding intents...");
  await db.delete(intents);
  await db.insert(intents).values([
    { name: "jurusan", keywords: ["jurusan", "prodi", "program studi", "fakultas", "teknik sipil", "teknik elektro", "teknik mesin", "akuntansi", "administrasi bisnis", "pariwisata"], responseType: "info-card", introText: "Berikut daftar jurusan di Polimdo:", dataSource: "jurusan", priority: 10 },
    { name: "biaya", keywords: ["biaya", "ukt", "spp", "bayar", "kuliah berapa", "harga", "tarif", "biaya kuliah", "mahal"], responseType: "info-card", introText: "Berikut rincian biaya kuliah per semester:", dataSource: "biaya", priority: 10 },
    { name: "pendaftaran", keywords: ["daftar", "pendaftaran", "registrasi", "snbp", "snbt", "mandiri", "pmb", "cara daftar", "mendaftar"], responseType: "info-card", introText: "Polimdo membuka pendaftaran melalui 3 jalur:", dataSource: "pendaftaran", priority: 10 },
    { name: "beasiswa", keywords: ["beasiswa", "kip", "bantuan biaya", "ppa"], responseType: "info-card", introText: "Polimdo menyediakan beberapa program beasiswa:", dataSource: "beasiswa", priority: 10 },
    { name: "lokasi", keywords: ["lokasi", "alamat", "dimana", "di mana", "maps", "peta"], responseType: "text", dataSource: "lokasi", priority: 8 },
    { name: "kontak", keywords: ["kontak", "telepon", "telpon", "whatsapp", "hubungi"], responseType: "fallback", responseTemplate: "Berikut kontak yang bisa kamu hubungi:", dataSource: "kontak", priority: 8 },
    { name: "fasilitas", keywords: ["fasilitas", "laboratorium", "perpustakaan", "perpus", "bengkel", "wifi", "kantin"], responseType: "text", dataSource: "fasilitas", priority: 8 },
    { name: "jadwal", keywords: ["jadwal", "kalender", "ujian", "semester", "akademik"], responseType: "text", responseTemplate: "📅 **Jadwal Akademik Polimdo 2025/2026:**\n\n• Semester Ganjil: September 2025 - Januari 2026\n• UTS Ganjil: Oktober 2025\n• UAS Ganjil: Januari 2026\n• Semester Genap: Februari - Juni 2026\n• UTS Genap: April 2026\n• UAS Genap: Juni 2026\n\nUntuk jadwal lebih detail, kunjungi website resmi Polimdo atau hubungi BAAK.", priority: 6 },
    { name: "akreditasi", keywords: ["akreditasi", "terakreditasi", "mutu", "kualitas"], responseType: "text", dataSource: "akreditasi", priority: 6 },
    { name: "thanks", keywords: ["terima kasih", "makasih", "thanks", "thank you", "trims", "thx"], responseType: "text", responseTemplate: "Sama-sama! 😊 Senang bisa membantu. Jika ada pertanyaan lain, jangan ragu untuk bertanya ya! 🤗", priority: 2 },
    { name: "greeting", keywords: ["halo", "hai ", " hai", "hello", "selamat pagi", "selamat siang", "selamat sore", "selamat malam", "hey ", " hey", "assalamualaikum"], exactMatch: ["hai", "hey", "halo", "hi"], responseType: "text", responseTemplate: "Halo! 👋 Saya asisten virtual Polimdo. Saya bisa membantu kamu dengan informasi seputar:\n\n• 🎓 Jurusan & Program Studi\n• 💰 Biaya Kuliah\n• 📝 Pendaftaran (SNBP/SNBT/Mandiri)\n• 🏅 Beasiswa\n• 📍 Lokasi Kampus\n• 📞 Kontak Admin\n\nSilakan ketik pertanyaan atau klik tombol di bawah!", priority: 1 },
  ]);
  console.log("  ✅ 11 intents seeded");

  // Close connection
  await queryClient.end();
  console.log("\n🎉 Database seeded successfully!");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
