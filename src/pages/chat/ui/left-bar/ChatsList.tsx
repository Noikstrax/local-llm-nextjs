import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../app/store/hooks";
import Link from "next/link";
import { Chat, fetchChats } from "../../../../../app/store/chats/chatsSlice";

export const ChatsList = () => {
  const dispatch = useAppDispatch();
  const chats = useAppSelector((state) => state.chats);

  useEffect(() => {
    dispatch(fetchChats());
  }, [dispatch]);

  return (
    <div>
      <ul>
        {chats.map((chat) => (
          <li
            className="hover:bg-gray-500 rounded-md py-1 pl-2"
            key={chat.chatId}
          >
            <Link
              href={`/chats/${chat.chatId}`}
              className="block w-full truncate"
            >
              {chat.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
