import { createContext, useCallback, useContext, useMemo, useState, ReactNode } from "react";
import { Campaign, campaigns as seedCampaigns } from "@/data/campaignData";

interface CampaignsContextValue {
  campaigns: Campaign[];
  addCampaign: (campaign: Campaign) => void;
  updateCampaign: (id: string, partial: Partial<Campaign>) => void;
}

const CampaignsContext = createContext<CampaignsContextValue | null>(null);

export const CampaignsProvider = ({ children }: { children: ReactNode }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(seedCampaigns);

  const addCampaign = useCallback((campaign: Campaign) => {
    setCampaigns((prev: Campaign[]) => [...prev, campaign]);
  }, []);

  const updateCampaign = useCallback((id: string, partial: Partial<Campaign>) => {
    setCampaigns((prev: Campaign[]) => prev.map(c => c.id === id ? { ...c, ...partial } : c));
  }, []);

  const value = useMemo(
    () => ({ campaigns, addCampaign, updateCampaign }),
    [campaigns, addCampaign, updateCampaign]
  );

  return <CampaignsContext.Provider value={value}>{children}</CampaignsContext.Provider>;
};

export const useCampaigns = (): CampaignsContextValue => {
  const ctx = useContext(CampaignsContext);
  if (!ctx) throw new Error("useCampaigns must be used inside CampaignsProvider");
  return ctx;
};
