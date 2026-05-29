// Renders a research section body as paragraphs and bullet lists.
// A block is treated as a bullet list when every line starts with "- " or "• ";
// otherwise it renders as a paragraph (newlines preserved).
export const ResearchSectionBody = ({ body }: { body: string }) => {
  const blocks = body.split(/\n\n+/);
  return (
    <div className="flex flex-col gap-3">
      {blocks.map((block, blockIdx) => {
        const lines = block.split("\n");
        const isBulletList = lines.every((line) => /^\s*[-•]\s+/.test(line));
        if (isBulletList) {
          return (
            <ul key={blockIdx} className="list-disc pl-5 flex flex-col gap-2">
              {lines.map((line, lineIdx) => (
                <li key={lineIdx} className="body-100 text-foreground leading-relaxed">
                  {line.replace(/^\s*[-•]\s+/, "")}
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={blockIdx} className="body-100 text-foreground leading-relaxed whitespace-pre-line">
            {block}
          </p>
        );
      })}
    </div>
  );
};
