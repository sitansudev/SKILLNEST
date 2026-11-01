import "dotenv/config";
import { prisma } from "../src/database/prisma.js";

const email = process.argv[2]?.trim().toLowerCase();

if (!email) {
  console.error("Usage: pnpm make:admin your-email@example.com");
  process.exit(1);
}

try {
  const user = await prisma.user.update({
    where: { email },
    data: { role: "ADMIN" },
    select: { id: true, name: true, email: true, role: true }
  });

  console.log("User promoted to admin:", user);
} catch {
  console.error(`No user found with email: ${email}`);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
