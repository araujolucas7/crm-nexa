
import { Deal, DealStage } from "@/types";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { STORAGE_KEYS, getItem, setItem } from "@/services/storageService";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

interface DealContextType {
  deals: Deal[];
  updateDealStage: (dealId: string, stage: DealStage) => void;
  createDeal: (deal: Omit<Deal, "id" | "createdAt" | "updatedAt">) => void;
  deleteDeal: (dealId: string) => void;
  updateDeal: (dealId: string, updatedDeal: Partial<Omit<Deal, "id" | "createdAt" | "updatedAt">>) => void;
}

const DealContext = createContext<DealContextType>({
  deals: [],
  updateDealStage: () => {},
  createDeal: () => {},
  deleteDeal: () => {},
  updateDeal: () => {},
});

export function DealProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [deals, setDeals] = useState<Deal[]>([]);

  // Load deals from storage
  useEffect(() => {
    if (user) {
      const storedDeals = getItem<Deal[]>(STORAGE_KEYS.DEALS, []);
      // If admin, show all deals, otherwise filter by assigned to current user
      const filteredDeals = user.role === 'admin' 
        ? storedDeals 
        : storedDeals.filter(d => d.assignedToId === user.id);
      
      setDeals(filteredDeals);
    }
  }, [user]);

  // Update deal stage
  const updateDealStage = (dealId: string, stage: DealStage) => {
    const updatedDeals = getItem<Deal[]>(STORAGE_KEYS.DEALS, []).map(deal => {
      if (deal.id === dealId) {
        return { 
          ...deal, 
          stage, 
          updatedAt: new Date().toISOString() 
        };
      }
      return deal;
    });
    
    setItem(STORAGE_KEYS.DEALS, updatedDeals);
    
    // Update state with filtered deals based on user role
    setDeals(
      user?.role === 'admin' 
        ? updatedDeals 
        : updatedDeals.filter(d => d.assignedToId === user?.id)
    );
    
    toast.success("Estágio da negociação atualizado");
  };

  // Create a new deal
  const createDeal = (deal: Omit<Deal, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString();
    const newDeal: Deal = {
      id: uuidv4(),
      ...deal,
      createdAt: now,
      updatedAt: now,
    };

    const updatedDeals = [...getItem<Deal[]>(STORAGE_KEYS.DEALS, []), newDeal];
    setItem(STORAGE_KEYS.DEALS, updatedDeals);
    
    // Update state with filtered deals based on user role
    setDeals(
      user?.role === 'admin' 
        ? updatedDeals 
        : updatedDeals.filter(d => d.assignedToId === user?.id)
    );
    
    toast.success("Negociação criada com sucesso");
  };

  // Delete deal
  const deleteDeal = (dealId: string) => {
    const updatedDeals = getItem<Deal[]>(STORAGE_KEYS.DEALS, []).filter(deal => deal.id !== dealId);
    setItem(STORAGE_KEYS.DEALS, updatedDeals);
    
    // Update state with filtered deals based on user role
    setDeals(
      user?.role === 'admin' 
        ? updatedDeals 
        : updatedDeals.filter(d => d.assignedToId === user?.id)
    );
    
    toast.success("Negociação excluída com sucesso");
  };
  
  // Update deal
  const updateDeal = (dealId: string, updatedDeal: Partial<Omit<Deal, "id" | "createdAt" | "updatedAt">>) => {
    const updatedDeals = getItem<Deal[]>(STORAGE_KEYS.DEALS, []).map(deal => {
      if (deal.id === dealId) {
        return { 
          ...deal, 
          ...updatedDeal, 
          updatedAt: new Date().toISOString() 
        };
      }
      return deal;
    });
    
    setItem(STORAGE_KEYS.DEALS, updatedDeals);
    
    // Update state with filtered deals based on user role
    setDeals(
      user?.role === 'admin' 
        ? updatedDeals 
        : updatedDeals.filter(d => d.assignedToId === user?.id)
    );
    
    toast.success("Negociação atualizada com sucesso");
  };

  return (
    <DealContext.Provider
      value={{
        deals,
        updateDealStage,
        createDeal,
        deleteDeal,
        updateDeal,
      }}
    >
      {children}
    </DealContext.Provider>
  );
}

export const useDeals = () => useContext(DealContext);
