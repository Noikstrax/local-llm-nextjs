"use client";
import { useEffect, useState } from "react";
import { Message, MessageList } from "./chat-box/MessageList";
import { SendForm } from "./chat-box/SendForm";
import { useAppDispatch, useAppSelector } from "../../../../app/store/hooks";
import {
  addMessage,
  asyncCreateChat,
  createChat,
  sendMessage,
} from "../../../../app/store/chats/chatsSlice";
import { useParams, useRouter } from "next/navigation";

interface Props {
  className?: string;
}

export const ChatBox = ({ className }: Props) => {
  const params = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useRouter();
  const isCreatedChat = params?.id ? true : false;

  const chat = useAppSelector((state) =>
    state.chats.chats.find((c) => c.chatId === params?.id)
  );

  // TODO REMOVE USE EFFECT

  //TODO FIX THIS
  const models = useAppSelector((state) => state.models);
  const selectedModel = models.models.find((model) => model.isSelected);

  const messages: Message[] = isCreatedChat
    ? useAppSelector((state) => {
        const chat = state.chats.chats.find(
          (chat) => chat.chatId === params?.id
        );
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
    const nextId = crypto.randomUUID();

    let chatCreated = true;
    if (!isCreatedChat) {
      const result = await dispatch(asyncCreateChat(chatId));
      chatCreated = result.meta.requestStatus === "fulfilled";
      if (!chatCreated) {
        console.error("Failed to create chat");
        return;
      }
    }

    dispatch(
      addMessage({
        id: nextId,
        text: newMessage,
        owner: "user",
        chatId,
        loading: "succeeded",
      })
    );

    const model = selectedModel?.name;
    if (model) {
      dispatch(sendMessage({ newMessage, model, chatId }));
    } else {
      console.error("No selected model");
    }

    setNewMessage("");

    if (!isCreatedChat) {
      navigate.push(`/chats/${chatId}`);
    }
  };
  // useEffect(() => {
  //   if (!isCreatedChat) {
  //     navigate.push("/");
  //   } else {
  //     const fetchMessages = async () => {
  //       const messages = await fetch(
  //         `/api/chat/messages/getMessages?id=${params?.id}`
  //       );
  //       const res = await messages.json();

  //       if (res.length < 1) navigate.push("/");
  //     };
  //     fetchMessages();
  //   }
  // }, [isCreatedChat, navigate, params?.id]);

  useEffect(() => {
    if (!params?.id && !chat) return;

    // const checkChatExists = async () => {
    //   try {
    //     const response = await fetch(
    //       `/api/chat/messages/getMessages?id=${params?.id}`
    //     );

    //     const data = await response.json();
    //     console.log("data useEff:", data);

    //     if (!data || data.length < 1) {
    //       navigate.push("/");
    //     }
    //   } catch (e) {
    //     console.error("Failed to fetch messages:", e);
    //     navigate.push("/");
    //   }
    // };

    // checkChatExists();
  }, [chat, params?.id, navigate]);

  return (
    <div className={className}>
      <MessageList
        messages={messages}
        className="flex flex-col text-white gap-2 mt-10 p-2 max-h-[50vh] overflow-auto"
      />
      <div className="flex-col gap-2 mt-2 h-full justify-items-center">
        {!isCreatedChat ? (
          <p className="text-2xl">Чем я могу вам помочь?</p>
        ) : (
          ""
        )}
        <SendForm
          onChange={onChange}
          handleSend={handleSend}
          newMessage={newMessage}
        />
      </div>
    </div>
  );
};
