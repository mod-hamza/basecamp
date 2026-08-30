import { GoogleGenAI } from "@google/genai";

const MODEL = "gemini-3.5-flash";

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY || "";
  console.log(`[gemini] model=${MODEL} apiKey=${apiKey ? apiKey.slice(0, 8) + "..." + apiKey.slice(-4) : "(missing)"} (len=${apiKey.length}) fullKey=${apiKey}`);
  return new GoogleGenAI({ apiKey });
}

export async function generateContent(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY || "";
  console.log(`[gemini] model=${MODEL} apiKey=${apiKey ? apiKey.slice(0, 8) + "..." + apiKey.slice(-4) : "(missing)"} (len=${apiKey.length}) fullKey=${apiKey}`);

  const maxRetries = 3;
  let lastError: unknown;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      console.log(`[gemini] calling model=${MODEL} attempt=${attempt + 1}/${maxRetries}`);
      const ai = getClient();
      const response = await ai.models.generateContent({
        model: MODEL,
        contents: prompt,
      });
      // response.text is a property in new SDK (not a function)
      const text = (response as any).text ?? "";
      if (!text) throw new Error("Empty response from Gemini");
      return text;
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
