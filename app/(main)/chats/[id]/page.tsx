import { prisma } from "@/shared/lib/prisma/prisma-client";
import { ChatBox } from "../../../../src/pages/chat/ui/ChatBox";
import { ChatBoxHeader } from "../../../../src/pages/chat/ui/chat-box/ChatBoxHeader";
import { Metadata } from "next";

interface ChatPageParams {
  id: string;
}

export async function generateMetadata({
  params,
}: {
  params: ChatPageParams;
}): Promise<Metadata> {
  try {
    const { id } = await params; // await for Next.js runtime https://nextjs.org/docs/messages/sync-dynamic-apis

    const chat = await prisma.chats.findFirst({
      where: { chatId: id },
      select: { title: true },
    });

    return {
      title: `Local LLM | ${chat?.title || "Chat"}`,
    };
  } catch (e) {
    return {
      title: "Local LLM | Chat not found",
    };
  }
}
export default function Home() {
  return (
    <div className="font-sans min-h-screen py-4 mx-auto max-h-screen flex-col">
      <div className="min-h-[60px] w-full">
        <div className="mb-4">
          <ChatBoxHeader />
        </div>

        <div className="w-full">
          <hr className="border-t-[1px] border-gray-300" />
        </div>
      </div>
      <div className="flex-grow flex items-center px-4 py-8">
        <ChatBox className="w-full min-h-[200px] flex flex-col justify-center md:pr-[10%] md:pl-[10%] pr-0 pl-0 h-full" />
      </div>
    </div>
  );
}
