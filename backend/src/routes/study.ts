import type { FastifyInstance } from "fastify";
export async function studyRoutes(app: FastifyInstance) {
  app.get("/api/study/history", async () => ({ history: [] }));
}
