import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, "../../data_kampus");

async function createPdf(filename: string, title: string, contentLines: string[]) {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
  const { width, height } = page.getSize();
  
  let yOffset = height - 50;
  
  page.drawText(title, {
    x: 50,
    y: yOffset,
    size: 20,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  
  yOffset -= 40;
  
  for (const line of contentLines) {
    if (yOffset < 50) {
      // Add simple pagination support if needed (not implementing full wrapping here for brevity)
    }
    
    // Check if it's a heading
    const isHeading = line.startsWith("##");
    const text = isHeading ? line.replace("##", "").trim() : line;
    const currentFont = isHeading ? boldFont : font;
    const size = isHeading ? 14 : 12;
    
    if (isHeading) yOffset -= 10;
    
    page.drawText(text, {
      x: 50,
      y: yOffset,
      size,
      font: currentFont,
      color: rgb(0, 0, 0),
    });
    
    yOffset -= (isHeading ? 25 : 20);
  }
  
  const pdfBytes = await pdfDoc.save();
  await fs.writeFile(path.join(DATA_DIR, filename), pdfBytes);
  console.log(`Created: ${filename}`);
}

async function generate() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }

  // File 1: Info UKT
  await createPdf("Info_UKT_Polimdo_2026.pdf", "Informasi UKT Polimdo 2026", [
    "## Biaya Uang Kuliah Tunggal (UKT)",
    "Uang Kuliah Tunggal (UKT) di Politeknik Negeri Manado (Polimdo)",
    "dibagi menjadi beberapa golongan berdasarkan kemampuan ekonomi.",
    "",
    "## Jurusan Teknik Informatika",
    "- Golongan 1: Rp 500.000",
    "- Golongan 2: Rp 1.000.000",
    "- Golongan 3: Rp 2.500.000",
    "- Golongan 4: Rp 4.000.000",
    "- Golongan 5: Rp 5.500.000",
    "",
    "## Jurusan Teknik Sipil",
    "- Golongan 1: Rp 500.000",
    "- Golongan 2: Rp 1.000.000",
    "- Golongan 3: Rp 2.750.000",
    "- Golongan 4: Rp 4.500.000",
    "- Golongan 5: Rp 6.000.000",
    "",
    "Untuk pembayaran dapat dilakukan melalui Bank BNI, BRI, atau Mandiri",
    "sebelum tanggal 15 Agustus setiap semester genap maupun ganjil."
  ]);

  // File 2: Panduan Akademik
  await createPdf("Panduan_Akademik_Polimdo.pdf", "Panduan Akademik Polimdo", [
    "## Prosedur Cuti Akademik",
    "Bagi mahasiswa yang ingin mengajukan cuti akademik, syaratnya adalah:",
    "1. Mahasiswa telah menempuh minimal 2 semester.",
    "2. Tidak sedang menerima beasiswa dari pemerintah/kampus.",
    "3. Mengisi formulir cuti di Biro Administrasi Akademik (BAAK).",
    "4. Membayar biaya administrasi cuti sebesar Rp 250.000.",
    "",
    "## Fasilitas Kampus",
    "1. Perpustakaan Pusat: Terletak di Gedung B lantai 2. Buka pukul 08:00 - 16:00.",
    "2. Laboratorium Komputer: Tersebar di setiap jurusan, khusus TI di Gedung C.",
    "3. Poliklinik: Menyediakan layanan kesehatan gratis untuk mahasiswa, di Gedung A.",
    "",
    "## Informasi Rektorat",
    "Direktur Polimdo saat ini menjabat untuk periode 2024-2028.",
    "Lokasi gedung direktorat berada di depan gerbang utama kampus."
  ]);

  console.log("Semua PDF dummy berhasil dibuat!");
}

generate().catch(console.error);
