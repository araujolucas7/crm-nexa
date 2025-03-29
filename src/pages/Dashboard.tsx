
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useConversations } from "@/contexts/ConversationContext";
import { useDeals } from "@/contexts/DealContext";
import { useTasks } from "@/contexts/TaskContext";
import { AppLayout } from "@/components/Layout/AppLayout";
import { AIStatus, ConversationStatus, DealStage, TaskPriority, TaskStatus } from "@/types";
import { ArrowUpRight, CheckCircle, Clock, MessageSquare, Users, DollarSign, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const { conversations } = useConversations();
  const { tasks } = useTasks();
  const { deals } = useDeals();
  
  // Calculate stats
  const totalConversations = conversations.length;
  const activeConversations = conversations.filter(c => c.status === ConversationStatus.ACTIVE).length;
  const unreadMessages = conversations.reduce((total, conv) => total + conv.unreadCount, 0);
  
  const pendingTasks = tasks.filter(t => t.status !== TaskStatus.DONE).length;
  const highPriorityTasks = tasks.filter(t => t.priority === TaskPriority.HIGH).length;
  
  const totalDealsValue = deals.reduce((total, deal) => total + deal.value, 0);
  const closedDealsValue = deals
    .filter(deal => deal.stage === DealStage.CLOSED)
    .reduce((total, deal) => total + deal.value, 0);
  
  const formattedTotalValue = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalDealsValue);
  const formattedClosedValue = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(closedDealsValue);
  
  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Bem-vindo, {user?.name}
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversas Ativas</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeConversations}</div>
              <p className="text-xs text-muted-foreground">
                +{unreadMessages} mensagens não lidas
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tarefas Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingTasks}</div>
              <p className="text-xs text-muted-foreground">
                {highPriorityTasks} com alta prioridade
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Total Negociações</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formattedTotalValue}</div>
              <p className="text-xs text-muted-foreground">
                {formattedClosedValue} em negociações fechadas
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversas com IA</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {conversations.filter(c => c.aiStatus === AIStatus.ACTIVE).length}
              </div>
              <p className="text-xs text-muted-foreground">
                {conversations.filter(c => c.aiStatus === AIStatus.PAUSED).length} em pausa
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-full lg:col-span-4">
            <CardHeader>
              <CardTitle>Conversas Recentes</CardTitle>
              <CardDescription>
                Conversas das últimas 24 horas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conversations
                  .filter(conv => {
                    const lastMessageDate = new Date(conv.lastMessageTime);
                    const oneDayAgo = new Date();
                    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
                    return lastMessageDate > oneDayAgo;
                  })
                  .slice(0, 5)
                  .map(conv => (
                    <div key={conv.id} className="flex items-center gap-4">
                      <div className="relative">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          {conv.contactName.charAt(0)}
                        </div>
                        <span className={`absolute -right-1 -top-1 h-4 w-4 rounded-full border-2 border-background ${
                          conv.status === ConversationStatus.ACTIVE 
                            ? "bg-success" 
                            : conv.status === ConversationStatus.PENDING 
                            ? "bg-warning" 
                            : "bg-muted-foreground"
                        }`} />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">{conv.contactName}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">{conv.lastMessage}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <p className="text-xs text-muted-foreground">
                          {new Date(conv.lastMessageTime).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        {conv.unreadCount > 0 && (
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  
                {conversations.filter(conv => {
                  const lastMessageDate = new Date(conv.lastMessageTime);
                  const oneDayAgo = new Date();
                  oneDayAgo.setDate(oneDayAgo.getDate() - 1);
                  return lastMessageDate > oneDayAgo;
                }).length === 0 && (
                  <div className="py-6 text-center text-muted-foreground">
                    Nenhuma conversa recente
                  </div>
                )}
                
                <Link
                  to="/conversations"
                  className="flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  <span>Ver todas as conversas</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
            </CardContent>
          </Card>
          
          <Card className="col-span-full lg:col-span-3">
            <CardHeader>
              <CardTitle>Próximas Tarefas</CardTitle>
              <CardDescription>
                Tarefas pendentes com prazo próximo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks
                  .filter(task => task.status !== TaskStatus.DONE)
                  .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                  .slice(0, 5)
                  .map(task => (
                    <div key={task.id} className="flex items-start gap-2">
                      <div className={`mt-0.5 h-2 w-2 rounded-full ${
                        task.priority === TaskPriority.HIGH 
                          ? "bg-destructive" 
                          : task.priority === TaskPriority.MEDIUM 
                          ? "bg-warning" 
                          : "bg-muted-foreground"
                      }`} />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">{task.title}</p>
                        <p className="text-xs text-muted-foreground">
                          Vence em: {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex h-6 items-center rounded-md bg-muted px-2 text-xs">
                        {task.status === TaskStatus.IN_PROGRESS ? "Em Progresso" : "A Fazer"}
                      </div>
                    </div>
                  ))}
                  
                {tasks.filter(task => task.status !== TaskStatus.DONE).length === 0 && (
                  <div className="py-6 text-center text-muted-foreground">
                    Nenhuma tarefa pendente
                  </div>
                )}
                
                <Link
                  to="/tasks"
                  className="flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  <span>Ver todas as tarefas</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
