
import { useConversations } from "@/contexts/ConversationContext";
import { cn } from "@/lib/utils";
import { AIStatus, Conversation, ConversationStatus } from "@/types";
import { BotIcon, MoreVertical, PauseIcon, UserIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
}

export function ConversationItem({ conversation, isActive }: ConversationItemProps) {
  const { setActiveConversation } = useConversations();
  
  const getStatusBadgeColor = (status: ConversationStatus) => {
    switch (status) {
      case ConversationStatus.ACTIVE:
        return "bg-success";
      case ConversationStatus.PENDING:
        return "bg-warning";
      case ConversationStatus.CLOSED:
        return "bg-muted-foreground";
      default:
        return "bg-muted-foreground";
    }
  };
  
  const getAIStatusIcon = (status: AIStatus) => {
    switch (status) {
      case AIStatus.ACTIVE:
        return <BotIcon className="h-3.5 w-3.5 text-success" />;
      case AIStatus.PAUSED:
        return <PauseIcon className="h-3.5 w-3.5 text-warning" />;
      case AIStatus.MANUAL:
        return <UserIcon className="h-3.5 w-3.5 text-destructive" />;
      default:
        return null;
    }
  };
  
  const timeAgo = formatDistanceToNow(new Date(conversation.lastMessageTime), {
    addSuffix: true,
    locale: ptBR,
  });
  
  return (
    <div
      className={cn(
        "cursor-pointer flex items-start p-3 gap-3 border-b border-border transition-colors",
        isActive ? "bg-secondary" : "hover:bg-secondary/50"
      )}
      onClick={() => setActiveConversation(conversation)}
    >
      <div className="relative flex-shrink-0">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          {conversation.contactName.charAt(0)}
        </div>
        <span 
          className={cn(
            "absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-background",
            getStatusBadgeColor(conversation.status)
          )} 
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <h3 className="font-medium text-sm">{conversation.contactName}</h3>
            <div className="flex items-center">
              {getAIStatusIcon(conversation.aiStatus)}
            </div>
          </div>
          <div className="text-xs text-muted-foreground">{timeAgo}</div>
        </div>
        
        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
          {conversation.lastMessage}
        </p>
        
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-muted-foreground">
            {conversation.contactEmail}
          </span>
          
          {conversation.unreadCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
              {conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
