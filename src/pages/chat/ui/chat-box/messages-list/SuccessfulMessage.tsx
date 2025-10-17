import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css"; // подключаем тему
import { Message } from "../MessageList";
import "./code.css";

interface Props {
  message: Message;
  isAi: boolean;
}

export const SuccessfulMessage = ({ message, isAi }: Props) => {
  return (
    <div
      key={message.id}
      className={`my-5 rounded-xl max-w-full text-justify prose prose-invert ${
        isAi ? "self-start" : "self-end bg-zinc-800 px-5 py-3 rounded-xl my-5"
      }`}
    >
      <ReactMarkdown
        rehypePlugins={[rehypeHighlight]}
        components={{
          pre: ({ node, ...props }: any) => (
            <pre
              className="bg-gray-700 p-3 rounded-lg overflow-hidden mb-2 break-words"
              {...props}
            />
          ),
          code: ({ node, inline, className, children, ...props }: any) => (
            <code className="bg-gray-700 px-2 py-0.5 rounded" {...props}>
              {children}
            </code>
          ),
        }}
      >
        {message.text}
      </ReactMarkdown>
    </div>
  );
};
