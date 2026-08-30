export async function handleCalendar(message: string, profile: object, history: HistoryItem[]) {
  return { reply: "Calendar integration is coming soon. I can help with scheduling once it's connected." };
}
type HistoryItem = { role: string; content: string };
