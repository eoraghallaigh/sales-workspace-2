import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TourProvider } from "@/contexts/TourContext";
import GuidedTour from "@/components/GuidedTour";
import TourLauncher from "@/components/TourLauncher";
import SalesWorkspace from "./pages/SalesWorkspace";
import Summary from "./pages/Summary";
import Prospecting from "./pages/Prospecting";
import PowerHour from "./pages/PowerHour";
import PowerHourReview from "./pages/PowerHourReview";
import Dashboard from "./pages/Dashboard";
import Deals from "./pages/Deals";
import Agents from "./pages/Agents";
import AgentDetail from "./pages/AgentDetail";
import DesignSystem from "./pages/DesignSystem";
import ProspectingStrategy from "./pages/ProspectingStrategy";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <TourProvider>
          <Routes>
            <Route path="/" element={<Summary />} />
            <Route path="/summary" element={<Summary />} />
            <Route path="/design-system" element={<DesignSystem />} />
            <Route path="/prospecting" element={<Prospecting />} />
            <Route path="/prospecting/campaign/:campaignId" element={<Prospecting />} />
            <Route path="/prospecting/strategy/:companyId" element={<ProspectingStrategy />} />
            <Route path="/power-hour" element={<PowerHour />} />
            <Route path="/power-hour/review" element={<PowerHourReview />} />
            <Route path="/sales-workspace" element={<SalesWorkspace />} />
             <Route path="/deals" element={<Deals />} />
            <Route path="/agents" element={<Agents />} />
            <Route path="/agents/:agentId" element={<AgentDetail />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
          <GuidedTour />
          {/* <TourLauncher /> */}
        </TourProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
