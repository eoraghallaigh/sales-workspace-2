import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TrellisIcon, TRELLIS_ICON_NAMES, type TrellisIconName } from "@/components/ui/trellis-icon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { TableHeaderCell } from "@/components/ui/table-header-cell";
import { TableDataCell } from "@/components/ui/table-data-cell";
import Tag from "@/components/Tag";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";

const ColorSwatch = ({ name, hex }: { name: string; hex: string }) => (
  <div className="flex flex-col items-center gap-1 min-w-[80px]">
    <div className="w-16 h-16 rounded-300 border border-core-subtle" style={{ backgroundColor: hex }} />
    <span className="detail-100 text-[var(--color-text-core-default)] text-center break-all">{name}</span>
    <span className="detail-100 text-[var(--color-text-core-subtle)]">{hex}</span>
  </div>
);

const TokenGroup = ({ label, tokens }: { label: string; tokens: { name: string; hex: string }[] }) => (
  <div className="mb-6">
    <h3 className="heading-100 text-[var(--color-text-core-default)] mb-3">{label}</h3>
    <div className="flex flex-wrap gap-3">
      {tokens.map((t) => (
        <ColorSwatch key={t.name} name={t.name} hex={t.hex} />
      ))}
    </div>
  </div>
);

const ColorScale = ({ label, colors }: { label: string; colors: { shade: number; hex: string }[] }) => (
  <div className="mb-6">
    <h3 className="heading-100 text-[var(--color-text-core-default)] mb-3">{label}</h3>
    <div className="flex flex-wrap gap-3">
      {colors.map((c) => (
        <ColorSwatch key={c.shade} name={`${c.shade}`} hex={c.hex} />
      ))}
    </div>
  </div>
);

const PALETTE = {
  neutral: [
    { shade: 100, hex: '#f8f7f6' }, { shade: 200, hex: '#f5f3f2' }, { shade: 300, hex: '#efedeb' },
    { shade: 400, hex: '#e7e5e4' }, { shade: 500, hex: '#cfcccb' }, { shade: 600, hex: '#b6b1af' },
    { shade: 700, hex: '#8c8787' }, { shade: 800, hex: '#676565' }, { shade: 900, hex: '#4d4c4c' },
    { shade: 1000, hex: '#333333' }, { shade: 1100, hex: '#292929' }, { shade: 1200, hex: '#242424' },
    { shade: 1300, hex: '#1f1f1f' }, { shade: 1400, hex: '#1c1c1c' }, { shade: 1500, hex: '#171717' },
    { shade: 1600, hex: '#141414' },
  ],
  red: [
    { shade: 200, hex: '#fcf5f3' }, { shade: 300, hex: '#fcece9' }, { shade: 500, hex: '#fcc5be' },
    { shade: 800, hex: '#ff3842' }, { shade: 900, hex: '#d9002b' }, { shade: 1000, hex: '#ac0020' },
    { shade: 1100, hex: '#850016' }, { shade: 1200, hex: '#63040e' }, { shade: 1300, hex: '#4a0605' },
  ],
  orange: [
    { shade: 200, hex: '#fcf5f2' }, { shade: 300, hex: '#fcece6' }, { shade: 400, hex: '#fbddd2' },
    { shade: 500, hex: '#fcc6b1' }, { shade: 600, hex: '#ffa581' }, { shade: 700, hex: '#ff7d4c' },
    { shade: 800, hex: '#ff4800' }, { shade: 900, hex: '#c93700' }, { shade: 1000, hex: '#9f2800' },
    { shade: 1100, hex: '#7b1d00' }, { shade: 1200, hex: '#591802' }, { shade: 1300, hex: '#411204' },
  ],
  yellow: [
    { shade: 200, hex: '#fcf6e6' }, { shade: 400, hex: '#fbe0a5' }, { shade: 500, hex: '#fccb57' },
    { shade: 800, hex: '#b67e0e' }, { shade: 900, hex: '#956309' }, { shade: 1000, hex: '#784b05' },
    { shade: 1100, hex: '#5e3804' }, { shade: 1200, hex: '#452805' }, { shade: 1300, hex: '#331e06' },
  ],
  green: [
    { shade: 200, hex: '#edf4ef' }, { shade: 300, hex: '#daefe1' }, { shade: 400, hex: '#bde7cb' },
    { shade: 500, hex: '#97dbae' }, { shade: 600, hex: '#6acb8c' }, { shade: 800, hex: '#119d49' },
    { shade: 900, hex: '#00823a' }, { shade: 1000, hex: '#006831' }, { shade: 1100, hex: '#005027' },
    { shade: 1200, hex: '#003c1e' }, { shade: 1300, hex: '#002d16' },
  ],
  teal: [
    { shade: 200, hex: '#e0fcfa' }, { shade: 400, hex: '#b3f0ed' }, { shade: 600, hex: '#48d1cf' },
    { shade: 800, hex: '#009b9c' }, { shade: 900, hex: '#007c7d' }, { shade: 1000, hex: '#006162' },
    { shade: 1100, hex: '#00494b' }, { shade: 1200, hex: '#033637' },
  ],
  blue: [
    { shade: 300, hex: '#e1f2fb' }, { shade: 500, hex: '#acdaf4' }, { shade: 600, hex: '#8cc4f4' },
    { shade: 800, hex: '#078cfd' }, { shade: 900, hex: '#016de1' }, { shade: 1000, hex: '#0050c7' },
    { shade: 1100, hex: '#0035b2' }, { shade: 1200, hex: '#0c18a0' },
  ],
  purple: [
    { shade: 200, hex: '#f9f5ff' }, { shade: 300, hex: '#efeefd' }, { shade: 500, hex: '#d7cdfc' },
    { shade: 600, hex: '#c4b4f7' }, { shade: 800, hex: '#9778ec' }, { shade: 900, hex: '#7d53e9' },
    { shade: 1000, hex: '#6431da' }, { shade: 1100, hex: '#5113ba' }, { shade: 1200, hex: '#321986' },
    { shade: 1300, hex: '#25155e' },
  ],
  magenta: [
    { shade: 300, hex: '#fcebf2' }, { shade: 400, hex: '#fbdbe9' }, { shade: 500, hex: '#fcc3dc' },
    { shade: 600, hex: '#ff9fcc' }, { shade: 800, hex: '#fb31a7' }, { shade: 900, hex: '#d20688' },
    { shade: 1000, hex: '#a5016a' }, { shade: 1100, hex: '#800051' }, { shade: 1200, hex: '#5e043b' },
    { shade: 1400, hex: '#46062B' },
  ],
};

const SEMANTIC_TOKENS = {
  'Fill – Surface': [
    { name: 'surface-default', hex: '#FFFFFF' },
    { name: 'surface-default-hover', hex: 'rgba(20,20,20,0.08)' },
    { name: 'surface-default-pressed', hex: 'rgba(20,20,20,0.11)' },
    { name: 'surface-raised', hex: '#FFFFFF' },
    { name: 'surface-recessed', hex: '#F0F0F0' },
    { name: 'surface-recessed-hover', hex: 'rgba(20,20,20,0.08)' },
    { name: 'surface-recessed-pressed', hex: 'rgba(20,20,20,0.11)' },
  ],
  'Fill – Primary': [
    { name: 'primary-default', hex: '#141414' },
    { name: 'primary-hover', hex: '#333333' },
    { name: 'primary-pressed', hex: '#4D4D4D' },
    { name: 'primary-disabled', hex: '#F5F5F5' },
  ],
  'Fill – Secondary': [
    { name: 'secondary-default', hex: '#FFFFFF' },
    { name: 'secondary-default-alt', hex: '#D6C2D9' },
    { name: 'secondary-hover', hex: '#F0F0F0' },
    { name: 'secondary-hover-alt', hex: '#CAAACF' },
    { name: 'secondary-pressed', hex: '#E6E6E6' },
    { name: 'secondary-pressed-alt', hex: '#BC8DC3' },
    { name: 'secondary-disabled', hex: '#FFFFFF' },
    { name: 'secondary-disabled-alt', hex: '#F5F5F5' },
  ],
  'Fill – Tertiary': [
    { name: 'tertiary-default', hex: '#FFFFFF' },
    { name: 'tertiary-hover', hex: '#EBEBEB' },
    { name: 'tertiary-pressed', hex: '#E6E6E6' },
    { name: 'tertiary-disabled', hex: '#F5F5F5' },
  ],
  'Fill – Field': [
    { name: 'field-default', hex: '#FFFFFF' },
    { name: 'field-default-alt', hex: '#FFFFFF' },
    { name: 'field-hover', hex: '#EBEBEB' },
    { name: 'field-pressed', hex: '#E6E6E6' },
    { name: 'field-disabled', hex: '#F5F5F5' },
  ],
  'Fill – Transparent': [
    { name: 'transparent-default', hex: 'rgba(20,20,20,0)' },
    { name: 'transparent-hover', hex: 'rgba(20,20,20,0)' },
    { name: 'transparent-pressed', hex: 'rgba(20,20,20,0)' },
    { name: 'transparent-disabled', hex: 'rgba(20,20,20,0)' },
  ],
  'Fill – Brand': [
    { name: 'brand-default', hex: '#FF4800' },
    { name: 'brand-subtle', hex: '#FCC6B1' },
    { name: 'brand-hover', hex: '#C93700' },
    { name: 'brand-pressed', hex: '#9F2800' },
  ],
  'Fill – Alert': [
    { name: 'alert-default', hex: '#D9002B' },
    { name: 'alert-subtle', hex: '#FCECE9' },
    { name: 'alert-hover', hex: '#AC0020' },
    { name: 'alert-pressed', hex: '#850016' },
  ],
  'Fill – Caution': [
    { name: 'caution-default', hex: '#FCCB57' },
    { name: 'caution-subtle', hex: '#FCF6E6' },
    { name: 'caution-hover', hex: '#EEB117' },
    { name: 'caution-pressed', hex: '#D39913' },
  ],
  'Fill – Info': [
    { name: 'info-default', hex: '#016DE1' },
    { name: 'info-subtle', hex: '#E1F2FB' },
    { name: 'info-hover', hex: '#0050C7' },
    { name: 'info-pressed', hex: '#0035B2' },
  ],
  'Fill – Positive': [
    { name: 'positive-default', hex: '#00823A' },
    { name: 'positive-subtle', hex: '#EDF4EF' },
    { name: 'positive-hover', hex: '#006831' },
    { name: 'positive-pressed', hex: '#005027' },
  ],
  'Text – Core': [
    { name: 'core-default', hex: '#141414' },
    { name: 'core-on-fill-default', hex: '#FFFFFF' },
    { name: 'core-subtle', hex: '#666666' },
    { name: 'core-disabled', hex: '#8A8A8A' },
  ],
  'Text – Primary': [
    { name: 'primary-default', hex: '#FFFFFF' },
    { name: 'primary-subtle', hex: '#FFFFFF' },
    { name: 'primary-disabled', hex: '#8A8A8A' },
  ],
  'Text – Secondary': [
    { name: 'secondary-default', hex: '#141414' },
    { name: 'secondary-disabled', hex: '#8A8A8A' },
  ],
  'Text – Tertiary': [
    { name: 'tertiary-default', hex: '#141414' },
    { name: 'tertiary-disabled', hex: '#8A8A8A' },
  ],
  'Text – Interactive': [
    { name: 'interactive-default', hex: '#006162' },
    { name: 'interactive-on-fill', hex: '#FFFFFF' },
    { name: 'interactive-hover', hex: '#00494B' },
    { name: 'interactive-on-fill-hover', hex: '#E6E6E6' },
    { name: 'interactive-pressed', hex: '#033637' },
    { name: 'interactive-on-fill-pressed', hex: '#B3B3B3' },
    { name: 'interactive-disabled', hex: '#8A8A8A' },
  ],
  'Text – Alert': [
    { name: 'alert-default', hex: '#D9002B' },
    { name: 'alert-on-fill', hex: '#FFFFFF' },
    { name: 'alert-hover', hex: '#AC0020' },
    { name: 'alert-pressed', hex: '#850016' },
  ],
  'Text – Brand & Inverse': [
    { name: 'brand-default', hex: '#9F2800' },
    { name: 'inverse-default', hex: '#141414' },
    { name: 'inverse-default-alt', hex: '#FFFFFF' },
    { name: 'inverse-hover', hex: '#4D4D4D' },
    { name: 'inverse-pressed', hex: '#666666' },
    { name: 'inverse-disabled', hex: '#8A8A8A' },
    { name: 'inverse-disabled-alt', hex: '#8A8A8A' },
  ],
  'Icon – Core': [
    { name: 'core-default', hex: '#141414' },
    { name: 'core-on-fill', hex: '#FFFFFF' },
    { name: 'core-subtle', hex: '#666666' },
    { name: 'core-disabled', hex: '#8A8A8A' },
  ],
  'Icon – Primary': [
    { name: 'primary-default', hex: '#FFFFFF' },
    { name: 'primary-hover', hex: '#FFFFFF' },
    { name: 'primary-pressed', hex: '#FFFFFF' },
    { name: 'primary-disabled', hex: '#8A8A8A' },
  ],
  'Icon – Secondary & Tertiary': [
    { name: 'secondary-default', hex: '#141414' },
    { name: 'secondary-disabled', hex: '#8A8A8A' },
    { name: 'tertiary-default', hex: '#141414' },
    { name: 'tertiary-disabled', hex: '#8A8A8A' },
  ],
  'Icon – Alert': [
    { name: 'alert-default', hex: '#D9002B' },
    { name: 'alert-on-fill', hex: '#FFFFFF' },
    { name: 'alert-hover', hex: '#AC0020' },
    { name: 'alert-pressed', hex: '#850016' },
  ],
  'Icon – Interactive': [
    { name: 'interactive-default', hex: '#141414' },
    { name: 'interactive-on-fill', hex: '#FFFFFF' },
    { name: 'interactive-hover', hex: '#4D4D4D' },
    { name: 'interactive-on-fill-hover', hex: '#E6E6E6' },
    { name: 'interactive-on-fill-pressed', hex: '#B3B3B3' },
    { name: 'interactive-pressed', hex: '#666666' },
    { name: 'interactive-disabled', hex: '#8A8A8A' },
  ],
  'Border – Core': [
    { name: 'core-default', hex: '#8A8A8A' },
    { name: 'core-on-fill', hex: '#FFFFFF' },
    { name: 'core-subtle', hex: '#CCCCCC' },
    { name: 'core-hover', hex: '#666666' },
    { name: 'core-subtle-hover', hex: '#B3B3B3' },
    { name: 'core-pressed', hex: '#141414' },
    { name: 'core-subtle-pressed', hex: '#8A8A8A' },
    { name: 'core-disabled', hex: '#E6E6E6' },
  ],
  'Border – Primary & Secondary & Tertiary': [
    { name: 'primary-default', hex: 'rgba(20,20,20,0)' },
    { name: 'primary-disabled', hex: 'rgba(20,20,20,0)' },
    { name: 'secondary-default', hex: '#8A8A8A' },
    { name: 'secondary-default-alt', hex: '#AB73B4' },
    { name: 'secondary-disabled', hex: '#E6E6E6' },
    { name: 'tertiary-default', hex: '#8A8A8A' },
    { name: 'tertiary-disabled', hex: '#E6E6E6' },
  ],
  'Border – Interactive': [
    { name: 'interactive-default', hex: '#8A8A8A' },
    { name: 'interactive-pressed', hex: '#141414' },
  ],
  'Border – Semantic': [
    { name: 'brand-default', hex: '#FF4800' },
    { name: 'alert-default', hex: '#D9002B' },
    { name: 'caution-default', hex: '#EEB117' },
    { name: 'info-default', hex: '#016DE1' },
    { name: 'positive-default', hex: '#00823A' },
    { name: 'container-default', hex: '#CCCCCC' },
    { name: 'transitional-core-subtle', hex: '#CCCCCC' },
  ],
  'Border – Accent': [
    { name: 'accent-blue', hex: '#016DE1' },
    { name: 'accent-green', hex: '#00823A' },
    { name: 'accent-light-orange', hex: '#C93700' },
    { name: 'accent-magenta', hex: '#D20688' },
    { name: 'accent-orange', hex: '#C93700' },
    { name: 'accent-purple', hex: '#7D53E9' },
    { name: 'accent-red', hex: '#D9002B' },
    { name: 'accent-yellow', hex: '#956309' },
  ],
  'Fill – Accent (Default)': [
    { name: 'blue', hex: '#016DE1' },
    { name: 'green', hex: '#00823A' },
    { name: 'light-orange', hex: '#FF4800' },
    { name: 'magenta', hex: '#D20688' },
    { name: 'neutral', hex: '#141414' },
    { name: 'orange', hex: '#C93700' },
    { name: 'purple', hex: '#6431DA' },
    { name: 'red', hex: '#D9002B' },
    { name: 'teal', hex: '#007C7D' },
    { name: 'yellow', hex: '#956309' },
  ],
  'Fill – Accent (Subtle)': [
    { name: 'blue', hex: '#ACDAF4' },
    { name: 'blue-alt', hex: '#E1F2FB' },
    { name: 'green', hex: '#BDE7CB' },
    { name: 'green-alt', hex: '#EDF4EF' },
    { name: 'light-orange', hex: '#FCC6B1' },
    { name: 'light-orange-alt', hex: '#FCECE6' },
    { name: 'magenta', hex: '#FCC3DC' },
    { name: 'magenta-alt', hex: '#FCEBF2' },
    { name: 'neutral', hex: '#E6E6E6' },
    { name: 'neutral-alt', hex: '#F0F0F0' },
    { name: 'orange', hex: '#FCC6B1' },
    { name: 'orange-alt', hex: '#FCECE6' },
    { name: 'purple', hex: '#D7CDFC' },
    { name: 'purple-alt', hex: '#EFEEFD' },
    { name: 'red', hex: '#FCC5BE' },
    { name: 'red-alt', hex: '#FCECE9' },
    { name: 'teal', hex: '#B3F0ED' },
    { name: 'teal-alt', hex: '#E0FCFA' },
    { name: 'yellow', hex: '#FBE0A5' },
    { name: 'yellow-alt', hex: '#FCF6E6' },
  ],
  'Fill – Accent (Hover)': [
    { name: 'blue', hex: '#0050C7' },
    { name: 'green', hex: '#006831' },
    { name: 'light-orange', hex: '#C93700' },
    { name: 'magenta', hex: '#A5016A' },
    { name: 'neutral', hex: '#4D4D4D' },
    { name: 'orange', hex: '#9F2800' },
    { name: 'purple', hex: '#5113BA' },
    { name: 'red', hex: '#AC0020' },
    { name: 'teal', hex: '#006162' },
    { name: 'yellow', hex: '#784B05' },
  ],
  'Fill – Accent (Pressed)': [
    { name: 'blue', hex: '#0035B2' },
    { name: 'green', hex: '#003C1E' },
    { name: 'light-orange', hex: '#9F2800' },
    { name: 'magenta', hex: '#800051' },
    { name: 'neutral', hex: '#666666' },
    { name: 'orange', hex: '#7B1D00' },
    { name: 'purple', hex: '#321986' },
    { name: 'red', hex: '#850016' },
    { name: 'teal', hex: '#00494B' },
    { name: 'yellow', hex: '#5E3804' },
  ],
  'Transitional': [
    { name: 'table-default', hex: '#F0F0F0' },
    { name: 'tabs-default', hex: '#FFFFFF' },
    { name: 'tabs-pressed', hex: '#F5F5F5' },
  ],
  'Specialty – Table': [
    { name: 'header-default', hex: '#F7F2F7' },
    { name: 'header-hover', hex: '#EFE7F0' },
    { name: 'header-pressed', hex: '#E4D7E6' },
    { name: 'zebra-stripe', hex: '#F5F5F5' },
  ],
  'Specialty – Scrim': [
    { name: 'scrim', hex: 'rgba(20,20,20,0.46)' },
    { name: 'scrim-alt', hex: 'rgba(255,255,255,0.81)' },
  ],
  'Specialty – On Fill': [
    { name: 'primary-on-fill-default', hex: '#FFFFFF' },
    { name: 'primary-on-fill-hover', hex: '#E6E6E6' },
    { name: 'primary-on-fill-pressed', hex: '#CCCCCC' },
    { name: 'primary-on-fill-disabled', hex: '#F5F5F5' },
    { name: 'tertiary-on-fill-default', hex: '#46062B' },
    { name: 'tertiary-on-fill-hover', hex: '#5E043B' },
    { name: 'tertiary-on-fill-pressed', hex: '#800051' },
    { name: 'tertiary-on-fill-disabled', hex: '#46062B' },
    { name: 'link-on-fill-default', hex: '#FFFFFF' },
    { name: 'link-on-fill-hover', hex: '#F0F0F0' },
    { name: 'link-on-fill-pressed', hex: '#FFFFFF' },
    { name: 'link-on-fill-disabled', hex: '#B3B3B3' },
    { name: 'link-on-fill-alt-default', hex: '#006162' },
    { name: 'link-on-fill-alt-hover', hex: '#00494B' },
    { name: 'link-on-fill-alt-pressed', hex: '#033637' },
    { name: 'link-on-fill-alt-disabled', hex: '#8A8A8A' },
  ],
  'Specialty – Tertiary Transparent': [
    { name: 'default', hex: 'rgba(255,255,255,0)' },
    { name: 'hover', hex: '#EBEBEB' },
    { name: 'pressed', hex: '#E6E6E6' },
    { name: 'disabled', hex: 'rgba(255,255,255,0)' },
  ],
  'Specialty – Text': [
    { name: 'core-alt-default', hex: '#006162' },
    { name: 'interactive-alt-default', hex: '#141414' },
    { name: 'interactive-alt-hover', hex: '#4D4D4D' },
    { name: 'interactive-alt-pressed', hex: '#666666' },
  ],
  'Specialty – Filter & Reporting': [
    { name: 'filter-pressed', hex: '#D9D9D9' },
    { name: 'reporting-highlight-purple-subtle', hex: '#EFEEFD' },
  ],
};

const SHADOWS = {
  100: '0px 1px 8px 0px rgba(20, 20, 20, 0.08)',
  200: '0px 8px 16px 0px rgba(20, 20, 20, 0.04)',
  300: '0px 16px 32px 0px rgba(20, 20, 20, 0.08)',
  400: '0px 24px 48px 0px rgba(20, 20, 20, 0.08)',
};

const TypographyRow = ({ className, label, specs }: { className: string; label: string; specs: string }) => (
  <div className="flex items-baseline gap-6 py-3 border-b border-core-subtle">
    <div className="w-48 shrink-0">
      <span className="detail-200 text-[var(--color-text-core-subtle)]">{label}</span>
      <br />
      <code className="code-100 text-[var(--color-text-core-subtle)]">.{className}</code>
    </div>
    <div className="w-48 shrink-0">
      <span className="detail-100 text-[var(--color-text-core-subtle)]">{specs}</span>
    </div>
    <div className={`${className} text-[var(--color-text-core-default)]`}>
      The quick brown fox
    </div>
  </div>
);

const IconGallery = () => {
  const [iconSearch, setIconSearch] = useState("");
  const filtered = TRELLIS_ICON_NAMES.filter((n) =>
    n.toLowerCase().includes(iconSearch.toLowerCase())
  );

  return (
    <Card>
      <CardContent className="p-4">
        <Input
          placeholder="Search icons…"
          value={iconSearch}
          onChange={(e) => setIconSearch(e.target.value)}
          className="mb-4 max-w-xs"
        />
        <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-3">
          {filtered.map((name) => (
            <div
              key={name}
              className="flex flex-col items-center gap-1.5 p-3 rounded-100 border border-transparent hover:border-core-subtle hover:bg-[var(--color-fill-surface-default)] transition-colors cursor-default"
              title={name}
            >
              <TrellisIcon name={name as TrellisIconName} size={20} />
              <span className="detail-100 text-[var(--color-text-core-subtle)] text-center truncate w-full">
                {name}
              </span>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="body-100 text-[var(--color-text-core-subtle)] col-span-full py-8 text-center">
              No icons match "{iconSearch}"
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const DesignSystem = () => {
  return (
    <div className="h-screen bg-fill-surface-recessed">
      {/* Header */}
      <div className="h-12 bg-trellis-magenta-1400 border-b border-trellis-magenta-1100 flex items-center px-4 gap-4 shrink-0">
        <Link to="/" className="flex items-center gap-2 text-[var(--color-text-primary-default)] hover:opacity-80 transition-opacity">
          <ArrowLeft className="h-4 w-4" />
          <span className="body-125">Back</span>
        </Link>
        <Separator orientation="vertical" className="h-6 bg-trellis-magenta-1100" />
        <span className="heading-200 text-[var(--color-text-primary-default)]">Trellis Design System</span>
      </div>

      <ScrollArea className="h-[calc(100vh-48px)]">
        <div className="max-w-[1200px] mx-auto p-8 space-y-12">

          {/* ── COLOUR TOKENS ── */}
          <section>
            <h1 className="heading-400 text-[var(--color-text-core-default)] mb-2">Colour Tokens</h1>
            <p className="body-200 text-[var(--color-text-core-subtle)] mb-6">
              The Trellis palette and semantic colour tokens.
            </p>

            {/* Raw Palette */}
            <Card className="mb-8">
              <CardHeader><CardTitle>Raw Palette</CardTitle></CardHeader>
              <CardContent className="space-y-8">
                <ColorScale label="Neutral" colors={PALETTE.neutral} />
                <Separator />
                <ColorScale label="Red" colors={PALETTE.red} />
                <ColorScale label="Orange" colors={PALETTE.orange} />
                <ColorScale label="Yellow" colors={PALETTE.yellow} />
                <ColorScale label="Green" colors={PALETTE.green} />
                <ColorScale label="Teal" colors={PALETTE.teal} />
                <ColorScale label="Blue" colors={PALETTE.blue} />
                <ColorScale label="Purple" colors={PALETTE.purple} />
                <ColorScale label="Magenta" colors={PALETTE.magenta} />
              </CardContent>
            </Card>

            {/* Semantic Tokens */}
            {Object.entries(SEMANTIC_TOKENS).map(([group, tokens]) => (
              <Card key={group} className="mb-4">
                <CardContent className="p-6">
                  <TokenGroup label={group} tokens={tokens} />
                </CardContent>
              </Card>
            ))}
          </section>

          {/* ── TYPOGRAPHY ── */}
          <section>
            <h2 className="heading-400 text-[var(--color-text-core-default)] mb-2">Typography</h2>
            <p className="body-200 text-[var(--color-text-core-subtle)] mb-6">
              Font: Lexend Deca. Code: Source Code Pro. All styles available as utility classes.
            </p>

            <Card>
              <CardContent className="p-6">
                <h3 className="heading-100 text-[var(--color-text-core-default)] mb-4">Display</h3>
                <TypographyRow className="display-100" label="Display 100" specs="56px / 72px / 500" />

                <h3 className="heading-100 text-[var(--color-text-core-default)] mt-8 mb-4">Headings</h3>
                <TypographyRow className="heading-25" label="Heading 25" specs="12px / 18px / 600" />
                <TypographyRow className="heading-50" label="Heading 50" specs="14px / 18px / 600" />
                <TypographyRow className="heading-100" label="Heading 100" specs="16px / 20px / 600" />
                <TypographyRow className="heading-200" label="Heading 200" specs="18px / 24px / 500" />
                <TypographyRow className="heading-300" label="Heading 300" specs="20px / 24px / 600" />
                <TypographyRow className="heading-400" label="Heading 400" specs="22px / 27px / 500" />
                <TypographyRow className="heading-500" label="Heading 500" specs="24px / 29px / 300" />
                <TypographyRow className="heading-600" label="Heading 600" specs="32px / 39px / 700" />
                <TypographyRow className="heading-700" label="Heading 700" specs="36px / 44px / 500" />

                <h3 className="heading-100 text-[var(--color-text-core-default)] mt-8 mb-4">Body</h3>
                <TypographyRow className="body-100" label="Body 100" specs="14px / 24px / 300" />
                <TypographyRow className="body-125" label="Body 125" specs="14px / 24px / 600" />
                <TypographyRow className="body-200" label="Body 200" specs="16px / 24px / 300" />
                <TypographyRow className="body-300" label="Body 300" specs="18px / 24px / 400" />
                <TypographyRow className="body-400" label="Body 400" specs="20px / 28px / 400" />

                <h3 className="heading-100 text-[var(--color-text-core-default)] mt-8 mb-4">Detail</h3>
                <TypographyRow className="detail-100" label="Detail 100" specs="12px / 14px / 300" />
                <TypographyRow className="detail-200" label="Detail 200" specs="12px / 18px / 300" />

                <h3 className="heading-100 text-[var(--color-text-core-default)] mt-8 mb-4">Link</h3>
                <TypographyRow className="link-25" label="Link 25" specs="12px / 18px / 700" />
                <TypographyRow className="link-100" label="Link 100" specs="14px / 24px / 700" />
                <TypographyRow className="link-200" label="Link 200" specs="16px / 24px / 700" />

                <h3 className="heading-100 text-[var(--color-text-core-default)] mt-8 mb-4">Code</h3>
                <TypographyRow className="code-100" label="Code 100" specs="14px / 24px / 500" />
              </CardContent>
            </Card>
          </section>

          {/* ── SHADOWS ── */}
          <section>
            <h2 className="heading-400 text-[var(--color-text-core-default)] mb-2">Shadows</h2>
            <p className="body-200 text-[var(--color-text-core-subtle)] mb-6">Four elevation levels.</p>
            <div className="flex flex-wrap gap-8">
              {([100, 200, 300, 400] as const).map((level) => (
                <div key={level} className="w-32 h-32 rounded-300 bg-fill-surface flex items-center justify-center" style={{ boxShadow: SHADOWS[level] }}>
                  <span className="body-125 text-[var(--color-text-core-default)]">{level}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ── BORDER RADIUS ── */}
          <section>
            <h2 className="heading-400 text-[var(--color-text-core-default)] mb-2">Border Radius</h2>
            <div className="flex flex-wrap gap-6">
              {[
                { name: "0", cls: "rounded-0" },
                { name: "100 (4px)", cls: "rounded-100" },
                { name: "300 (8px)", cls: "rounded-300" },
                { name: "400 (16px)", cls: "rounded-400" },
                { name: "Full", cls: "rounded-full" },
              ].map((r) => (
                <div key={r.name} className="flex flex-col items-center gap-2">
                  <div className={`w-20 h-20 bg-fill-primary ${r.cls}`} />
                  <span className="detail-100 text-[var(--color-text-core-default)]">{r.name}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ── UI COMPONENTS ── */}
          <section>
            <h2 className="heading-400 text-[var(--color-text-core-default)] mb-2">UI Components</h2>
            <p className="body-200 text-[var(--color-text-core-subtle)] mb-6">
              shadcn/ui components styled with Trellis tokens.
            </p>

            <div className="space-y-8">
              {/* Table Cells */}
              <Card>
                <CardHeader>
                  <CardTitle>Table Cells</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <span className="heading-50 text-[var(--color-text-core-subtle)] mb-3 block">Header Cell</span>
                    <div className="flex">
                      <TableHeaderCell>Header</TableHeaderCell>
                      <TableHeaderCell>Name</TableHeaderCell>
                      <TableHeaderCell>Status</TableHeaderCell>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <span className="heading-50 text-[var(--color-text-core-subtle)] mb-3 block">Data Cell</span>
                    <div className="flex">
                      <TableDataCell>Table cell</TableDataCell>
                      <TableDataCell>John Smith</TableDataCell>
                      <TableDataCell>Active</TableDataCell>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <span className="heading-50 text-[var(--color-text-core-subtle)] mb-3 block">Combined</span>
                    <div>
                      <div className="flex">
                        <TableHeaderCell>Header</TableHeaderCell>
                        <TableHeaderCell>Name</TableHeaderCell>
                        <TableHeaderCell>Status</TableHeaderCell>
                      </div>
                      <div className="flex">
                        <TableDataCell>Row 1</TableDataCell>
                        <TableDataCell>Jane Doe</TableDataCell>
                        <TableDataCell>Active</TableDataCell>
                      </div>
                      <div className="flex">
                        <TableDataCell>Row 2</TableDataCell>
                        <TableDataCell>John Smith</TableDataCell>
                        <TableDataCell>Pending</TableDataCell>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Buttons */}
              <Card>
                <CardHeader>
                  <CardTitle>Buttons</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <span className="heading-50 text-[var(--color-text-core-subtle)] mb-3 block">Variants</span>
                    <div className="flex flex-wrap gap-3">
                      <Button variant="primary" size="medium">Primary</Button>
                      <Button variant="secondary" size="medium">Secondary</Button>
                      <Button variant="secondary-alt" size="medium">Secondary Alt</Button>
                      <Button variant="transparent" size="medium">Transparent</Button>
                      <Button variant="destructive" size="medium">Destructive</Button>
                      <Button variant="outline" size="medium">Outline</Button>
                      <Button variant="ghost" size="medium">Ghost</Button>
                      <Button variant="link" size="medium">Link</Button>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <span className="heading-50 text-[var(--color-text-core-subtle)] mb-3 block">Sizes</span>
                    <div className="flex flex-wrap items-center gap-3">
                      <Button variant="primary" size="extra-small">Extra Small</Button>
                      <Button variant="primary" size="small">Small</Button>
                      <Button variant="primary" size="medium">Medium</Button>
                      <Button variant="primary" size="lg">Large</Button>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <span className="heading-50 text-[var(--color-text-core-subtle)] mb-3 block">Disabled</span>
                    <div className="flex flex-wrap gap-3">
                      <Button variant="primary" size="medium" disabled>Primary Disabled</Button>
                      <Button variant="secondary" size="medium" disabled>Secondary Disabled</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Inputs */}
              <Card>
                <CardHeader>
                  <CardTitle>Inputs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 max-w-md">
                  <Input placeholder="Default input" />
                  <Input placeholder="Disabled input" disabled />
                  <Textarea placeholder="Textarea placeholder..." />
                </CardContent>
              </Card>

              {/* Select */}
              <Card>
                <CardHeader>
                  <CardTitle>Select</CardTitle>
                </CardHeader>
                <CardContent className="max-w-xs">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="option1">Option 1</SelectItem>
                      <SelectItem value="option2">Option 2</SelectItem>
                      <SelectItem value="option3">Option 3</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Badges */}
              <Card>
                <CardHeader>
                  <CardTitle>Badges</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    <Badge>Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                    <Badge variant="outline">Outline</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Controls */}
              <Card>
                <CardHeader>
                  <CardTitle>Controls</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Checkbox id="check1" />
                    <label htmlFor="check1" className="body-100 text-[var(--color-text-core-default)]">Checkbox</label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch id="switch1" />
                    <label htmlFor="switch1" className="body-100 text-[var(--color-text-core-default)]">Switch</label>
                  </div>
                </CardContent>
              </Card>

              {/* Tabs */}
              <Card>
                <CardHeader>
                  <CardTitle>Tabs</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="tab1">
                    <TabsList>
                      <TabsTrigger value="tab1">Tab One</TabsTrigger>
                      <TabsTrigger value="tab2">Tab Two</TabsTrigger>
                      <TabsTrigger value="tab3">Tab Three</TabsTrigger>
                    </TabsList>
                    <TabsContent value="tab1" className="body-200 text-[var(--color-text-core-default)] pt-4">Content for tab one.</TabsContent>
                    <TabsContent value="tab2" className="body-200 text-[var(--color-text-core-default)] pt-4">Content for tab two.</TabsContent>
                    <TabsContent value="tab3" className="body-200 text-[var(--color-text-core-default)] pt-4">Content for tab three.</TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Tooltip */}
              <Card>
                <CardHeader>
                  <CardTitle>Tooltip</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="secondary" size="medium">Hover me</Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Tooltip content</p>
                    </TooltipContent>
                  </Tooltip>
                </CardContent>
              </Card>

              {/* Cards */}
              <Card>
                <CardHeader>
                  <CardTitle>Card</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <Card>
                      <CardHeader><CardTitle>Card Title</CardTitle></CardHeader>
                      <CardContent><p className="body-100 text-[var(--color-text-core-subtle)]">Card body content goes here.</p></CardContent>
                    </Card>
                    <Card>
                      <CardHeader><CardTitle>Another Card</CardTitle></CardHeader>
                      <CardContent><p className="body-100 text-[var(--color-text-core-subtle)]">More content in a second card.</p></CardContent>
                    </Card>
                    <Card>
                      <CardHeader><CardTitle>Third Card</CardTitle></CardHeader>
                      <CardContent><p className="body-100 text-[var(--color-text-core-subtle)]">Third card example.</p></CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>

              {/* Separator */}
              <Card>
                <CardHeader>
                  <CardTitle>Separator</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="body-100 text-[var(--color-text-core-default)]">Content above</p>
                  <Separator />
                  <p className="body-100 text-[var(--color-text-core-default)]">Content below</p>
                </CardContent>
              </Card>

              {/* Tag */}
              <Card>
                <CardHeader>
                  <CardTitle>Tag</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    <Tag variant="green">Domain Loads</Tag>
                    <Tag variant="blue">New Hire</Tag>
                    <Tag variant="orange">High Intent</Tag>
                    <Tag variant="yellow">Renewal Soon</Tag>
                    <Tag variant="neutral">Non-QL Demand</Tag>
                  </div>
                </CardContent>
              </Card>

              {/* Avatar */}
              <Card>
                <CardHeader>
                  <CardTitle>Avatar</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <Avatar>
                      <AvatarFallback className="bg-[var(--color-fill-accent-blue-subtle)] text-[var(--color-text-accent-blue-default)]">JD</AvatarFallback>
                    </Avatar>
                    <Avatar>
                      <AvatarFallback className="bg-[var(--color-fill-accent-green-subtle)] text-[var(--color-text-accent-green-default)]">AB</AvatarFallback>
                    </Avatar>
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-[var(--color-fill-brand-subtle)] text-[var(--color-text-brand-default)]">LG</AvatarFallback>
                    </Avatar>
                  </div>
                </CardContent>
              </Card>

              {/* Dialog */}
              <Card>
                <CardHeader>
                  <CardTitle>Dialog</CardTitle>
                </CardHeader>
                <CardContent>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">Open Dialog</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Dialog Title</DialogTitle>
                        <DialogDescription>This is a description of the dialog content and its purpose.</DialogDescription>
                      </DialogHeader>
                      <p className="body-100 text-[var(--color-text-core-subtle)]">Dialog body content goes here.</p>
                      <DialogFooter>
                        <Button variant="outline">Cancel</Button>
                        <Button>Confirm</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>

              {/* Dropdown Menu */}
              <Card>
                <CardHeader>
                  <CardTitle>Dropdown Menu</CardTitle>
                </CardHeader>
                <CardContent>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-[var(--color-text-negative-default)]">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardContent>
              </Card>

              {/* Popover */}
              <Card>
                <CardHeader>
                  <CardTitle>Popover</CardTitle>
                </CardHeader>
                <CardContent>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline">Open Popover</Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64">
                      <div className="space-y-2">
                        <h4 className="heading-100">Popover Title</h4>
                        <p className="body-100 text-[var(--color-text-core-subtle)]">This is popover content with additional context.</p>
                      </div>
                    </PopoverContent>
                  </Popover>
                </CardContent>
              </Card>

              {/* Accordion */}
              <Card>
                <CardHeader>
                  <CardTitle>Accordion</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>First Section</AccordionTrigger>
                      <AccordionContent>
                        <p className="body-100 text-[var(--color-text-core-subtle)]">Content for the first accordion section.</p>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>Second Section</AccordionTrigger>
                      <AccordionContent>
                        <p className="body-100 text-[var(--color-text-core-subtle)]">Content for the second accordion section.</p>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger>Third Section</AccordionTrigger>
                      <AccordionContent>
                        <p className="body-100 text-[var(--color-text-core-subtle)]">Content for the third accordion section.</p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>

              {/* Progress */}
              <Card>
                <CardHeader>
                  <CardTitle>Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="body-100">25%</Label>
                    <Progress value={25} />
                  </div>
                  <div className="space-y-2">
                    <Label className="body-100">50%</Label>
                    <Progress value={50} />
                  </div>
                  <div className="space-y-2">
                    <Label className="body-100">75%</Label>
                    <Progress value={75} />
                  </div>
                </CardContent>
              </Card>

              {/* Radio Group */}
              <Card>
                <CardHeader>
                  <CardTitle>Radio Group</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup defaultValue="option-1">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-1" id="option-1" />
                      <Label htmlFor="option-1" className="body-100">Option One</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-2" id="option-2" />
                      <Label htmlFor="option-2" className="body-100">Option Two</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-3" id="option-3" />
                      <Label htmlFor="option-3" className="body-100">Option Three</Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Slider */}
              <Card>
                <CardHeader>
                  <CardTitle>Slider</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label className="body-100">Default</Label>
                    <Slider defaultValue={[50]} max={100} step={1} />
                  </div>
                  <div className="space-y-2">
                    <Label className="body-100">Range</Label>
                    <Slider defaultValue={[25, 75]} max={100} step={1} />
                  </div>
                </CardContent>
              </Card>

              {/* Alert */}
              <Card>
                <CardHeader>
                  <CardTitle>Alert</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <AlertTitle>Default Alert</AlertTitle>
                    <AlertDescription>This is a default alert with important information.</AlertDescription>
                  </Alert>
                  <Alert variant="destructive">
                    <AlertTitle>Error Alert</AlertTitle>
                    <AlertDescription>Something went wrong. Please try again.</AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              {/* Skeleton */}
              <Card>
                <CardHeader>
                  <CardTitle>Skeleton</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-4 w-[150px]" />
                    </div>
                  </div>
                  <Skeleton className="h-[100px] w-full rounded-lg" />
                </CardContent>
              </Card>

              {/* Label */}
              <Card>
                <CardHeader>
                  <CardTitle>Label</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="label-example">Email address</Label>
                    <Input id="label-example" placeholder="you@example.com" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="label-checkbox" />
                    <Label htmlFor="label-checkbox">Accept terms and conditions</Label>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* ── Icon Library ── */}
          <section>
            <h2 className="heading-200 text-[var(--color-text-core-default)] mb-4">Icon Library</h2>
            <p className="body-100 text-[var(--color-text-core-subtle)] mb-4">
              {TRELLIS_ICON_NAMES.length} icons from the Trellis design system. Usage: <code className="code-100 bg-[var(--color-fill-field-default)] px-1 rounded-100">{'<TrellisIcon name="iconName" size={16} />'}</code>
            </p>
            <IconGallery />
          </section>

          <div className="h-12" />
        </div>
      </ScrollArea>
    </div>
  );
};

export default DesignSystem;
