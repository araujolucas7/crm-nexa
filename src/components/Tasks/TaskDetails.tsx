
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Task, TaskPriority, TaskStatus } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AlertCircle, Calendar, CheckCircle, Clock } from "lucide-react";

interface TaskDetailsProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TaskDetails({ task, open, onOpenChange }: TaskDetailsProps) {
  if (!task) return null;

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

  const getStatusLabel = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.TODO:
        return "A Fazer";
      case TaskStatus.IN_PROGRESS:
        return "Em Progresso";
      case TaskStatus.DONE:
        return "Concluída";
      default:
        return "Desconhecido";
    }
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.DONE:
        return <CheckCircle className="h-5 w-5 text-success" />;
      case TaskStatus.IN_PROGRESS:
        return <Clock className="h-5 w-5 text-warning-foreground" />;
      case TaskStatus.TODO:
        return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {getStatusIcon(task.status)}
            <DialogTitle 
              className={`text-xl font-bold ${task.status === TaskStatus.DONE ? "line-through text-muted-foreground" : ""}`}
            >
              {task.title}
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm font-medium text-muted-foreground">
            {getStatusLabel(task.status)}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Descrição</div>
            <div className="rounded-md border p-3">
              <p className="text-sm">{task.description}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">Prioridade</div>
              <div className={`font-medium ${getPriorityClass(task.priority)}`}>
                {getPriorityLabel(task.priority)}
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">Data de vencimento</div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  {formatDistanceToNow(new Date(task.dueDate), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
