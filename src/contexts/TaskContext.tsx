
import { Task, TaskPriority, TaskStatus } from "@/types";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { STORAGE_KEYS, getItem, setItem } from "@/services/storageService";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

interface TaskContextType {
  tasks: Task[];
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  createTask: (task: Omit<Task, "id">) => void;
  deleteTask: (taskId: string) => void;
  updateTask: (taskId: string, updatedTask: Partial<Omit<Task, "id">>) => void;
}

const TaskContext = createContext<TaskContextType>({
  tasks: [],
  updateTaskStatus: () => {},
  createTask: () => {},
  deleteTask: () => {},
  updateTask: () => {},
});

export function TaskProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);

  // Load tasks from storage
  useEffect(() => {
    if (user) {
      const storedTasks = getItem<Task[]>(STORAGE_KEYS.TASKS, []);
      // If admin, show all tasks, otherwise filter by assigned to current user
      const filteredTasks = user.role === 'admin' 
        ? storedTasks 
        : storedTasks.filter(t => t.assignedToId === user.id);
      
      setTasks(filteredTasks);
    }
  }, [user]);

  // Update task status
  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    const updatedTasks = getItem<Task[]>(STORAGE_KEYS.TASKS, []).map(task => {
      if (task.id === taskId) {
        return { ...task, status };
      }
      return task;
    });
    
    setItem(STORAGE_KEYS.TASKS, updatedTasks);
    
    // Update state with filtered tasks based on user role
    setTasks(
      user?.role === 'admin' 
        ? updatedTasks 
        : updatedTasks.filter(t => t.assignedToId === user?.id)
    );
    
    toast.success("Status da tarefa atualizado");
  };

  // Create a new task
  const createTask = (task: Omit<Task, "id">) => {
    const newTask: Task = {
      id: uuidv4(),
      ...task,
    };

    const updatedTasks = [...getItem<Task[]>(STORAGE_KEYS.TASKS, []), newTask];
    setItem(STORAGE_KEYS.TASKS, updatedTasks);
    
    // Update state with filtered tasks based on user role
    setTasks(
      user?.role === 'admin' 
        ? updatedTasks 
        : updatedTasks.filter(t => t.assignedToId === user?.id)
    );
    
    toast.success("Tarefa criada com sucesso");
  };

  // Delete task
  const deleteTask = (taskId: string) => {
    const updatedTasks = getItem<Task[]>(STORAGE_KEYS.TASKS, []).filter(task => task.id !== taskId);
    setItem(STORAGE_KEYS.TASKS, updatedTasks);
    
    // Update state with filtered tasks based on user role
    setTasks(
      user?.role === 'admin' 
        ? updatedTasks 
        : updatedTasks.filter(t => t.assignedToId === user?.id)
    );
    
    toast.success("Tarefa excluída com sucesso");
  };
  
  // Update task
  const updateTask = (taskId: string, updatedTask: Partial<Omit<Task, "id">>) => {
    const updatedTasks = getItem<Task[]>(STORAGE_KEYS.TASKS, []).map(task => {
      if (task.id === taskId) {
        return { ...task, ...updatedTask };
      }
      return task;
    });
    
    setItem(STORAGE_KEYS.TASKS, updatedTasks);
    
    // Update state with filtered tasks based on user role
    setTasks(
      user?.role === 'admin' 
        ? updatedTasks 
        : updatedTasks.filter(t => t.assignedToId === user?.id)
    );
    
    toast.success("Tarefa atualizada com sucesso");
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        updateTaskStatus,
        createTask,
        deleteTask,
        updateTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export const useTasks = () => useContext(TaskContext);
