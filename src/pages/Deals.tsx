import { AppLayout } from "@/components/Layout/AppLayout";
import { DealForm } from "@/components/Deals/DealForm";
import { useDeals } from "@/contexts/DealContext";
import { DealStage } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ExternalLink, MoreHorizontal, Plus, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DealDetails } from "@/components/Deals/DealDetails";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const Deals = () => {
  const { deals, updateDealStage, deleteDeal } = useDeals();
  const [dealFormOpen, setDealFormOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<typeof deals[0] | undefined>(undefined);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [dealToDelete, setDealToDelete] = useState<string | null>(null);
  const [dealDetailsOpen, setDealDetailsOpen] = useState(false);
  const [dealToView, setDealToView] = useState<typeof deals[0] | null>(null);
  
  // Group deals by stage
  const dealsByStage = {
    [DealStage.LEAD]: deals.filter(deal => deal.stage === DealStage.LEAD),
    [DealStage.PROPOSAL]: deals.filter(deal => deal.stage === DealStage.PROPOSAL),
    [DealStage.CLOSED]: deals.filter(deal => deal.stage === DealStage.CLOSED),
  };
  
  const handleEditDeal = (deal: typeof deals[0]) => {
    setSelectedDeal(deal);
    setDealFormOpen(true);
  };
  
  const handleDeleteDeal = (dealId: string) => {
    setDealToDelete(dealId);
    setDeleteConfirmOpen(true);
  };
  
  const confirmDeleteDeal = () => {
    if (dealToDelete) {
      deleteDeal(dealToDelete);
      setDealToDelete(null);
    }
    setDeleteConfirmOpen(false);
  };
  
  const handleAddDeal = () => {
    setSelectedDeal(undefined);
    setDealFormOpen(true);
  };
  
  const handleViewDealDetails = (deal: typeof deals[0]) => {
    setDealToView(deal);
    setDealDetailsOpen(true);
  };
  
  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Negociações</h1>
          <Button onClick={handleAddDeal}>
            <Plus className="mr-2 h-4 w-4" /> Nova Negociação
          </Button>
        </div>
        
        <Tabs defaultValue="lead" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="lead">
              Leads ({dealsByStage[DealStage.LEAD].length})
            </TabsTrigger>
            <TabsTrigger value="proposal">
              Propostas ({dealsByStage[DealStage.PROPOSAL].length})
            </TabsTrigger>
            <TabsTrigger value="closed">
              Fechados ({dealsByStage[DealStage.CLOSED].length})
            </TabsTrigger>
          </TabsList>
          
          {/* Leads Tab */}
          <TabsContent value="lead" className="space-y-4 mt-4">
            {dealsByStage[DealStage.LEAD].length === 0 ? (
              <div className="py-10 text-center text-muted-foreground border border-dashed rounded-md">
                Não há leads ativos
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dealsByStage[DealStage.LEAD].map(deal => (
                  <Card key={deal.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">{deal.title}</CardTitle>
                          <CardDescription className="text-xs mt-1">
                            {deal.company}
                          </CardDescription>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Ações</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditDeal(deal)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateDealStage(deal.id, DealStage.PROPOSAL)}>
                              Mover para Propostas
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteDeal(deal.id)} className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {formatCurrency(deal.value)}
                      </div>
                      <div className="mt-2 text-sm">
                        <span className="font-medium">Contato:</span> {deal.contactName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <span className="font-medium">Email:</span> {deal.contactEmail}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between text-xs text-muted-foreground">
                      <span>
                        Criado {formatDistanceToNow(new Date(deal.createdAt), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 px-2"
                        onClick={() => handleViewDealDetails(deal)}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" /> Detalhes
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          {/* Proposals Tab */}
          <TabsContent value="proposal" className="space-y-4 mt-4">
            {dealsByStage[DealStage.PROPOSAL].length === 0 ? (
              <div className="py-10 text-center text-muted-foreground border border-dashed rounded-md">
                Não há propostas ativas
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dealsByStage[DealStage.PROPOSAL].map(deal => (
                  <Card key={deal.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">{deal.title}</CardTitle>
                          <CardDescription className="text-xs mt-1">
                            {deal.company}
                          </CardDescription>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Ações</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditDeal(deal)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateDealStage(deal.id, DealStage.LEAD)}>
                              Mover para Leads
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateDealStage(deal.id, DealStage.CLOSED)}>
                              Mover para Fechados
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteDeal(deal.id)} className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {formatCurrency(deal.value)}
                      </div>
                      <div className="mt-2 text-sm">
                        <span className="font-medium">Contato:</span> {deal.contactName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <span className="font-medium">Email:</span> {deal.contactEmail}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between text-xs text-muted-foreground">
                      <span>
                        Atualizado {formatDistanceToNow(new Date(deal.updatedAt), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 px-2"
                        onClick={() => handleViewDealDetails(deal)}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" /> Detalhes
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          {/* Closed Tab */}
          <TabsContent value="closed" className="space-y-4 mt-4">
            {dealsByStage[DealStage.CLOSED].length === 0 ? (
              <div className="py-10 text-center text-muted-foreground border border-dashed rounded-md">
                Não há negociações fechadas
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dealsByStage[DealStage.CLOSED].map(deal => (
                  <Card key={deal.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">{deal.title}</CardTitle>
                          <CardDescription className="text-xs mt-1">
                            {deal.company}
                          </CardDescription>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Ações</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditDeal(deal)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateDealStage(deal.id, DealStage.PROPOSAL)}>
                              Reabrir como Proposta
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteDeal(deal.id)} className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {formatCurrency(deal.value)}
                      </div>
                      <div className="mt-2 text-sm">
                        <span className="font-medium">Contato:</span> {deal.contactName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <span className="font-medium">Email:</span> {deal.contactEmail}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between text-xs text-muted-foreground">
                      <span>
                        Fechado {formatDistanceToNow(new Date(deal.updatedAt), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 px-2"
                        onClick={() => handleViewDealDetails(deal)}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" /> Detalhes
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Deal Form Dialog */}
      <DealForm 
        open={dealFormOpen} 
        onOpenChange={setDealFormOpen} 
        deal={selectedDeal}
      />
      
      {/* Deal Details Dialog */}
      <DealDetails 
        deal={dealToView} 
        open={dealDetailsOpen} 
        onOpenChange={setDealDetailsOpen} 
      />
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir negociação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta negociação? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteDeal} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
};

export default Deals;
