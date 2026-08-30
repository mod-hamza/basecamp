import type { FastifyInstance } from "fastify";
export async function calendarRoutes(app: FastifyInstance) {
  app.get("/api/calendar/events", async () => ({ events: [], message: "Calendar integration is coming soon." }));
}
