require("dotenv").config();
import prisma from "../src/db";

async function run() {
  await prisma.$executeRawUnsafe("DROP Database proofofhabit");
  await prisma.$executeRawUnsafe("CREATE Database proofofhabit");
}
console.log("Reset DB..");
run();
