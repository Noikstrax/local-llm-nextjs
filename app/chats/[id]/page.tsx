import { ChatBox } from "../../../src/pages/chat/ui/ChatBox";
import { ChatBoxHeader } from "../../../src/pages/chat/ui/ChatBoxHeader";

export default function Home() {
  return (
    <div className="font-sans min-h-screen px-4 py-8 mx-auto">
      <ChatBoxHeader />
      <ChatBox className="w-full min-h-[200px] max-h-full flex flex-col justify-start md:pr-[10%] md:pl-[20%] pr-0 pl-0 h-full" />
    </div>
  );
}
