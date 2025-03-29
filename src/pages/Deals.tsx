
import { AppLayout } from "@/components/Layout/AppLayout";
import { useDeals } from "@/contexts/DealContext";
import { DealStage } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

const Deals = () => {
  const { deals, updateDealStage } = useDeals();
  
  // Group deals by stage
  const dealsByStage = {
    [DealStage.LEAD]: deals.filter(deal => deal.stage === DealStage.LEAD),
    [DealStage.PROPOSAL]: deals.filter(deal => deal.stage === DealStage.PROPOSAL),
    [DealStage.CLOSED]: deals.filter(deal => deal.stage === DealStage.CLOSED),
  };
  
  // Calculate total values by stage
  const totalValueByStage = {
    [DealStage.LEAD]: dealsByStage[DealStage.LEAD].reduce((total, deal) => total + deal.value, 0),
    [DealStage.PROPOSAL]: dealsByStage[DealStage.PROPOSAL].reduce((total, deal) => total + deal.value, 0),
    [DealStage.CLOSED]: dealsByStage[DealStage.CLOSED].reduce((total, deal) => total + deal.value, 0),
  };
  
  // Handle drag end
  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    
    // Dropped outside a droppable area
    if (!destination) return;
    
    // Dropped in the same place
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }
    
    // Update deal stage
    if (source.droppableId !== destination.droppableId) {
      updateDealStage(draggableId, destination.droppableId as DealStage);
    }
  };
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };
  
  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Negociações</h1>
        </div>
        
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Lead Column */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2">
                <h2 className="text-lg font-semibold">Leads</h2>
                <div className="text-sm text-muted-foreground">
                  {formatCurrency(totalValueByStage[DealStage.LEAD])}
                </div>
              </div>
              
              <Droppable droppableId={DealStage.LEAD}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="min-h-[200px] space-y-3"
                  >
                    {dealsByStage[DealStage.LEAD].map((deal, index) => (
                      <Draggable key={deal.id} draggableId={deal.id} index={index}>
                        {(provided) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="cursor-grab active:cursor-grabbing"
                          >
                            <CardHeader className="p-3 pb-1">
                              <CardTitle className="text-sm">{deal.title}</CardTitle>
                              <CardDescription className="text-xs">
                                {deal.company}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="p-3 pt-0 space-y-1">
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-medium text-foreground/70">
                                  {deal.contactName}
                                </span>
                                <span className="text-sm font-semibold">
                                  {formatCurrency(deal.value)}
                                </span>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Atualizado {formatDistanceToNow(new Date(deal.updatedAt), {
                                  addSuffix: true,
                                  locale: ptBR,
                                })}
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    
                    {dealsByStage[DealStage.LEAD].length === 0 && (
                      <div className="py-10 text-center text-muted-foreground border border-dashed rounded-md">
                        Sem negociações
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
            
            {/* Proposal Column */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2">
                <h2 className="text-lg font-semibold">Propostas</h2>
                <div className="text-sm text-muted-foreground">
                  {formatCurrency(totalValueByStage[DealStage.PROPOSAL])}
                </div>
              </div>
              
              <Droppable droppableId={DealStage.PROPOSAL}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="min-h-[200px] space-y-3"
                  >
                    {dealsByStage[DealStage.PROPOSAL].map((deal, index) => (
                      <Draggable key={deal.id} draggableId={deal.id} index={index}>
                        {(provided) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="cursor-grab active:cursor-grabbing"
                          >
                            <CardHeader className="p-3 pb-1">
                              <CardTitle className="text-sm">{deal.title}</CardTitle>
                              <CardDescription className="text-xs">
                                {deal.company}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="p-3 pt-0 space-y-1">
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-medium text-foreground/70">
                                  {deal.contactName}
                                </span>
                                <span className="text-sm font-semibold">
                                  {formatCurrency(deal.value)}
                                </span>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Atualizado {formatDistanceToNow(new Date(deal.updatedAt), {
                                  addSuffix: true,
                                  locale: ptBR,
                                })}
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    
                    {dealsByStage[DealStage.PROPOSAL].length === 0 && (
                      <div className="py-10 text-center text-muted-foreground border border-dashed rounded-md">
                        Sem negociações
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
            
            {/* Closed Column */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2">
                <h2 className="text-lg font-semibold">Fechados</h2>
                <div className="text-sm text-muted-foreground">
                  {formatCurrency(totalValueByStage[DealStage.CLOSED])}
                </div>
              </div>
              
              <Droppable droppableId={DealStage.CLOSED}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="min-h-[200px] space-y-3"
                  >
                    {dealsByStage[DealStage.CLOSED].map((deal, index) => (
                      <Draggable key={deal.id} draggableId={deal.id} index={index}>
                        {(provided) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="cursor-grab active:cursor-grabbing"
                          >
                            <CardHeader className="p-3 pb-1">
                              <CardTitle className="text-sm">{deal.title}</CardTitle>
                              <CardDescription className="text-xs">
                                {deal.company}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="p-3 pt-0 space-y-1">
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-medium text-foreground/70">
                                  {deal.contactName}
                                </span>
                                <span className="text-sm font-semibold">
                                  {formatCurrency(deal.value)}
                                </span>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Atualizado {formatDistanceToNow(new Date(deal.updatedAt), {
                                  addSuffix: true,
                                  locale: ptBR,
                                })}
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    
                    {dealsByStage[DealStage.CLOSED].length === 0 && (
                      <div className="py-10 text-center text-muted-foreground border border-dashed rounded-md">
                        Sem negociações
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        </DragDropContext>
      </div>
    </AppLayout>
  );
};

export default Deals;
