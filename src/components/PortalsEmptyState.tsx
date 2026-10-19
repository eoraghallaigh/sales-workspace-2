import noPortalsImg from "@/assets/no-portals.png";

// Shown in the Portals card when a company has no HubSpot portal (common for
// net-new prospects).
const PortalsEmptyState = () => (
  <div className="flex flex-col items-center text-center gap-3 py-6">
    <img src={noPortalsImg} alt="" className="w-20 h-auto" />
    <p className="body-100 text-muted-foreground">This company has no portals</p>
  </div>
);

export default PortalsEmptyState;
