import { hashSync } from "bcrypt";
import { prisma } from "./prisma-client";

async function up() {
  await prisma.users.createMany({
    data: [
      {
        name: "test",
        email: "test@test.com",
        password: hashSync("testtest", 10),
      },
      {
        name: "test2",
        email: "test2@test.com",
        password: hashSync("testtest2", 10),
      },
    ],
  });
}

async function down() {
  await prisma.$executeRaw`TRUNCATE TABLE "Messages" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Chats" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Users" RESTART IDENTITY CASCADE`;
}

async function main() {
  try {
    await down();
    await up();
  } catch (e) {
    console.error(e);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect;
    process.exit(1);
  });
