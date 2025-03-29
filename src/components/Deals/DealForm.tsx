
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
  FormMessage 
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
import { useDeals } from "@/contexts/DealContext";
import { Deal, DealStage, User } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect } from "react";

interface DealFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deal?: Deal;
}

const dealFormSchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  company: z.string().min(2, "A empresa deve ter pelo menos 2 caracteres"),
  contactName: z.string().min(3, "O nome do contato deve ter pelo menos 3 caracteres"),
  contactEmail: z.string().email("E-mail inválido"),
  value: z.coerce.number().positive("O valor deve ser maior que zero"),
  stage: z.nativeEnum(DealStage),
  assignedToId: z.string({
    required_error: "O responsável é obrigatório",
  }),
});

export function DealForm({ open, onOpenChange, deal }: DealFormProps) {
  const { user, users } = useAuth();
  const { createDeal, updateDeal } = useDeals();
  
  const isEditing = !!deal;
  
  const form = useForm<z.infer<typeof dealFormSchema>>({
    resolver: zodResolver(dealFormSchema),
    defaultValues: {
      title: "",
      company: "",
      contactName: "",
      contactEmail: "",
      value: 0,
      stage: DealStage.LEAD,
      assignedToId: user?.id || "",
    },
  });
  
  // Load deal data when editing
  useEffect(() => {
    if (deal) {
      form.reset({
        title: deal.title,
        company: deal.company,
        contactName: deal.contactName,
        contactEmail: deal.contactEmail,
        value: deal.value,
        stage: deal.stage,
        assignedToId: deal.assignedToId,
      });
    } else {
      form.reset({
        title: "",
        company: "",
        contactName: "",
        contactEmail: "",
        value: 0,
        stage: DealStage.LEAD,
        assignedToId: user?.id || "",
      });
    }
  }, [deal, form, user]);
  
  const onSubmit = (values: z.infer<typeof dealFormSchema>) => {
    if (isEditing && deal) {
      updateDeal(deal.id, values);
    } else {
      createDeal(values);
    }
    
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Negociação" : "Nova Negociação"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o título da negociação" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Empresa</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da empresa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor (R$)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        min={0}
                        step="0.01"
                        placeholder="0,00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Contato</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do contato" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail do Contato</FormLabel>
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
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="stage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estágio</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o estágio" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={DealStage.LEAD}>Lead</SelectItem>
                        <SelectItem value={DealStage.PROPOSAL}>Proposta</SelectItem>
                        <SelectItem value={DealStage.CLOSED}>Fechado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="assignedToId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Responsável</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o responsável" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {users.map((user: User) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancelar</Button>
              </DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {isEditing ? "Salvar Alterações" : "Criar Negociação"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
