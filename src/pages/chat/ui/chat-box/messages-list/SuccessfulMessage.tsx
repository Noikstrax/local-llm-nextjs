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
      className={
        "my-5 rounded-xl max-w-full text-justify prose prose-invert " +
        `${
          isAi ? "self-start" : "self-end bg-zinc-800 px-5 py-3 rounded-xl my-5"
        }`
      }
    >
      <ReactMarkdown
        components={{
          pre: ({ node, ...props }: any) => (
            <pre
              className="max-w-full overflow-x-auto bg-gray-700 p-3 rounded-lg mb-2 whitespace-pre-wrap"
              {...props}
            />
          ),
          code: ({ node, inline, className, children, ...props }: any) => (
            <code className={"bg-gray-700 px-2 py-0.5"} {...props}>
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
