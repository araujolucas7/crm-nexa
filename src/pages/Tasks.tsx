
import { AppLayout } from "@/components/Layout/AppLayout";
import { useTasks } from "@/contexts/TaskContext";
import { TaskStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { TaskForm } from "@/components/Tasks/TaskForm";
import { TaskDetails } from "@/components/Tasks/TaskDetails";
import { TaskTabs } from "@/components/Tasks/TaskTabs";
import { DeleteTaskDialog } from "@/components/Tasks/DeleteTaskDialog";

const Tasks = () => {
  const { tasks, updateTaskStatus, deleteTask } = useTasks();
  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<typeof tasks[0] | undefined>(undefined);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [taskDetailsOpen, setTaskDetailsOpen] = useState(false);
  const [taskToView, setTaskToView] = useState<typeof tasks[0] | null>(null);
  
  const handleEditTask = (task: typeof tasks[0]) => {
    setSelectedTask(task);
    setTaskFormOpen(true);
  };
  
  const handleDeleteTask = (taskId: string) => {
    setTaskToDelete(taskId);
    setDeleteConfirmOpen(true);
  };
  
  const confirmDeleteTask = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete);
      setTaskToDelete(null);
    }
    setDeleteConfirmOpen(false);
  };
  
  const handleAddTask = () => {
    setSelectedTask(undefined);
    setTaskFormOpen(true);
  };
  
  const handleViewTaskDetails = (task: typeof tasks[0]) => {
    setTaskToView(task);
    setTaskDetailsOpen(true);
  };
  
  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Tarefas</h1>
          <Button onClick={handleAddTask}>
            <Plus className="mr-2 h-4 w-4" /> Nova Tarefa
          </Button>
        </div>
        
        <TaskTabs
          tasks={tasks}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          onStatusChange={updateTaskStatus}
          onViewDetails={handleViewTaskDetails}
        />
      </div>

      {/* Task Form Dialog */}
      <TaskForm 
        open={taskFormOpen} 
        onOpenChange={setTaskFormOpen} 
        task={selectedTask}
      />
      
      {/* Task Details Dialog */}
      <TaskDetails
        task={taskToView}
        open={taskDetailsOpen}
        onOpenChange={setTaskDetailsOpen}
      />
      
      {/* Delete Confirmation Dialog */}
      <DeleteTaskDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={confirmDeleteTask}
      />
    </AppLayout>
  );
};

export default Tasks;
