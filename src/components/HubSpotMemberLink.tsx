import { Mail, Slack } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface HubSpotMemberLinkProps {
  name: string;
  role: string; // card role, e.g. "Sales Owner"
}

const linkClass =
  "text-left text-[var(--color-specialty-text-core-alt-default)] hover:underline";

// A plausible job title for the member's card role.
const JOB_TITLES: Record<string, string> = {
  "Sales Owner": "Account Executive",
  "Contract Manager": "Renewals Manager",
  "Success Owner": "Customer Success Manager",
};

const initialsOf = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return `${first}${last}`.toUpperCase();
};

const emailOf = (name: string): string => {
  const parts = name.trim().toLowerCase().replace(/[^a-z\s-]/g, "").split(/\s+/);
  const first = parts[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1] : "";
  return `${first[0] ?? ""}${last}@hubspot.com`;
};

const HubSpotMemberLink = ({ name, role }: HubSpotMemberLinkProps) => {
  const title = JOB_TITLES[role] ?? role;
  const email = emailOf(name);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" className={`link-100 ${linkClass}`}>
          {name}
        </button>
      </PopoverTrigger>
      <PopoverContent side="top" align="center" sideOffset={8} className="relative w-80">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-trellis-magenta-300 text-trellis-magenta-900 heading-100">
                {initialsOf(name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="heading-200 text-foreground truncate">{name}</span>
              <span className="body-100 text-muted-foreground">{title}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
            <a href={`mailto:${email}`} className={`body-100 ${linkClass} truncate`}>
              {email}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Slack className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="body-100 text-muted-foreground">Unknown</span>
          </div>
        </div>
        {/* Downward caret pointing at the triggering name */}
        <span className="absolute left-1/2 -bottom-[6px] h-3 w-3 -translate-x-1/2 rotate-45 border-b border-r border-core-subtle bg-popover" />
      </PopoverContent>
    </Popover>
  );
};

export default HubSpotMemberLink;
