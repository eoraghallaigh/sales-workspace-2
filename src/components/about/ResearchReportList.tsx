import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { TrellisIcon } from "@/components/ui/trellis-icon";
import { cn } from "@/lib/utils";
import { researchReports } from "@/data/researchReports";

interface ResearchReportListProps {
  className?: string;
}

export const ResearchReportList = ({ className }: ResearchReportListProps) => {
  return (
    <section
      aria-labelledby="research-reports-heading"
      className={cn("flex flex-col gap-3", className)}
    >
      <header>
        <h2
          id="research-reports-heading"
          className="heading-400 text-foreground"
        >
          Original research reports
        </h2>
        <p className="body-100 text-muted-foreground mt-1">
          The full write-ups behind the themes below — interviews, quotes, and
          recommendations.
        </p>
      </header>

      <ul className="flex flex-col gap-3">
        {researchReports.map((report) => (
          <li key={report.slug}>
            <Link to={`/research/${report.slug}`} className="block group">
              <Card className="shadow-100 transition-colors group-hover:border-border-hover">
                <CardContent className="p-4 flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--color-fill-surface-default)]">
                    <TrellisIcon name="description" size={18} />
                  </span>
                  <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                    <p className="heading-100 text-foreground group-hover:text-text-interactive transition-colors">
                      {report.title}
                    </p>
                    <p className="body-100 text-muted-foreground">
                      {report.summary}
                    </p>
                    {report.date || report.participants ? (
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1 detail-200 text-muted-foreground">
                        {report.date ? (
                          <span className="inline-flex items-center gap-1">
                            <TrellisIcon name="date" size={11} />
                            {report.date}
                          </span>
                        ) : null}
                        {report.participants ? (
                          <span className="inline-flex items-center gap-1 min-w-0">
                            <TrellisIcon name="contact" size={11} />
                            <span className="truncate">
                              {report.participants}
                            </span>
                          </span>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                  <TrellisIcon
                    name="right"
                    size={14}
                    className="shrink-0 mt-1 opacity-40 group-hover:opacity-100 transition-opacity"
                  />
                </CardContent>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};
