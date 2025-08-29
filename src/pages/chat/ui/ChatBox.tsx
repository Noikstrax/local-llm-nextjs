"use client";
import { useEffect, useState } from "react";
import { Message, MessageList } from "./chat-box/MessageList";
import { SendForm } from "./chat-box/SendForm";
import { useAppDispatch, useAppSelector } from "../../../../app/store/hooks";
import { addMessage, createChat } from "../../../../app/store/chats/chatsSlice";
import { useParams, useRouter } from "next/navigation";

interface Props {
  className?: string;
}

export const ChatBox = ({ className }: Props) => {
  const params = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useRouter();
  const isCreatedChat = params?.id ? true : false;

  // TODO REMOVE USE EFFECT

  //TODO FIX THIS
  const models = useAppSelector((state) => state.models);
  const selectedModel = models.models.find((model) => model.isSelected);

  const messages: Message[] = isCreatedChat
    ? useAppSelector((state) => {
        const chat = state.chats.find((chat) => chat.chatId === params?.id);
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
    const chatId = params?.id ? params.id : crypto.randomUUID();
    const nextId = messages.length + 1;

    console.log(messages);
    if (!isCreatedChat) {
      dispatch(createChat(chatId));
    }

    dispatch(
      addMessage({ id: nextId, text: newMessage, owner: "user", chatId })
    );
    setNewMessage("");
    if (!params?.id) {
      navigate.push(`/chats/${chatId}`);
    }

    const model = selectedModel?.name;
    console.log(model);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: newMessage, model }),
    });

    const data = await res.json();
    if (data.error) {
      console.error("Error");
      return;
    }
    console.log(data.response);
    let answer;
    if (data.response) {
      answer = data.response;
    } else {
      answer = "Error";
    }

    dispatch(
      addMessage({
        id: nextId + 1,
        text: answer,
        owner: "ai",
        chatId,
      })
    );
  };

  useEffect(() => {
    if (messages.length < 1 && isCreatedChat) {
      navigate.push("/");
    }
  }, [messages, isCreatedChat, navigate]);

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
