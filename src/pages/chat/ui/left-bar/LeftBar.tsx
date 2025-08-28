"use client";

import Link from "next/link";
import { ChatsList } from "./ChatsList";

interface Props {
  className?: string;
}

export const LeftBar = ({ className }: Props) => {
  return (
    <div className={className}>
      <div className="sticky top-0 block h-1/3 w-full">
        <Link
          href="/"
          className="hover:bg-gray-500 rounded-md py-1 pl-2 block w-full"
        >
          New chat
        </Link>
      </div>
      <ChatsList />
    </div>
  );
};
