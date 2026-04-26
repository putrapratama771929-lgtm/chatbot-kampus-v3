/* ============================================
   DATA.JS — Campus Knowledge Base (Polimdo)
   ============================================ */

var campusData = {

  // === Info Kampus ===
  kampus: {
    nama: 'Politeknik Negeri Manado',
    singkatan: 'Polimdo',
    alamat: 'Jl. Politeknik, Buha, Kec. Mapanget, Kota Manado, Sulawesi Utara 95252',
    telepon: '(0431) 812 635',
    email: 'info@polimdo.ac.id',
    website: 'https://polimdo.ac.id',
    whatsapp: '081234567890',
    maps: 'https://maps.google.com/?q=Politeknik+Negeri+Manado',
    visi: 'Menjadi politeknik unggul yang menghasilkan lulusan berkompeten, inovatif, dan berdaya saing global.',
    misi: [
      'Menyelenggarakan pendidikan vokasi berkualitas tinggi.',
      'Melaksanakan penelitian terapan yang bermanfaat bagi masyarakat.',
      'Menjalin kerjasama dengan industri dan institusi dalam dan luar negeri.',
      'Membentuk lulusan berkarakter dan siap kerja.'
    ]
  },

  // === Jurusan / Program Studi ===
  jurusan: [
    {
      nama: 'Teknik Sipil',
      jenjang: 'D-III / D-IV',
      akreditasi: 'B',
      icon: '🏗️',
      biaya: 'Rp 3.500.000 - 6.000.000 / semester',
      deskripsi: 'Mempelajari perencanaan, perancangan, dan pelaksanaan konstruksi bangunan sipil.'
    },
    {
      nama: 'Teknik Elektro',
      jenjang: 'D-III / D-IV',
      akreditasi: 'B',
      icon: '⚡',
      biaya: 'Rp 3.500.000 - 6.000.000 / semester',
      deskripsi: 'Mempelajari sistem kelistrikan, elektronika, dan teknologi telekomunikasi.'
    },
    {
      nama: 'Teknik Mesin',
      jenjang: 'D-III / D-IV',
      akreditasi: 'B',
      icon: '⚙️',
      biaya: 'Rp 3.500.000 - 6.000.000 / semester',
      deskripsi: 'Mempelajari perancangan, pembuatan, dan pemeliharaan mesin dan peralatan industri.'
    },
    {
      nama: 'Akuntansi',
      jenjang: 'D-III / D-IV',
      akreditasi: 'B',
      icon: '📊',
      biaya: 'Rp 3.000.000 - 5.500.000 / semester',
      deskripsi: 'Mempelajari pencatatan, pelaporan, dan analisis keuangan sesuai standar akuntansi.'
    },
    {
      nama: 'Administrasi Bisnis',
      jenjang: 'D-III / D-IV',
      akreditasi: 'B',
      icon: '💼',
      biaya: 'Rp 3.000.000 - 5.500.000 / semester',
      deskripsi: 'Mempelajari manajemen, pemasaran, dan administrasi bisnis modern.'
    },
    {
      nama: 'Pariwisata',
      jenjang: 'D-III / D-IV',
      akreditasi: 'B',
      icon: '🌴',
      biaya: 'Rp 3.000.000 - 5.500.000 / semester',
      deskripsi: 'Mempelajari manajemen hospitality, tour planning, dan pengembangan destinasi wisata.'
    }
  ],

  // === Jalur Pendaftaran ===
  pendaftaran: [
    {
      jalur: 'SNBP',
      nama: 'Seleksi Nasional Berdasarkan Prestasi',
      periode: 'Januari - Februari 2026',
      syarat: 'Nilai rapor semester 1-5, ranking sekolah, prestasi akademik/non-akademik.',
      biaya_pendaftaran: 'Gratis',
      icon: '🏆'
    },
    {
      jalur: 'SNBT',
      nama: 'Seleksi Nasional Berdasarkan Tes',
      periode: 'Maret - Juni 2026',
      syarat: 'Lulus SMA/SMK/sederajat, mengikuti ujian UTBK.',
      biaya_pendaftaran: 'Rp 200.000',
      icon: '📝'
    },
    {
      jalur: 'Mandiri',
      nama: 'Seleksi Mandiri Polimdo',
      periode: 'Juli - Agustus 2026',
      syarat: 'Lulus SMA/SMK/sederajat, mengisi formulir online, tes tertulis/wawancara.',
      biaya_pendaftaran: 'Rp 250.000',
      icon: '📋'
    }
  ],

  // === Beasiswa ===
  beasiswa: [
    {
      nama: 'KIP Kuliah',
      deskripsi: 'Bantuan biaya pendidikan dari pemerintah untuk mahasiswa kurang mampu.',
      icon: '🎓'
    },
    {
      nama: 'Beasiswa Prestasi',
      deskripsi: 'Beasiswa untuk mahasiswa berprestasi akademik dan non-akademik.',
      icon: '🏅'
    },
    {
      nama: 'Beasiswa Daerah',
      deskripsi: 'Beasiswa dari pemerintah daerah Sulawesi Utara.',
      icon: '🏛️'
    },
    {
      nama: 'Beasiswa PPA',
      deskripsi: 'Peningkatan Prestasi Akademik dari Kemendikbud.',
      icon: '📚'
    }
  ],

  // === Fasilitas ===
  fasilitas: [
    { nama: 'Laboratorium Komputer', icon: '💻' },
    { nama: 'Perpustakaan', icon: '📚' },
    { nama: 'Lab Bahasa', icon: '🗣️' },
    { nama: 'Aula Serbaguna', icon: '🏛️' },
    { nama: 'Lapangan Olahraga', icon: '⚽' },
    { nama: 'Masjid', icon: '🕌' },
    { nama: 'Kantin', icon: '🍽️' },
    { nama: 'Bengkel Praktik', icon: '🔧' },
    { nama: 'Hotspot WiFi', icon: '📶' }
  ],

  // === FAQ ===
  faq: [
    {
      q: 'Bagaimana cara mendaftar di Polimdo?',
      a: 'Pendaftaran bisa melalui 3 jalur: SNBP (berdasarkan prestasi), SNBT (berdasarkan tes), dan Seleksi Mandiri. Kunjungi website resmi Polimdo untuk informasi lengkap.'
    },
    {
      q: 'Berapa biaya kuliah di Polimdo?',
      a: 'Biaya kuliah bervariasi antara Rp 3.000.000 - 6.000.000 per semester tergantung jurusan dan jalur masuk. Tersedia juga beasiswa KIP Kuliah.'
    },
    {
      q: 'Apa saja jurusan yang tersedia?',
      a: 'Polimdo memiliki 6 jurusan: Teknik Sipil, Teknik Elektro, Teknik Mesin, Akuntansi, Administrasi Bisnis, dan Pariwisata.'
    },
    {
      q: 'Apakah ada beasiswa?',
      a: 'Ya! Tersedia KIP Kuliah, Beasiswa Prestasi, Beasiswa Daerah, dan Beasiswa PPA.'
    },
    {
      q: 'Dimana lokasi kampus Polimdo?',
      a: 'Polimdo berlokasi di Jl. Politeknik, Buha, Kec. Mapanget, Kota Manado, Sulawesi Utara.'
    },
    {
      q: 'Kapan jadwal pendaftaran mahasiswa baru?',
      a: 'SNBP: Jan-Feb, SNBT: Mar-Jun, Mandiri: Jul-Agu. Kunjungi website resmi untuk tanggal pasti.'
    }
  ],

  // === Kontak Admin ===
  kontak: {
    whatsapp: { label: 'WhatsApp Admin', value: '081234567890', url: 'https://wa.me/6281234567890', icon: '💬' },
    email: { label: 'Email BAAK', value: 'baak@polimdo.ac.id', url: 'mailto:baak@polimdo.ac.id', icon: '📧' },
    telepon: { label: 'Telepon Kampus', value: '(0431) 812 635', url: 'tel:+62431812635', icon: '📞' }
  }
};
