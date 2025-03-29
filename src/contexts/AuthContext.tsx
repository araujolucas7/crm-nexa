
import { User, UserRole } from "@/types";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { STORAGE_KEYS, getItem, setItem } from "@/services/storageService";
import { toast } from "sonner";
import { initMockData } from "@/services/mockDataService";
import { v4 as uuidv4 } from 'uuid';

interface AuthContextType {
  user: User | null;
  users: User[];
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  createUser: (userData: Omit<User, "id">) => void;
  updateUser: (userId: string, userData: Partial<Omit<User, "id">>) => void;
  deleteUser: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  users: [],
  isAuthenticated: false,
  loading: true,
  login: async () => false,
  logout: () => {},
  createUser: () => {},
  updateUser: () => {},
  deleteUser: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize mock data
    initMockData();
    
    // Check if user is logged in
    const currentUser = getItem<User | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (currentUser) {
      setUser(currentUser);
    }
    
    // Load users
    const allUsers = getItem<User[]>(STORAGE_KEYS.USERS, []);
    setUsers(allUsers);
    
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // In a real app, we would make an API call here
      // For this simulation, we'll check against our mock users
      const storedUsers = getItem<User[]>(STORAGE_KEYS.USERS, []);
      const userFound = storedUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (userFound) {
        // In a real app, we would verify the password
        // For simulation purposes, any password is valid
        setItem(STORAGE_KEYS.CURRENT_USER, userFound);
        setUser(userFound);
        toast.success(`Bem-vindo, ${userFound.name}!`);
        return true;
      } else {
        toast.error("Usuário não encontrado");
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Erro ao fazer login");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    setUser(null);
    toast.info("Sessão encerrada");
  };
  
  const createUser = (userData: Omit<User, "id">) => {
    const newUser: User = {
      id: uuidv4(),
      ...userData,
    };
    
    const storedUsers = getItem<User[]>(STORAGE_KEYS.USERS, []);
    
    // Check if email already exists
    const emailExists = storedUsers.some(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (emailExists) {
      toast.error("Este e-mail já está em uso");
      return;
    }
    
    const updatedUsers = [...storedUsers, newUser];
    setItem(STORAGE_KEYS.USERS, updatedUsers);
    setUsers(updatedUsers);
    
    toast.success("Usuário criado com sucesso");
  };
  
  const updateUser = (userId: string, userData: Partial<Omit<User, "id">>) => {
    const storedUsers = getItem<User[]>(STORAGE_KEYS.USERS, []);
    
    // Check if email already exists for another user
    if (userData.email) {
      const emailExists = storedUsers.some(u => 
        u.id !== userId && u.email.toLowerCase() === userData.email.toLowerCase()
      );
      
      if (emailExists) {
        toast.error("Este e-mail já está em uso");
        return;
      }
    }
    
    const updatedUsers = storedUsers.map(u => {
      if (u.id === userId) {
        return { ...u, ...userData };
      }
      return u;
    });
    
    setItem(STORAGE_KEYS.USERS, updatedUsers);
    setUsers(updatedUsers);
    
    // Update current user if it's the one being updated
    if (user && user.id === userId) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      setItem(STORAGE_KEYS.CURRENT_USER, updatedUser);
    }
    
    toast.success("Usuário atualizado com sucesso");
  };
  
  const deleteUser = (userId: string) => {
    // Prevent deleting the last admin
    const storedUsers = getItem<User[]>(STORAGE_KEYS.USERS, []);
    const userToDelete = storedUsers.find(u => u.id === userId);
    
    if (userToDelete?.role === UserRole.ADMIN) {
      const remainingAdmins = storedUsers.filter(u => 
        u.id !== userId && u.role === UserRole.ADMIN
      );
      
      if (remainingAdmins.length === 0) {
        toast.error("Não é possível excluir o último administrador");
        return;
      }
    }
    
    const updatedUsers = storedUsers.filter(u => u.id !== userId);
    setItem(STORAGE_KEYS.USERS, updatedUsers);
    setUsers(updatedUsers);
    
    toast.success("Usuário excluído com sucesso");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        createUser,
        updateUser,
        deleteUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
