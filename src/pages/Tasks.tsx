
import { AppLayout } from "@/components/Layout/AppLayout";
import { useTasks } from "@/contexts/TaskContext";
import { TaskPriority, TaskStatus } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CheckIcon, Clock, MoreHorizontal } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Tasks = () => {
  const { tasks, updateTaskStatus } = useTasks();
  
  // Group tasks by status
  const tasksByStatus = {
    [TaskStatus.TODO]: tasks.filter(task => task.status === TaskStatus.TODO),
    [TaskStatus.IN_PROGRESS]: tasks.filter(task => task.status === TaskStatus.IN_PROGRESS),
    [TaskStatus.DONE]: tasks.filter(task => task.status === TaskStatus.DONE),
  };
  
  // Get priority class
  const getPriorityClass = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.HIGH:
        return "text-destructive";
      case TaskPriority.MEDIUM:
        return "text-warning-foreground";
      case TaskPriority.LOW:
        return "text-muted-foreground";
      default:
        return "text-muted-foreground";
    }
  };
  
  // Get priority label
  const getPriorityLabel = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.HIGH:
        return "Alta";
      case TaskPriority.MEDIUM:
        return "Média";
      case TaskPriority.LOW:
        return "Baixa";
      default:
        return "Não definida";
    }
  };
  
  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Tarefas</h1>
        </div>
        
        <Tabs defaultValue="todo" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="todo">
              A Fazer ({tasksByStatus[TaskStatus.TODO].length})
            </TabsTrigger>
            <TabsTrigger value="in-progress">
              Em Progresso ({tasksByStatus[TaskStatus.IN_PROGRESS].length})
            </TabsTrigger>
            <TabsTrigger value="done">
              Concluídas ({tasksByStatus[TaskStatus.DONE].length})
            </TabsTrigger>
          </TabsList>
          
          {/* To-Do Tasks */}
          <TabsContent value="todo" className="space-y-4 mt-4">
            {tasksByStatus[TaskStatus.TODO].length === 0 ? (
              <div className="py-10 text-center text-muted-foreground border border-dashed rounded-md">
                Não há tarefas a fazer
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tasksByStatus[TaskStatus.TODO].map(task => (
                  <Card key={task.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base">{task.title}</CardTitle>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Ações</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={() => updateTaskStatus(task.id, TaskStatus.IN_PROGRESS)}
                            >
                              Iniciar Tarefa
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => updateTaskStatus(task.id, TaskStatus.DONE)}
                            >
                              Marcar como Concluída
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {task.description}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-2">
                      <div className="flex items-center gap-1 text-xs">
                        <Clock className="h-3 w-3" />
                        <span>
                          Vence {formatDistanceToNow(new Date(task.dueDate), {
                            addSuffix: true,
                            locale: ptBR,
                          })}
                        </span>
                      </div>
                      <div className={`text-xs font-medium ${getPriorityClass(task.priority)}`}>
                        Prioridade: {getPriorityLabel(task.priority)}
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          {/* In Progress Tasks */}
          <TabsContent value="in-progress" className="space-y-4 mt-4">
            {tasksByStatus[TaskStatus.IN_PROGRESS].length === 0 ? (
              <div className="py-10 text-center text-muted-foreground border border-dashed rounded-md">
                Não há tarefas em progresso
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tasksByStatus[TaskStatus.IN_PROGRESS].map(task => (
                  <Card key={task.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base">{task.title}</CardTitle>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Ações</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={() => updateTaskStatus(task.id, TaskStatus.TODO)}
                            >
                              Voltar para A Fazer
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => updateTaskStatus(task.id, TaskStatus.DONE)}
                            >
                              Marcar como Concluída
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {task.description}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-2">
                      <div className="flex items-center gap-1 text-xs">
                        <Clock className="h-3 w-3" />
                        <span>
                          Vence {formatDistanceToNow(new Date(task.dueDate), {
                            addSuffix: true,
                            locale: ptBR,
                          })}
                        </span>
                      </div>
                      <div className={`text-xs font-medium ${getPriorityClass(task.priority)}`}>
                        Prioridade: {getPriorityLabel(task.priority)}
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          {/* Completed Tasks */}
          <TabsContent value="done" className="space-y-4 mt-4">
            {tasksByStatus[TaskStatus.DONE].length === 0 ? (
              <div className="py-10 text-center text-muted-foreground border border-dashed rounded-md">
                Não há tarefas concluídas
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tasksByStatus[TaskStatus.DONE].map(task => (
                  <Card key={task.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <CheckIcon className="h-4 w-4 text-success" />
                          <CardTitle className="text-base line-through text-muted-foreground">
                            {task.title}
                          </CardTitle>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Ações</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={() => updateTaskStatus(task.id, TaskStatus.TODO)}
                            >
                              Reabrir Tarefa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {task.description}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-2">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>
                          Concluída
                        </span>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Tasks;
