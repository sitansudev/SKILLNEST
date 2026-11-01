import { app } from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./database/prisma.js";

const server = app.listen(env.port, () => {
  console.log(`SkillNest API: http://localhost:${env.port}`);
});

async function shutdown(signal) {
  console.log(`${signal} received. Shutting down...`);

  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
