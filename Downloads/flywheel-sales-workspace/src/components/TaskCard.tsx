import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { isDateOverdue } from "@/utils/dateUtils";
import companyLogoPlaceholder from "@/assets/company-logo-placeholder.png";
import { TrellisIcon } from "@/components/ui/trellis-icon";

export interface Task {
  id: string;
  title: string;
  priority: "P1" | "P2" | "P3";
  dueDate: string;
  contact: {
    name: string;
    initials: string;
    role: string;
    avatarColor: string;
  };
  contactId?: string;
  action: "call" | "email" | "linkedin";
  completed?: boolean;
  companyLogo?: string;
  notes?: string;
}

interface TaskCardProps {
  task: Task;
  onContactClick?: (contactId: string) => void;
  onTaskClick?: (taskId: string) => void;
  onCallClick?: (contactId: string, taskId: string) => void;
  onEmailClick?: (contactId: string, taskId: string) => void;
}

const TaskCard = ({ task, onContactClick, onTaskClick, onCallClick, onEmailClick }: TaskCardProps) => {
  const getActionButton = () => {
    if (task.completed) {
      return (
        <Badge className="justify-self-end bg-[var(--color-border-accent-green-default)] text-white border-transparent hover:bg-[var(--color-border-accent-green-default)]/90">Complete</Badge>
      );
    }
    switch (task.action) {
      case "call":
        return (
          <Button 
            variant="secondary-alt" 
            size="small" 
            className="justify-self-end"
            onClick={() => task.contactId && onCallClick?.(task.contactId, task.id)}
          >
            <TrellisIcon name="calling" size={16} className="mr-2" />
            Call
          </Button>
        );
      case "email":
        return (
          <Button 
            variant="secondary-alt" 
            size="small" 
            className="justify-self-end"
            onClick={() => onEmailClick?.(task.contactId || "", task.id)}
          >
            <TrellisIcon name="email" size={16} className="mr-2" />
            Email
          </Button>
        );
      case "linkedin":
        return (
          <Button variant="secondary-alt" size="small" className="justify-self-end">
            <TrellisIcon name="linkedin" size={16} className="mr-2" />
            Send Message
          </Button>
        );
    }
  };

  const isOverdue = isDateOverdue(task.dueDate);
  const showOverdueStyle = isOverdue && !task.completed;

  return (
    <div className={`flex h-24 py-3 px-6 justify-center items-center gap-6 w-full rounded-lg border ${showOverdueStyle ? 'border-[var(--color-border-alert-default)]' : 'border-[var(--color-border-core-subtle)]'} bg-[var(--color-fill-surface-default)]`}>
      <div className="w-[390px]">
        <div className="flex items-center gap-2 mb-1">
          <button
            className="link-200 text-text-interactive hover:text-text-interactive-hover transition-colors cursor-pointer text-left"
            onClick={() => onTaskClick?.(task.id)}
          >
            {task.title}
          </button>
        </div>
        <div className={`detail-200 ${showOverdueStyle ? 'text-[var(--color-text-alert-default)]' : 'text-muted-foreground'}`}>Due: {task.dueDate}</div>
      </div>
      <div className="flex h-[72px] min-h-[72px] py-4 px-6 flex-row justify-start items-center gap-3 flex-1 bg-[var(--color-fill-field-default-alt)]">
        <Avatar className="h-10 w-10">
          <AvatarImage src={task.companyLogo || companyLogoPlaceholder} alt="Company logo" />
          <AvatarFallback>
            <img src={task.companyLogo || companyLogoPlaceholder} alt="Company logo" className="h-full w-full object-cover" />
          </AvatarFallback>
        </Avatar>
        <div>
          <button 
            className="link-100 text-text-interactive hover:text-text-interactive-hover transition-colors cursor-pointer text-left"
            onClick={() => task.contactId && onContactClick?.(task.contactId)}
          >
            {task.contact.name}
          </button>
          <div className="detail-200 text-muted-foreground">{task.contact.role}</div>
        </div>
      </div>
      {getActionButton()}
    </div>
  );
};

export default TaskCard;
