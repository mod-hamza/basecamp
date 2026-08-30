import Fastify from "fastify";
import dotenv from "dotenv";
import { chatRoutes } from "./routes/chat.js";

dotenv.config();

const fastify = Fastify({ logger: true });

fastify.get("/health", async () => {
  return { status: "ok" };
});

async function main() {
  await fastify.register(chatRoutes);

  const port = Number(process.env.PORT) || 8080;
  const host = "0.0.0.0";

  fastify.listen({ port, host }, (err) => {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  });
}

main();
