import { ROUTER_SYSTEM_PROMPT } from "../prompts/router.js";
import { generateContent } from "../services/gemini.js";

type HistoryItem = { role: string; content: string };

type ClarificationResult = { type: "clarification"; question: string };
type RouteResult = { type: "route"; agent: string; note: string };
export type RouterResult = ClarificationResult | RouteResult;

function buildPrompt(message: string, profile: object, history: HistoryItem[]): string {
  const prompt = ROUTER_SYSTEM_PROMPT.replace("{{PROFILE_JSON}}", JSON.stringify(profile)).replace(
    "{{HISTORY}}",
    history
      .slice(-5)
      .map((m) => `${m.role}: ${m.content}`)
      .join("\n"),
  );
  return prompt + "\n\nUser message: " + message;
}

function extractJson(text: string): string {
  const codeBlock = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlock) return codeBlock[1].trim();
  return text.trim();
}

export async function route(
  message: string,
  profile: object,
  history: HistoryItem[],
): Promise<RouterResult> {
  const prompt = buildPrompt(message, profile, history);

  let raw: string;
  try {
    raw = await generateContent(prompt);
  } catch (err) {
    console.error("[router] generateContent failed:", err);
    return { type: "route", agent: "general", note: "Routing to General Agent" };
  }

  let parsed: any;
  try {
    parsed = JSON.parse(extractJson(raw));
  } catch (err) {
    console.error("[router] JSON parse failed, raw response:", raw, err);
    // retry once
    try {
      raw = await generateContent(prompt);
      parsed = JSON.parse(extractJson(raw));
    } catch (err2) {
      console.error("[router] retry failed, raw response:", raw, err2);
      return { type: "route", agent: "general", note: "Routing to General Agent" };
    }
  }

  if (parsed.needs_clarification) {
    return {
      type: "clarification",
      question: parsed.clarification_question ?? "Could you clarify?",
    };
  }

  return {
    type: "route",
    agent: parsed.agent ?? "general",
    note: parsed.routing_note ?? `Routing to ${parsed.agent} Agent`,
  };
}
