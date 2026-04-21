import { useState, useRef, useEffect } from "react";
import { X, Maximize2, ChevronDown, Bold, Italic, Underline, Link as LinkIcon, Image as ImageIcon, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface EmailCommunicatorProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName?: string;
  recipientEmail?: string;
  onSendEmail?: () => void;
}

const EmailCommunicator = ({ isOpen, onClose, recipientName, recipientEmail, onSendEmail }: EmailCommunicatorProps) => {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [createTask, setCreateTask] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);

  // Initialize position at bottom center when opened
  useEffect(() => {
    if (isOpen && panelRef.current) {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const panelWidth = 600;
      const panelHeight = 572;
      
      setPosition({
        x: (windowWidth - panelWidth) / 2,
        y: windowHeight - panelHeight - 20 // 20px from bottom
      });
    }
  }, [isOpen]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (panelRef.current) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  if (!isOpen) return null;

  return (
    <div 
      ref={panelRef}
      className="fixed bg-white z-50 flex flex-col shadow-400 rounded-lg animate-scale-in"
      style={{ 
        width: '600px', 
        height: '572px',
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'default'
      }}
    >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <button 
              className="p-1 hover:bg-gray-100 rounded cursor-grab active:cursor-grabbing"
              onMouseDown={handleMouseDown}
            >
              <div className="grid grid-cols-3 gap-0.5">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="h-1 w-1 bg-foreground rounded-full" />
                ))}
              </div>
            </button>
            <ChevronDown className="h-5 w-5 text-foreground" />
            <h2 className="heading-300 text-foreground">Email</h2>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded transition-colors">
              <Maximize2 className="h-5 w-5 text-foreground" />
            </button>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
            >
              <X className="h-5 w-5 text-foreground" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 px-6 py-3 border-b border-border flex-shrink-0">
          <button className="body-125 text-foreground hover:text-primary font-medium">Templates</button>
          <button className="body-125 text-foreground hover:text-primary">Sequences</button>
          <button className="body-125 text-foreground hover:text-primary">Documents</button>
          <button className="body-125 text-foreground hover:text-primary flex items-center gap-1">
            Meetings <ChevronDown className="h-4 w-4" />
          </button>
          <button className="body-125 text-foreground hover:text-primary flex items-center gap-1">
            Quotes <ChevronDown className="h-4 w-4" />
          </button>
        </div>

        {/* Email Form */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-4 space-y-4">
            {/* To Field */}
            <div className="flex items-center gap-3">
              <label className="heading-100 text-foreground w-16">To</label>
              <div className="flex-1 flex items-center gap-2 flex-wrap">
                {recipientName && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 border border-border rounded-full">
                    <span className="body-100 text-foreground">{recipientName}</span>
                    <button className="hover:bg-gray-200 rounded-full p-0.5">
                      <X className="h-3 w-3 text-foreground" />
                    </button>
                  </div>
                )}
                <input
                  type="text"
                  className="flex-1 min-w-[200px] body-100 text-foreground focus:outline-none"
                  placeholder="Add recipient"
                />
              </div>
            </div>

            {/* From Field */}
            <div className="flex items-center gap-3">
              <label className="heading-100 text-foreground w-16">From</label>
              <div className="flex-1 flex items-center justify-between">
                <Select defaultValue="eoin">
                  <SelectTrigger className="w-auto border-0 shadow-none p-0 h-auto body-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eoin">Eoin Ó Raghallaigh (einoraghallaigh@gmail.com)</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-4">
                  <button className="body-100 text-foreground underline hover:no-underline">Cc</button>
                  <button className="body-100 text-foreground underline hover:no-underline">Bcc</button>
                </div>
              </div>
            </div>

            {/* Subject Field */}
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <label className="heading-100 text-foreground w-16">Subject</label>
              <Input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="flex-1 border-0 shadow-none p-0 h-auto body-100 focus-visible:ring-0"
                placeholder="Enter subject"
              />
            </div>

            {/* Email Body */}
            <div className="min-h-[300px]">
              <Textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="min-h-[300px] border-0 shadow-none p-0 body-100 resize-none focus-visible:ring-0"
                placeholder="Type your message..."
              />
            </div>
          </div>
        </div>

        {/* Formatting Toolbar */}
        <div className="px-6 py-3 border-t border-border flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded transition-colors">
              <Bold className="h-4 w-4 text-foreground" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded transition-colors">
              <Italic className="h-4 w-4 text-foreground" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded transition-colors">
              <Underline className="h-4 w-4 text-foreground" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded transition-colors">
              <span className="text-foreground">Tt</span>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded transition-colors flex items-center gap-1">
              <span className="body-100 text-foreground">More</span>
              <ChevronDown className="h-4 w-4 text-foreground" />
            </button>
            <div className="w-px h-6 bg-border" />
            <button className="p-2 hover:bg-gray-100 rounded transition-colors">
              <LinkIcon className="h-4 w-4 text-foreground" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded transition-colors">
              <ImageIcon className="h-4 w-4 text-foreground" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded transition-colors flex items-center gap-1">
              <span className="body-100 text-foreground">Insert</span>
              <ChevronDown className="h-4 w-4 text-foreground" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded transition-colors">
              <Paperclip className="h-4 w-4 text-foreground" />
            </button>
          </div>

          <Select defaultValue="1">
            <SelectTrigger className="w-auto border-0 shadow-none h-auto">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Associated with 1 record</SelectItem>
              <SelectItem value="2">Associated with 2 records</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <Button 
                variant="default" 
                size="default" 
                className="rounded-r-none"
                onClick={() => {
                  onSendEmail?.();
                  onClose();
                }}
              >
                Send
              </Button>
              <Button variant="default" size="default" className="rounded-l-none border-l border-white/20 px-2">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={createTask}
                onChange={(e) => setCreateTask(e.target.checked)}
                className="h-4 w-4 rounded border-border"
              />
              <span className="body-100 text-foreground">Create a</span>
            </label>
            <Select defaultValue="todo">
              <SelectTrigger className="w-auto h-auto border-0 shadow-none p-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todo">To-do</SelectItem>
                <SelectItem value="task">Task</SelectItem>
              </SelectContent>
            </Select>
            <span className="body-100 text-foreground">task to follow up</span>
            <Select defaultValue="3days">
              <SelectTrigger className="w-auto h-auto border-0 shadow-none p-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3days">In 3 business days (Wednesday)</SelectItem>
                <SelectItem value="1week">In 1 week</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    );
  };

export default EmailCommunicator;
