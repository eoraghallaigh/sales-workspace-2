import { Link, useParams, Navigate } from "react-router-dom";
import { MarkdownDoc } from "@/components/about/MarkdownDoc";
import { AboutSideNav } from "@/components/about/AboutSideNav";
import { TrellisIcon } from "@/components/ui/trellis-icon";
import { getResearchReport } from "@/data/researchReports";

const ResearchReport = () => {
  const { reportSlug } = useParams<{ reportSlug: string }>();
  const report = getResearchReport(reportSlug);

  if (!report) return <Navigate to="/about/user-research" replace />;

  return (
    <div className="about-doc h-screen overflow-hidden bg-background text-foreground">
      <div className="flex h-full">
        <AboutSideNav />
        <main className="flex-1 h-full overflow-y-auto bg-white px-6 md:px-12 py-10">
          <div className="md:max-w-3xl mx-auto">
            <Link
              to="/about/user-research"
              className="detail-100 text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-6"
            >
              <TrellisIcon name="left" size={12} />
              User research
            </Link>

            <header className="pb-8 mb-8 border-b border-border">
              <h1 className="heading-1000 text-foreground tracking-tight">
                {report.title}
              </h1>
              <p className="body-200 text-muted-foreground mt-2 max-w-2xl">
                {report.summary}
              </p>
              {report.date || report.participants ? (
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-4 detail-100 text-muted-foreground">
                  {report.date ? (
                    <span className="inline-flex items-center gap-1.5">
                      <TrellisIcon name="date" size={12} />
                      {report.date}
                    </span>
                  ) : null}
                  {report.participants ? (
                    <span className="inline-flex items-center gap-1.5">
                      <TrellisIcon name="contact" size={12} />
                      {report.participants}
                    </span>
                  ) : null}
                </div>
              ) : null}
            </header>

            <MarkdownDoc source={report.source} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ResearchReport;
