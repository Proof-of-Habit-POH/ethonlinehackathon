import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";

export async function GET(request: NextRequest) {
  // 1. find all sponsorship habits of the specified wallet address
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get("walletAddress");
    if (!walletAddress) {
      return NextResponse.json(
        { error: "walletAddress is required" },
        { status: 400 }
      );
    }
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
      include: {
        transactions: true,
        sponsorships: true,
      },
    });
    return NextResponse.json(habitArr, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const habitId = searchParams.get("habitId");
    const walletAddress = searchParams.get("walletAddress");
    const sponsorAmount = searchParams.get("sponsorAmount");

    console.log("habitId", habitId);
    console.log("walletAddress", walletAddress);
    console.log("sponsorAmount", sponsorAmount);
    if (habitId && walletAddress && sponsorAmount) {
      const result = await prisma.sponsorship.create({
        data: {
          habitId: +habitId,
          walletAddress: walletAddress,
          amount: +sponsorAmount,
        },
      });
    }
    return NextResponse.json(
      { message: "Sponsorship created" },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
