import { getUserSessionId } from "@/shared/lib/auth/get-user-session-id";
import { prisma } from "@/shared/lib/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";
import ollama from "ollama";

//TODO DRY
function cleanResponse(text: string): string {
  return text.replace(/<think>[\s\S]*?<\/think>/g, "");
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserSessionId();
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

    const chat = await prisma.chats.findFirst({
      where: {
        chatId,
        user: { id: Number(userId) },
      },
    });

    if (!chat) {
      return NextResponse.json({
        error: true,
        message: "You are not chat owner",
      });
    }

    const user = await prisma.users.findFirst({
      where: {
        id: Number(userId),
      },
    });

    const encoder = new TextEncoder();
    let fullResponse = "";

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const response = await ollama.chat({
            model,
            messages: [{ role: "user", content: prompt }],
            stream: true,
            options: { temperature: user?.temperature || 0.5 },
          });

          for await (const part of response) {
            if (part.message?.content) {
              const clean = cleanResponse(part.message.content);
              fullResponse += clean;
              controller.enqueue(encoder.encode(clean));
            }
          }

          controller.close();

          const prismaResult = await prisma.messages.create({
            data: {
              text: fullResponse,
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
        } catch (e) {
          await prisma.messages.update({
            data: {
              loading: "failed",
            },
            where: {
              id: messageId,
            },
          });
          console.error("AI resend message stream error: ", e);
        }
      },
    });

    return new NextResponse(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (e) {
    console.error("Router /api/chat/resendMessage error: ", e);
    return NextResponse.json(
      {
        message: e,
      },
      { status: 500 }
    );
  }
}
