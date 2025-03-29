
export enum UserRole {
  ADMIN = 'admin',
  AGENT = 'agent',
}

export enum ConversationStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  CLOSED = 'closed',
}

export enum AIStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  MANUAL = 'manual',
}

export enum MessageSender {
  USER = 'user',
  CONTACT = 'contact',
  AI = 'ai',
}

export enum DealStage {
  LEAD = 'lead',
  PROPOSAL = 'proposal',
  CLOSED = 'closed',
}

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface Conversation {
  id: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  status: ConversationStatus;
  aiStatus: AIStatus;
  unreadCount: number;
  lastMessageTime: string;
  assignedToId: string;
  lastMessage: string;
}

export interface Message {
  id: string;
  conversationId: string;
  sender: MessageSender;
  content: string;
  timestamp: string;
  isRead: boolean;
  senderName: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedToId: string;
  relatedTo?: { type: 'conversation' | 'deal'; id: string };
}

export interface Deal {
  id: string;
  title: string;
  value: number;
  company: string;
  contactName: string;
  contactEmail: string;
  stage: DealStage;
  createdAt: string;
  updatedAt: string;
  assignedToId: string;
}
