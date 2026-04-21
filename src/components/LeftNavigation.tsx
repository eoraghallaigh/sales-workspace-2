import { Link, useLocation } from "react-router-dom";
import { TrellisIcon } from "./ui/trellis-icon";

export const LeftNavigation = () => {
  const location = useLocation();
  return <nav className="fixed left-0 top-12 w-16 h-[calc(100vh-48px)] bg-trellis-magenta-1400 border-r  z-40 flex flex-col items-center py-4 space-y-4" onWheel={(e) => e.stopPropagation()}>
      <Link to="/" className={`p-2 rounded-lg transition-colors ${location.pathname === '/' ? 'bg-transparent text-white' : 'text-white hover:text-orange-300 hover:bg-white/10'}`}>
        <TrellisIcon name="home" size={20} className="brightness-0 invert" />
      </Link>
      <div className="p-2 rounded-lg text-white hover:text-orange-300 hover:bg-white/10 cursor-pointer transition-colors">
        <TrellisIcon name="favoriteHollow" size={20} className="brightness-0 invert" />
      </div>
      <div className="p-2 rounded-lg text-white hover:text-orange-300 hover:bg-white/10 cursor-pointer transition-colors">
        <TrellisIcon name="listView" size={20} className="brightness-0 invert" />
      </div>
      <Link to="/canvas-mode" className={`p-2 rounded-lg transition-colors ${location.pathname === '/canvas-mode' ? 'bg-orange-500 text-white' : 'text-white hover:text-orange-300 hover:bg-white/10'}`}>
        <TrellisIcon name="documents" size={20} className="brightness-0 invert" />
      </Link>
      <div className="p-2 rounded-lg text-white hover:text-orange-300 hover:bg-white/10 cursor-pointer transition-colors">
        <TrellisIcon name="objectAssociations" size={20} className="brightness-0 invert" />
      </div>
      <div className="p-2 rounded-lg text-white hover:text-orange-300 hover:bg-white/10 cursor-pointer transition-colors">
        <TrellisIcon name="reports" size={20} className="brightness-0 invert" />
      </div>
      <div className="p-2 rounded-lg text-white hover:text-orange-300 hover:bg-white/10 cursor-pointer transition-colors">
        <TrellisIcon name="folder" size={20} className="brightness-0 invert" />
      </div>
      <div className="p-2 rounded-lg text-white hover:text-orange-300 hover:bg-white/10 cursor-pointer transition-colors">
        <TrellisIcon name="date" size={20} className="brightness-0 invert" />
      </div>
    </nav>;
};
