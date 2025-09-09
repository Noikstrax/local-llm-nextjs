import { prisma } from "@/shared/lib/prisma/prisma-client";
import { NextResponse } from "next/server";

export async function GET() {
  const chats = await prisma.chat.findMany();

  return NextResponse.json(chats);
}
