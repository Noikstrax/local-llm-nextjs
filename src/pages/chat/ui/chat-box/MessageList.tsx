"use client";
export type Message = {
  id: number;
  text: string;
  owner: "user" | "ai";
};

interface Props {
  className?: string;
  messages: Message[];
}

export const MessageList = ({ messages, className }: Props) => {
  return (
    <div className={className}>
      {messages.map((message) => {
        const isAi = message.owner === "ai";
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
      })}
    </div>
  );
};
