import "dotenv/config";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { searchRelevantContext } from "../services/ragService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATASET_PATH = path.resolve(__dirname, "../../tests/qa_dataset.json");

interface TestCase {
  query: string;
  expected_keywords: string[];
}

async function runEvaluation() {
  console.log("=== Starting RAG Evaluation ===");
  try {
    const data = await fs.readFile(DATASET_PATH, "utf-8");
    const testCases: TestCase[] = JSON.parse(data);
    
    let successCount = 0;
    const results = [];

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      console.log(`\n[Test ${i + 1}/${testCases.length}] Query: "${tc.query}"`);
      
      const start = Date.now();
      const ragResult = await searchRelevantContext(tc.query);
      const latency = Date.now() - start;

      if (!ragResult) {
        console.log(`❌ FAILED: No RAG context found (Score: 0)`);
        results.push({ query: tc.query, success: false, score: 0, latency });
        continue;
      }

      const contextLower = ragResult.context.toLowerCase();
      const matchedKeywords = tc.expected_keywords.filter(kw => contextLower.includes(kw.toLowerCase()));
      
      // We consider it a success if at least 1 keyword is found, or if the score is very high
      const isSuccess = matchedKeywords.length > 0 || ragResult.score > 0.8;
      
      if (isSuccess) {
        successCount++;
        console.log(`✅ PASSED: Score: ${ragResult.score.toFixed(4)} | Latency: ${latency}ms`);
      } else {
        console.log(`❌ FAILED: Context did not contain expected keywords. Score: ${ragResult.score.toFixed(4)}`);
      }
      
      results.push({ 
        query: tc.query, 
        success: isSuccess, 
        score: ragResult.score, 
        latency 
      });
    }

    console.log("\n=== Evaluation Summary ===");
    console.log(`Total Tests: ${testCases.length}`);
    console.log(`Passed: ${successCount}`);
    console.log(`Failed: ${testCases.length - successCount}`);
    console.log(`Accuracy: ${((successCount / testCases.length) * 100).toFixed(2)}%`);

  } catch (error) {
    console.error("Evaluation failed:", error);
  }
  process.exit(0);
}

runEvaluation();
