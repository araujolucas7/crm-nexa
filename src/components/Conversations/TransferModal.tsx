
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useConversations } from "@/contexts/ConversationContext";
import { STORAGE_KEYS, getItem } from "@/services/storageService";
import { User } from "@/types";
import { useEffect, useState } from "react";

interface TransferModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TransferModal({ open, onOpenChange }: TransferModalProps) {
  const [users, setUsers] = useState<User[]>([]);
  const { transferConversation, activeConversation } = useConversations();
  
  useEffect(() => {
    if (open) {
      const allUsers = getItem<User[]>(STORAGE_KEYS.USERS, []);
      // Filter out the current user if the conversation is already assigned to them
      const filteredUsers = activeConversation
        ? allUsers.filter(user => user.id !== activeConversation.assignedToId)
        : allUsers;
      
      setUsers(filteredUsers);
    }
  }, [open, activeConversation]);
  
  const handleTransfer = async (userId: string) => {
    await transferConversation(userId);
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Transferir Conversa</DialogTitle>
          <DialogDescription>
            Escolha um atendente para transferir esta conversa.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 py-4">
          {users.map(user => (
            <div
              key={user.id}
              className="flex items-center gap-3 p-3 rounded-md cursor-pointer hover:bg-muted"
              onClick={() => handleTransfer(user.id)}
            >
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
          ))}
          
          {users.length === 0 && (
            <p className="text-sm text-muted-foreground py-2 text-center">
              Não há outros atendentes disponíveis.
            </p>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
