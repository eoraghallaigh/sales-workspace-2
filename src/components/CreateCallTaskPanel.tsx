import { useState, useEffect } from "react";
import { X, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface CreateCallTaskPanelProps {
  open: boolean;
  contactCount: number;
  defaultTitle?: string;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
}

const getTomorrow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(0, 0, 0, 0);
  return d;
};

const CreateCallTaskPanel = ({
  open,
  contactCount,
  defaultTitle = "Follow-up call",
  onOpenChange,
  onCreated,
}: CreateCallTaskPanelProps) => {
  const [title, setTitle] = useState(defaultTitle);
  const [notes, setNotes] = useState("");
  const [taskType, setTaskType] = useState("call");
  const [dueDate, setDueDate] = useState<Date>(getTomorrow);
  const [agentCreate, setAgentCreate] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [isCalOpen, setIsCalOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setTitle(defaultTitle);
      requestAnimationFrame(() => setIsVisible(true));
    } else {
      setIsVisible(false);
    }
  }, [open, defaultTitle]);

  const handleCreate = () => {
    setTitle(defaultTitle);
    setNotes("");
    setTaskType("call");
    setDueDate(getTomorrow());
    onOpenChange(false);
    onCreated?.();
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div
      className={`fixed top-0 right-0 h-full w-[480px] bg-white z-50 flex flex-col p-6 shadow-[-4px_0_24px_rgba(0,0,0,0.12)] transition-transform duration-300 ease-out ${
        isVisible ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between mb-0">
        <h2 className="heading-300 text-foreground">Create Call Tasks</h2>
        <Button variant="ghost" size="icon" onClick={handleCancel} className="h-8 w-8">
          <X className="h-4 w-4" />
        </Button>
      </div>
      <p className="body-100 text-muted-foreground mb-6">
        Creating tasks for {contactCount} contact{contactCount !== 1 ? "s" : ""}
      </p>

      <div className="flex flex-col gap-5 flex-1">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="task-title">Task Title</Label>
          <Input
            id="task-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="task-notes">Task Notes</Label>
          <Textarea
            id="task-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes for these tasks..."
            rows={4}
            disabled={agentCreate}
            className={agentCreate ? "opacity-50" : ""}
          />
          <div className="flex items-center gap-2 mt-1 justify-end">
            <Label htmlFor="agent-create" className="body-100 text-[var(--color-text-core-default)] cursor-pointer">
              Allow Outreach Agent to create this
            </Label>
            <Switch id="agent-create" checked={agentCreate} onCheckedChange={setAgentCreate} />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="task-type">Task Type</Label>
          <Select value={taskType} onValueChange={setTaskType}>
            <SelectTrigger id="task-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="call">Call</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="to-do">To-do</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Due Date</Label>
          <Popover open={isCalOpen} onOpenChange={setIsCalOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start body-100 font-normal h-10 !rounded-[4px] bg-[var(--color-fill-surface-default)]"
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                {format(dueDate, "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={(date) => {
                  if (date) setDueDate(date);
                  setIsCalOpen(false);
                }}
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-6 mt-auto border-t border-border">
        <Button variant="primary" size="medium" onClick={handleCreate}>
          Create
        </Button>
        <Button variant="secondary" size="medium" onClick={handleCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default CreateCallTaskPanel;
