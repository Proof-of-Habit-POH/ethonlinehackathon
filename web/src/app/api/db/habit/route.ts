import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";
import { ProvingMethod } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const habitId = searchParams.get("habitId");
    if (!habitId) {
      return NextResponse.json(
        { error: "habitId is required" },
        { status: 400 }
      );
    }
    const result = await prisma.habit.findUnique({
      where: { id: +habitId },
    });
    console.log("habit data", result);
    if (!result) {
      return NextResponse.json({ error: "habit not found" }, { status: 404 });
    }
    return Response.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const habitId = searchParams.get("habitId");
    const returnAmountUSD = searchParams.get("returnAmountUSD");
    // Convert returnAmountUSD to a number
    const returnAmountUSDNumber = returnAmountUSD ? parseFloat(returnAmountUSD) : 0;

    if (!habitId) {
      return NextResponse.json(
        { error: "habitId is required" },
        { status: 400 }
      );
    }

    if (isNaN(returnAmountUSDNumber)) {
      return NextResponse.json(
        { error: "Invalid returnAmountUSD value" },
        { status: 400 }
      );
    }

    if (habitId) {
      const result = await prisma.habit.update({
        where: { id: +habitId },
        data: { status: "ENDED", moneyTransferStatus: "COMPLETED", totalMoney: returnAmountUSDNumber },
      });
    }
    return NextResponse.json(
      { message: "Habit status updated" },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      habitName,
      verificationMethod,
      durationOfHabit,
      betAmountPerDay,
      address,
    } = body;

    // Get the user's id based on their wallet address
    const user = await prisma.user.findUnique({
      where: { walletAddress: address },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "You havn't create userId yet" },
        { status: 500 }
      );
    }

    const userId = user.id;

    const totalMoney = betAmountPerDay * durationOfHabit;

    let provingMethodChoice: ProvingMethod;
    if (verificationMethod === "Photo uploading") {
      provingMethodChoice = ProvingMethod.UPLOAD_IMAGE;
    } else {
      provingMethodChoice = ProvingMethod.SELF_CONFIRM;
    }

    const result = await prisma.habit.create({
      data: {
        name: habitName,
        duration: durationOfHabit,
        amountPunishment: betAmountPerDay,
        sponsorAmount: 0,
        userId: userId,
        provingMethod: provingMethodChoice,
        startDate: new Date(),
        totalMoney: totalMoney,
      },
    });
    return NextResponse.json({ data: result }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
