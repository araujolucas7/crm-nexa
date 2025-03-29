
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { TaskPriority, TaskStatus, Task } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CheckIcon, Clock, MoreHorizontal, Pencil, Trash2, ExternalLink } from "lucide-react";

interface TaskCardProps {
  task: Task;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onViewDetails: (task: Task) => void;
}

export const TaskCard = ({
  task,
  onEditTask,
  onDeleteTask,
  onStatusChange,
  onViewDetails,
}: TaskCardProps) => {
  const isCompleted = task.status === TaskStatus.DONE;

  return (
    <Card key={task.id}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            {isCompleted && <CheckIcon className="h-4 w-4 text-success" />}
            <CardTitle 
              className={`text-base ${isCompleted ? "line-through text-muted-foreground" : ""}`}>
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
              <DropdownMenuItem onClick={() => onEditTask(task)}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              
              {/* Conditional menu items based on current status */}
              {task.status === TaskStatus.TODO && (
                <DropdownMenuItem 
                  onClick={() => onStatusChange(task.id, TaskStatus.IN_PROGRESS)}
                >
                  Iniciar Tarefa
                </DropdownMenuItem>
              )}
              
              {task.status === TaskStatus.TODO && (
                <DropdownMenuItem 
                  onClick={() => onStatusChange(task.id, TaskStatus.DONE)}
                >
                  Marcar como Concluída
                </DropdownMenuItem>
              )}
              
              {task.status === TaskStatus.IN_PROGRESS && (
                <DropdownMenuItem 
                  onClick={() => onStatusChange(task.id, TaskStatus.TODO)}
                >
                  Voltar para A Fazer
                </DropdownMenuItem>
              )}
              
              {task.status === TaskStatus.IN_PROGRESS && (
                <DropdownMenuItem 
                  onClick={() => onStatusChange(task.id, TaskStatus.DONE)}
                >
                  Marcar como Concluída
                </DropdownMenuItem>
              )}
              
              {task.status === TaskStatus.DONE && (
                <DropdownMenuItem 
                  onClick={() => onStatusChange(task.id, TaskStatus.TODO)}
                >
                  Reabrir Tarefa
                </DropdownMenuItem>
              )}
              
              <DropdownMenuItem 
                onClick={() => onDeleteTask(task.id)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
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
            {isCompleted ? (
              "Concluída"
            ) : (
              `Vence ${formatDistanceToNow(new Date(task.dueDate), {
                addSuffix: true,
                locale: ptBR,
              })}`
            )}
          </span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 px-2"
          onClick={() => onViewDetails(task)}
        >
          <ExternalLink className="h-3 w-3 mr-1" /> Detalhes
        </Button>
      </CardFooter>
    </Card>
  );
};
