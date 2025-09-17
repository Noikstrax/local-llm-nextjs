import { prisma } from "@/shared/lib/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

function cleanResponse(text: string): string {
  return text.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
}

export async function POST(req: NextRequest) {
  try {
    const LLM_HOST = process.env.LLM_HOST;
    if (!LLM_HOST) {
      return NextResponse.json({
        error: true,
        message: "LLM_HOST is not defined",
      });
    }
    const body = await req.json();
    const { messageId } = body;
    if (!messageId) {
      return NextResponse.json({
        error: true,
        message: "User prompt is missing",
      });
    }

    const messageData = await prisma.messages.findFirst({
      where: {
        id: messageId,
      },
    });

    if (!messageData) {
      return NextResponse.json({
        error: true,
        message: "Message data is missing",
      });
    }

    const { model, text: prompt, chatId } = messageData;

    const ollamaPayload = {
      model,
      prompt,
      stream: false,
    };

    const ollamaRes = await fetch(`${LLM_HOST}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ollamaPayload),
    });

    if (!ollamaRes.ok) {
      const error = await ollamaRes.text();
      await prisma.messages.update({
        data: {
          loading: "failed",
        },
        where: {
          id: messageId,
        },
      });
      throw new Error(`[OLLAMA_FETCH_GENERATE] Server Error: ${error}`);
    }

    const result = await ollamaRes.json();

    const prismaResult = await prisma.messages.create({
      data: {
        text: cleanResponse(result.response),
        chatId,
        owner: "ai",
        loading: "succeeded",
        model,
      },
    });

    if (!prismaResult) {
      throw new Error(`[DB_POST_ERROR] for answer in Chat: ${chatId}`);
    } else {
      await prisma.messages.update({
        where: {
          id: messageId,
        },
        data: {
          loading: "succeeded",
        },
      });
    }

    return NextResponse.json(result);
  } catch (e) {
    console.error(
      NextResponse.json(
        {
          message: e,
        },
        { status: 500 }
      )
    );
    return NextResponse.json(
      {
        message: e,
      },
      { status: 500 }
    );
  }
}
