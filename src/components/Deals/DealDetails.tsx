
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Deal, DealStage } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BadgeInfo, Calendar, DollarSign, Mail, User } from "lucide-react";

interface DealDetailsProps {
  deal: Deal | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DealDetails({ deal, open, onOpenChange }: DealDetailsProps) {
  if (!deal) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getStageLabel = (stage: DealStage) => {
    switch (stage) {
      case DealStage.LEAD:
        return "Lead";
      case DealStage.PROPOSAL:
        return "Proposta";
      case DealStage.CLOSED:
        return "Fechado";
      default:
        return "Desconhecido";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{deal.title}</DialogTitle>
          <DialogDescription className="text-sm font-medium text-muted-foreground">
            {deal.company}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-muted-foreground" />
            <div className="font-semibold text-lg">{formatCurrency(deal.value)}</div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">Estágio</div>
              <div className="flex items-center gap-2">
                <BadgeInfo className="h-4 w-4 text-muted-foreground" />
                <span>{getStageLabel(deal.stage)}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">Data de criação</div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  {formatDistanceToNow(new Date(deal.createdAt), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Contato</div>
            <div className="rounded-md border p-3 space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{deal.contactName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{deal.contactEmail}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
