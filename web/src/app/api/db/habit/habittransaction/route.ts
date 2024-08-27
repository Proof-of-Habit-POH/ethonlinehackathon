import { NextRequest, NextResponse } from "next/server";
import  prisma  from "@/db";

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
    const result = await prisma.habitTransaction.findMany({
      where: { habitId: +habitId },
    });
    console.log("habit transaction data", result);
    if (!result) {
      return NextResponse.json(
        { error: "habit transaction not found" },
        { status: 404 }
      );
    }
    return Response.json(result);
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
    const { habitId, isCompleted } = body;
    const result = await prisma.habitTransaction.create({
      data: { 
        habitId: habitId, 
        isCompleted: isCompleted,
      },
    });
    return NextResponse.json(
      { message: "Habit transaction created: " + result.id },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
