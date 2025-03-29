
import { AppLayout } from "@/components/Layout/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { STORAGE_KEYS, getItem } from "@/services/storageService";
import { User, UserRole } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Shield, UserCog } from "lucide-react";
import { toast } from "sonner";

const Users = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  
  useEffect(() => {
    // Load all users from storage
    const allUsers = getItem<User[]>(STORAGE_KEYS.USERS, []);
    setUsers(allUsers);
  }, []);
  
  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== UserRole.ADMIN) {
      toast.error("Acesso negado. Apenas administradores podem acessar esta página.");
      window.location.href = "/dashboard";
    }
  }, [user]);
  
  // Get role badge
  const getRoleBadge = (role: UserRole) => {
    if (role === UserRole.ADMIN) {
      return (
        <div className="flex items-center gap-1 text-primary font-medium text-xs">
          <Shield className="h-3.5 w-3.5" />
          <span>Administrador</span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center gap-1 text-muted-foreground font-medium text-xs">
        <UserCog className="h-3.5 w-3.5" />
        <span>Atendente</span>
      </div>
    );
  };
  
  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Usuários</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map(user => (
            <Card key={user.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-lg">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <CardTitle className="text-base">{user.name}</CardTitle>
                    {getRoleBadge(user.role)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {user.email}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Users;
