
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { User, UserRole } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect } from "react";

interface UserFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User;
}

const userFormSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  role: z.nativeEnum(UserRole),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres").optional(),
  avatarUrl: z.string().url("URL inválida").optional(),
});

export function UserForm({ open, onOpenChange, user }: UserFormProps) {
  const { createUser, updateUser } = useAuth();
  
  const isEditing = !!user;
  
  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      role: UserRole.AGENT,
      password: "",
      avatarUrl: "",
    },
  });
  
  // Load user data when editing
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl || "",
      });
    } else {
      form.reset({
        name: "",
        email: "",
        role: UserRole.AGENT,
        password: "",
        avatarUrl: "",
      });
    }
  }, [user, form]);
  
  const onSubmit = (values: z.infer<typeof userFormSchema>) => {
    if (isEditing && user) {
      // When editing, we don't want to send an empty password
      const updateData = { ...values };
      if (!updateData.password) {
        delete updateData.password;
      }
      updateUser(user.id, updateData);
    } else {
      // For new users, password is required
      createUser({
        ...values,
        password: values.password || "", // fallback, but form validation should prevent this
      });
    }
    
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Usuário" : "Novo Usuário"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="email@exemplo.com" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{isEditing ? "Nova senha (opcional)" : "Senha"}</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder={isEditing ? "Deixe em branco para manter a atual" : "Senha"} 
                      {...field} 
                    />
                  </FormControl>
                  {isEditing && (
                    <FormDescription>
                      Deixe em branco para manter a senha atual
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Função</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a função" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={UserRole.ADMIN}>Administrador</SelectItem>
                      <SelectItem value={UserRole.AGENT}>Atendente</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="avatarUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL do Avatar (opcional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://exemplo.com/avatar.jpg" 
                      {...field} 
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancelar</Button>
              </DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {isEditing ? "Salvar Alterações" : "Criar Usuário"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
