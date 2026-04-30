import "dotenv/config";
import { askOpenRouter } from "../services/openRouterService.js";

async function testChat() {
  console.log("Testing OpenRouter AI chat...");
  const response = await askOpenRouter([
    {
      role: "system",
      content: "Kamu adalah asisten virtual kampus. Jawab dengan singkat dalam Bahasa Indonesia.",
    },
    {
      role: "user",
      content: "Siapa namamu?",
    },
  ]);

  console.log("\nResponse:", response);
}

testChat()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
