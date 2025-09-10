"use client";

import { Skeleton } from "@/shared/ui/skeleton";

export type Message = {
  id: number;
  text: string;
  owner: "user" | "ai";
  loading: "idle" | "pending" | "succeeded" | "failed";
  createdAt?: string;
  updatedAt?: string;
  chatId?: string;
};

interface Props {
  className?: string;
  messages: Message[];
}

export const MessageList = ({ messages, className }: Props) => {
  console.log(messages);
  return (
    <div className={className}>
      {messages.map((message) => {
        const isAi = message.owner === "ai";
        const messageStatus = message.loading;
        if (messageStatus === "succeeded") {
          return (
            <div
              key={message.id}
              className={`
              my-5
              rounded-xl
              max-w-full
              text-justify
              prose prose-invert
              ${
                isAi
                  ? "self-start"
                  : "self-end bg-zinc-800 px-5 py-3 rounded-xl my-5"
              }`}
            >
              {message.text}
            </div>
          );
        } else if (messageStatus === "failed") {
          return (
            <div
              key={message.id}
              className={`
              my-5
              rounded-xl
              max-w-full
              text-justify
              text-red-500
              prose prose-invert
              ${
                isAi
                  ? "self-start"
                  : "self-end bg-zinc-800 px-5 py-3 rounded-xl my-5"
              }`}
            >
              {message.text}
            </div>
          );
        } else if (messageStatus === "pending") {
          return (
            <Skeleton
              key={message.id}
              className="ml-3 h-[32px] w-[85px] rounded-sm bg-gray-500"
            />
          );
        }
      })}
    </div>
  );
};
