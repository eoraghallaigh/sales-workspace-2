import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TrellisIcon } from "@/components/ui/trellis-icon";

// A quick-filter pill that sits above a table: a ghost button with a label and
// a caret that opens a dropdown of options. Shared so every table's quick
// filters look and behave the same.
const FilterPill = ({
  label,
  hasCarat,
  options,
}: {
  label: string;
  hasCarat?: boolean;
  options?: string[];
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="medium" className="border border-transparent heading-50">
        {label}
        {hasCarat && <TrellisIcon name="downCarat" size={12} />}
      </Button>
    </DropdownMenuTrigger>
    {options && options.length > 0 && (
      <DropdownMenuContent>
        {options.map(option => (
          <DropdownMenuItem key={option}>{option}</DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    )}
  </DropdownMenu>
);

export default FilterPill;
