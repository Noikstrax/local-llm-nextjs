import { prisma } from "@/shared/lib/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

const TEMP_USER_ID = 1;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { chatId } = body;

    if (!chatId) {
      return NextResponse.json(
        {
          message: "[CREATE_CHAT]: chatId is missing",
          error: true,
        },
        {
          status: 400,
        }
      );
    }

    if (!body) {
      return NextResponse.json(
        {
          message: "[CREATE_CHAT]: request body is missing",
          error: true,
        },
        { status: 400 }
      );
    }

    const result = await prisma.chats.create({
      data: {
        chatId,
        title: `Chat: ${chatId}`,
        userId: TEMP_USER_ID,
      },
    });

    return NextResponse.json(result, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      {
        message: e,
      },
      { status: 500 }
    );
  }
}
