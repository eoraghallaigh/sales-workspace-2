import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ExternalLink, Building2, Ticket, Contact, LineChart, Star, FileText } from 'lucide-react';
import emailIcon from "@/assets/email-icon.png";
import callIcon from "@/assets/call-icon.png";
import linkedinIcon from "@/assets/linkedin-icon.png";

interface SourceItem {
  category: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const sources: SourceItem[] = [
  // CRM data
  { category: "CRM data", icon: <Building2 className="h-4 w-4 text-blue-600" />, title: "Deal", description: "Hampton Healthcare" },
  { category: "CRM data", icon: <img src={emailIcon} alt="Email" className="w-4 h-4" />, title: "Email", description: "Quick Follow-Up & Resources from Today" },
  { category: "CRM data", icon: <Ticket className="h-4 w-4 text-blue-600" />, title: "Ticket", description: "Ticket name goes here" },
  { category: "CRM data", icon: <Building2 className="h-4 w-4 text-blue-600" />, title: "Company", description: "Woodford Reserve" },
  { category: "CRM data", icon: <Contact className="h-4 w-4 text-blue-600" />, title: "Contact", description: "Jacqueline Barcamonte" },
  { category: "CRM data", icon: <LineChart className="h-4 w-4 text-blue-600" />, title: "Line Item", description: "Line item name (Deal name)" },
  
  // Websites
  { category: "Websites", icon: <img src={linkedinIcon} alt="LinkedIn" className="w-4 h-4" />, title: "LinkedIn", description: "This Startup Is Using AI Agents To Fight..." },
  { category: "Websites", icon: <img src={linkedinIcon} alt="LinkedIn" className="w-4 h-4" />, title: "LinkedIn", description: "This Startup Is Using AI Agents To Fight..." },
  { category: "Websites", icon: <img src={linkedinIcon} alt="LinkedIn" className="w-4 h-4" />, title: "LinkedIn", description: "This Startup Is Using AI Agents To Fight..." },
  { category: "Websites", icon: <img src={linkedinIcon} alt="LinkedIn" className="w-4 h-4" />, title: "LinkedIn", description: "This Startup Is Using AI Agents To Fight..." },
  
  // Apps
  { category: "Apps", icon: <Star className="h-4 w-4 text-purple-600" />, title: "Gong", description: "Intro call with Hampton Healthcare" },
  { category: "Apps", icon: <Star className="h-4 w-4 text-purple-600" />, title: "Gong", description: "This Startup Is Using AI Agents To Fight Ca..." },
  { category: "Apps", icon: <Star className="h-4 w-4 text-purple-600" />, title: "Gong", description: "This Startup Is Using AI Agents To Fight Ca..." },
  { category: "Apps", icon: <Star className="h-4 w-4 text-purple-600" />, title: "Gong", description: "This Startup Is Using AI Agents To Fight Ca..." },
  
  // AI Skills
  { category: "AI Skills", icon: <Star className="h-4 w-4 text-pink-600" />, title: "Perform Web Search", description: "Details if available" },
  { category: "AI Skills", icon: <Star className="h-4 w-4 text-pink-600" />, title: "Perform Web Search", description: "Details if available" },
  { category: "AI Skills", icon: <Star className="h-4 w-4 text-pink-600" />, title: "Perform Web Search", description: "Details if available" },
  { category: "AI Skills", icon: <Star className="h-4 w-4 text-pink-600" />, title: "Perform Web Search", description: "Details if available" },
  
  // Knowledge box
  { category: "Knowledge box", icon: <FileText className="h-4 w-4 text-blue-600" />, title: "Excel filename.xls", description: "Details if available" },
  { category: "Knowledge box", icon: <Building2 className="h-4 w-4 text-blue-600" />, title: "KB Article Name", description: "Details if available" },
  { category: "Knowledge box", icon: <Building2 className="h-4 w-4 text-blue-600" />, title: "Deal", description: "Deal name goes here" },
  { category: "Knowledge box", icon: <Contact className="h-4 w-4 text-blue-600" />, title: "Contact", description: "Jacqueline Barcamonte" },
  { category: "Knowledge box", icon: <Ticket className="h-4 w-4 text-blue-600" />, title: "Ticket", description: "Ticket name goes here" },
  { category: "Knowledge box", icon: <Building2 className="h-4 w-4 text-blue-600" />, title: "Company", description: "Woodford Reserve" },
];

interface AllSourcesProps {
  sourceCount: number;
  children?: React.ReactNode;
}

export const AllSources: React.FC<AllSourcesProps> = ({ sourceCount, children }) => {
  const groupedSources = sources.reduce((acc, source) => {
    if (!acc[source.category]) {
      acc[source.category] = [];
    }
    acc[source.category].push(source);
    return acc;
  }, {} as Record<string, SourceItem[]>);

  return (
    <Popover>
      <PopoverTrigger asChild>
        {children || (
          <button className="flex items-center gap-2 px-3 py-2 rounded-full border border-border bg-background hover:bg-muted/50 transition-colors">
            <div className="flex items-center -space-x-2">
              <div className="h-6 w-6 rounded-full bg-blue-600 border-2 border-background flex items-center justify-center z-30">
                <img src={linkedinIcon} alt="LinkedIn" className="w-3 h-3" />
              </div>
              <div className="h-6 w-6 rounded-full bg-gray-100 border-2 border-background flex items-center justify-center z-20">
                <Building2 className="h-3 w-3 text-gray-600" />
              </div>
              <div className="h-6 w-6 rounded-full bg-gray-100 border-2 border-background flex items-center justify-center z-10">
                <Star className="h-3 w-3 text-gray-600" />
              </div>
            </div>
            <span className="body-100 text-foreground">21 Sources</span>
          </button>
        )}
      </PopoverTrigger>
      <PopoverContent 
        className="w-96 p-0 max-h-[600px] overflow-y-auto" 
        align="end"
        side="top"
        sideOffset={8}
      >
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="heading-200 text-foreground">Sources</h3>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        
        <div className="p-4 space-y-6">
          {Object.entries(groupedSources).map(([category, items]) => (
            <div key={category} className="space-y-3">
              <h4 className="body-125 text-foreground capitalize">{category}</h4>
              <div className="space-y-2">
                {items.map((item, index) => (
                  <div key={`${category}-${index}`} className="flex items-start gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                    <div className="flex-shrink-0 mt-0.5">
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="body-125 text-foreground">{item.title}</span>
                        <span className="detail-100 text-muted-foreground">|</span>
                        <span className="detail-100 text-muted-foreground truncate">{item.description}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};