import type { FastifyInstance } from "fastify";
export async function profileRoutes(app: FastifyInstance) {
  app.get("/api/profile", async () => ({ profile: {} }));
  app.put("/api/profile", async (request) => ({ profile: request.body }));
}
