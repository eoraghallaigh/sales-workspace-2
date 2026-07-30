export const SpecLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-white min-h-screen overflow-y-auto h-screen">
    <div className="px-10 py-12 max-w-6xl">{children}</div>
  </div>
);
