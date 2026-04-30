import "dotenv/config";
import { syncDatabaseKnowledge } from "../services/knowledgeSyncService.js";

async function main() {
  console.log("Syncing database content into RAG knowledge sources...");
  const summary = await syncDatabaseKnowledge();
  console.log("Knowledge sync completed:", summary);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Knowledge sync failed:", error);
    process.exit(1);
  });
