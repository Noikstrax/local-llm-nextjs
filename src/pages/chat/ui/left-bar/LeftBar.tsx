"use client";

import Link from "next/link";
import { ChatsList } from "./ChatsList";
import { LoginMenu } from "@/shared/ui";
import { UserAuth } from "@/shared/components/user-auth";

interface Props {
  className?: string;
}

export const LeftBar = ({ className }: Props) => {
  return (
    <div className={className + "flex flex-col h-screen"}>
      <div className="sticky top-0 block w-full">
        <div className="flex justify-between py-3 pl-2 px-2">
          <div>Logo</div>
          <div>
            <button
              onClick={(e) => {
                e.preventDefault();
              }}
              className="hover:cursor-pointer"
            >
              Hide
            </button>
          </div>
        </div>
        <Link
          href="/"
          className="hover:bg-gray-500 rounded-md py-1 pl-2 block w-full"
        >
          New chat
        </Link>
        <Link
          href="/"
          className="hover:bg-gray-500 rounded-md py-1 pl-2 block w-full"
        >
          Search in chats
        </Link>
      </div>
      <div className="w-full">
        <hr className="border-t-2 border-gray-300 my-2" />
      </div>

      <div className="flex-1 overflow-y-auto mt-2 pl-2 px-2">
        <ChatsList />
      </div>
      <div className="w-full">
        <hr className="border-t-2 border-gray-300 my-2" />
      </div>
      <div className="py-2 pl-2 px-1">
        <UserAuth />
      </div>
    </div>
  );
};
