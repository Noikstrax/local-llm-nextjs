import { Skeleton } from "@/shared/ui/skeleton";
import { Message } from "../MessageList";

interface Props {
  message: Message;
}

export const PendingMessage = ({ message }: Props) => {
  return (
    <Skeleton className="ml-3 min-h-[32px] w-[85px] rounded-sm bg-gray-500" />
  );
};
