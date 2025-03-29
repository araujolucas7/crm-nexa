
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Task, TaskStatus } from "@/types";
import { TaskList } from "./TaskList";

interface TaskTabsProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onViewDetails: (task: Task) => void;
}

export const TaskTabs = ({
  tasks,
  onEditTask,
  onDeleteTask,
  onStatusChange,
  onViewDetails,
}: TaskTabsProps) => {
  // Group tasks by status for counting
  const tasksByStatus = {
    [TaskStatus.TODO]: tasks.filter(task => task.status === TaskStatus.TODO),
    [TaskStatus.IN_PROGRESS]: tasks.filter(task => task.status === TaskStatus.IN_PROGRESS),
    [TaskStatus.DONE]: tasks.filter(task => task.status === TaskStatus.DONE),
  };
  
  return (
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
        <TaskList
          tasks={tasks}
          status={TaskStatus.TODO}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
          onStatusChange={onStatusChange}
          onViewDetails={onViewDetails}
        />
      </TabsContent>
      
      {/* In Progress Tasks */}
      <TabsContent value="in-progress" className="space-y-4 mt-4">
        <TaskList
          tasks={tasks}
          status={TaskStatus.IN_PROGRESS}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
          onStatusChange={onStatusChange}
          onViewDetails={onViewDetails}
        />
      </TabsContent>
      
      {/* Completed Tasks */}
      <TabsContent value="done" className="space-y-4 mt-4">
        <TaskList
          tasks={tasks}
          status={TaskStatus.DONE}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
          onStatusChange={onStatusChange}
          onViewDetails={onViewDetails}
        />
      </TabsContent>
    </Tabs>
  );
};
