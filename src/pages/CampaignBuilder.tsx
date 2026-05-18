import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import WorkspaceHeader from "@/components/WorkspaceHeader";
import CreateViewModal from "@/components/CreateViewModal";
import { useCyclePath } from "@/hooks/useCyclePath";
import { useCampaigns } from "@/contexts/CampaignsContext";
import { Campaign } from "@/data/campaignData";

const CampaignBuilder = () => {
  const navigate = useNavigate();
  const { cyclePath } = useCyclePath();
  const { campaignId } = useParams();
  const { campaigns, addCampaign, updateCampaign } = useCampaigns();

  const editing = campaignId ? campaigns.find((c) => c.id === campaignId) ?? null : null;
  const isEditMode = !!editing;

  const handleSave = (campaign: Campaign) => {
    if (editing) {
      updateCampaign(editing.id, campaign);
    } else {
      addCampaign(campaign);
    }
  };

  const handleClose = () => {
    navigate(cyclePath("/campaigns"));
  };

  return (
    <Layout>
      <div className="flex flex-col h-[calc(100vh-3rem)] overflow-hidden bg-muted/30">
        <WorkspaceHeader
          backLink={{ to: cyclePath("/campaigns"), label: "Campaigns" }}
          title={isEditMode ? "Edit campaign" : "Create campaign"}
        />

        <div className="flex-1 min-h-0 overflow-hidden">
          <CreateViewModal
            isOpen
            onClose={handleClose}
            onSave={handleSave}
            initialCampaign={editing ?? undefined}
          />
        </div>
      </div>
    </Layout>
  );
};

export default CampaignBuilder;
