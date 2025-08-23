"use client";
import { useState } from "react";
import { Message, MessageList } from "./chatbox/MessageList";
import { InputFiled } from "./chatbox/InputField";
import { SendButton } from "./chatbox/SendButton";

interface Props {
  className?: string;
}

const messagesTemplate: Message[] = [
  { id: 1, text: "Okay man it`s alright", owner: "user" },
  {
    id: 2,
    text: "Hahahahah",
    owner: "ai",
  },
];

export const ChatBox = ({ className }: Props) => {
  const [messages, setMessages] = useState<Message[]>(messagesTemplate);

  const [newMessage, setNewMessage] = useState("");

  const onChange = (newMessage: string) => {
    setNewMessage(newMessage);
  };

  const handleSend = async () => {
    if (newMessage.trim() === "") {
      console.log("message is missing");
      return;
    }

    const nextId = messages.length + 1;

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: newMessage }),
    });

    const data = await res.json();
    if (data.error) {
      console.error("Error");
      return;
    }
    console.log(data.response);

    setMessages([
      ...messages,
      { id: nextId, text: newMessage, owner: "user" },
      { id: nextId + 1, text: data.response, owner: "ai" },
    ]);
    setNewMessage("");
  };

  return (
    <div className={className}>
      <MessageList
        messages={messages}
        className="flex flex-col text-white gap-2 mt-10 p-2 max-h-[80vh] overflow-auto"
      />
      <div className="flex gap-2 mt-2 h-full">
        <InputFiled value={newMessage} onChange={onChange} />
        <SendButton onClick={handleSend} />
      </div>
    </div>
  );
};
