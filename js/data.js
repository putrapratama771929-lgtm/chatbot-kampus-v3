/* ============================================
   DATA.JS — Campus Knowledge Base (Polimdo)
   (Synced with Database seed.ts)
   ============================================ */

var campusData = {

  // === Info Kampus ===
  kampus: {
    nama: 'Politeknik Negeri Manado',
    singkatan: 'Polimdo',
    alamat: 'Jl. Raya Politeknik, Desa Buha, Kec. Mapanget, Kota Manado, Sulawesi Utara 95252',
    telepon: '(0431) 815212',
    email: 'informasi@polimdo.ac.id',
    website: 'https://polimdo.ac.id',
    whatsapp: 'https://chat.whatsapp.com/H2OEOpImaZuGXfxnD4HzQG',
    maps: 'https://maps.google.com/?q=Politeknik+Negeri+Manado',
    visi: 'Politeknik Negeri Manado menjadi penyelenggara pendidikan vokasi terkemuka dalam menghasilkan sumber daya manusia yang memenuhi standar kompetensi global serta menjadi pusat pelatihan dan penerapan teknologi.',
    misi: [
      'Mengembangkan mutu layanan program pendidikan diploma secara profesional untuk menghasilkan lulusan yang berkualitas dan berdaya saing sesuai standar kompetensi nasional dan internasional.',
      'Mengembangkan dan memberdayakan potensi tenaga kependidikan secara berkelanjutan.',
      'Mengembangkan potensi manajemen institusi yang profesional berdasarkan Good Governance.',
      'Menciptakan proses manajerial yang baik melalui pengembangan sistem informasi manajemen.',
      'Menciptakan sistem pelayanan jasa pendidikan dan pengajaran berbasis pada mutu dan produktivitas.',
      'Membangun daya saing lulusan di dunia kerja.'
    ]
  },

  // === Jurusan / Program Studi ===
  jurusan: [
    {
      nama: 'Teknik Sipil',
      jenjang: 'D-III / S.Tr. / M.Tr.',
      akreditasi: 'B - Baik Sekali',
      icon: '🏗️',
      biaya: 'Rp 3.700.000 - 4.300.000 / semester',
      deskripsi: '4 Prodi: Rekayasa Perawatan Bangunan Gedung (M.Tr), Konstruksi Bangunan Gedung (S.Tr), Teknik Jalan Jembatan (S.Tr), Teknik Sipil (D-III).'
    },
    {
      nama: 'Teknik Elektro',
      jenjang: 'D-III / S.Tr.',
      akreditasi: 'B',
      icon: '⚡',
      biaya: 'Rp 3.700.000 - 4.900.000 / semester',
      deskripsi: '4 Prodi: Teknik Listrik (S.Tr & D-III), Teknik Informatika (S.Tr), Teknik Komputer (D-III).'
    },
    {
      nama: 'Teknik Mesin',
      jenjang: 'S.Tr.',
      akreditasi: 'B',
      icon: '⚙️',
      biaya: 'Rp 4.300.000 / semester',
      deskripsi: '2 Prodi: Teknik Mesin Produksi dan Perawatan (S.Tr), Teknologi Rekayasa Mekatronika (S.Tr).'
    },
    {
      nama: 'Akuntansi',
      jenjang: 'D-III / S.Tr.',
      akreditasi: 'B',
      icon: '📊',
      biaya: 'Rp 2.500.000 - 4.900.000 / semester',
      deskripsi: '3 Prodi: Akuntansi Keuangan (S.Tr), Akuntansi Perpajakan (S.Tr), Akuntansi (D-III).'
    },
    {
      nama: 'Administrasi Bisnis',
      jenjang: 'D-III / S.Tr.',
      akreditasi: 'B',
      icon: '💼',
      biaya: 'Rp 2.500.000 - 4.300.000 / semester',
      deskripsi: '3 Prodi: Manajemen Bisnis (S.Tr), Administrasi Bisnis (D-III), Manajemen Pemasaran (D-III).'
    },
    {
      nama: 'Pariwisata',
      jenjang: 'D-III / S.Tr.',
      akreditasi: 'B',
      icon: '🌴',
      biaya: 'Rp 2.500.000 - 4.900.000 / semester',
      deskripsi: '5 Prodi: Perhotelan (S.Tr), Manajemen Pariwisata Global (S.Tr), Pariwisata (D-III), Usaha Perjalanan Wisata (D-III), Ekowisata Bawah Laut (D-III).'
    }
  ],

  // === Jalur Pendaftaran ===
  pendaftaran: [
    {
      jalur: 'SNBP',
      nama: 'Seleksi Nasional Berdasarkan Prestasi',
      periode: 'Februari 2026',
      syarat: 'Nilai rapor semester 1-5, ranking sekolah, prestasi akademik/non-akademik.',
      biaya_pendaftaran: 'Gratis',
      icon: '🏆'
    },
    {
      jalur: 'SNBT',
      nama: 'Seleksi Nasional Berdasarkan Tes',
      periode: 'Maret 2026',
      syarat: 'Lulus SMA/SMK/sederajat, mengikuti UTBK (Ujian Tulis Berbasis Komputer).',
      biaya_pendaftaran: 'Rp 200.000',
      icon: '📝'
    },
    {
      jalur: 'UMPN',
      nama: 'Ujian Masuk Politeknik Negeri',
      periode: 'April - Juni 2026',
      syarat: 'Lulus SMA/SMK/sederajat, mengikuti ujian tulis khusus politeknik se-Indonesia.',
      biaya_pendaftaran: 'Rp 200.000',
      icon: '📋'
    },
    {
      jalur: 'Mandiri Prestasi',
      nama: 'Jalur Prestasi Non-Akademik',
      periode: 'Juli - Agustus 2026',
      syarat: 'Memiliki sertifikat/piagam minimal juara 3 tingkat nasional. Tanpa tes.',
      biaya_pendaftaran: 'Rp 200.000',
      icon: '🥇'
    },
    {
      jalur: 'Mandiri',
      nama: 'Seleksi Mandiri Polimdo',
      periode: 'Juli - Agustus 2026',
      syarat: 'Lulus SMA/SMK/sederajat, seleksi mandiri institusi.',
      biaya_pendaftaran: 'Rp 200.000',
      icon: '📄'
    }
  ],

  // === Beasiswa ===
  beasiswa: [
    {
      nama: 'KIP Kuliah',
      deskripsi: 'Bantuan biaya pendidikan dari pemerintah untuk mahasiswa kurang mampu. Bebas UKT.',
      icon: '🎓'
    },
    {
      nama: 'Beasiswa Prestasi',
      deskripsi: 'Beasiswa untuk mahasiswa berprestasi akademik dan non-akademik selama masa studi.',
      icon: '🏅'
    },
    {
      nama: 'Beasiswa Daerah',
      deskripsi: 'Beasiswa dari pemerintah daerah Sulawesi Utara untuk mahasiswa berprestasi.',
      icon: '🏛️'
    },
    {
      nama: 'Beasiswa PPA',
      deskripsi: 'Peningkatan Prestasi Akademik (PPA) dari Kemendikbud untuk mahasiswa berprestasi.',
      icon: '📚'
    }
  ],

  // === Fasilitas ===
  fasilitas: [
    { nama: 'Kelas Full AC', icon: '❄️' },
    { nama: 'Laboratorium per Jurusan', icon: '🔬' },
    { nama: 'Laboratorium Komputer', icon: '💻' },
    { nama: 'Perpustakaan', icon: '📚' },
    { nama: 'Gedung Olahraga (GOR)', icon: '🏟️' },
    { nama: 'Auditorium', icon: '🎭' },
    { nama: 'Asrama Mahasiswa', icon: '🏠' },
    { nama: 'Ruang Kuliah Terpadu', icon: '🏫' },
    { nama: 'Kantin & Kafe', icon: '🍽️' },
    { nama: 'Galeri Investasi', icon: '📈' },
    { nama: 'Hotspot WiFi / LAN', icon: '📶' },
    { nama: 'Bengkel Praktik', icon: '🔧' },
    { nama: 'Lapangan Olahraga', icon: '⚽' },
    { nama: 'Area Parkir Luas', icon: '🅿️' },
    { nama: 'Masjid', icon: '🕌' }
  ],

  // === FAQ ===
  faq: [
    {
      q: 'Bagaimana cara mendaftar di Polimdo?',
      a: 'Pendaftaran bisa melalui 5 jalur: SNBP (berdasarkan prestasi), SNBT (berdasarkan tes UTBK), UMPN (Ujian Masuk Politeknik Negeri), Jalur Prestasi Non-Akademik, dan Seleksi Mandiri. Kunjungi sim.polimdo.ac.id/spmb/ untuk info lengkap.'
    },
    {
      q: 'Berapa biaya kuliah di Polimdo?',
      a: 'UKT bervariasi per program studi: D-III mulai Rp2.500.000, S.Tr. (D-IV) mulai Rp2.500.000 - Rp4.900.000 per semester. Jalur Mandiri ada tambahan SPI. Penerima KIP-Kuliah dibebaskan dari UKT.'
    },
    {
      q: 'Apa saja jurusan yang tersedia?',
      a: 'Polimdo memiliki 6 jurusan dengan 21 program studi: Teknik Sipil (4 prodi), Teknik Elektro (4 prodi), Teknik Mesin (2 prodi), Akuntansi (3 prodi), Administrasi Bisnis (3 prodi), dan Pariwisata (5 prodi).'
    },
    {
      q: 'Apakah ada beasiswa?',
      a: 'Ya! Tersedia KIP Kuliah (bebas UKT), Beasiswa Prestasi, Beasiswa Daerah Sulawesi Utara, dan Beasiswa PPA dari Kemendikbud.'
    },
    {
      q: 'Dimana lokasi kampus Polimdo?',
      a: 'Polimdo berlokasi di Jl. Raya Politeknik, Desa Buha, Kec. Mapanget, Kota Manado, Sulawesi Utara 95252.'
    },
    {
      q: 'Kapan jadwal pendaftaran mahasiswa baru?',
      a: 'SNBP: Februari, SNBT: Maret, UMPN: April-Juni, Mandiri Prestasi & Mandiri: Juli-Agustus. Kunjungi website resmi untuk tanggal pasti.'
    }
  ],

  // === Kontak Admin ===
  kontak: {
    whatsapp: { label: 'Grup WhatsApp Polimdo', value: 'Gabung Grup', url: 'https://chat.whatsapp.com/H2OEOpImaZuGXfxnD4HzQG', icon: '💬' },
    email: { label: 'Email Kampus', value: 'informasi@polimdo.ac.id', url: 'mailto:informasi@polimdo.ac.id', icon: '📧' },
    telepon: { label: 'Telepon Kampus', value: '(0431) 815212', url: 'tel:+62431815212', icon: '📞' },
    website: { label: 'Website Resmi', value: 'polimdo.ac.id', url: 'https://polimdo.ac.id', icon: '🌐' },
    registrasi: { label: 'Registrasi Online', value: 'sim.polimdo.ac.id/spmb', url: 'https://sim.polimdo.ac.id/spmb/', icon: '📝' }
  }
};
