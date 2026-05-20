import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

/*
 * Calendar (Date Picker popover content) — Trellis UI Design Library (Trellis Alpha)
 * Figma: https://www.figma.com/design/WFHzemS77ZIN7J2syvCwwC/Trellis-UI-Design-Library?node-id=8860-55235
 * Light mode values only. Token paths annotated inline.
 *
 * The date picker trigger is just an <Input>; this component is the popover body.
 */
export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      data-figma-component-key="8860:55235"
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-[14px] leading-[20px] font-medium text-[#141414]", // Heading 05 — HubSpot Sans 14/20/500
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "tertiary", size: "sm", iconOnly: true }),
          "h-7 w-7"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "w-9 text-[12px] leading-[18px] font-normal text-[#666666]", // Body Sm / foundational/fg/subtle
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-[14px] leading-[20px] p-0 relative focus-within:relative focus-within:z-20", // Body Md
        day: cn(
          "inline-flex items-center justify-center h-9 w-9 p-0",
          "rounded-full", // Day cells are circular per design
          "text-[14px] leading-[20px] font-normal text-[#141414]",
          "transition-colors",
          "hover:bg-[#ebebeb]", // bg/normal/hover
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0050c7] focus-visible:ring-offset-2", // expressive/focus/default
          "aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected: cn(
          "bg-[#333333] text-white", // primary fill on selected — trellisComp/button/container/backgroundColor/primary/default
          "hover:bg-[#4d4d4d] hover:text-white",
          "focus:bg-[#333333] focus:text-white"
        ),
        day_today: "bg-[#f0f0f0] text-[#141414]", // foundational/bg/subtle for today (no overlap with selected)
        day_outside:
          "day-outside text-[#cccccc] opacity-100 aria-selected:bg-[#e6e6e6] aria-selected:text-[#8a8a8a]", // border/subtle / disabled greys
        day_disabled: "text-[#8a8a8a] opacity-50", // foundational/fg/normal/disabled
        day_range_middle: "aria-selected:bg-[#f0f0f0] aria-selected:text-[#141414]",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
