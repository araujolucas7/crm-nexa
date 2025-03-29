
import { 
  AIStatus, 
  Conversation, 
  ConversationStatus, 
  Deal, 
  DealStage, 
  Message, 
  MessageSender, 
  Task, 
  TaskPriority, 
  TaskStatus, 
  User, 
  UserRole 
} from "@/types";
import { STORAGE_KEYS, getItem, setItem } from "./storageService";
import { v4 as uuidv4 } from 'uuid';

// Initialize users if they don't exist
export const initUsers = (): User[] => {
  const existingUsers = getItem<User[]>(STORAGE_KEYS.USERS, []);
  
  if (existingUsers.length > 0) {
    return existingUsers;
  }
  
  const users: User[] = [
    {
      id: uuidv4(),
      name: 'Admin User',
      email: 'admin@nexaautomations.com',
      role: UserRole.ADMIN,
      avatarUrl: 'https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff',
    },
    {
      id: uuidv4(),
      name: 'Maria Silva',
      email: 'maria@nexaautomations.com',
      role: UserRole.AGENT,
      avatarUrl: 'https://ui-avatars.com/api/?name=Maria+Silva&background=2563EB&color=fff',
    },
    {
      id: uuidv4(),
      name: 'João Santos',
      email: 'joao@nexaautomations.com',
      role: UserRole.AGENT,
      avatarUrl: 'https://ui-avatars.com/api/?name=João+Santos&background=2563EB&color=fff',
    },
  ];
  
  setItem(STORAGE_KEYS.USERS, users);
  return users;
};

// Initialize conversations if they don't exist
export const initConversations = (users: User[]): Conversation[] => {
  const existingConversations = getItem<Conversation[]>(STORAGE_KEYS.CONVERSATIONS, []);
  
  if (existingConversations.length > 0) {
    return existingConversations;
  }
  
  const admin = users.find(u => u.role === UserRole.ADMIN);
  const agents = users.filter(u => u.role === UserRole.AGENT);
  
  if (!admin || agents.length === 0) {
    throw new Error('Users must be initialized before conversations');
  }
  
  const conversations: Conversation[] = [
    {
      id: uuidv4(),
      contactName: 'Roberto Almeida',
      contactEmail: 'roberto@empresa.com.br',
      contactPhone: '(11) 98765-4321',
      status: ConversationStatus.ACTIVE,
      aiStatus: AIStatus.ACTIVE,
      unreadCount: 2,
      lastMessageTime: new Date(Date.now() - 10 * 60000).toISOString(),
      assignedToId: agents[0].id,
      lastMessage: 'Preciso saber mais sobre a integração com nosso ERP.',
    },
    {
      id: uuidv4(),
      contactName: 'Carla Mendes',
      contactEmail: 'carla@techsolutions.com.br',
      contactPhone: '(21) 99876-5432',
      status: ConversationStatus.PENDING,
      aiStatus: AIStatus.PAUSED,
      unreadCount: 0,
      lastMessageTime: new Date(Date.now() - 120 * 60000).toISOString(),
      assignedToId: agents[1].id,
      lastMessage: 'Vou analisar a proposta e retorno em breve.',
    },
    {
      id: uuidv4(),
      contactName: 'Marcos Oliveira',
      contactEmail: 'marcos@bigcorp.com.br',
      contactPhone: '(31) 98765-1234',
      status: ConversationStatus.CLOSED,
      aiStatus: AIStatus.MANUAL,
      unreadCount: 0,
      lastMessageTime: new Date(Date.now() - 1440 * 60000).toISOString(),
      assignedToId: agents[0].id,
      lastMessage: 'Obrigado pelo excelente atendimento. Já assinamos o contrato.',
    },
    {
      id: uuidv4(),
      contactName: 'Luciana Costa',
      contactEmail: 'luciana@startupnova.com',
      contactPhone: '(41) 99988-7766',
      status: ConversationStatus.ACTIVE,
      aiStatus: AIStatus.ACTIVE,
      unreadCount: 1,
      lastMessageTime: new Date(Date.now() - 45 * 60000).toISOString(),
      assignedToId: agents[1].id,
      lastMessage: 'Quando podemos agendar uma demonstração?',
    },
    {
      id: uuidv4(),
      contactName: 'Fernando Gomes',
      contactEmail: 'fernando@industria.com.br',
      contactPhone: '(51) 98877-6655',
      status: ConversationStatus.ACTIVE,
      aiStatus: AIStatus.PAUSED,
      unreadCount: 3,
      lastMessageTime: new Date(Date.now() - 5 * 60000).toISOString(),
      assignedToId: admin.id,
      lastMessage: 'Estou com problemas no sistema. Podem me ajudar?',
    },
    {
      id: uuidv4(),
      contactName: 'Amanda Reis',
      contactEmail: 'amanda@consulta.com.br',
      contactPhone: '(61) 99123-4567',
      status: ConversationStatus.PENDING,
      aiStatus: AIStatus.MANUAL,
      unreadCount: 0,
      lastMessageTime: new Date(Date.now() - 240 * 60000).toISOString(),
      assignedToId: agents[0].id,
      lastMessage: 'Aguardo o envio dos documentos para prosseguirmos.',
    },
  ];
  
  setItem(STORAGE_KEYS.CONVERSATIONS, conversations);
  return conversations;
};

// Initialize messages if they don't exist
export const initMessages = (conversations: Conversation[], users: User[]): Message[] => {
  const existingMessages = getItem<Message[]>(STORAGE_KEYS.MESSAGES, []);
  
  if (existingMessages.length > 0) {
    return existingMessages;
  }
  
  const messages: Message[] = [];
  
  conversations.forEach(conversation => {
    const assignedUser = users.find(u => u.id === conversation.assignedToId);
    const assignedUserName = assignedUser ? assignedUser.name : 'Atendente';
    
    // First message from contact
    messages.push({
      id: uuidv4(),
      conversationId: conversation.id,
      sender: MessageSender.CONTACT,
      content: `Olá, sou ${conversation.contactName} da empresa e gostaria de saber mais sobre os serviços da Nexa Automations.`,
      timestamp: new Date(Date.now() - 180 * 60000).toISOString(),
      isRead: true,
      senderName: conversation.contactName,
    });
    
    // Response from assigned user
    messages.push({
      id: uuidv4(),
      conversationId: conversation.id,
      sender: MessageSender.USER,
      content: `Olá ${conversation.contactName}, sou ${assignedUserName} da Nexa Automations. Como posso ajudar você hoje?`,
      timestamp: new Date(Date.now() - 175 * 60000).toISOString(),
      isRead: true,
      senderName: assignedUserName,
    });
    
    // AI response for active AI status
    if (conversation.aiStatus === AIStatus.ACTIVE) {
      messages.push({
        id: uuidv4(),
        conversationId: conversation.id,
        sender: MessageSender.AI,
        content: `Olá ${conversation.contactName}, sou o assistente de IA da Nexa Automations. Estou aqui para auxiliar com informações sobre nossos produtos e serviços. ${assignedUserName} também está acompanhando nossa conversa.`,
        timestamp: new Date(Date.now() - 174 * 60000).toISOString(),
        isRead: true,
        senderName: 'Assistente IA',
      });
    }
    
    // Additional message from contact
    messages.push({
      id: uuidv4(),
      conversationId: conversation.id,
      sender: MessageSender.CONTACT,
      content: conversation.lastMessage,
      timestamp: conversation.lastMessageTime,
      isRead: conversation.unreadCount === 0,
      senderName: conversation.contactName,
    });
  });
  
  setItem(STORAGE_KEYS.MESSAGES, messages);
  return messages;
};

// Initialize tasks if they don't exist
export const initTasks = (users: User[], conversations: Conversation[]): Task[] => {
  const existingTasks = getItem<Task[]>(STORAGE_KEYS.TASKS, []);
  
  if (existingTasks.length > 0) {
    return existingTasks;
  }
  
  const admin = users.find(u => u.role === UserRole.ADMIN);
  const agents = users.filter(u => u.role === UserRole.AGENT);
  
  if (!admin || agents.length === 0) {
    throw new Error('Users must be initialized before tasks');
  }
  
  const tasks: Task[] = [
    {
      id: uuidv4(),
      title: 'Enviar material sobre integração ERP',
      description: 'Preparar e enviar documentação técnica sobre API de integração com sistemas ERP',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: TaskStatus.TODO,
      priority: TaskPriority.HIGH,
      assignedToId: agents[0].id,
      relatedTo: { type: 'conversation', id: conversations[0].id },
    },
    {
      id: uuidv4(),
      title: 'Agendar demonstração',
      description: 'Agendar call para demonstração do produto para a Startup Nova',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.MEDIUM,
      assignedToId: agents[1].id,
      relatedTo: { type: 'conversation', id: conversations[3].id },
    },
    {
      id: uuidv4(),
      title: 'Resolver problema técnico',
      description: 'Investigar e resolver problema reportado pelo cliente Fernando da Indústria',
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      status: TaskStatus.TODO,
      priority: TaskPriority.HIGH,
      assignedToId: admin.id,
      relatedTo: { type: 'conversation', id: conversations[4].id },
    },
    {
      id: uuidv4(),
      title: 'Preparar renovação de contrato',
      description: 'Revisar e preparar documentos para renovação de contrato trimestral',
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      assignedToId: admin.id,
    },
    {
      id: uuidv4(),
      title: 'Seguir com lead Techsolutions',
      description: 'Entrar em contato para verificar feedback sobre a proposta',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      assignedToId: agents[1].id,
      relatedTo: { type: 'conversation', id: conversations[1].id },
    },
  ];
  
  setItem(STORAGE_KEYS.TASKS, tasks);
  return tasks;
};

// Initialize deals if they don't exist
export const initDeals = (users: User[]): Deal[] => {
  const existingDeals = getItem<Deal[]>(STORAGE_KEYS.DEALS, []);
  
  if (existingDeals.length > 0) {
    return existingDeals;
  }
  
  const admin = users.find(u => u.role === UserRole.ADMIN);
  const agents = users.filter(u => u.role === UserRole.AGENT);
  
  if (!admin || agents.length === 0) {
    throw new Error('Users must be initialized before deals');
  }
  
  const deals: Deal[] = [
    {
      id: uuidv4(),
      title: 'Implantação Sistema CRM',
      value: 15000,
      company: 'Empresa SA',
      contactName: 'Roberto Almeida',
      contactEmail: 'roberto@empresa.com.br',
      stage: DealStage.PROPOSAL,
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      assignedToId: agents[0].id,
    },
    {
      id: uuidv4(),
      title: 'Consultoria Automação',
      value: 7500,
      company: 'TechSolutions',
      contactName: 'Carla Mendes',
      contactEmail: 'carla@techsolutions.com.br',
      stage: DealStage.LEAD,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      assignedToId: agents[1].id,
    },
    {
      id: uuidv4(),
      title: 'Licença Software Anual',
      value: 25000,
      company: 'BigCorp',
      contactName: 'Marcos Oliveira',
      contactEmail: 'marcos@bigcorp.com.br',
      stage: DealStage.CLOSED,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      assignedToId: agents[0].id,
    },
    {
      id: uuidv4(),
      title: 'Pacote Treinamento',
      value: 5000,
      company: 'StartupNova',
      contactName: 'Luciana Costa',
      contactEmail: 'luciana@startupnova.com',
      stage: DealStage.LEAD,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      assignedToId: agents[1].id,
    },
    {
      id: uuidv4(),
      title: 'Integração Sistemas',
      value: 35000,
      company: 'Indústria LTDA',
      contactName: 'Fernando Gomes',
      contactEmail: 'fernando@industria.com.br',
      stage: DealStage.PROPOSAL,
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      assignedToId: admin.id,
    },
    {
      id: uuidv4(),
      title: 'Suporte Premium',
      value: 12000,
      company: 'Consulta SA',
      contactName: 'Amanda Reis',
      contactEmail: 'amanda@consulta.com.br',
      stage: DealStage.LEAD,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      assignedToId: agents[0].id,
    },
  ];
  
  setItem(STORAGE_KEYS.DEALS, deals);
  return deals;
};

// Initialize all mock data
export const initMockData = () => {
  const users = initUsers();
  const conversations = initConversations(users);
  const messages = initMessages(conversations, users);
  const tasks = initTasks(users, conversations);
  const deals = initDeals(users);
  
  return { users, conversations, messages, tasks, deals };
};
