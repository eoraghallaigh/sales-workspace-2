import { useEffect } from "react";

export const SpecLayout = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    function postHeight() {
      window.parent.postMessage(
        { type: "spec-height", height: document.documentElement.scrollHeight },
        "*"
      );
    }
    window.addEventListener("load", postHeight);
    const observer = new ResizeObserver(postHeight);
    observer.observe(document.documentElement);
    postHeight();
    return () => {
      window.removeEventListener("load", postHeight);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="bg-white min-h-screen overflow-y-auto h-screen">
      <div className="px-10 py-12 max-w-6xl">{children}</div>
    </div>
  );
};
