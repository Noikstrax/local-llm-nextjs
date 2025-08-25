"use client";

import Link from "next/link";

interface Props {
  className?: string;
}

export const LeftBar = ({ className }: Props) => {
  return (
    <div className={className}>
      <Link href="/about">Left bar</Link>
    </div>
  );
};
