import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create 2 Users
  const user1 = await prisma.user.create({
    data: {
      walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
      username: "UserOne",
      habits: {
        create: [
          {
            name: "Morning Run",
            details: "Run for 30 minutes every morning",
            startDate: new Date("2024-08-20"),
            duration: 30,
            provingMethod: "UPLOAD_IMAGE",
            status: "IN_PROGRESS",
            amountPunishment: new Prisma.Decimal(10.0),
            totalMoney: new Prisma.Decimal(300.0),
            transactions: {
              create: [
                { date: new Date("2024-08-20") },
                { date: new Date("2024-08-20") },
              ],
            },
          },
          {
            name: "Read Books",
            details: "Read at least 10 pages daily",
            startDate: new Date("2024-08-20"),
            duration: 15,
            provingMethod: "SELF_CONFIRM",
            status: "IN_PROGRESS",
            amountPunishment: new Prisma.Decimal(5.0),
            totalMoney: new Prisma.Decimal(75.0),
            transactions: {
              create: [
                { date: new Date("2024-08-01") },
                { date: new Date("2024-08-02") },
              ],
            },
          },
          {
            name: "Meditation",
            details: "Meditate for 20 minutes",
            startDate: new Date("2024-08-01"),
            duration: 10,
            provingMethod: "UPLOAD_IMAGE",
            status: "IN_PROGRESS",
            amountPunishment: new Prisma.Decimal(3.0),
            totalMoney: new Prisma.Decimal(30.0),
            transactions: {
              create: [
                { date: new Date("2024-08-01") },
                { date: new Date("2024-08-02") },
              ],
            },
          },
          {
            name: "Drink Water",
            details: "Drink 8 glasses of water daily",
            startDate: new Date("2024-08-01"),
            duration: 7,
            provingMethod: "SELF_CONFIRM",
            status: "IN_PROGRESS",
            amountPunishment: new Prisma.Decimal(2.0),
            totalMoney: new Prisma.Decimal(14.0),
            transactions: {
              create: [
                { date: new Date("2024-08-01") },
                { date: new Date("2024-08-02") },
              ],
            },
          },
        ],
      },
    },
  });

  const user2 = await prisma.user.create({
    data: {
      walletAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
      username: "UserTwo",
      habits: {
        create: [
          {
            name: "Evening Walk",
            details: "Walk for 45 minutes every evening",
            startDate: new Date("2024-08-01"),
            duration: 30,
            provingMethod: "UPLOAD_IMAGE",
            status: "IN_PROGRESS",
            amountPunishment: new Prisma.Decimal(10.0),
            totalMoney: new Prisma.Decimal(300.0),
            transactions: {
              create: [
                { date: new Date("2024-08-01") },
                { date: new Date("2024-08-02") },
              ],
            },
          },
          {
            name: "Write Journal",
            details: "Write at least 200 words daily",
            startDate: new Date("2024-08-01"),
            duration: 15,
            provingMethod: "SELF_CONFIRM",
            status: "IN_PROGRESS",
            amountPunishment: new Prisma.Decimal(5.0),
            totalMoney: new Prisma.Decimal(75.0),
            transactions: {
              create: [
                { date: new Date("2024-08-01") },
                { date: new Date("2024-08-02") },
              ],
            },
          },
          {
            name: "Yoga",
            details: "Practice Yoga for 30 minutes",
            startDate: new Date("2024-08-01"),
            duration: 10,
            provingMethod: "UPLOAD_IMAGE",
            status: "IN_PROGRESS",
            amountPunishment: new Prisma.Decimal(3.0),
            totalMoney: new Prisma.Decimal(30.0),
            transactions: {
              create: [
                { date: new Date("2024-08-01") },
                { date: new Date("2024-08-02") },
              ],
            },
          },
          {
            name: "Sleep Early",
            details: "Go to bed before 10 PM",
            startDate: new Date("2024-08-01"),
            duration: 7,
            provingMethod: "SELF_CONFIRM",
            status: "IN_PROGRESS",
            amountPunishment: new Prisma.Decimal(2.0),
            totalMoney: new Prisma.Decimal(14.0),
            transactions: {
              create: [
                { date: new Date("2024-08-01") },
                { date: new Date("2024-08-02") },
              ],
            },
          },
        ],
      },
    },
  });

  console.log({ user1, user2 });
}

main()
  .then(() => {
    console.log("Seeding completed.");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
