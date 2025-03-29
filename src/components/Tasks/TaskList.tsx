
import { Task, TaskStatus } from "@/types";
import { TaskCard } from "./TaskCard";

interface TaskListProps {
  tasks: Task[];
  status: TaskStatus;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onViewDetails: (task: Task) => void;
}

export const TaskList = ({
  tasks,
  status,
  onEditTask,
  onDeleteTask,
  onStatusChange,
  onViewDetails,
}: TaskListProps) => {
  const filteredTasks = tasks.filter(task => task.status === status);
  
  if (filteredTasks.length === 0) {
    return (
      <div className="py-10 text-center text-muted-foreground border border-dashed rounded-md">
        {status === TaskStatus.TODO && "Não há tarefas a fazer"}
        {status === TaskStatus.IN_PROGRESS && "Não há tarefas em progresso"}
        {status === TaskStatus.DONE && "Não há tarefas concluídas"}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredTasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
          onStatusChange={onStatusChange}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};
