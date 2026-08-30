import { generateContent } from "../services/gemini.js";

export async function handleFinance(message: string, profile: object, history: any[]) {
  const prompt = `Extract a financial transaction from this message. Return JSON only:
{"amount": number, "category": string, "type": "expense"|"income", "description": string}

Message: "${message}"`;

  const raw = await generateContent(prompt);
  const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());

  return {
    reply: `Logged ${parsed.type}: ${parsed.amount} for ${parsed.category}.`,
    data: parsed,
  };
}