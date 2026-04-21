import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronDown, Mic, Grid3x3, Sparkles, Headphones, BarChart3, Bold, Italic, Underline, Link as LinkIcon, List, Circle, X, Phone } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

type CallState = 'dialling' | 'connected' | 'hungUp';

interface DiallerCommunicatorProps {
  isOpen: boolean;
  onClose: () => void;
  contactName?: string;
  contactPhone?: string;
  taskNotes?: string;
  onEndCall?: () => void;
}

const DiallerCommunicator = ({
  isOpen,
  onClose,
  contactName = "Unknown",
  contactPhone = "",
  onEndCall
}: DiallerCommunicatorProps) => {
  const [notes, setNotes] = useState("");
  const [callDuration, setCallDuration] = useState(0);
  const [callState, setCallState] = useState<CallState>('dialling');

  // Drag state
  const [position, setPosition] = useState({ x: 84, y: window.innerHeight - 420 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const dialerRef = useRef<HTMLDivElement>(null);

  // Reset position and state when opening
  useEffect(() => {
    if (isOpen) {
      setPosition({ x: 84, y: window.innerHeight - 420 });
      setCallDuration(0);
      setCallState('dialling');
      setNotes("");
    }
  }, [isOpen]);

  // Simulate call connecting after 3 seconds
  useEffect(() => {
    if (!isOpen) return;
    
    const diallingTimeout = setTimeout(() => {
      setCallState('connected');
    }, 3000);

    return () => clearTimeout(diallingTimeout);
  }, [isOpen, contactName]);

  // Timer for call duration - only runs when connected
  useEffect(() => {
    if (callState !== 'connected') return;
    
    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [callState]);

  // Drag handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!dialerRef.current) return;
    e.preventDefault();
    setIsDragging(true);
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  }, [position]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newX = Math.max(0, Math.min(window.innerWidth - 540, e.clientX - dragOffset.current.x));
      const newY = Math.max(0, Math.min(window.innerHeight - 100, e.clientY - dragOffset.current.y));
      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setCallState('hungUp');
    onEndCall?.();
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  const getStatusText = () => {
    switch (callState) {
      case 'dialling':
        return 'Dialling...';
      case 'connected':
        return formatTime(callDuration);
      case 'hungUp':
        return 'Call ended';
    }
  };

  return (
    <div 
      ref={dialerRef}
      className="fixed bg-card z-[60] flex flex-col shadow-lg rounded-lg animate-scale-in overflow-hidden border border-border"
      style={{
        width: '540px',
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : undefined,
      }}
    >
      {/* Header - Dark with contact info and call controls — draggable handle */}
      <div 
        className="flex items-center justify-between px-4 py-3 bg-[#33475B] select-none"
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-3">
          <ChevronDown className="h-5 w-5 text-white" />
          <div>
            <div className="body-125 font-semibold text-white">{contactName}</div>
            <div className="detail-100 text-white/70">{contactPhone}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {callState === 'dialling' && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-white animate-pulse" />
              <span className="body-125 text-white font-medium">{getStatusText()}</span>
            </div>
          )}
          {callState === 'connected' && (
            <span className="body-125 text-white font-medium">{getStatusText()}</span>
          )}
          {callState === 'hungUp' && (
            <span className="body-125 text-white/70 font-medium">{getStatusText()}</span>
          )}
          
          {callState !== 'hungUp' ? (
            <button 
              onClick={handleEndCall}
              className="px-6 py-2 bg-red-500 hover:bg-red-600 rounded text-white transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            </button>
          ) : (
            <button 
              onClick={handleClose}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded text-white transition-colors flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Close
            </button>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-3 bg-fill-surface-recessed border-b border-border">
        <div className="flex items-center gap-4">
          <button className="flex flex-col items-center gap-1 group" disabled={callState !== 'connected'}>
            <div className={`p-2 rounded transition-colors ${callState === 'connected' ? 'hover:bg-accent/10' : 'opacity-50'}`}>
              <Circle className="h-5 w-5 text-foreground" />
            </div>
            <span className="detail-100 text-foreground">Record</span>
          </button>
          
          <button className="flex flex-col items-center gap-1 group" disabled={callState !== 'connected'}>
            <div className={`p-2 rounded transition-colors ${callState === 'connected' ? 'hover:bg-accent/10' : 'opacity-50'}`}>
              <Mic className="h-5 w-5 text-foreground" />
            </div>
            <span className="detail-100 text-foreground">Mute</span>
          </button>
          
          <button className="flex flex-col items-center gap-1 group" disabled={callState !== 'connected'}>
            <div className={`p-2 rounded transition-colors ${callState === 'connected' ? 'hover:bg-accent/10' : 'opacity-50'}`}>
              <Grid3x3 className="h-5 w-5 text-foreground" />
            </div>
            <span className="detail-100 text-foreground">Keypad</span>
          </button>
          
          <button className="flex flex-col items-center gap-1 group" disabled={callState !== 'connected'}>
            <div className={`p-2 rounded transition-colors ${callState === 'connected' ? 'hover:bg-accent/10' : 'opacity-50'}`}>
              <Sparkles className="h-5 w-5 text-foreground" />
            </div>
            <span className="detail-100 text-foreground">Assistant</span>
          </button>
        </div>

        <div className="h-8 w-px bg-border" />

        <div className="flex items-center gap-4">
          <button className="flex flex-col items-center gap-1 group">
            <div className="flex items-center gap-1 p-2 rounded hover:bg-accent/10 transition-colors">
              <Headphones className="h-5 w-5 text-foreground" />
              <ChevronDown className="h-3 w-3 text-foreground" />
            </div>
            <span className="detail-100 text-foreground">Audio</span>
          </button>
          
          <button className="flex flex-col items-center gap-1 group">
            <div className="p-2 rounded hover:bg-accent/10 transition-colors">
              <BarChart3 className="h-5 w-5 text-[#00BDA5]" />
            </div>
            <span className="detail-100 text-foreground">Network</span>
          </button>
        </div>
      </div>

      {/* Notes Section */}
      <div className="p-4">
        <h3 className="heading-200 text-foreground mb-2">Notes</h3>
        <Textarea 
          value={notes} 
          onChange={e => setNotes(e.target.value)} 
          className="min-h-[80px] body-100 resize-none" 
          placeholder="Take notes on this call..." 
        />
      </div>

      {/* Formatting Toolbar */}
      <div className="px-4 py-2 border-t border-border flex items-center gap-2">
        <button className="p-1.5 hover:bg-accent/10 rounded transition-colors">
          <Bold className="h-4 w-4 text-foreground" />
        </button>
        <button className="p-1.5 hover:bg-accent/10 rounded transition-colors">
          <Italic className="h-4 w-4 text-foreground" />
        </button>
        <button className="p-1.5 hover:bg-accent/10 rounded transition-colors">
          <Underline className="h-4 w-4 text-foreground" />
        </button>
        <button className="p-1.5 hover:bg-accent/10 rounded transition-colors">
          <span className="text-sm font-serif italic text-foreground">I</span>
        </button>
        <button className="p-1.5 hover:bg-accent/10 rounded transition-colors flex items-center gap-1">
          <span className="detail-100 text-foreground">More</span>
          <ChevronDown className="h-3 w-3 text-foreground" />
        </button>
        <button className="p-1.5 hover:bg-accent/10 rounded transition-colors">
          <LinkIcon className="h-4 w-4 text-foreground" />
        </button>
        <button className="p-1.5 hover:bg-accent/10 rounded transition-colors">
          <List className="h-4 w-4 text-foreground" />
        </button>
      </div>
    </div>
  );
};

export default DiallerCommunicator;