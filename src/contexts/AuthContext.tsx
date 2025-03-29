
import { User } from "@/types";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { STORAGE_KEYS, getItem, setItem } from "@/services/storageService";
import { toast } from "sonner";
import { initMockData } from "@/services/mockDataService";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
  login: async () => false,
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize mock data
    initMockData();
    
    // Check if user is logged in
    const currentUser = getItem<User | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // In a real app, we would make an API call here
      // For this simulation, we'll check against our mock users
      const users = getItem<User[]>(STORAGE_KEYS.USERS, []);
      const userFound = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
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

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
