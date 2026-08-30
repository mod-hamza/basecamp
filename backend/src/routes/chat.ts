import type { FastifyInstance } from "fastify";
import { route } from "../agents/router.js";
import { handleFinance } from "../agents/finance.js";
import { handleStudy } from "../agents/study.js";
import { handleGeneral } from "../agents/general.js";
import { handleCalendar } from "../agents/calendar.js";
import { randomUUID } from "crypto";

const sessions = new Map<string, { role: string; content: string }[]>();

export async function chatRoutes(app: FastifyInstance) {
  app.post("/api/chat", async (request, reply) => {
    const { message, chatId: incomingId } = request.body as { message: string; chatId?: string };

    if (!message || typeof message !== "string") {
      return reply.status(400).send({ error: "message is required" });
    }

    const chatId = incomingId ?? randomUUID();
    const history = sessions.get(chatId) ?? [];
    const profile: object = {};

    // Append user message to history for context
    const historyForRoute = history.slice(-10);

    const routing = await route(message, profile, historyForRoute);

    if (routing.type === "clarification") {
      // Save user message to session
      history.push({ role: "user", content: message });
      sessions.set(chatId, history);
      return { chatId, routing };
    }

    let result;
    switch (routing.agent) {
      case "finance":
        result = await handleFinance(message, profile, historyForRoute);
        break;
      case "study":
        result = await handleStudy(message, profile, historyForRoute);
        break;
      case "calendar":
        result = await handleCalendar(message, profile, historyForRoute);
        break;
      default:
        result = await handleGeneral(message, profile, historyForRoute);
        break;
    }

    history.push({ role: "user", content: message });
    history.push({ role: "assistant", content: result.reply });
    sessions.set(chatId, history);

    return { chatId, routing, result };
  });
}
