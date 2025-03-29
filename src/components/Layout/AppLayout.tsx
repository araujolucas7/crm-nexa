
import { useAuth } from "@/contexts/AuthContext";
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, loading, navigate]);
  
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return null; // Will be redirected by useEffect
  }
  
  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
