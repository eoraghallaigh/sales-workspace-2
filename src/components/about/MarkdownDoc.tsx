import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownDocProps {
  source: string;
  hideFirstHeading?: boolean;
}

// Strip the first H1 of a markdown doc when we already render the section
// heading ourselves — otherwise the rep would see two stacked titles.
const stripFirstH1 = (md: string) => md.replace(/^#\s+.+\n+/, "");

export const MarkdownDoc = ({ source, hideFirstHeading = true }: MarkdownDocProps) => {
  const cleaned = hideFirstHeading ? stripFirstH1(source) : source;
  return (
    <div className="prose prose-sm md:prose-base max-w-none prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground prose-a:text-text-interactive prose-strong:text-foreground">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{cleaned}</ReactMarkdown>
    </div>
  );
};
