/* ============================================
   SEED.TS — Populate Postgres with initial data
   Real data from Politeknik Negeri Manado (Polimdo)
   Usage: npm run db:seed  (or npx tsx src/db/seed.ts)
   ============================================ */

import { db, queryClient } from "./index.js";
import {
  kampusInfo,
  jurusan,
  prodi,
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
    alamat: "Jl. Raya Politeknik, Desa Buha, Kec. Mapanget, Kota Manado, Sulawesi Utara 95252",
    telepon: "(0431) 815212",
    email: "informasi@polimdo.ac.id",
    website: "https://polimdo.ac.id",
    whatsapp: "https://chat.whatsapp.com/H2OEOpImaZuGXfxnD4HzQG",
    mapsUrl: "https://maps.google.com/?q=Politeknik+Negeri+Manado",
    visi: "Politeknik Negeri Manado menjadi penyelenggara pendidikan vokasi terkemuka dalam menghasilkan sumber daya manusia yang memenuhi standar kompetensi global serta menjadi pusat pelatihan dan penerapan teknologi.",
    misi: [
      "Mengembangkan mutu layanan program pendidikan diploma secara profesional untuk menghasilkan lulusan yang berkualitas dan berdaya saing sesuai standar kompetensi nasional dan internasional.",
      "Mengembangkan dan memberdayakan potensi tenaga kependidikan secara berkelanjutan.",
      "Mengembangkan potensi manajemen institusi yang profesional berdasarkan Good Governance.",
      "Menciptakan proses manajerial yang baik melalui pengembangan sistem informasi manajemen.",
      "Menciptakan sistem pelayanan jasa pendidikan dan pengajaran berbasis pada mutu dan produktivitas.",
      "Membangun daya saing lulusan di dunia kerja.",
    ],
  });
  console.log("  ✅ kampus_info seeded");

  // ── Jurusan (Departments) ──
  console.log("🎓 Seeding jurusan...");
  await db.delete(jurusan);
  const [jSipil, jElektro, jMesin, jAkuntansi, jAdminBisnis, jPariwisata] = await db
    .insert(jurusan)
    .values([
      { nama: "Teknik Sipil", icon: "🏗️", deskripsi: "Jurusan yang mempelajari perencanaan, perancangan, dan pelaksanaan konstruksi bangunan sipil.", sortOrder: 1 },
      { nama: "Teknik Elektro", icon: "⚡", deskripsi: "Jurusan yang mempelajari sistem kelistrikan, elektronika, informatika, dan teknologi telekomunikasi.", sortOrder: 2 },
      { nama: "Teknik Mesin", icon: "⚙️", deskripsi: "Jurusan yang mempelajari perancangan, pembuatan, dan pemeliharaan mesin dan peralatan industri.", sortOrder: 3 },
      { nama: "Akuntansi", icon: "📊", deskripsi: "Jurusan yang mempelajari pencatatan, pelaporan, dan analisis keuangan sesuai standar akuntansi.", sortOrder: 4 },
      { nama: "Administrasi Bisnis", icon: "💼", deskripsi: "Jurusan yang mempelajari manajemen, pemasaran, dan administrasi bisnis modern.", sortOrder: 5 },
      { nama: "Pariwisata", icon: "🌴", deskripsi: "Jurusan yang mempelajari manajemen hospitality, tour planning, dan pengembangan destinasi wisata.", sortOrder: 6 },
    ])
    .returning();
  console.log("  ✅ 6 jurusan seeded");

  // ── Program Studi (Prodi) ──
  console.log("📚 Seeding prodi...");
  await db.delete(prodi);
  await db.insert(prodi).values([
    // Teknik Sipil — 4 prodi
    { jurusanId: jSipil.id, nama: "Rekayasa Perawatan dan Restorasi Bangunan Gedung", jenjang: "M.Tr.", akreditasi: "Baik Sekali", biaya: "Hubungi kampus", icon: "🏛️", sortOrder: 1 },
    { jurusanId: jSipil.id, nama: "Konstruksi Bangunan Gedung", jenjang: "S.Tr. (D-IV)", akreditasi: "B", biaya: "Rp4.300.000 / semester", icon: "🏗️", sortOrder: 2 },
    { jurusanId: jSipil.id, nama: "Teknik Jalan Jembatan", jenjang: "S.Tr. (D-IV)", akreditasi: "B", biaya: "Rp4.300.000 / semester", icon: "🛤️", sortOrder: 3 },
    { jurusanId: jSipil.id, nama: "Teknik Sipil", jenjang: "D-III", akreditasi: "B", biaya: "Rp3.700.000 / semester", icon: "🏗️", sortOrder: 4 },

    // Teknik Elektro — 4 prodi
    { jurusanId: jElektro.id, nama: "Teknik Listrik", jenjang: "S.Tr. (D-IV)", akreditasi: "B", biaya: "Rp4.300.000 / semester", icon: "🔌", sortOrder: 1 },
    { jurusanId: jElektro.id, nama: "Teknik Informatika", jenjang: "S.Tr. (D-IV)", akreditasi: "B", biaya: "Rp4.900.000 / semester", icon: "💻", sortOrder: 2 },
    { jurusanId: jElektro.id, nama: "Teknik Listrik", jenjang: "D-III", akreditasi: "B", biaya: "Rp3.700.000 / semester", icon: "⚡", sortOrder: 3 },
    { jurusanId: jElektro.id, nama: "Teknik Komputer", jenjang: "D-III", akreditasi: "B", biaya: "Rp3.700.000 / semester", icon: "🖥️", sortOrder: 4 },

    // Teknik Mesin — 2 prodi
    { jurusanId: jMesin.id, nama: "Teknik Mesin Produksi dan Perawatan", jenjang: "S.Tr. (D-IV)", akreditasi: "B", biaya: "Rp4.300.000 / semester", icon: "🔧", sortOrder: 1 },
    { jurusanId: jMesin.id, nama: "Teknologi Rekayasa Mekatronika", jenjang: "S.Tr. (D-IV)", akreditasi: "B", biaya: "Rp4.300.000 / semester", icon: "🤖", sortOrder: 2 },

    // Akuntansi — 3 prodi
    { jurusanId: jAkuntansi.id, nama: "Akuntansi Keuangan", jenjang: "S.Tr. (D-IV)", akreditasi: "B", biaya: "Rp4.900.000 / semester", icon: "💰", sortOrder: 1 },
    { jurusanId: jAkuntansi.id, nama: "Akuntansi Perpajakan", jenjang: "S.Tr. (D-IV)", akreditasi: "B", biaya: "Rp2.500.000 / semester", icon: "📋", sortOrder: 2 },
    { jurusanId: jAkuntansi.id, nama: "Akuntansi", jenjang: "D-III", akreditasi: "B", biaya: "Rp2.500.000 / semester", icon: "📊", sortOrder: 3 },

    // Administrasi Bisnis — 3 prodi
    { jurusanId: jAdminBisnis.id, nama: "Manajemen Bisnis", jenjang: "S.Tr. (D-IV)", akreditasi: "B", biaya: "Rp4.300.000 / semester", icon: "📈", sortOrder: 1 },
    { jurusanId: jAdminBisnis.id, nama: "Administrasi Bisnis", jenjang: "D-III", akreditasi: "B", biaya: "Rp2.500.000 / semester", icon: "💼", sortOrder: 2 },
    { jurusanId: jAdminBisnis.id, nama: "Manajemen Pemasaran", jenjang: "D-III", akreditasi: "B", biaya: "Rp2.500.000 / semester", icon: "📣", sortOrder: 3 },

    // Pariwisata — 5 prodi
    { jurusanId: jPariwisata.id, nama: "Perhotelan", jenjang: "S.Tr. (D-IV)", akreditasi: "B", biaya: "Rp4.900.000 / semester", icon: "🏨", sortOrder: 1 },
    { jurusanId: jPariwisata.id, nama: "Manajemen Pariwisata Global", jenjang: "S.Tr. (D-IV)", akreditasi: "B", biaya: "Hubungi kampus", icon: "🌍", sortOrder: 2 },
    { jurusanId: jPariwisata.id, nama: "Pariwisata", jenjang: "D-III", akreditasi: "B", biaya: "Rp2.500.000 / semester", icon: "🌴", sortOrder: 3 },
    { jurusanId: jPariwisata.id, nama: "Usaha Perjalanan Wisata", jenjang: "D-III", akreditasi: "B", biaya: "Rp2.500.000 / semester", icon: "✈️", sortOrder: 4 },
    { jurusanId: jPariwisata.id, nama: "Ekowisata Bawah Laut", jenjang: "D-III", akreditasi: "B", biaya: "Rp2.500.000 / semester", icon: "🤿", sortOrder: 5 },
  ]);
  console.log("  ✅ 21 prodi seeded");

  // ── Pendaftaran ──
  console.log("📝 Seeding pendaftaran...");
  await db.delete(pendaftaran);
  await db.insert(pendaftaran).values([
    { jalur: "SNBP", nama: "Seleksi Nasional Berdasarkan Prestasi", periode: "Februari 2026", syarat: "Nilai rapor semester 1-5, ranking sekolah, prestasi akademik/non-akademik.", biayaPendaftaran: "Gratis", icon: "🏆", sortOrder: 1 },
    { jalur: "SNBT", nama: "Seleksi Nasional Berdasarkan Tes", periode: "Maret 2026", syarat: "Lulus SMA/SMK/sederajat, mengikuti UTBK (Ujian Tulis Berbasis Komputer).", biayaPendaftaran: "Rp200.000", icon: "📝", sortOrder: 2 },
    { jalur: "UMPN", nama: "Ujian Masuk Politeknik Negeri", periode: "April - Juni 2026", syarat: "Lulus SMA/SMK/sederajat, mengikuti ujian tulis khusus politeknik se-Indonesia.", biayaPendaftaran: "Rp200.000", icon: "📋", sortOrder: 3 },
    { jalur: "Mandiri Prestasi", nama: "Jalur Prestasi Non-Akademik", periode: "Juli - Agustus 2026", syarat: "Memiliki sertifikat/piagam minimal juara 3 tingkat nasional di bidang akademik maupun non-akademik. Tanpa tes.", biayaPendaftaran: "Rp200.000", icon: "🥇", sortOrder: 4 },
    { jalur: "Mandiri", nama: "Seleksi Mandiri Polimdo", periode: "Juli - Agustus 2026", syarat: "Lulus SMA/SMK/sederajat, nilai rapor semester 1-5 rata-rata minimal 80 (untuk lulusan tahun berjalan).", biayaPendaftaran: "Rp200.000", icon: "📄", sortOrder: 5 },
  ]);
  console.log("  ✅ 5 pendaftaran seeded");

  // ── Beasiswa ──
  console.log("🏅 Seeding beasiswa...");
  await db.delete(beasiswa);
  await db.insert(beasiswa).values([
    { nama: "KIP Kuliah", deskripsi: "Bantuan biaya pendidikan dari pemerintah untuk mahasiswa kurang mampu. Penerima KIP-Kuliah dibebaskan dari biaya UKT atau mendapatkan subsidi penuh.", icon: "🎓", sortOrder: 1 },
    { nama: "Beasiswa Prestasi", deskripsi: "Beasiswa untuk mahasiswa berprestasi akademik dan non-akademik selama masa studi.", icon: "🏅", sortOrder: 2 },
    { nama: "Beasiswa Daerah", deskripsi: "Beasiswa dari pemerintah daerah Sulawesi Utara untuk mahasiswa berprestasi.", icon: "🏛️", sortOrder: 3 },
    { nama: "Beasiswa PPA", deskripsi: "Peningkatan Prestasi Akademik (PPA) dari Kemendikbud untuk mahasiswa berprestasi.", icon: "📚", sortOrder: 4 },
  ]);
  console.log("  ✅ 4 beasiswa seeded");

  // ── Fasilitas ──
  console.log("🏫 Seeding fasilitas...");
  await db.delete(fasilitas);
  await db.insert(fasilitas).values([
    { nama: "Kelas Full AC", icon: "❄️", sortOrder: 1 },
    { nama: "Laboratorium per Jurusan", icon: "🔬", sortOrder: 2 },
    { nama: "Laboratorium Komputer", icon: "💻", sortOrder: 3 },
    { nama: "Perpustakaan", icon: "📚", sortOrder: 4 },
    { nama: "Gedung Olahraga (GOR)", icon: "🏟️", sortOrder: 5 },
    { nama: "Auditorium", icon: "🎭", sortOrder: 6 },
    { nama: "Asrama Mahasiswa", icon: "🏠", sortOrder: 7 },
    { nama: "Ruang Kuliah Terpadu", icon: "🏫", sortOrder: 8 },
    { nama: "Kantin", icon: "🍽️", sortOrder: 9 },
    { nama: "Kafe", icon: "☕", sortOrder: 10 },
    { nama: "Galeri Investasi", icon: "📈", sortOrder: 11 },
    { nama: "Hotspot WiFi / LAN", icon: "📶", sortOrder: 12 },
    { nama: "Bengkel Praktik", icon: "🔧", sortOrder: 13 },
    { nama: "Lapangan Olahraga", icon: "⚽", sortOrder: 14 },
    { nama: "Area Parkir Luas", icon: "🅿️", sortOrder: 15 },
    { nama: "Masjid", icon: "🕌", sortOrder: 16 },
  ]);
  console.log("  ✅ 16 fasilitas seeded");

  // ── FAQ ──
  console.log("❓ Seeding faq...");
  await db.delete(faq);
  await db.insert(faq).values([
    { pertanyaan: "Bagaimana cara mendaftar di Polimdo?", jawaban: "Pendaftaran bisa melalui 5 jalur: SNBP (berdasarkan prestasi), SNBT (berdasarkan tes UTBK), UMPN (Ujian Masuk Politeknik Negeri), Jalur Prestasi Non-Akademik, dan Seleksi Mandiri. Kunjungi website resmi Polimdo atau sim.polimdo.ac.id/spmb/ untuk informasi lengkap.", sortOrder: 1 },
    { pertanyaan: "Berapa biaya kuliah di Polimdo?", jawaban: "UKT bervariasi per program studi: D-III mulai Rp2.500.000, S.Tr. (D-IV) mulai Rp2.500.000 - Rp4.900.000 per semester. Untuk jalur Mandiri ada tambahan SPI (Sumbangan Pengembangan Institusi). Penerima KIP-Kuliah dibebaskan dari UKT.", sortOrder: 2 },
    { pertanyaan: "Apa saja jurusan yang tersedia?", jawaban: "Polimdo memiliki 6 jurusan dengan 21 program studi: Teknik Sipil (4 prodi), Teknik Elektro (4 prodi), Teknik Mesin (2 prodi), Akuntansi (3 prodi), Administrasi Bisnis (3 prodi), dan Pariwisata (5 prodi).", sortOrder: 3 },
    { pertanyaan: "Apakah ada beasiswa?", jawaban: "Ya! Tersedia KIP Kuliah (bebas UKT), Beasiswa Prestasi, Beasiswa Daerah Sulawesi Utara, dan Beasiswa PPA dari Kemendikbud.", sortOrder: 4 },
    { pertanyaan: "Dimana lokasi kampus Polimdo?", jawaban: "Polimdo berlokasi di Jl. Raya Politeknik, Desa Buha, Kec. Mapanget, Kota Manado, Sulawesi Utara 95252.", sortOrder: 5 },
    { pertanyaan: "Kapan jadwal pendaftaran mahasiswa baru?", jawaban: "SNBP: Februari, SNBT: Maret, UMPN: April-Juni, Mandiri Prestasi & Mandiri: Juli-Agustus. Kunjungi website resmi atau sim.polimdo.ac.id/spmb/ untuk tanggal pasti.", sortOrder: 6 },
  ]);
  console.log("  ✅ 6 FAQ seeded");

  // ── Kontak ──
  console.log("📞 Seeding kontak...");
  await db.delete(kontak);
  await db.insert(kontak).values([
    { tipe: "whatsapp", label: "Grup WhatsApp Polimdo", value: "Gabung Grup", url: "https://chat.whatsapp.com/H2OEOpImaZuGXfxnD4HzQG", icon: "💬", sortOrder: 1 },
    { tipe: "email", label: "Email Kampus", value: "informasi@polimdo.ac.id", url: "mailto:informasi@polimdo.ac.id", icon: "📧", sortOrder: 2 },
    { tipe: "telepon", label: "Telepon Kampus", value: "(0431) 815212", url: "tel:+62431815212", icon: "📞", sortOrder: 3 },
    { tipe: "website", label: "Website Resmi", value: "polimdo.ac.id", url: "https://polimdo.ac.id", icon: "🌐", sortOrder: 4 },
    { tipe: "registrasi", label: "Registrasi Online", value: "sim.polimdo.ac.id/spmb", url: "https://sim.polimdo.ac.id/spmb/", icon: "📝", sortOrder: 5 },
  ]);
  console.log("  ✅ 5 kontak seeded");

  // ── Intents ──
  console.log("🧠 Seeding intents...");
  await db.delete(intents);
  await db.insert(intents).values([
    { name: "jurusan", keywords: ["jurusan", "prodi", "program studi", "fakultas", "departemen", "teknik sipil", "teknik elektro", "teknik mesin", "akuntansi", "administrasi bisnis", "pariwisata", "teknik informatika", "teknik komputer", "teknik listrik", "perhotelan", "ekowisata", "mekatronika", "manajemen bisnis", "manajemen pemasaran", "manajemen pariwisata", "akuntansi keuangan", "akuntansi perpajakan", "jalan jembatan", "restorasi bangunan"], responseType: "info-card", introText: "Berikut daftar jurusan dan program studi di Polimdo:", dataSource: "jurusan", priority: 10 },
    { name: "biaya", keywords: ["biaya", "ukt", "spp", "bayar", "kuliah berapa", "harga", "tarif", "biaya kuliah", "mahal", "spi", "sumbangan"], responseType: "info-card", introText: "Berikut rincian estimasi UKT per semester:", dataSource: "biaya", priority: 10 },
    { name: "pendaftaran", keywords: ["daftar", "pendaftaran", "registrasi", "snbp", "snbt", "mandiri", "pmb", "cara daftar", "mendaftar", "umpn", "ujian masuk", "jalur prestasi", "sim.polimdo"], responseType: "info-card", introText: "Polimdo membuka pendaftaran melalui beberapa jalur:", dataSource: "pendaftaran", priority: 10 },
    { name: "beasiswa", keywords: ["beasiswa", "kip", "bantuan biaya", "ppa", "kip kuliah"], responseType: "info-card", introText: "Polimdo menyediakan beberapa program beasiswa:", dataSource: "beasiswa", priority: 10 },
    { name: "lokasi", keywords: ["lokasi", "alamat", "dimana", "di mana", "maps", "peta", "buha", "mapanget"], responseType: "text", dataSource: "lokasi", priority: 8 },
    { name: "kontak", keywords: ["kontak", "telepon", "telpon", "whatsapp", "hubungi", "email", "website"], responseType: "fallback", responseTemplate: "Berikut kontak yang bisa kamu hubungi:", dataSource: "kontak", priority: 8 },
    { name: "fasilitas", keywords: ["fasilitas", "laboratorium", "perpustakaan", "perpus", "bengkel", "wifi", "kantin", "asrama", "gor", "auditorium", "parkir"], responseType: "text", dataSource: "fasilitas", priority: 8 },
    { name: "jadwal", keywords: ["jadwal", "kalender", "ujian", "semester", "akademik"], responseType: "text", responseTemplate: "📅 **Jadwal Akademik Polimdo 2025/2026:**\n\n• Semester Ganjil: September 2025 - Januari 2026\n• UTS Ganjil: Oktober 2025\n• UAS Ganjil: Januari 2026\n• Semester Genap: Februari - Juni 2026\n• UTS Genap: April 2026\n• UAS Genap: Juni 2026\n\nUntuk jadwal lebih detail, kunjungi website resmi Polimdo atau hubungi kampus di (0431) 815212.", priority: 6 },
    { name: "akreditasi", keywords: ["akreditasi", "terakreditasi", "mutu", "kualitas", "ban-pt"], responseType: "text", dataSource: "akreditasi", priority: 6 },
    { name: "visi_misi", keywords: ["visi", "misi", "tujuan", "visi misi"], responseType: "text", dataSource: "visi_misi", priority: 6 },
    { name: "thanks", keywords: ["terima kasih", "makasih", "thanks", "thank you", "trims", "thx"], responseType: "text", responseTemplate: "Sama-sama! 😊 Senang bisa membantu. Jika ada pertanyaan lain, jangan ragu untuk bertanya ya! 🤗", priority: 2 },
    { name: "greeting", keywords: ["halo", "hai ", " hai", "hello", "selamat pagi", "selamat siang", "selamat sore", "selamat malam", "hey ", " hey", "assalamualaikum"], exactMatch: ["hai", "hey", "halo", "hi"], responseType: "text", responseTemplate: "Halo! 👋 Saya asisten virtual Polimdo. Saya bisa membantu kamu dengan informasi seputar:\n\n• 🎓 Jurusan & Program Studi (21 prodi)\n• 💰 Biaya Kuliah (UKT)\n• 📝 Pendaftaran (SNBP/SNBT/UMPN/Mandiri)\n• 🏅 Beasiswa\n• 📍 Lokasi Kampus\n• 📞 Kontak\n\nSilakan ketik pertanyaan atau klik tombol di bawah!", priority: 1 },
  ]);
  console.log("  ✅ 12 intents seeded");

  // Close connection
  await queryClient.end();
  console.log("\n🎉 Database seeded successfully!");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
