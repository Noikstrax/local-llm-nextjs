import { prisma } from "@/shared/lib/prisma/prisma-client";
import { NextResponse } from "next/server";

export async function GET() {
  const chats = await prisma.chats.findMany({
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  return NextResponse.json(chats);
}
