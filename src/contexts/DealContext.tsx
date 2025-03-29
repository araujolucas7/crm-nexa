
import { Deal, DealStage } from "@/types";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { STORAGE_KEYS, getItem, setItem } from "@/services/storageService";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

interface DealContextType {
  deals: Deal[];
  updateDealStage: (dealId: string, stage: DealStage) => void;
}

const DealContext = createContext<DealContextType>({
  deals: [],
  updateDealStage: () => {},
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

  return (
    <DealContext.Provider
      value={{
        deals,
        updateDealStage,
      }}
    >
      {children}
    </DealContext.Provider>
  );
}

export const useDeals = () => useContext(DealContext);
