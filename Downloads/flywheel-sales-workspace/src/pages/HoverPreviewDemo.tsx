import companyLogoPlaceholder from "@/assets/company-logo-placeholder.png";

const contacts = [
  {
    id: "c1",
    name: "Jennifer Park",
    role: "VP, Marketing",
    approach: "Lead with strategic framing — they set direction.",
  },
  {
    id: "c2",
    name: "Keisha Blue",
    role: "Marketing Director",
    approach: "Emphasise productivity gains",
  },
  {
    id: "c3",
    name: "Elowen Green",
    role: "Head of Product",
    approach: "Pitch Content Hub",
  },
];

const HoverPreviewDemo = () => {
  return (
    <div className="min-h-screen bg-muted/20 flex items-start justify-start p-10">
      <div className="w-[360px] rounded-md border border-[#ccc] bg-card shadow-100 p-4">
        <div className="flex flex-col gap-6">
          <div className="detail-200 font-semibold text-muted-foreground uppercase tracking-wide">
            Strategy preview
          </div>
          {contacts.map((contact) => (
            <div key={contact.id} className="flex items-start gap-3">
              <img
                src={companyLogoPlaceholder}
                alt=""
                className="h-8 w-8 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex flex-col min-w-0 flex-1 gap-0.5">
                <span className="heading-100 text-foreground">{contact.name}</span>
                <span className="detail-200 text-muted-foreground">{contact.role}</span>
                <span className="body-100 text-foreground">{contact.approach}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HoverPreviewDemo;
