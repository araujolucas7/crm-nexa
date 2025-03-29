
import { AppLayout } from "@/components/Layout/AppLayout";
import { useConversations } from "@/contexts/ConversationContext";
import { ConversationItem } from "@/components/Conversations/ConversationItem";
import { MessageBubble } from "@/components/Conversations/MessageBubble";
import { TransferModal } from "@/components/Conversations/TransferModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AIStatus, MessageSender } from "@/types";
import { BotIcon, Send, User, UserCircle2 } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const Conversations = () => {
  const {
    conversations,
    activeConversation,
    messages,
    loadingMessages,
    sendingMessage,
    aiProcessing,
    setActiveConversation,
    sendMessage,
    triggerAI,
  } = useConversations();
  
  const [messageInput, setMessageInput] = useState("");
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  
  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    
    if (messageInput.trim() && !sendingMessage) {
      sendMessage(messageInput);
      setMessageInput("");
    }
  };
  
  const getAIStatusBadge = (status: AIStatus | undefined) => {
    if (!status) return null;
    
    const badgeClasses = {
      [AIStatus.ACTIVE]: "ai-badge-active",
      [AIStatus.PAUSED]: "ai-badge-paused",
      [AIStatus.MANUAL]: "ai-badge-manual",
    };
    
    const badgeLabels = {
      [AIStatus.ACTIVE]: "IA Ativa",
      [AIStatus.PAUSED]: "IA Pausada",
      [AIStatus.MANUAL]: "Modo Manual",
    };
    
    return (
      <Badge className={badgeClasses[status]}>
        {badgeLabels[status]}
      </Badge>
    );
  };
  
  return (
    <AppLayout>
      <div className="flex h-full">
        {/* Conversations Sidebar */}
        <div className="w-80 border-r border-border bg-muted/30 flex flex-col h-full">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold">Conversas</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="flex items-center justify-center h-full p-4 text-center text-muted-foreground">
                <p>Nenhuma conversa encontrada</p>
              </div>
            ) : (
              conversations.map(conversation => (
                <ConversationItem
                  key={conversation.id}
                  conversation={conversation}
                  isActive={activeConversation?.id === conversation.id}
                />
              ))
            )}
          </div>
        </div>
        
        {/* Chat Area */}
        <div className="flex-1 flex flex-col h-full">
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    {activeConversation.contactName.charAt(0)}
                  </div>
                  <div>
                    <h2 className="font-semibold">{activeConversation.contactName}</h2>
                    <p className="text-xs text-muted-foreground">{activeConversation.contactEmail}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {getAIStatusBadge(activeConversation.aiStatus)}
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setIsTransferModalOpen(true)}
                  >
                    <UserCircle2 className="h-4 w-4 mr-2" />
                    Transferir
                  </Button>
                </div>
              </div>
              
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 bg-background/50">
                {loadingMessages ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">Carregando mensagens...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">Nenhuma mensagem encontrada</p>
                  </div>
                ) : (
                  <>
                    {messages.map(message => (
                      <MessageBubble key={message.id} message={message} />
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>
              
              {/* Input Area */}
              <div className="p-4 border-t border-border">
                <form onSubmit={handleSendMessage} className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={aiProcessing}
                      onClick={() => triggerAI()}
                    >
                      <BotIcon className="h-4 w-4 mr-2" />
                      {aiProcessing ? "Acionando IA..." : "Acionar IA"}
                    </Button>
                    
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setIsTransferModalOpen(true)}
                    >
                      <UserCircle2 className="h-4 w-4 mr-2" />
                      Transferir
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Input
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Digite sua mensagem..."
                      disabled={sendingMessage}
                      className="flex-1"
                    />
                    <Button type="submit" disabled={!messageInput.trim() || sendingMessage}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full p-8">
              <div className="max-w-md text-center">
                <User className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhuma conversa selecionada</h3>
                <p className="text-muted-foreground">
                  Selecione uma conversa na lista para iniciar ou continuar um atendimento.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <TransferModal
        open={isTransferModalOpen}
        onOpenChange={setIsTransferModalOpen}
      />
    </AppLayout>
  );
};

export default Conversations;
