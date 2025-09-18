"use client";

import { Skeleton } from "@/shared/ui/skeleton";
import { resendMessage, useAppDispatch } from "../../../../../app/store";
import { RotateCw } from "lucide-react";

export type Message = {
  id: string;
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

async function retrySendMessage(
  messageId: string | number,
  chatId: string | number
) {
  const body = {
    messageId,
    chatId,
  };
  await fetch("/api/chat/messages/resendMessage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

export const MessageList = ({ messages, className }: Props) => {
  const dispatch = useAppDispatch();
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
              flex
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
              <button
                onClick={(e) => {
                  e.preventDefault();
                  const currentButton = e.currentTarget as HTMLButtonElement;
                  currentButton.classList.add("animate-spin");
                  if (!message.id || !message.chatId) {
                    currentButton.classList.remove("animate-spin");
                    return;
                  }
                  dispatch(
                    resendMessage({
                      messageId: message.id,
                      chatId: message.chatId,
                    })
                  );
                }}
                className="ml-2"
              >
                <RotateCw />
              </button>
            </div>
          );
        } else if (messageStatus === "pending") {
          return (
            <Skeleton
              key={message.id}
              className="ml-3 min-h-[32px] w-[85px] rounded-sm bg-gray-500"
            />
          );
        }
      })}
    </div>
  );
};
