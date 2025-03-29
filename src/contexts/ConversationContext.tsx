
import { Conversation, ConversationStatus, Message, MessageSender, User } from "@/types";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { STORAGE_KEYS, getItem, setItem } from "@/services/storageService";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

interface ConversationContextType {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Message[];
  loadingMessages: boolean;
  sendingMessage: boolean;
  aiProcessing: boolean;
  setActiveConversation: (conversation: Conversation | null) => void;
  sendMessage: (content: string) => Promise<void>;
  triggerAI: () => Promise<void>;
  transferConversation: (userId: string) => Promise<void>;
  markConversationAsRead: (conversationId: string) => void;
}

const ConversationContext = createContext<ConversationContextType>({
  conversations: [],
  activeConversation: null,
  messages: [],
  loadingMessages: false,
  sendingMessage: false,
  aiProcessing: false,
  setActiveConversation: () => {},
  sendMessage: async () => {},
  triggerAI: async () => {},
  transferConversation: async () => {},
  markConversationAsRead: () => {},
});

export function ConversationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [aiProcessing, setAiProcessing] = useState(false);

  // Load conversations from storage
  useEffect(() => {
    if (user) {
      const storedConversations = getItem<Conversation[]>(STORAGE_KEYS.CONVERSATIONS, []);
      // If admin, show all conversations, otherwise filter by assigned to current user
      const filteredConversations = user.role === 'admin' 
        ? storedConversations 
        : storedConversations.filter(c => c.assignedToId === user.id);
      
      setConversations(filteredConversations);
    }
  }, [user]);

  // Load messages when active conversation changes
  useEffect(() => {
    if (activeConversation) {
      setLoadingMessages(true);
      
      // Get all messages for this conversation
      const allMessages = getItem<Message[]>(STORAGE_KEYS.MESSAGES, []);
      const conversationMessages = allMessages.filter(
        m => m.conversationId === activeConversation.id
      ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      
      setMessages(conversationMessages);
      markConversationAsRead(activeConversation.id);
      setLoadingMessages(false);
      
      // Simulate real-time messages every 30-90 seconds for active conversation
      const simulateIncomingMessage = () => {
        const randomTimeMs = Math.floor(Math.random() * (90000 - 30000) + 30000);
        
        const messageTimeout = setTimeout(() => {
          if (Math.random() > 0.7) { // 30% chance of new message
            const newMessage: Message = {
              id: uuidv4(),
              conversationId: activeConversation.id,
              sender: MessageSender.CONTACT,
              content: generateRandomMessage(),
              timestamp: new Date().toISOString(),
              isRead: false,
              senderName: activeConversation.contactName,
            };
            
            // Add message to storage and state
            const updatedMessages = [...getItem<Message[]>(STORAGE_KEYS.MESSAGES, []), newMessage];
            setItem(STORAGE_KEYS.MESSAGES, updatedMessages);
            setMessages(prev => [...prev, newMessage]);
            
            // Update conversation with last message
            const updatedConversations = getItem<Conversation[]>(STORAGE_KEYS.CONVERSATIONS, []).map(c => {
              if (c.id === activeConversation.id) {
                return {
                  ...c,
                  lastMessage: newMessage.content,
                  lastMessageTime: newMessage.timestamp,
                  unreadCount: c.unreadCount + 1,
                };
              }
              return c;
            });
            
            setItem(STORAGE_KEYS.CONVERSATIONS, updatedConversations);
            setConversations(
              user?.role === 'admin' 
                ? updatedConversations
                : updatedConversations.filter(c => c.assignedToId === user?.id)
            );
            
            // Update active conversation
            setActiveConversation(updatedConversations.find(c => c.id === activeConversation.id) || null);
            
            // Show notification
            toast(`Nova mensagem de ${activeConversation.contactName}`);
          }
          
          simulateIncomingMessage(); // Setup next timeout
        }, randomTimeMs);
        
        // Clean up timeout when component unmounts or conversation changes
        return () => clearTimeout(messageTimeout);
      };
      
      const cleanup = simulateIncomingMessage();
      return cleanup;
    }
  }, [activeConversation, user]);

  // Helper function to generate random messages
  const generateRandomMessage = () => {
    const messages = [
      "Poderia me enviar mais informações sobre isso?",
      "Qual é o prazo de implementação?",
      "O preço inclui suporte técnico?",
      "Vamos agendar uma reunião para discutir os detalhes?",
      "Precisamos de treinamento para a equipe também.",
      "Isso é compatível com nossos sistemas atuais?",
      "Qual a garantia do serviço?",
      "Vocês atendem no final de semana?",
      "Preciso de uma proposta comercial formalizada.",
      "Podemos fazer uma demonstração para o time?",
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  // Send a new message
  const sendMessage = async (content: string): Promise<void> => {
    if (!activeConversation || !user || !content.trim()) return;
    
    setSendingMessage(true);
    
    try {
      // Create new message
      const newMessage: Message = {
        id: uuidv4(),
        conversationId: activeConversation.id,
        sender: MessageSender.USER,
        content,
        timestamp: new Date().toISOString(),
        isRead: true,
        senderName: user.name,
      };
      
      // Add message to storage and state
      const updatedMessages = [...getItem<Message[]>(STORAGE_KEYS.MESSAGES, []), newMessage];
      setItem(STORAGE_KEYS.MESSAGES, updatedMessages);
      setMessages(prev => [...prev, newMessage]);
      
      // Update conversation with last message
      const updatedConversations = getItem<Conversation[]>(STORAGE_KEYS.CONVERSATIONS, []).map(c => {
        if (c.id === activeConversation.id) {
          return {
            ...c,
            lastMessage: content,
            lastMessageTime: newMessage.timestamp,
            status: ConversationStatus.ACTIVE, // Set to active when responding
          };
        }
        return c;
      });
      
      setItem(STORAGE_KEYS.CONVERSATIONS, updatedConversations);
      setConversations(
        user.role === 'admin' 
          ? updatedConversations
          : updatedConversations.filter(c => c.assignedToId === user.id)
      );
      
      // Update active conversation
      setActiveConversation(updatedConversations.find(c => c.id === activeConversation.id) || null);
      
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 500));
    } finally {
      setSendingMessage(false);
    }
  };

  // Trigger AI assistant
  const triggerAI = async (): Promise<void> => {
    if (!activeConversation || !user) return;
    
    setAiProcessing(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create AI response
      const aiResponse: Message = {
        id: uuidv4(),
        conversationId: activeConversation.id,
        sender: MessageSender.AI,
        content: "Olá! Sou o assistente de IA da Nexa Automations. Com base no histórico da conversa, posso ajudar com informações sobre nossos produtos, preços e serviços. Por favor, deixe-me saber exatamente o que você precisa saber.",
        timestamp: new Date().toISOString(),
        isRead: true,
        senderName: "Assistente IA",
      };
      
      // Add AI message to storage and state
      const updatedMessages = [...getItem<Message[]>(STORAGE_KEYS.MESSAGES, []), aiResponse];
      setItem(STORAGE_KEYS.MESSAGES, updatedMessages);
      setMessages(prev => [...prev, aiResponse]);
      
      toast.success("IA ativada para esta conversa!");
    } finally {
      setAiProcessing(false);
    }
  };

  // Transfer conversation to another user
  const transferConversation = async (userId: string): Promise<void> => {
    if (!activeConversation) return;
    
    try {
      // Get user details
      const users = getItem<User[]>(STORAGE_KEYS.USERS, []);
      const targetUser = users.find(u => u.id === userId);
      
      if (!targetUser) {
        throw new Error("Usuário não encontrado");
      }
      
      // Update conversation assigned user
      const updatedConversations = getItem<Conversation[]>(STORAGE_KEYS.CONVERSATIONS, []).map(c => {
        if (c.id === activeConversation.id) {
          return { ...c, assignedToId: userId };
        }
        return c;
      });
      
      setItem(STORAGE_KEYS.CONVERSATIONS, updatedConversations);
      
      // Create system message about transfer
      const transferMessage: Message = {
        id: uuidv4(),
        conversationId: activeConversation.id,
        sender: MessageSender.USER,
        content: `Conversa transferida para ${targetUser.name}`,
        timestamp: new Date().toISOString(),
        isRead: true,
        senderName: "Sistema",
      };
      
      const updatedMessages = [...getItem<Message[]>(STORAGE_KEYS.MESSAGES, []), transferMessage];
      setItem(STORAGE_KEYS.MESSAGES, updatedMessages);
      
      // Update state
      setMessages(prev => [...prev, transferMessage]);
      setConversations(
        user?.role === 'admin' 
          ? updatedConversations
          : updatedConversations.filter(c => c.assignedToId === user?.id)
      );
      
      // Clear active conversation if it was transferred away from current user
      if (user?.role !== 'admin' && userId !== user?.id) {
        setActiveConversation(null);
      } else {
        setActiveConversation(updatedConversations.find(c => c.id === activeConversation.id) || null);
      }
      
      toast.success(`Conversa transferida para ${targetUser.name}`);
    } catch (error) {
      console.error("Error transferring conversation:", error);
      toast.error("Erro ao transferir conversa");
    }
  };

  // Mark conversation as read
  const markConversationAsRead = (conversationId: string) => {
    const updatedConversations = getItem<Conversation[]>(STORAGE_KEYS.CONVERSATIONS, []).map(c => {
      if (c.id === conversationId) {
        return { ...c, unreadCount: 0 };
      }
      return c;
    });
    
    setItem(STORAGE_KEYS.CONVERSATIONS, updatedConversations);
    setConversations(
      user?.role === 'admin' 
        ? updatedConversations
        : updatedConversations.filter(c => c.assignedToId === user?.id)
    );
    
    // Update active conversation if it's the one being marked as read
    if (activeConversation?.id === conversationId) {
      setActiveConversation(updatedConversations.find(c => c.id === conversationId) || null);
    }
    
    // Mark messages as read
    const updatedMessages = getItem<Message[]>(STORAGE_KEYS.MESSAGES, []).map(m => {
      if (m.conversationId === conversationId) {
        return { ...m, isRead: true };
      }
      return m;
    });
    
    setItem(STORAGE_KEYS.MESSAGES, updatedMessages);
    
    // Update messages in state if this is the active conversation
    if (activeConversation?.id === conversationId) {
      setMessages(
        updatedMessages.filter(m => m.conversationId === conversationId)
          .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      );
    }
  };

  return (
    <ConversationContext.Provider
      value={{
        conversations,
        activeConversation,
        messages,
        loadingMessages,
        sendingMessage,
        aiProcessing,
        setActiveConversation,
        sendMessage,
        triggerAI,
        transferConversation,
        markConversationAsRead,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
}

export const useConversations = () => useContext(ConversationContext);
