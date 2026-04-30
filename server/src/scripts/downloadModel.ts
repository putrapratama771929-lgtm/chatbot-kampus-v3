import fs from "fs";
import path from "path";
import https from "https";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MODELS_DIR = path.resolve(__dirname, "../../models");
// We use a small, efficient model suitable for text and RAG tests on CPU
const MODEL_URL = "https://huggingface.co/Qwen/Qwen1.5-0.5B-Chat-GGUF/resolve/main/qwen1_5-0_5b-chat-q4_k_m.gguf";
const MODEL_NAME = "qwen1_5-0_5b-chat-q4_k_m.gguf";

async function downloadModel() {
  if (!fs.existsSync(MODELS_DIR)) {
    fs.mkdirSync(MODELS_DIR, { recursive: true });
  }

  const destPath = path.join(MODELS_DIR, MODEL_NAME);
  
  if (fs.existsSync(destPath)) {
    console.log(`Model already exists at ${destPath}`);
    return;
  }

  console.log(`Downloading model to ${destPath}...`);
  console.log(`URL: ${MODEL_URL}`);

  const file = fs.createWriteStream(destPath);
  
  // Need to handle redirects for HuggingFace
  function download(url: string) {
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        console.log("Following redirect...");
        download(response.headers.location as string);
        return;
      }
      
      if (response.statusCode !== 200) {
        console.error(`Failed to download: ${response.statusCode} ${response.statusMessage}`);
        file.close();
        fs.unlinkSync(destPath);
        process.exit(1);
      }

      const totalSize = parseInt(response.headers["content-length"] || "0", 10);
      let downloadedSize = 0;

      response.on("data", (chunk) => {
        downloadedSize += chunk.length;
        if (totalSize > 0) {
          const percent = ((downloadedSize / totalSize) * 100).toFixed(1);
          process.stdout.write(`\rProgress: ${percent}% (${(downloadedSize / 1024 / 1024).toFixed(1)}MB / ${(totalSize / 1024 / 1024).toFixed(1)}MB)`);
        } else {
          process.stdout.write(`\rDownloaded: ${(downloadedSize / 1024 / 1024).toFixed(1)} MB`);
        }
      });

      response.pipe(file);

      file.on("finish", () => {
        file.close();
        console.log("\nDownload completed successfully!");
      });
    }).on("error", (err) => {
      fs.unlinkSync(destPath);
      console.error(`\nError downloading model: ${err.message}`);
    });
  }

  download(MODEL_URL);
}

downloadModel();
