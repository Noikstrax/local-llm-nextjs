import { useAppSelector } from "../../../../../app/store/hooks";
import Link from "next/link";

export const ChatsList = () => {
  const chats = useAppSelector((state) => state.chats);
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
              {chat.messages[0].text}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
