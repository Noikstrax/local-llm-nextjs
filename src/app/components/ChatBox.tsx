"use client";
import { useState } from "react";
import { Message, MessageList } from "./chatbox/MessageList";
import { SendForm } from "./chatbox/SendForm";
import { useAppDispatch, useAppSelector, useAppStore } from "../lib/hooks";
import { addMessage, createChat } from "../lib/features/chats/chatsSlice";
import { useParams, useRouter } from "next/navigation";

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
  const store = useAppStore();
  const params = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useRouter();
  const isCreatedChat = params.id ? true : false;

  const messages: Message[] = isCreatedChat
    ? useAppSelector((state) => {
        const chat = state.chats.find((chat) => chat.chatId === params.id);
        return chat ? chat.messages : [];
      })
    : [];

  const [newMessage, setNewMessage] = useState("");

  const onChange = (newMessage: string) => {
    setNewMessage(newMessage);
  };

  const handleSend = async () => {
    if (newMessage.trim() === "") {
      console.log("message is missing");
      return;
    }
    const chatId = params.id ? params.id : crypto.randomUUID();
    const nextId = messages.length + 1;
    if (!isCreatedChat) {
      dispatch(createChat(chatId));
    }

    dispatch(
      addMessage({ id: nextId, text: newMessage, owner: "user", chatId })
    );
    setNewMessage("");
    if (!params.id) {
      navigate.push(`/chats/${chatId}`);
    }

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

    dispatch(
      addMessage({
        id: nextId + 1,
        text: data.response,
        owner: "ai",
        chatId,
      })
    );
  };

  return (
    <div className={className}>
      <MessageList
        messages={messages}
        className="flex flex-col text-white gap-2 mt-10 p-2 max-h-[80vh] overflow-auto"
      />
      <div className="flex gap-2 mt-2 h-full">
        <SendForm
          onChange={onChange}
          handleSend={handleSend}
          newMessage={newMessage}
        />
      </div>
    </div>
  );
};
