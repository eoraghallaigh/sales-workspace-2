import { Link, useLocation } from "react-router-dom";
import { TrellisIcon } from "./ui/trellis-icon";

export const LeftNavigation = () => {
  const location = useLocation();
  const items: Array<{ name: any; to?: string }> = [
    { name: "bookmark" },
  ];
  const branchItems: Array<{ name: any; to?: string }> = [
    { name: "crm", to: "/" },
    { name: "campaigns" },
    { name: "documents" },
    { name: "salesTemplates" },
    { name: "shoppingCart" },
    { name: "questionAnswer" },
    { name: "hubDB" },
    { name: "workflows" },
    { name: "reports" },
  ];
  const itemClass = "p-2 rounded-md cursor-pointer transition-colors hover:bg-white/10";
  return (
    <nav
      className="fixed left-0 top-12 w-16 h-[calc(100vh-48px)] z-40 flex flex-col items-center py-3 gap-1"
      style={{ background: "#333333" }}
      onWheel={(e) => e.stopPropagation()}>
      {items.map((it) => (
        <div key={it.name} className={itemClass}>
          <TrellisIcon name={it.name} size={16} className="brightness-0 invert" />
        </div>
      ))}
      <div className="w-6 h-px bg-white/20 my-1" />
      {branchItems.map((it) => {
        const active = it.to && location.pathname === it.to;
        const inner = (
          <TrellisIcon name={it.name} size={16} className="brightness-0 invert" />
        );
        return it.to ? (
          <Link
            key={it.name}
            to={it.to}
            className={`${itemClass} ${active ? "bg-white/15" : ""}`}>
            {inner}
          </Link>
        ) : (
          <div key={it.name} className={itemClass}>
            {inner}
          </div>
        );
      })}
      <div className="w-6 h-px bg-white/20 my-1" />
      <div className={itemClass}>
        <TrellisIcon name="star" size={16} className="brightness-0 invert" />
      </div>
    </nav>
  );
};
