
import { cn } from "@/lib/utils";
import { Message, MessageSender } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const timeAgo = formatDistanceToNow(new Date(message.timestamp), {
    addSuffix: true,
    locale: ptBR,
  });
  
  const getBubbleClass = (sender: MessageSender) => {
    switch (sender) {
      case MessageSender.USER:
        return "message-bubble-user";
      case MessageSender.CONTACT:
        return "message-bubble-contact";
      case MessageSender.AI:
        return "message-bubble-ai";
      default:
        return "message-bubble-contact";
    }
  };
  
  return (
    <div
      className={cn(
        "flex flex-col gap-1 mb-4",
        message.sender === MessageSender.USER ? "items-end" : "items-start"
      )}
    >
      <div className="flex items-center gap-1">
        <p className="text-xs font-medium">{message.senderName}</p>
        <span className="text-xs text-muted-foreground">{timeAgo}</span>
      </div>
      
      <div className={cn("message-bubble", getBubbleClass(message.sender))}>
        {message.content}
      </div>
    </div>
  );
}
