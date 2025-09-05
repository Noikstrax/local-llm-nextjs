"use client";

import { useEffect, useRef } from "react";
import { useAppSelector } from "../../../../../app/store/hooks";
import { cn } from "@/lib/utils";

interface Props {
  handleSend: () => void;
  newMessage: string;
  onChange: (newMessage: string) => void;
}

export const SendForm = ({ handleSend, newMessage, onChange }: Props) => {
  const { loading } = useAppSelector((state) => state.models);
  const isButtonDisabled = loading === "failed" ? true : false;
  const adjustHeight = (ta: HTMLTextAreaElement) => {
    ta.style.height = "auto";

    const style = window.getComputedStyle(ta);

    let lineHeight = parseFloat(style.lineHeight);

    if (isNaN(lineHeight)) {
      const fontSize = parseFloat(style.fontSize);
      lineHeight = fontSize * 1.2;
    }

    const maxHeight = lineHeight * 8;

    ta.style.height = Math.min(ta.scrollHeight, maxHeight) + "px";
    ta.style.overflowY = ta.scrollHeight > maxHeight ? "auto" : "hidden";
  };

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    adjustHeight(e.target);
  };

  useEffect(() => {
    if (!textareaRef.current) return;

    const ta = textareaRef.current;

    const observer = new ResizeObserver(() => {
      adjustHeight(ta);
    });
    observer.observe(ta);

    return () => observer.disconnect();
  }, []);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSend();
      }}
      className="flex space-between w-full mt-10"
    >
      <div className="relative grid grid-cols-1 w-full bg-gray-500 py-2 px-2 rounded-xl">
        <div>
          <textarea
            id="input"
            className="border px-2 py-1 rounded w-full border-none outline-none resize-none"
            value={newMessage}
            onChange={(e) => {
              handleChange(e);
            }}
            ref={textareaRef}
          />
        </div>
        <div className="flex justify-end">
          <button
            className={cn(
              isButtonDisabled
                ? "bg-gray-800 text-white px-4 py-1 rounded cursor-pointer row-end-1 opacity-60 hover:bg-red-500"
                : "bg-blue-500 text-white px-4 py-1 rounded cursor-pointer row-end-1 hover:bg-green-500"
            )}
            type="submit"
            disabled={isButtonDisabled}
          >
            Send
          </button>
        </div>
      </div>
    </form>
  );
};
