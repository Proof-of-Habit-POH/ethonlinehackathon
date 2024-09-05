import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";
import { Habit, HabitTransaction, Sponsorship } from "@prisma/client";

interface HabitDetails extends Omit<Habit, "amountPunishment"> {
  amountPunishment: number;
}
interface HabitWithHabitTransaction extends HabitDetails {
  transactions: HabitTransaction[];
  sponsorships: Sponsorship[];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get("walletAddress");
    if (!walletAddress) {
      return NextResponse.json(
        { error: "walletAddress is required" },
        { status: 400 }
      );
    }
    const user = await prisma.user.findUnique({
      where: { walletAddress: walletAddress },
      select: { id: true },
    });
    if (!user) {
      return NextResponse.json([], { status: 200 });
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
      return NextResponse.json([], { status: 200 });
    } else {
      // Convert Decimal to number
      return NextResponse.json(
        result.map((habit) => ({
          ...habit,
          amountPunishment: habit.amountPunishment.toNumber(),
        })),
        { status: 200 }
      );
    }
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
