"use server";
import prisma from "@/db";
import { Habit } from "@prisma/client";

export async function getSponsoringHabitsByWalletAddress(
  walletAddress: string
): Promise<Habit[]> {
  // 1. find all sponsorship habits of the specified wallet address
  const result = await prisma.sponsorship.findMany({
    where: {
      walletAddress: walletAddress,
    },
    select: {
      habitId: true,
    },
    distinct: ["habitId"],
  });
  // 2. get all habit ID that we sponsor
  const habitIdArr = result.map((sponsorship) => sponsorship.habitId);
  // 3. get all habit data of each habit ID that we sponsor
  const habitArr = await prisma.habit.findMany({
    where: {
      id: { in: habitIdArr },
    },
  });
  return habitArr;
}
