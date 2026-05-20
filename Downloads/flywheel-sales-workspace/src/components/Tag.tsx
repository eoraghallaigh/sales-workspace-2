import { cn } from "@/lib/utils";

/*
 * Tag — Trellis UI Design Library (Trellis Alpha)
 * Figma: https://www.figma.com/design/WFHzemS77ZIN7J2syvCwwC/Trellis-UI-Design-Library?node-id=3034-1987
 * Light mode values only. Token paths annotated inline.
 *
 * Borderless chip with subtle background, 6px radius, HubSpot Sans 12/18/400.
 * The 5 original variants (green/blue/neutral/orange/yellow) retain their
 * names so existing 9 consumers don't break; their background values have
 * been updated to Trellis Alpha readOnly colors. 5 new variants added.
 */

type TagVariant =
  | "neutral"
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "teal"
  | "blue"
  | "purple"
  | "lavender"
  | "magenta";

interface TagProps {
  children: React.ReactNode;
  variant?: TagVariant;
  className?: string;
}

const variantBackgrounds: Record<TagVariant, string> = {
  // trellisComp/tag/container/backgroundColor/{variant}/readOnly
  neutral: "#ebebeb",
  red: "#fcece9",
  orange: "#fcece6",
  yellow: "#fcf6e6",
  green: "#daefe1",
  teal: "#e0fcfa",
  blue: "#e1f2fb",
  purple: "#efeefd",
  lavender: "#efe7f0",
  magenta: "#fcebf2",
};

const Tag = ({ children, variant = "neutral", className }: TagProps) => {
  return (
    <div
      data-figma-component-key="3034:1987"
      className={cn(
        "inline-flex items-center",
        "gap-[4px]", // trellisComp/tag/container/gap
        "px-[8px] py-[4px]", // trellisComp/tag/container/paddingInline (8) + tagGroup/overflowTag/container/paddingBlock (4)
        "rounded-[6px]", // trellisComp/tag/container/borderRadius
        "text-[12px] leading-[18px] font-normal", // trellisComp/tag/label fontSize/lineHeight/fontWeight (Body Sm / HubSpot Sans 12/18/400)
        "text-[#141414]", // trellisComp/tag/label/color/readOnly
        // border is transparent by spec — borderColor/{variant}/readOnly = #ffffff00 — so we omit border entirely
        className
      )}
      style={{ backgroundColor: variantBackgrounds[variant] }}
    >
      {children}
    </div>
  );
};

export default Tag;
