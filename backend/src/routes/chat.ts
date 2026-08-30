import type { FastifyInstance } from "fastify";
import { route } from "../agents/router.js";

export async function chatRoutes(app: FastifyInstance) {
  app.post("/api/chat", async (request, reply) => {
    const { message } = request.body as { message: string; chatId?: string };

    if (!message || typeof message !== "string") {
      return reply.status(400).send({ error: "message is required" });
    }

    const profile: object = {};
    const history: { role: string; content: string }[] = [];

    const routing = await route(message, profile, history);

    return { routing };
  });
}
