import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function init() {
  // Get the embedding model
  const model = genAI.getGenerativeModel({ model: "embedding-001" });

  // Generate embedding
  const result = await model.embedContent("I love to code");

  // Embedding vector
  console.log(result.embedding.values);
}

init();
