import sparkleIcon from "@/assets/sparkle-icon.png";

interface AssistantButtonProps {
  onClick: () => void;
}

export const AssistantButton = ({ onClick }: AssistantButtonProps) => {
  return (
    <div 
      onClick={onClick}
      className="flex items-center space-x-2 bg-transparent px-3 py-1 rounded-full text-white body-125 cursor-pointer hover:bg-white/10 transition-colors"
    >
      <img src={sparkleIcon} alt="Sparkle" className="h-4 w-4" style={{ filter: 'brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%)' }} />
      <span>Assistant</span>
    </div>
  );
};