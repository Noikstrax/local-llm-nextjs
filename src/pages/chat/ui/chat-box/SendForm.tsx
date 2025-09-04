"use client";

import { useEffect, useRef } from "react";
import { text } from "stream/consumers";

interface Props {
  handleSend: () => void;
  newMessage: string;
  onChange: (newMessage: string) => void;
}

export const SendForm = ({ handleSend, newMessage, onChange }: Props) => {
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
    if (!textareaRef.current) return;
    adjustHeight(e.target);
  };

  useEffect(() => {
    if (!textareaRef.current) return;

    const observer = new ResizeObserver(() => {
      adjustHeight(textareaRef.current!);
    });
    observer.observe(textareaRef.current);

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
            className="bg-blue-500 text-white px-4 py-1 rounded cursor-pointer row-end-1"
            type="submit"
          >
            Send
          </button>
        </div>
      </div>
    </form>
  );
};
