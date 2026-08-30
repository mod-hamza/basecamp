import { generateContent } from "../services/gemini.js";
import { STUDY_SYSTEM_PROMPT } from "../prompts/study.js";

export async function handleStudy(message: string, profile: object, history: HistoryItem[]) {
  // No study material available yet - graceful fallback (no hallucinating)
  // In future, load notes from DB/storage here
  const hasNotes = false;
  if (!hasNotes && message.toLowerCase().includes("quiz")) {
    // Try to generate anyway if no notes, but inform user
    // For now return upload prompt if no context
    // Attempt Gemini generation with placeholder
    const prompt = STUDY_SYSTEM_PROMPT.replace("{{NOTES}}", "No notes uploaded yet.").replace("{{MESSAGE}}", message);
    try {
      const raw = await generateContent(prompt);
      // If model still returns something, return it with disclaimer
      return { reply: "Please upload your lecture notes first so I can generate a relevant quiz. " + raw.trim() };
    } catch {
      return { reply: "Please upload your lecture notes first so I can generate a quiz tailored to your material." };
    }
  }
  const prompt = STUDY_SYSTEM_PROMPT.replace("{{NOTES}}", "No notes uploaded yet.").replace("{{MESSAGE}}", message);
  const raw = await generateContent(prompt);
  return { reply: raw.trim() };
}
type HistoryItem = { role: string; content: string };
