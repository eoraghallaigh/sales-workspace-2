import { useRef } from "react";
import { AnchorNav, type AnchorNavSection } from "@/components/about/AnchorNav";
import { HeroSection } from "@/components/about/HeroSection";
import { HeroImagePanel } from "@/components/about/HeroImagePanel";
import { IterationsSection } from "@/components/about/IterationsSection";
import { ProjectContextSection } from "@/components/about/ProjectContextSection";
import { LinksSection } from "@/components/about/LinksSection";
import { OpenQuestionsSection } from "@/components/about/OpenQuestionsSection";
import { projectMeta } from "@/data/about";

const SECTIONS: AnchorNavSection[] = [
  { id: "hero", label: "Overview" },
  { id: "iterations", label: "Iteration history" },
  { id: "project-context", label: "Project context" },
  { id: "links", label: "Links" },
  { id: "open-questions", label: "Open questions" },
];

const About = () => {
  const scrollRef = useRef<HTMLElement | null>(null);

  return (
    <div className="about-doc h-screen overflow-hidden bg-background text-foreground">
      <div className="grid h-full grid-cols-1 md:grid-cols-[15rem_minmax(0,1fr)] 2xl:grid-cols-[15rem_minmax(0,1fr)_44rem]">
        <AnchorNav
          sections={SECTIONS}
          projectName={projectMeta.name}
          scrollRoot={scrollRef}
        />
        <main
          ref={scrollRef}
          className="h-full overflow-y-auto bg-white px-6 md:px-12 py-10"
        >
          <div className="md:max-w-3xl">
            <HeroSection />
            <IterationsSection />
            <ProjectContextSection />
            <LinksSection />
            <OpenQuestionsSection />
          </div>
        </main>
        <HeroImagePanel />
      </div>
    </div>
  );
};

export default About;
