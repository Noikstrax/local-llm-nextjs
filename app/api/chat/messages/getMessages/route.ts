import { prisma } from "@/shared/lib/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get("id");
    if (!chatId) {
      throw new Error("Missing chat id");
    }
    const messages = await prisma.messages.findMany({
      where: { chatId },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(messages);
  } catch (e) {
    return NextResponse.json(
      {
        message: e,
      },
      { status: 500 }
    );
  }
}
