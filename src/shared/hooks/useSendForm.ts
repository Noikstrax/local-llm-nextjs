import { useState, useRef, useCallback, useLayoutEffect } from "react";

const getLineHeight = (element: HTMLElement): number => {
  if (!element) return 0;
  const style = window.getComputedStyle(element);
  let lineHeight = parseFloat(style.lineHeight);
  if (isNaN(lineHeight)) {
    const fontSize = parseFloat(style.fontSize);
    lineHeight = fontSize * 1.2;
  }
  return lineHeight;
};

export const useSendForm = (
  handleSend: (newMessage: string) => void,
  maxRows: number
) => {
  const [newMessage, setNewMessage] = useState("");
  const [isMultiline, setIsMultiline] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const textArea = textareaRef.current;
    if (!textArea) return;

    textArea.style.height = "auto";
    const lineHeight = getLineHeight(textArea);
    const maxHeight = lineHeight * maxRows;
    textArea.style.height = `${Math.min(textArea.scrollHeight, maxHeight)}px`;
    textArea.style.overflowY =
      textArea.scrollHeight > maxHeight ? "auto" : "hidden";

    if (newMessage.trim() === "") {
      if (isMultiline) {
        setIsMultiline(false);
      }
      return;
    }

    if (isMultiline) {
      return;
    }

    if (textArea.scrollHeight > lineHeight * 1.5) {
      setIsMultiline(true);
    }
  }, [newMessage, isMultiline, maxRows]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setNewMessage(e.target.value);
    },
    []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (newMessage.trim() === "") return;

      handleSend(newMessage);

      setNewMessage("");
      setIsMultiline(false);

      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    },
    [newMessage, handleSend]
  );

  return {
    newMessage,
    textareaRef,
    isMultiline,
    handleChange,
    handleSubmit,
  };
};
