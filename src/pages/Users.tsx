
import { AppLayout } from "@/components/Layout/AppLayout";
import { UserForm } from "@/components/Users/UserForm";
import { useAuth } from "@/contexts/AuthContext";
import { STORAGE_KEYS, getItem } from "@/services/storageService";
import { User, UserRole } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Pencil, Plus, Shield, Trash2, UserCog } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const Users = () => {
  const { user, users, deleteUser } = useAuth();
  const [userFormOpen, setUserFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  
  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== UserRole.ADMIN) {
      toast.error("Acesso negado. Apenas administradores podem acessar esta página.");
      window.location.href = "/dashboard";
    }
  }, [user]);
  
  const handleCreateUser = () => {
    setSelectedUser(undefined);
    setUserFormOpen(true);
  };
  
  const handleEditUser = (userToEdit: User) => {
    setSelectedUser(userToEdit);
    setUserFormOpen(true);
  };
  
  const handleDeleteUser = (userId: string) => {
    // Check if attempting to delete current user
    if (userId === user?.id) {
      toast.error("Você não pode excluir seu próprio usuário");
      return;
    }
    
    setUserToDelete(userId);
    setDeleteConfirmOpen(true);
  };
  
  const confirmDeleteUser = () => {
    if (userToDelete) {
      deleteUser(userToDelete);
      setUserToDelete(null);
    }
    setDeleteConfirmOpen(false);
  };
  
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
          <Button onClick={handleCreateUser}>
            <Plus className="mr-2 h-4 w-4" /> Novo Usuário
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map(userItem => (
            <Card key={userItem.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-lg">
                      {userItem.name.charAt(0)}
                    </div>
                    <div>
                      <CardTitle className="text-base">{userItem.name}</CardTitle>
                      {getRoleBadge(userItem.role)}
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <svg width="15" height="3" viewBox="0 0 15 3" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-foreground">
                          <path d="M1.5 1.5C1.5 1.91421 1.16421 2.25 0.75 2.25C0.335786 2.25 0 1.91421 0 1.5C0 1.08579 0.335786 0.75 0.75 0.75C1.16421 0.75 1.5 1.08579 1.5 1.5Z" fill="currentColor"/>
                          <path d="M7.5 1.5C7.5 1.91421 7.16421 2.25 6.75 2.25C6.33579 2.25 6 1.91421 6 1.5C6 1.08579 6.33579 0.75 6.75 0.75C7.16421 0.75 7.5 1.08579 7.5 1.5Z" fill="currentColor"/>
                          <path d="M13.5 1.5C13.5 1.91421 13.1642 2.25 12.75 2.25C12.3358 2.25 12 1.91421 12 1.5C12 1.08579 12.3358 0.75 12.75 0.75C13.1642 0.75 13.5 1.08579 13.5 1.5Z" fill="currentColor"/>
                        </svg>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditUser(userItem)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteUser(userItem.id)}
                        className="text-destructive"
                        disabled={userItem.id === user?.id}
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
                  {userItem.email}
                </p>
                {userItem.id === user?.id && (
                  <div className="mt-2 text-xs bg-muted px-2 py-1 rounded">
                    Usuário atual
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* User Form Dialog */}
      <UserForm
        open={userFormOpen}
        onOpenChange={setUserFormOpen}
        user={selectedUser}
      />
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir usuário</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteUser} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
};

export default Users;
