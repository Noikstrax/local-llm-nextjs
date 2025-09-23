import ReactMarkdown from "react-markdown";
import { Message } from "../MessageList";

interface Props {
  message: Message;
  isAi: boolean;
}

export const SuccessfulMessage = ({ message, isAi }: Props) => {
  return (
    <div
      key={message.id}
      className={`
        my-5
        rounded-xl
        max-w-full
        text-justify
        prose prose-invert
        ${
          isAi ? "self-start" : "self-end bg-zinc-800 px-5 py-3 rounded-xl my-5"
        }`}
    >
      <ReactMarkdown>{message.text}</ReactMarkdown>
    </div>
  );
};
