import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    console.log("id inside find user check request", id);
    if (!id) {
      return NextResponse.json(
        { error: "id is required" },
        { status: 400 }
      );
    }
    const user = await prisma.user.findUnique({
      where: { id: id },
    });
    if (user) {
      return NextResponse.json({ user }, { status: 200 });
    }
    return NextResponse.json({ data: "user not exists" }, { status: 404 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
