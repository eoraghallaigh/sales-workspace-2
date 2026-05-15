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
    <div
      className={[
        "prose prose-sm max-w-none",
        "prose-p:text-foreground prose-p:font-light prose-p:text-[14px] prose-p:leading-6 prose-p:my-3",
        "prose-li:text-foreground prose-li:font-light prose-li:text-[14px] prose-li:leading-6 prose-li:my-1",
        "prose-ul:my-3 prose-ol:my-3",
        "prose-strong:text-foreground prose-strong:font-semibold",
        "prose-a:text-text-interactive prose-a:font-light",
        "prose-headings:text-foreground prose-headings:font-medium",
        "prose-h2:text-[18px] prose-h2:leading-6 prose-h2:mt-6 prose-h2:mb-2",
        "prose-h3:text-[15px] prose-h3:leading-5 prose-h3:mt-5 prose-h3:mb-2",
        "prose-h4:text-[14px] prose-h4:leading-5 prose-h4:mt-4 prose-h4:mb-1",
        "prose-blockquote:text-muted-foreground prose-blockquote:font-light",
        "prose-blockquote:not-italic prose-blockquote:border-l-2 prose-blockquote:border-border",
        "prose-blockquote:pl-4 prose-blockquote:my-3",
        "prose-code:text-foreground prose-code:font-normal prose-code:bg-fill-tertiary",
        "prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-[13px]",
        "prose-code:before:content-none prose-code:after:content-none",
      ].join(" ")}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{cleaned}</ReactMarkdown>
    </div>
  );
};
