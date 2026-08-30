import { generateContent } from "../services/gemini.js";
import { supabase } from "../services/supabase.js";

export async function handleFinance(message: string, profile: object, history: any[], chatId?: string) {
  // Include history context for affordability checks
  const historyText = history.map((h: any) => `${h.role}: ${h.content}`).join("\n");
  const prompt = `Classify the user's intent and extract data. Return JSON only with fields:
{"intent": "log_expense"|"log_income"|"check_affordability"|"query_summary", "amount": number|null, "category": string|null, "type": "expense"|"income"|null, "description": string|null, "item": string|null}

Rules:
- "log_expense"/"log_income": user reports spending/earning (e.g. "I spent 50 on food")
- "check_affordability": user asks if they can afford something (e.g. "can I afford this", "it costs 200" when prior context was affordability)
- "query_summary": user asks for summary (e.g. "how much have I spent")

Conversation history:
${historyText}

Message: "${message}"`;

  const raw = await generateContent(prompt);
  const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
  const intent = parsed.intent ?? "log_expense";

  if (intent === "log_expense" || intent === "log_income") {
    const type = parsed.type ?? (intent === "log_income" ? "income" : "expense");
    const amount = Number(parsed.amount) || 0;
    const category = parsed.category ?? "Uncategorized";
    const description = parsed.description ?? message;
    try {
      await supabase.from("transactions").insert({
        user_id: "default_user",
        chat_id: chatId ?? null,
        type,
        amount,
        category,
        description,
      });
    } catch (e) {
      console.error("[finance] insert failed", e);
    }
    return {
      reply: `Logged ${type}: ${amount} for ${category}.`,
      data: { intent, amount, category, type, description },
    };
  }

  if (intent === "check_affordability") {
    const amount = Number(parsed.amount);
    if (!amount) {
      return { reply: "How much does it cost?", data: { intent, amount: null } };
    }
    const { data: rows, error } = await supabase.from("transactions").select("type,amount").eq("user_id", "default_user");
    if (error) {
      console.error("[finance] query failed", error);
      return { reply: "I couldn't check your balance right now. Please try again.", data: { intent, amount } };
    }
    if (!rows || rows.length === 0) {
      return { reply: "You haven't logged any income or expenses yet, so I can't check your balance. Tell me what you've earned or spent so far.", data: { intent, amount, balance: 0, affordable: false } };
    }
    let balance = 0;
    for (const r of rows) balance += r.type === "income" ? Number(r.amount) : -Number(r.amount);
    const affordable = balance >= amount;
    const remaining = balance - amount;
    const item = parsed.item ? ` ${parsed.item}` : "";
    const reply = affordable
      ? `Yes, you can afford it — you'd have $${remaining} left.`
      : `No, that would put you $${Math.abs(remaining)} over your balance.`;
    return { reply, data: { intent, amount, item: parsed.item ?? undefined, balance, affordable } };
  }

  // query_summary
  const { data: rows } = await supabase.from("transactions").select("type,amount").eq("user_id", "default_user");
  if (!rows || rows.length === 0) {
    return { reply: "You haven't logged any transactions yet.", data: { intent, balance: 0 } };
  }
  let income = 0, expense = 0;
  for (const r of rows) {
    if (r.type === "income") income += Number(r.amount);
    else expense += Number(r.amount);
  }
  const balance = income - expense;
  return { reply: `You've spent $${expense} and earned $${income}. Current balance: $${balance}.`, data: { intent, totalIncome: income, totalExpense: expense, balance } };
}
