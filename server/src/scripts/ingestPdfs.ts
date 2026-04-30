import "dotenv/config";
import fs from "fs/promises";
import path from "path";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfModule = require("pdf-parse");
const pdf = typeof pdfModule === "function" ? pdfModule : pdfModule.default;
import { upsertKnowledgeSource } from "../services/ragService.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path ke folder data_kampus (berada di dalam server/data_kampus)
const DATA_DIR = path.resolve(__dirname, "../../data_kampus");

async function ingestPdfs() {
  console.log(`Starting PDF ingestion from: ${DATA_DIR}`);

  try {
    // Pastikan folder ada
    await fs.access(DATA_DIR);
  } catch (error) {
    console.error(`Directory ${DATA_DIR} does not exist. Creating it now...`);
    await fs.mkdir(DATA_DIR, { recursive: true });
    console.log("Please add PDF files to data_kampus/ and run this script again.");
    return;
  }

  const files = await fs.readdir(DATA_DIR);
  const pdfFiles = files.filter(f => f.toLowerCase().endsWith(".pdf"));

  if (pdfFiles.length === 0) {
    console.log("No PDF files found in data_kampus/ directory.");
    return;
  }

  console.log(`Found ${pdfFiles.length} PDF file(s). Processing...`);

  for (const file of pdfFiles) {
    const filePath = path.join(DATA_DIR, file);
    try {
      console.log(`\nProcessing: ${file}...`);
      const dataBuffer = await fs.readFile(filePath);
      const data = await pdf(dataBuffer);

      const content = data.text;
      
      if (!content || content.trim().length === 0) {
        console.warn(`Warning: Extracted text is empty for ${file}`);
        continue;
      }

      console.log(`Extracted ${content.length} characters. Saving to database...`);

      // Menyimpan ke tabel knowledge_sources dan meng-generate embeddings
      const result = await upsertKnowledgeSource({
        title: path.basename(file, path.extname(file)),
        content: content,
        sourceType: "admin_text",
        sourceKey: `pdf:${file}`,
        metadata: {
          filename: file,
          pages: data.numpages,
          info: data.info,
          importedAt: new Date().toISOString()
        }
      });

      console.log(`Success: Generated ${result.chunks} chunks for ${file}`);
    } catch (err) {
      console.error(`Failed to process ${file}:`, err);
    }
  }

  console.log("\nIngestion completed!");
}

// Run script
ingestPdfs().then(() => process.exit(0)).catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
