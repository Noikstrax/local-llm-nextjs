import { ChatBox } from "@/app/components/ChatBox";

export default function Home() {
  return (
    <div className="font-sans min-h-screen px-4 py-8 mx-auto">
      <ChatBox className="w-full min-h-[200px] max-h-full flex flex-col justify-start md:pr-[10%] md:pl-[20%] pr-0 pl-0 h-full" />
    </div>
  );
}
