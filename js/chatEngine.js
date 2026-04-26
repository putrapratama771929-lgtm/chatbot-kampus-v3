/* ============================================
   CHATENGINE.JS — Keyword-Matching Bot Logic
   ============================================ */

var ChatEngine = (function () {

  // Intent definitions: keywords → handler
  // Order matters: more specific intents first, greeting last before fallback
  var intents = [
    {
      name: 'jurusan',
      keywords: ['jurusan', 'prodi', 'program studi', 'fakultas', 'teknik sipil', 'teknik elektro', 'teknik mesin', 'akuntansi', 'administrasi bisnis', 'pariwisata'],
      handler: handleJurusan
    },
    {
      name: 'biaya',
      keywords: ['biaya', 'ukt', 'spp', 'bayar', 'kuliah berapa', 'harga', 'tarif', 'biaya kuliah', 'mahal'],
      handler: handleBiaya
    },
    {
      name: 'pendaftaran',
      keywords: ['daftar', 'pendaftaran', 'registrasi', 'snbp', 'snbt', 'mandiri', 'pmb', 'cara daftar', 'mendaftar'],
      handler: handlePendaftaran
    },
    {
      name: 'beasiswa',
      keywords: ['beasiswa', 'kip', 'bantuan biaya', 'ppa'],
      handler: handleBeasiswa
    },
    {
      name: 'lokasi',
      keywords: ['lokasi', 'alamat', 'dimana', 'di mana', 'maps', 'peta'],
      handler: handleLokasi
    },
    {
      name: 'kontak',
      keywords: ['kontak', 'telepon', 'telpon', 'whatsapp', 'hubungi'],
      handler: handleKontak
    },
    {
      name: 'fasilitas',
      keywords: ['fasilitas', 'laboratorium', 'perpustakaan', 'perpus', 'bengkel', 'wifi', 'kantin'],
      handler: handleFasilitas
    },
    {
      name: 'jadwal',
      keywords: ['jadwal', 'kalender', 'ujian', 'semester', 'akademik'],
      handler: handleJadwal
    },
    {
      name: 'akreditasi',
      keywords: ['akreditasi', 'terakreditasi', 'mutu', 'kualitas'],
      handler: handleAkreditasi
    },
    {
      name: 'thanks',
      keywords: ['terima kasih', 'makasih', 'thanks', 'thank you', 'trims', 'thx'],
      handler: handleThanks
    },
    {
      name: 'greeting',
      keywords: ['halo', 'hai ', ' hai', 'hello', 'selamat pagi', 'selamat siang', 'selamat sore', 'selamat malam', 'hey ', ' hey', 'assalamualaikum'],
      exactMatch: ['hai', 'hey', 'halo', 'hi'],
      handler: handleGreeting
    }
  ];

  // === Process user message ===
  function processMessage(text) {
    var lower = text.toLowerCase().trim();

    // Score each intent by counting keyword matches
    var bestIntent = null;
    var bestScore = 0;

    for (var i = 0; i < intents.length; i++) {
      var intent = intents[i];
      var score = 0;

      // Check exact matches first (whole input equals keyword)
      if (intent.exactMatch) {
        for (var k = 0; k < intent.exactMatch.length; k++) {
          if (lower === intent.exactMatch[k]) {
            return intent.handler(); // Exact match = immediate return
          }
        }
      }

      // Check substring keywords
      for (var j = 0; j < intent.keywords.length; j++) {
        if (lower.indexOf(intent.keywords[j]) !== -1) {
          // Longer keyword match = higher score (more specific)
          score += intent.keywords[j].length;
        }
      }
      if (score > bestScore) {
        bestScore = score;
        bestIntent = intent;
      }
    }

    if (bestIntent) {
      return bestIntent.handler();
    }

    return handleFallback();
  }

  // === Handlers ===
  function handleGreeting() {
    return {
      type: 'text',
      text: 'Halo! 👋 Saya asisten virtual Polimdo. Saya bisa membantu kamu dengan informasi seputar:\n\n• 🎓 Jurusan & Program Studi\n• 💰 Biaya Kuliah\n• 📝 Pendaftaran (SNBP/SNBT/Mandiri)\n• 🏅 Beasiswa\n• 📍 Lokasi Kampus\n• 📞 Kontak Admin\n\nSilakan ketik pertanyaan atau klik tombol di bawah!'
    };
  }

  function handleJurusan() {
    var items = campusData.jurusan.map(function (j) {
      return {
        icon: j.icon,
        name: j.nama,
        detail: j.jenjang + ' • Akreditasi ' + j.akreditasi + ' • ' + j.biaya
      };
    });
    return {
      type: 'info-card',
      text: 'Berikut daftar jurusan di Polimdo:',
      card: {
        title: '🎓 Program Studi Polimdo',
        items: items
      }
    };
  }

  function handleBiaya() {
    var items = campusData.jurusan.map(function (j) {
      return {
        icon: j.icon,
        name: j.nama,
        detail: j.biaya
      };
    });
    return {
      type: 'info-card',
      text: 'Berikut rincian biaya kuliah per semester:',
      card: {
        title: '💰 Biaya Kuliah per Semester',
        items: items
      }
    };
  }

  function handlePendaftaran() {
    var items = campusData.pendaftaran.map(function (p) {
      return {
        icon: p.icon,
        name: p.jalur + ' — ' + p.nama,
        detail: '📅 ' + p.periode + ' | Biaya: ' + p.biaya_pendaftaran + '\n📋 ' + p.syarat
      };
    });
    return {
      type: 'info-card',
      text: 'Polimdo membuka pendaftaran melalui 3 jalur:',
      card: {
        title: '📝 Jalur Pendaftaran',
        items: items
      }
    };
  }

  function handleBeasiswa() {
    var items = campusData.beasiswa.map(function (b) {
      return {
        icon: b.icon,
        name: b.nama,
        detail: b.deskripsi
      };
    });
    return {
      type: 'info-card',
      text: 'Polimdo menyediakan beberapa program beasiswa:',
      card: {
        title: '🏅 Beasiswa Tersedia',
        items: items
      }
    };
  }

  function handleLokasi() {
    var k = campusData.kampus;
    return {
      type: 'text',
      text: '📍 **Lokasi Kampus Polimdo**\n\n' +
        k.alamat + '\n\n' +
        '📞 Telepon: ' + k.telepon + '\n' +
        '📧 Email: ' + k.email + '\n' +
        '🌐 Website: ' + k.website + '\n\n' +
        '🗺️ Lihat di Google Maps:\n' + k.maps
    };
  }

  function handleKontak() {
    return {
      type: 'fallback',
      text: 'Berikut kontak yang bisa kamu hubungi:',
      contacts: campusData.kontak
    };
  }

  function handleFasilitas() {
    var list = campusData.fasilitas.map(function (f) {
      return f.icon + ' ' + f.nama;
    }).join('\n');
    return {
      type: 'text',
      text: '🏫 **Fasilitas Kampus Polimdo:**\n\n' + list
    };
  }

  function handleJadwal() {
    return {
      type: 'text',
      text: '📅 **Jadwal Akademik Polimdo 2025/2026:**\n\n' +
        '• Semester Ganjil: September 2025 - Januari 2026\n' +
        '• UTS Ganjil: Oktober 2025\n' +
        '• UAS Ganjil: Januari 2026\n' +
        '• Semester Genap: Februari - Juni 2026\n' +
        '• UTS Genap: April 2026\n' +
        '• UAS Genap: Juni 2026\n\n' +
        'Untuk jadwal lebih detail, kunjungi website resmi Polimdo atau hubungi BAAK.'
    };
  }

  function handleAkreditasi() {
    var list = campusData.jurusan.map(function (j) {
      return j.icon + ' ' + j.nama + ' — Akreditasi **' + j.akreditasi + '**';
    }).join('\n');
    return {
      type: 'text',
      text: '📋 **Akreditasi Program Studi Polimdo:**\n\n' + list + '\n\nPolimdo secara institusi terakreditasi **B** oleh BAN-PT.'
    };
  }

  function handleThanks() {
    return {
      type: 'text',
      text: 'Sama-sama! 😊 Senang bisa membantu. Jika ada pertanyaan lain, jangan ragu untuk bertanya ya! 🤗'
    };
  }

  function handleFallback() {
    return {
      type: 'fallback',
      text: 'Maaf, saya belum mengerti pertanyaan tersebut. 🤔\n\nCoba gunakan kata kunci seperti: **jurusan**, **biaya**, **pendaftaran**, **beasiswa**, **lokasi**, atau **kontak**.\n\nAtau hubungi admin langsung:',
      contacts: campusData.kontak
    };
  }

  // Public API
  return {
    processMessage: processMessage
  };

})();
