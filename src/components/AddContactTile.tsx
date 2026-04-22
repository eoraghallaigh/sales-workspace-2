import { Plus } from "lucide-react";

interface AddContactTileProps {
  onClick: () => void;
}

const AddContactTile = ({ onClick }: AddContactTileProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-shrink-0 flex flex-col items-center justify-center gap-2 min-w-[280px] max-w-[320px] min-h-[220px] rounded-lg border-2 border-dashed border-border bg-white text-muted-foreground hover:border-text-interactive hover:text-text-interactive transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label="Add contacts"
    >
      <Plus className="h-6 w-6" />
      <span className="body-125">Add contacts</span>
    </button>
  );
};

export default AddContactTile;
