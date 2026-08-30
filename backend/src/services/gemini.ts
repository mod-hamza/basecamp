import { GoogleGenerativeAI } from "@google/generative-ai";

const MODEL = "gemini-3.5-flash";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateContent(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY || "";
  // Debug: which model + which key is actually being used
  console.log(`[gemini] model=${MODEL} apiKey=${apiKey ? apiKey.slice(0, 8) + "..." + apiKey.slice(-4) : "(missing)"} (len=${apiKey.length}) fullKey=${apiKey}`);

  const maxRetries = 3;
  let lastError: unknown;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      console.log(`[gemini] calling model=${MODEL} attempt=${attempt + 1}/${maxRetries}`);
      const model = genAI.getGenerativeModel({ model: MODEL });
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err) {
      console.error(`[gemini] model=${MODEL} attempt=${attempt + 1} failed:`, err);
      lastError = err;
      if (attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 1000;
        console.log(`[gemini] retrying in ${delay}ms...`);
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }
  console.error(`[gemini] all ${maxRetries} attempts failed for model=${MODEL}`);
  throw lastError;
}
