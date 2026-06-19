import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { TourProvider } from "@/contexts/TourContext";
import { VariantProvider } from "@/contexts/VariantContext";
import { StrategyAssistantProvider } from "@/contexts/StrategyAssistantContext";
import { PlaysProvider } from "@/contexts/PlaysContext";
import GuidedTour from "@/components/GuidedTour";
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
import DataWellSandbox from "./pages/DataWellSandbox";
import PlayHeaderSandbox from "./pages/PlayHeaderSandbox";
import ProspectingStrategy from "./pages/ProspectingStrategy";
import HoverPreviewDemo from "./pages/HoverPreviewDemo";
import OutreachStates from "./pages/OutreachStates";
import TeamHome from "./pages/TeamHome";
import AboutDoc from "./pages/AboutDoc";
import ResearchReport from "./pages/ResearchReport";
import CyclePage from "./pages/CyclePage";
import MotionSandbox from "./pages/MotionSandbox";
import Plays from "./pages/Plays";
import PlayBuilder from "./pages/PlayBuilder";
import DesignMode from "./sandbox/DesignMode";
import Inspector from "./inspector/Inspector";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <TourProvider>
          <VariantProvider>
          <StrategyAssistantProvider>
          <PlaysProvider>
          <Routes>
            <Route path="/" element={<TeamHome />} />
            <Route path="/about/:docSlug" element={<AboutDoc />} />
            <Route path="/research/:reportSlug" element={<ResearchReport />} />
            <Route path="/motion-sandbox" element={<MotionSandbox />} />
            <Route path="/:cycleSlug" element={<CyclePage />} />
            <Route path="/:cycleSlug/summary" element={<Summary />} />
            <Route path="/:cycleSlug/design-system" element={<DesignSystem />} />
            <Route path="/data-well-sandbox" element={<DataWellSandbox />} />
            <Route path="/:cycleSlug/data-well-sandbox" element={<DataWellSandbox />} />
            <Route path="/play-box-sandbox" element={<PlayHeaderSandbox />} />
            <Route path="/:cycleSlug/play-box-sandbox" element={<PlayHeaderSandbox />} />
            <Route path="/:cycleSlug/prospecting" element={<Prospecting />} />
            <Route path="/:cycleSlug/prospecting/play/:playId" element={<Prospecting />} />
            <Route path="/:cycleSlug/plays" element={<Plays />} />
            <Route path="/:cycleSlug/plays/new" element={<PlayBuilder />} />
            <Route path="/:cycleSlug/plays/:playId/edit" element={<PlayBuilder />} />
            <Route path="/:cycleSlug/prospecting/strategy/:companyId" element={<ProspectingStrategy />} />
            <Route path="/:cycleSlug/power-hour" element={<PowerHour />} />
            <Route path="/:cycleSlug/power-hour/review" element={<PowerHourReview />} />
            <Route path="/:cycleSlug/sales-workspace" element={<SalesWorkspace />} />
            <Route path="/:cycleSlug/deals" element={<Deals />} />
            <Route path="/:cycleSlug/agents" element={<Agents />} />
            <Route path="/:cycleSlug/agents/:agentId" element={<AgentDetail />} />
            <Route path="/:cycleSlug/dashboard" element={<Dashboard />} />
            <Route path="/:cycleSlug/hover-preview" element={<HoverPreviewDemo />} />
            <Route path="/:cycleSlug/outreach-states" element={<OutreachStates />} />
          </Routes>
          <GuidedTour />
          {import.meta.env.DEV && <DesignMode />}
          <Inspector />
          </PlaysProvider>
          </StrategyAssistantProvider>
          </VariantProvider>
        </TourProvider>
      </BrowserRouter>
    </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
