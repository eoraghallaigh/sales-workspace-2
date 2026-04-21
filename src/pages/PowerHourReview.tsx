import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import WorkspaceHeader from "@/components/WorkspaceHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { TableHeaderCell } from "@/components/ui/table-header-cell";
import { TableDataCell } from "@/components/ui/table-data-cell";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import Tag from "@/components/Tag";
import { TrellisIcon } from "@/components/ui/trellis-icon";
import ProspectingSubNav from "@/components/ProspectingSubNav";

// Power Hour contact data with enriched fields
const powerHourContacts = [
{
  id: "1",
  name: "John Mitchell",
  company: "Acme Corp",
  title: "President & Co-founder",
  phone: "+1 (415) 555-0134",
  recentConversions: ["Invited User Accepted Invitation"],
  signals: ["Competitive Renewal", "3rd Party Intent Signals"],
  lastTouchDate: "2 days ago",
  priority: "P1"
},
{
  id: "2",
  name: "Seraphina Dubois",
  company: "Zephyr Dynamics",
  title: "VP of Operations",
  phone: "+1 (212) 555-0198",
  recentConversions: [],
  signals: ["Recent Funding Round"],
  lastTouchDate: "5 days ago",
  priority: "P1"
},
{
  id: "3",
  name: "Jasper Thornton",
  company: "Luminary Industries",
  title: "CTO",
  phone: "+1 (310) 555-0267",
  recentConversions: ["Viewed Pricing Page"],
  signals: ["Non-QL Demand", "Marketing QL"],
  lastTouchDate: "1 day ago",
  priority: "P1"
},
{
  id: "4",
  name: "Genevieve Bellweather",
  company: "Stellar Solutions",
  title: "Head of Procurement",
  phone: "+1 (617) 555-0321",
  recentConversions: ["Downloaded Whitepaper"],
  signals: ["3rd Party Intent Signals"],
  lastTouchDate: "3 days ago",
  priority: "P2"
},
{
  id: "5",
  name: "Barnaby Chumley",
  company: "Apex Innovations",
  title: "Director of Sales",
  phone: "+1 (503) 555-0445",
  recentConversions: [],
  signals: ["Competitive Renewal"],
  lastTouchDate: "7 days ago",
  priority: "P1"
},
{
  id: "6",
  name: "Alistair Finch",
  company: "Veridian Systems",
  title: "CFO",
  phone: "+1 (206) 555-0512",
  recentConversions: ["Invited User Accepted Invitation"],
  signals: ["Recent Funding Round", "Non-QL Demand"],
  lastTouchDate: "4 days ago",
  priority: "P2"
},
{
  id: "7",
  name: "Wilhelmina Quince",
  company: "Galactic Enterprises",
  title: "CEO",
  phone: "+1 (312) 555-0678",
  recentConversions: [],
  signals: ["Marketing QL"],
  lastTouchDate: "6 days ago",
  priority: "P1"
},
{
  id: "8",
  name: "Montgomery Sterling",
  company: "Zenith Technologies",
  title: "VP Engineering",
  phone: "+1 (408) 555-0789",
  recentConversions: ["Viewed Pricing Page"],
  signals: ["3rd Party Intent Signals", "Competitive Renewal"],
  lastTouchDate: "1 day ago",
  priority: "P1"
},
{
  id: "9",
  name: "Beatrice Ainsworth",
  company: "Nova Dynamics",
  title: "Head of Marketing",
  phone: "+1 (646) 555-0834",
  recentConversions: [],
  signals: ["Non-QL Demand"],
  lastTouchDate: "8 days ago",
  priority: "P2"
},
{
  id: "10",
  name: "Reginald Featherstonehaugh",
  company: "Celestial Innovations",
  title: "COO",
  phone: "+1 (415) 555-0901",
  recentConversions: ["Attended Webinar"],
  signals: ["Recent Funding Round"],
  lastTouchDate: "3 days ago",
  priority: "P1"
},
{
  id: "11",
  name: "Cecily Fairweather",
  company: "Ethereal Solutions",
  title: "Product Manager",
  phone: "+1 (720) 555-0156",
  recentConversions: [],
  signals: ["Marketing QL", "3rd Party Intent Signals"],
  lastTouchDate: "10 days ago",
  priority: "P2"
},
{
  id: "12",
  name: "Desmond Hargrove",
  company: "Pinnacle Systems",
  title: "VP of Sales",
  phone: "+1 (303) 555-0211",
  recentConversions: ["Viewed Pricing Page"],
  signals: ["Competitive Renewal"],
  lastTouchDate: "2 days ago",
  priority: "P1"
},
{
  id: "13",
  name: "Tabitha Wren",
  company: "Cascade Analytics",
  title: "Director of Engineering",
  phone: "+1 (425) 555-0322",
  recentConversions: [],
  signals: ["Recent Funding Round", "3rd Party Intent Signals"],
  lastTouchDate: "4 days ago",
  priority: "P1"
},
{
  id: "14",
  name: "Lionel Ashford",
  company: "Meridian Corp",
  title: "Chief Revenue Officer",
  phone: "+1 (512) 555-0433",
  recentConversions: ["Attended Webinar"],
  signals: ["Non-QL Demand"],
  lastTouchDate: "6 days ago",
  priority: "P2"
},
{
  id: "15",
  name: "Cordelia Blakemore",
  company: "Summit Digital",
  title: "Head of Partnerships",
  phone: "+1 (415) 555-0544",
  recentConversions: ["Downloaded Whitepaper"],
  signals: ["Marketing QL"],
  lastTouchDate: "1 day ago",
  priority: "P1"
},
{
  id: "16",
  name: "Percival Lockwood",
  company: "Ironclad Technologies",
  title: "CTO",
  phone: "+1 (206) 555-0655",
  recentConversions: [],
  signals: ["Competitive Renewal", "Recent Funding Round"],
  lastTouchDate: "3 days ago",
  priority: "P1"
},
{
  id: "17",
  name: "Margot Sinclair",
  company: "Prism Ventures",
  title: "CEO",
  phone: "+1 (646) 555-0766",
  recentConversions: ["Invited User Accepted Invitation"],
  signals: ["3rd Party Intent Signals"],
  lastTouchDate: "5 days ago",
  priority: "P2"
},
{
  id: "18",
  name: "Fletcher Drummond",
  company: "Cobalt Industries",
  title: "VP of Marketing",
  phone: "+1 (312) 555-0877",
  recentConversions: [],
  signals: ["Non-QL Demand", "Marketing QL"],
  lastTouchDate: "7 days ago",
  priority: "P1"
},
{
  id: "19",
  name: "Helena Prescott",
  company: "Oasis Software",
  title: "Head of Product",
  phone: "+1 (408) 555-0988",
  recentConversions: ["Viewed Pricing Page"],
  signals: ["Recent Funding Round"],
  lastTouchDate: "2 days ago",
  priority: "P1"
},
{
  id: "20",
  name: "Archibald Crane",
  company: "Nexus Group",
  title: "Director of Operations",
  phone: "+1 (617) 555-1099",
  recentConversions: [],
  signals: ["Competitive Renewal"],
  lastTouchDate: "9 days ago",
  priority: "P2"
},
{
  id: "21",
  name: "Rosalind Kensington",
  company: "Atlas Consulting",
  title: "Managing Director",
  phone: "+1 (503) 555-1200",
  recentConversions: ["Attended Webinar"],
  signals: ["3rd Party Intent Signals", "Non-QL Demand"],
  lastTouchDate: "1 day ago",
  priority: "P1"
},
{
  id: "22",
  name: "Edmund Whitfield",
  company: "Forge Analytics",
  title: "CFO",
  phone: "+1 (310) 555-1311",
  recentConversions: [],
  signals: ["Marketing QL"],
  lastTouchDate: "4 days ago",
  priority: "P2"
},
{
  id: "23",
  name: "Imogen Blackwell",
  company: "Radiant Health",
  title: "VP of Strategy",
  phone: "+1 (720) 555-1422",
  recentConversions: ["Downloaded Whitepaper"],
  signals: ["Recent Funding Round", "Competitive Renewal"],
  lastTouchDate: "3 days ago",
  priority: "P1"
},
{
  id: "24",
  name: "Theodore Ashby",
  company: "Quantum Logistics",
  title: "Head of Sales",
  phone: "+1 (212) 555-1533",
  recentConversions: [],
  signals: ["3rd Party Intent Signals"],
  lastTouchDate: "6 days ago",
  priority: "P1"
},
{
  id: "25",
  name: "Vivienne Caldwell",
  company: "Sapphire Networks",
  title: "COO",
  phone: "+1 (415) 555-1644",
  recentConversions: ["Invited User Accepted Invitation"],
  signals: ["Non-QL Demand"],
  lastTouchDate: "8 days ago",
  priority: "P2"
},
{
  id: "26",
  name: "Rupert Langley",
  company: "Vertex Solutions",
  title: "Director of IT",
  phone: "+1 (425) 555-1755",
  recentConversions: ["Viewed Pricing Page"],
  signals: ["Marketing QL", "Recent Funding Round"],
  lastTouchDate: "2 days ago",
  priority: "P1"
},
{
  id: "27",
  name: "Octavia Pemberton",
  company: "Horizon Media",
  title: "Chief Marketing Officer",
  phone: "+1 (303) 555-1866",
  recentConversions: [],
  signals: ["Competitive Renewal"],
  lastTouchDate: "5 days ago",
  priority: "P1"
},
{
  id: "28",
  name: "Gideon Ramsey",
  company: "Crest Financial",
  title: "VP of Business Dev",
  phone: "+1 (512) 555-1977",
  recentConversions: ["Attended Webinar"],
  signals: ["3rd Party Intent Signals", "Non-QL Demand"],
  lastTouchDate: "1 day ago",
  priority: "P2"
},
{
  id: "29",
  name: "Arabella Foxworth",
  company: "Lumen Technologies",
  title: "Head of Engineering",
  phone: "+1 (646) 555-2088",
  recentConversions: [],
  signals: ["Recent Funding Round"],
  lastTouchDate: "7 days ago",
  priority: "P1"
},
{
  id: "30",
  name: "Sebastian Whitmore",
  company: "Onyx Platforms",
  title: "President",
  phone: "+1 (408) 555-2199",
  recentConversions: ["Downloaded Whitepaper"],
  signals: ["Marketing QL", "Competitive Renewal"],
  lastTouchDate: "3 days ago",
  priority: "P1"
}];


const getSignalVariant = (signal: string): "green" | "blue" | "orange" | "yellow" | "neutral" => {
  switch (signal) {
    case "Competitive Renewal":return "orange";
    case "Non-QL Demand":return "blue";
    case "Recent Funding Round":return "green";
    case "3rd Party Intent Signals":return "yellow";
    case "Marketing QL":return "orange";
    default:return "neutral";
  }
};

const PowerHourReview = () => {
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [contacts, setContacts] = useState(powerHourContacts);

  const toggleContact = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === contacts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(contacts.map((c) => c.id)));
    }
  };

  const allSelected = selectedIds.size === contacts.length && contacts.length > 0;

  return (
    <Layout>
      <div className="flex flex-col h-[calc(100vh-48px)] bg-fill-surface-recessed overflow-hidden">
        <WorkspaceHeader activeTab="prospecting" />
        <div className="flex flex-1 overflow-hidden relative">
          {/* Left Sidebar */}
          <ProspectingSubNav isCollapsed={false} onActiveItemChange={() => {}} />

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto overscroll-contain">
            <div className="max-w-[1440px] mx-auto px-6 py-6">
              {/* Metrics */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <Card className="flex flex-col items-center px-6 py-4 bg-card border border-border rounded shadow-100 flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="heading-25 text-foreground">TOTAL BOOK SIZE</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent><p>Total book size</p></TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="text-heading-500 font-normal text-foreground">497</div>
                </Card>
                <Card className="flex flex-col items-center px-6 py-4 bg-card border border-border rounded shadow-100 flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="heading-25 text-foreground">BOOK WORKED</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent><p>Percentage of book worked</p></TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="heading-500 text-foreground">52%</div>
                    <div className="detail-100 text-muted-foreground">Target: 33%</div>
                  </div>
                </Card>
                <Card className="flex flex-col items-center px-6 py-4 bg-card border border-border rounded shadow-100 flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="heading-25 text-foreground">P1 WORKED WITHIN SLA</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent><p>P1 priority worked</p></TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="heading-500 text-foreground">84%</div>
                    <div className="detail-100 text-muted-foreground">Target: 100%</div>
                  </div>
                </Card>
                <Card className="flex flex-col items-center px-6 py-4 bg-card border border-border rounded shadow-100 flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="heading-25 text-foreground">P2 WORKED WITHIN SLA</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent><p>P2 priority worked</p></TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="heading-500 text-foreground">40%</div>
                    <div className="detail-100 text-muted-foreground">Target: 100%</div>
                  </div>
                </Card>
              </div>
              {/* Header */}
              <div className="flex items-center justify-between py-4">

            <div>
              <h1 className="heading-300 text-foreground">Daily Power Hour</h1>
              <p className="body-100 text-muted-foreground mt-1">
                Here are the best {contacts.length} contacts you can call today.
              </p>
            </div>
            <div className="flex items-center gap-3">
              {selectedIds.size > 0 && (
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => {
                    setContacts((prev) => prev.filter((c) => !selectedIds.has(c.id)));
                    setSelectedIds(new Set());
                  }}>
                  Remove from List ({selectedIds.size})
                </Button>
              )}
              <Button
                    variant="secondary"
                    size="small">
                Add Contacts
              </Button>
              <Button
                    variant="primary"
                    size="small"
                    onClick={() => navigate("/power-hour")}>
                <TrellisIcon name="calling" size={16} className="brightness-0 invert mr-1" />
                Start Power Hour ({contacts.length})
              </Button>
            </div>
          </div>

              <Card className="border border-border-core-subtle rounded-100 shadow-100 overflow-hidden">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="flex">
                  <TableHeaderCell className="w-[48px] min-w-[48px] items-center justify-center">
                    <Checkbox
                            checked={allSelected}
                            onCheckedChange={toggleAll} />
                          
                  </TableHeaderCell>
                  <TableHeaderCell className="flex-[2] w-auto">
                    Contact
                  </TableHeaderCell>
                  <TableHeaderCell className="flex-[2] w-auto">
                    Company
                  </TableHeaderCell>
                  <TableHeaderCell className="flex-[1.5] w-auto">
                    Phone
                  </TableHeaderCell>
                  <TableHeaderCell className="flex-[1.5] w-auto items-start">
                    Recent Conversions
                  </TableHeaderCell>
                  <TableHeaderCell className="flex-[2] w-auto">
                    Intent Signals
                  </TableHeaderCell>
                  <TableHeaderCell className="flex-1 w-auto">
                    Last Touch
                  </TableHeaderCell>
                  <TableHeaderCell className="flex-1 w-auto">
                    Priority
                  </TableHeaderCell>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) =>
                      <tr
                        key={contact.id}
                        className="flex cursor-pointer transition-colors"
                        onClick={() => toggleContact(contact.id)}>
                        
                    <TableDataCell className="w-[48px] min-w-[48px] items-center justify-center">
                      <Checkbox
                            checked={selectedIds.has(contact.id)}
                            onCheckedChange={() => toggleContact(contact.id)}
                            onClick={(e) => e.stopPropagation()} />
                          
                    </TableDataCell>
                    <TableDataCell className="flex-[2] w-auto">
                      <div className="flex flex-col">
                        <a href="#" className="body-125 text-text-interactive hover:underline cursor-pointer">{contact.name}</a>
                        <span className="detail-200 text-muted-foreground">{contact.title}</span>
                      </div>
                    </TableDataCell>
                    <TableDataCell className="flex-[2] w-auto">
                      <a href="#" className="body-100 text-text-interactive hover:underline cursor-pointer">{contact.company}</a>
                    </TableDataCell>
                    <TableDataCell className="flex-[1.5] w-auto">
                      <span className="body-100 text-foreground">{contact.phone}</span>
                    </TableDataCell>
                    <TableDataCell className="flex-[1.5] w-auto">
                      {contact.recentConversions.length > 0 ?
                          <div className="flex flex-col gap-1">
                          {contact.recentConversions.map((conv, i) =>
                            <span key={i} className="body-100 text-foreground">{conv}</span>
                            )}
                        </div> :

                          <span className="detail-200 text-muted-foreground">—</span>
                          }
                    </TableDataCell>
                    <TableDataCell className="flex-[2] w-auto">
                      {contact.signals.length > 0 ?
                          <div className="flex flex-wrap gap-1">
                          {contact.signals.map((signal, i) =>
                            <Tag key={i} variant={getSignalVariant(signal)}>
                              {signal}
                            </Tag>
                            )}
                        </div> :

                          <span className="detail-200 text-muted-foreground">—</span>
                          }
                    </TableDataCell>
                    <TableDataCell className="flex-1 w-auto">
                      <span className="detail-100 text-muted-foreground">{contact.lastTouchDate}</span>
                    </TableDataCell>
                    <TableDataCell className="flex-1 w-auto">
                      <Tag variant={contact.priority === "P1" ? "blue" : "neutral"}>
                        {contact.priority}
                      </Tag>
                    </TableDataCell>
                  </tr>
                      )}
              </tbody>
            </table>
          </div>
        </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>);

};

export default PowerHourReview;