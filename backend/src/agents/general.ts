import { generateContent } from "../services/gemini.js";
import { GENERAL_SYSTEM_PROMPT } from "../prompts/general.js";

export async function handleGeneral(message: string, profile: object, history: HistoryItem[]) {
  const prompt = GENERAL_SYSTEM_PROMPT.replace("{{MESSAGE}}", message);
  const raw = await generateContent(prompt);
  return { reply: raw.trim() };
}
type HistoryItem = { role: string; content: string };
