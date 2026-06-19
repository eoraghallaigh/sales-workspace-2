import { Link, useParams, Navigate } from "react-router-dom";
import { MarkdownDoc } from "@/components/about/MarkdownDoc";
import { AboutSideNav } from "@/components/about/AboutSideNav";
import { ResearchReportList } from "@/components/about/ResearchReportList";
import { TrellisIcon } from "@/components/ui/trellis-icon";
import { getAboutDoc } from "@/data/aboutDocs";

const AboutDoc = () => {
  const { docSlug } = useParams<{ docSlug: string }>();
  const doc = getAboutDoc(docSlug);

  if (!doc) return <Navigate to="/" replace />;

  const showResearchReports = doc.slug === "user-research";

  return (
    <div className="about-doc h-screen overflow-hidden bg-background text-foreground">
      <div className="flex h-full">
        <AboutSideNav />
        <main className="flex-1 h-full overflow-y-auto bg-white px-6 md:px-12 py-10">
          <div className="md:max-w-3xl mx-auto">
            <Link
              to="/"
              className="md:hidden detail-100 text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-6"
            >
              <TrellisIcon name="left" size={12} />
              Team home
            </Link>

            <header className="pb-8 mb-8 border-b border-border">
              <h1 className="heading-1000 text-foreground tracking-tight">
                {doc.title}
              </h1>
              <p className="body-200 text-muted-foreground mt-2 max-w-2xl">
                {doc.description}
              </p>
            </header>

            {showResearchReports ? (
              <ResearchReportList className="mb-12" />
            ) : null}

            <MarkdownDoc source={doc.source} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AboutDoc;
