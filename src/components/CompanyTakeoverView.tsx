import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  ChevronRight,
  ExternalLink,
  FileEdit,
  Mail,
  Phone,
  ListTodo,
  Calendar,
  MoreHorizontal,
  Copy,
  Building2
} from "lucide-react";
import Tag from "@/components/Tag";
import CollapsibleSection from "@/components/CollapsibleSection";
import { Company } from "@/components/CompanyCard";
import { CompanyDetail } from "@/data/companyDetails";
import { ContactDetail } from "@/data/contactDetails";

interface CompanyTakeoverViewProps {
  company: Company;
  companyDetails: CompanyDetail;
  contacts: ContactDetail[];
  onBack: () => void;
  onEmailClick?: (name?: string, email?: string, taskId?: string, contactId?: string) => void;
  onCallClick?: (contactId: string) => void;
}

const SkeletonBlock = ({ height = "h-[200px]" }: { height?: string }) => (
  <div className={`${height} bg-muted rounded-lg w-full`} />
);

const SkeletonLines = ({ count = 3 }: { count?: number }) => (
  <div className="space-y-2">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className={`h-3 bg-muted rounded ${i === count - 1 ? 'w-2/3' : 'w-full'}`} />
    ))}
  </div>
);

const CompanyTakeoverView = ({
  company,
  companyDetails: details,
  contacts,
  onBack,
  onEmailClick,
  onCallClick
}: CompanyTakeoverViewProps) => {
  const [callPopoverContactId, setCallPopoverContactId] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-[calc(100vh-48px)] bg-fill-surface-recessed overflow-hidden">
      {/* Breadcrumb Header */}
      <div className="flex items-center gap-2 px-6 py-3 bg-[var(--color-fill-surface-default)] border-b border-border">
        <button
          onClick={onBack}
          className="heading-50 text-[var(--color-text-interactive-default)] hover:text-[var(--color-text-interactive-defaulthover)] transition-colors"
        >
          Prospecting
        </button>
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="heading-50 text-foreground">{company.name}</span>
      </div>

      {/* Two-Column Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Column - Company Profile */}
        <ScrollArea className="flex-1 border-r border-border bg-background">
          <div className="px-6 py-8">
            {/* Company Info Card */}
            <Card className="p-5 mb-8">
              {/* Company Header */}
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 rounded-full bg-[var(--color-fill-accent-neutral-default)] flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-7 w-7 text-[var(--color-icon-primary-default)]" />
                  </div>
                  <div>
                    <h1 className="heading-400 text-foreground mb-1">{company.name}</h1>
                    <div className="body-100 text-muted-foreground mb-1">{details.industry} · {details.country}</div>
                    <div className="body-100 text-muted-foreground">{company.website}</div>
                  </div>
                </div>
                <Button variant="link" className="body-100 text-foreground p-0 h-auto">
                  View record <ExternalLink className="h-4 w-4 ml-1" />
                </Button>
              </div>

              {/* Signals */}
              {company.signals.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {company.signals.map((signal, idx) => (
                    <Tag key={idx} variant={signal.variant}>
                      {signal.text}
                    </Tag>
                  ))}
                </div>
              )}

              {/* Quick Actions */}
              <div className="flex items-center gap-4">
                {[
                  { icon: FileEdit, label: "Note" },
                  { icon: Mail, label: "Email" },
                  { icon: Phone, label: "Call" },
                  { icon: ListTodo, label: "Task" },
                  { icon: Calendar, label: "Meeting" },
                  { icon: MoreHorizontal, label: "More" },
                ].map((action) => (
                  <button key={action.label} className="flex flex-col items-center gap-2 group">
                    <div className="h-8 w-8 rounded-full border border-border flex items-center justify-center group-hover:bg-[var(--color-fill-surface-default-hover)] transition-colors">
                      <action.icon className="h-4 w-4 text-foreground" />
                    </div>
                    <span className="body-100 text-foreground">{action.label}</span>
                  </button>
                ))}
              </div>

              <div className="mt-8">
              <CollapsibleSection title="Company Overview">
                <SkeletonBlock />
              </CollapsibleSection>

              <CollapsibleSection title="LinkedIn Sales Navigator">
                <SkeletonBlock />
              </CollapsibleSection>

              <CollapsibleSection title="Lead Qualification">
                <SkeletonBlock />
              </CollapsibleSection>

              <CollapsibleSection title="Deals">
                <SkeletonBlock />
              </CollapsibleSection>

              <CollapsibleSection title="Contacts">
                <SkeletonBlock />
              </CollapsibleSection>

              <CollapsibleSection title="Portals">
                <SkeletonBlock />
              </CollapsibleSection>

              <CollapsibleSection title="Recent Conversions">
                <SkeletonBlock />
              </CollapsibleSection>

              <CollapsibleSection title="Recent Activity">
                <SkeletonBlock />
              </CollapsibleSection>

              <CollapsibleSection title="Notes">
                <SkeletonBlock height="h-[120px]" />
              </CollapsibleSection>
              </div>
            </Card>
          </div>
        </ScrollArea>

        {/* Right Column - Contacts */}
        <ScrollArea className="w-[620px] flex-shrink-0">
          <div className="px-6 py-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="heading-300 text-foreground">Contacts ({contacts.length})</h2>
            </div>

            <div className="space-y-4">
              {contacts.map((contact) => (
                <Card key={contact.id} className="p-5">
                  {/* Contact Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10 flex-shrink-0">
                        <AvatarFallback className={`${contact.avatarColor} text-[var(--color-text-primary-default)] heading-25`}>
                          {contact.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="heading-200 text-foreground">{contact.name}</h3>
                        <div className="body-100 text-muted-foreground">{contact.role}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        className="h-8 w-8 rounded-full border border-border flex items-center justify-center hover:bg-[var(--color-fill-surface-default-hover)] transition-colors"
                        onClick={() => onEmailClick?.(contact.name, contact.email, undefined, contact.id)}
                      >
                        <Mail className="h-3.5 w-3.5 text-foreground" />
                      </button>
                      <Popover
                        open={callPopoverContactId === contact.id}
                        onOpenChange={(open) => setCallPopoverContactId(open ? contact.id : null)}
                      >
                        <PopoverTrigger asChild>
                          <button className="h-8 w-8 rounded-full border border-border flex items-center justify-center hover:bg-[var(--color-fill-surface-default-hover)] transition-colors">
                            <Phone className="h-3.5 w-3.5 text-foreground" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[500px] p-0 bg-[var(--color-fill-surface-default)] shadow-400" align="end" side="bottom" sideOffset={8} alignOffset={-40}>
                          <div className="border border-border rounded-lg">
                            <div className="px-4 py-3 border-b border-border">
                              <h3 className="heading-200 text-foreground">{contact.name}</h3>
                            </div>
                            <div className="p-4">
                              <button
                                className="flex items-center gap-2 mb-4 w-full text-left hover:bg-[var(--color-fill-surface-default-hover)] p-2 rounded transition-colors"
                                onClick={() => {
                                  onCallClick?.(contact.id);
                                  setCallPopoverContactId(null);
                                }}
                              >
                                <Phone className="h-5 w-5 text-foreground" />
                                <span className="body-100 text-foreground">
                                  Call {contact.phone} (Mobile Phone Number)
                                </span>
                              </button>
                              <button className="body-100 text-foreground underline hover:no-underline mb-6">
                                + Add phone number
                              </button>
                              <div className="flex items-center justify-between px-4 py-3 border-t border-border hover:bg-[var(--color-fill-surface-default-hover)] cursor-pointer">
                                <span className="heading-100 text-foreground">Call from: +31647352106</span>
                                <ChevronRight className="h-5 w-5 text-foreground" />
                              </div>
                              <div className="flex items-center justify-between px-4 py-3 border-t border-border hover:bg-[var(--color-fill-surface-default-hover)] cursor-pointer">
                                <span className="heading-100 text-foreground">Device: Browser</span>
                                <ChevronRight className="h-5 w-5 text-foreground" />
                              </div>
                              <div className="px-4 py-3 border-t border-border">
                                <button className="body-100 text-foreground underline hover:no-underline">
                                  Open call options
                                </button>
                              </div>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Contact Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                      <span className="body-100 text-[var(--color-text-interactive-default)]">{contact.email}</span>
                      <button className="p-0.5 hover:bg-[var(--color-fill-surface-default-hover)] rounded transition-colors">
                        <Copy className="h-3 w-3 text-muted-foreground" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                      <span className="body-100 text-foreground">{contact.phone}</span>
                      <button className="p-0.5 hover:bg-[var(--color-fill-surface-default-hover)] rounded transition-colors">
                        <Copy className="h-3 w-3 text-muted-foreground" />
                      </button>
                    </div>
                  </div>

                  {/* Skeleton sections */}
                  <CollapsibleSection title="LinkedIn Sales Navigator" defaultOpen={false}>
                    <SkeletonBlock height="h-[120px]" />
                  </CollapsibleSection>

                  <CollapsibleSection title="QL Summary" defaultOpen={false}>
                    <SkeletonBlock height="h-[120px]" />
                  </CollapsibleSection>

                  <CollapsibleSection title="Recent Conversions" defaultOpen={false}>
                    <SkeletonBlock height="h-[120px]" />
                  </CollapsibleSection>

                  <CollapsibleSection title="Recent Activity" defaultOpen={false}>
                    <SkeletonBlock height="h-[120px]" />
                  </CollapsibleSection>

                  <CollapsibleSection title="Deals" defaultOpen={false}>
                    <SkeletonBlock height="h-[120px]" />
                  </CollapsibleSection>

                  <CollapsibleSection title="Notes" defaultOpen={false}>
                    <SkeletonBlock height="h-[120px]" />
                  </CollapsibleSection>
                </Card>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default CompanyTakeoverView;
