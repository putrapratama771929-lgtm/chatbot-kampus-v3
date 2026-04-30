/* ============================================
   SERVICE: MESSAGE GUARD — Domain and safety rejection
   ============================================ */

import type { BotResponse } from "./intentResolver.js";

export interface GuardResult {
  intentName: string;
  response: BotResponse;
}

const OTHER_CAMPUSES = [
  /\buniversitas\s+sam\s+ratulangi\b/,
  /\bsam\s*ratulangi\b/,
  /\bunsrat\b/,
  /\buniversitas\s+indonesia\b/,
  /\bui\b/,
  /\bitb\b/,
  /\binstitut\s+teknologi\s+bandung\b/,
  /\buniversitas\s+hasanuddin\b/,
  /\bunhas\b/,
  /\bpoliteknik\s+negeri\s+jakarta\b/,
  /\bpnj\b/,
  /\bunima\b/,
  /\buniversitas\s+negeri\s+manado\b/,
  /\bugm\b/,
  /\bipb\b/,
  /\bunpad\b/,
  /\bbrawijaya\b/,
  /\bundip\b/,
  /\bbinus\b/,
  /\btelkom\b/,
  /\bharvard\b/,
  /\bharvard\s+university\b/,
  /\bmit\b/,
  /\bmassachusetts\s+institute\s+of\s+technology\b/,
  /\bstanford\b/,
  /\bstanford\s+university\b/,
  /\boxford\b/,
  /\buniversity\s+of\s+oxford\b/,
  /\bcambridge\b/,
  /\buniversity\s+of\s+cambridge\b/,
];

const CAMPUS_TOPIC_PATTERNS = [
  /\bukt\b/,
  /\bbiaya\b/,
  /\bkuliah\b/,
  /\bpendaftaran\b/,
  /\bdaftar\b/,
  /\bjurusan\b/,
  /\bprogram\s+studi\b/,
  /\bprodi\b/,
  /\bwisuda\b/,
  /\bpassing\s+grade\b/,
];

const NON_POLIMDO_INSTITUTION_MARKERS = [
  /\buniversitas\b/,
  /\buniversity\b/,
  /\binstitut\b/,
  /\binstitute\b/,
  /\bpoliteknik\b/,
  /\bharvard\b/,
  /\bmit\b/,
  /\bstanford\b/,
  /\boxford\b/,
  /\bcambridge\b/,
];

const POLIMDO_MARKERS = [
  /\bpolimdo\b/,
  /\bpoliteknik\s+negeri\s+manado\b/,
];

const UNSAFE_PATTERNS = [
  /\bmenyontek\b/,
  /\bcontekan\b/,
  /\bdokumen\s+palsu\b/,
  /\bijazah\s+palsu\b/,
  /\bmerusak\s+server\b/,
  /\bmembobol\b/,
  /\bhack\b/,
  /\bretas\b/,
  /\bpassword\s+orang\b/,
];

const PRIVACY_PATTERNS = [
  /\bpacar\s+dosen\b/,
  /\bnilai\s+terburuk\b/,
  /\bdata\s+pribadi\b/,
  /\bnomor\s+hp\s+mahasiswa\b/,
  /\balamat\s+rumah\b/,
];

const OUT_OF_DOMAIN_PATTERNS = [
  /\btransfer\s+uang\b/,
  /\btiket\s+konser\b/,
  /\bmemasak\b/,
  /\brendang\b/,
  /\bresep\b/,
  /\bkue\s+bolu\b/,
  /\bcuaca\b/,
  /\bpresiden\b/,
  /\bmembuat\s+ktp\b/,
  /\bharga\s+bitcoin\b/,
  /\bbitcoin\b/,
  /\bcrypto\b/,
  /\bmenu\s+makan\s+siang\b/,
  /\bmenu\s+kantin\s+hari\s+ini\b/,
];

const ABSURD_PATTERNS = [
  /\bastronaut\b/,
  /\blulus\s+kuliah\s+dalam\s+1\s+minggu\b/,
  /\bgedung\s+kampus\s+bisa\s+terbang\b/,
  /\bkuliah\s+di\s+mars\b/,
  /\bbiaya\s+kuliah\s+di\s+mars\b/,
  /\bberbicara\s+dengan\s+hewan\b/,
];

export function guardMessage(message: string): GuardResult | null {
  const normalized = normalize(message);

  if (matchesAny(normalized, UNSAFE_PATTERNS)) {
    return {
      intentName: "safety_rejection",
      response: {
        type: "text",
        text:
          "Maaf, saya tidak bisa membantu permintaan yang melanggar aturan, keamanan, atau integritas akademik.\n\n" +
          "Saya bisa membantu informasi resmi seputar Polimdo seperti jurusan, biaya UKT, pendaftaran, beasiswa, fasilitas, lokasi, dan kontak kampus.",
      },
    };
  }

  if (matchesAny(normalized, PRIVACY_PATTERNS)) {
    return {
      intentName: "privacy_rejection",
      response: {
        type: "text",
        text:
          "Maaf, saya tidak bisa membantu mencari atau membahas informasi pribadi dosen, mahasiswa, atau pihak kampus.\n\n" +
          "Silakan tanyakan informasi umum dan resmi tentang Polimdo seperti pendaftaran, program studi, biaya, beasiswa, fasilitas, atau kontak kampus.",
      },
    };
  }

  if (matchesAny(normalized, OTHER_CAMPUSES) || isOtherInstitutionQuestion(normalized)) {
    return {
      intentName: "other_campus_rejection",
      response: {
        type: "text",
        text:
          "Maaf, saya hanya asisten virtual untuk Politeknik Negeri Manado (Polimdo), jadi saya tidak dapat memberikan informasi tentang kampus lain.\n\n" +
          "Saya bisa membantu informasi Polimdo seperti jurusan, biaya UKT, pendaftaran, beasiswa, fasilitas, lokasi, dan kontak kampus.",
      },
    };
  }

  if (matchesAny(normalized, ABSURD_PATTERNS)) {
    return {
      intentName: "unsupported_campus_claim",
      response: {
        type: "text",
        text:
          "Saya belum menemukan informasi resmi Polimdo yang mendukung hal tersebut, jadi saya tidak akan mengarang jawaban.\n\n" +
          "Untuk informasi yang valid, kamu bisa bertanya tentang program studi, biaya UKT, pendaftaran, beasiswa, fasilitas, lokasi, atau kontak Polimdo.",
      },
    };
  }

  if (matchesAny(normalized, OUT_OF_DOMAIN_PATTERNS)) {
    return {
      intentName: "out_of_scope",
      response: {
        type: "text",
        text:
          "Maaf, pertanyaan itu berada di luar cakupan saya sebagai asisten virtual Polimdo.\n\n" +
          "Saya bisa membantu informasi kampus seperti jurusan, biaya UKT, pendaftaran, beasiswa, fasilitas, lokasi, dan kontak Polimdo.",
      },
    };
  }

  return null;
}

function normalize(message: string) {
  return message
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function matchesAny(value: string, patterns: RegExp[]) {
  return patterns.some((pattern) => pattern.test(value));
}

function isOtherInstitutionQuestion(value: string) {
  return (
    matchesAny(value, CAMPUS_TOPIC_PATTERNS) &&
    matchesAny(value, NON_POLIMDO_INSTITUTION_MARKERS) &&
    !matchesAny(value, POLIMDO_MARKERS)
  );
}
