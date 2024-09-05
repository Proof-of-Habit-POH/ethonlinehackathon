import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get("address");
    console.log("address inside find user check request", address);
    if (!address) {
      return NextResponse.json(
        { error: "address is required" },
        { status: 400 }
      );
    }
    const user = await prisma.user.findUnique({
      where: { walletAddress: address },
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

export async function POST(request: NextRequest) {
  try {
    console.log("create new user request body", request.body);
    const { address, username } = await request.json();
    console.log("username inside register", username);
    if (!address || !username)
      return NextResponse.json(
        { error: "user data is required" },
        { status: 400 }
      );
    const result = await prisma.user.create({
      data: {
        walletAddress: address,
        username: username,
      },
    });
    return NextResponse.json({ user: result }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
