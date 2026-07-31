import { useEffect, useRef } from "react";

export const SpecLayout = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    function postHeight() {
      window.parent.postMessage(
        { type: "spec-height", height: el!.scrollHeight },
        "*"
      );
    }
    window.addEventListener("load", postHeight);
    const observer = new ResizeObserver(postHeight);
    observer.observe(el);
    postHeight();
    return () => {
      window.removeEventListener("load", postHeight);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={ref} className="bg-white min-h-screen overflow-y-auto h-screen">
      <div className="px-10 py-12 max-w-6xl">{children}</div>
    </div>
  );
};
