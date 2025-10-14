import { getUserSessionId } from "@/shared/lib/auth/get-user-session-id";
import { prisma } from "@/shared/lib/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { temperature } = body;
    if (temperature > 1 || temperature < 0 || !temperature) {
      return NextResponse.json(
        {
          message: "[UPDATE_TEMPERATURE]: Invalid temperature value",
          error: true,
        },
        { status: 400 }
      );
    }

    const userId = await getUserSessionId();
    if (!userId) {
      return NextResponse.json(
        {
          message: "[UPDATE_TEMPERATURE]: userId is missing",
          error: true,
        },
        { status: 400 }
      );
    }

    const user = await prisma.users.findFirst({
      where: {
        id: Number(userId),
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "[UPDATE_TEMPERATURE]: user not found",
          error: true,
        },
        { status: 400 }
      );
    }

    await prisma.users.update({
      data: {
        temperature: Number(temperature),
      },
      where: {
        id: Number(userId),
      },
    });

    return NextResponse.json("Temperature is updated", { status: 201 });
  } catch (e) {
    return NextResponse.json(
      {
        message: e,
      },
      { status: 500 }
    );
  }
}
