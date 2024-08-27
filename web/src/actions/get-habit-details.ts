"use server";
import prisma from "@/db";
import { Habit } from "@prisma/client";

interface HabitDetails extends Omit<Habit, "amountPunishment"> {
  amountPunishment: number;
}
export async function getHabitDetails(
  habitId: string
): Promise<HabitDetails | null> {
  const result = await prisma.habit.findUnique({ where: { id: +habitId } });
  console.log("result", result);
  if (!result) {
    console.log("no data");
    return null;
  } else {
    // Convert Decimal to number
    return {
      ...result,
      amountPunishment: result.amountPunishment.toNumber(),
    };
  }
}
