"use server";
import prisma from "@/db";
import { Habit, HabitTransaction } from "@prisma/client";

interface HabitDetails extends Omit<Habit, "amountPunishment"> {
  amountPunishment: number;
}
interface HabitWithHabitTransaction extends HabitDetails {
  transactions: HabitTransaction[];
  sponsorships: Sponsorship[];
}

export async function getAllHabitsAndHabitTransactionsByWalletAddress(
  walletAddress: string
): Promise<HabitWithHabitTransaction[]> {
  const user = await prisma.user.findUnique({
    where: { walletAddress: walletAddress },
    select: { id: true },
  });
  if (!user) {
    return [];
  }
  const result = await prisma.habit.findMany({
    where: {
      userId: user.id,
    },
    include: {
      transactions: true,
      sponsorships: true,
    },
  });

  if (!result) {
    console.log("no data");
    return [];
  } else {
    // Convert Decimal to number
    return result.map((habit) => ({
      ...habit,
      amountPunishment: habit.amountPunishment.toNumber(),
    }));
  }
}
