import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrellisIcon } from "@/components/ui/trellis-icon";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CompanyStrategyVariant } from "@/data/companyStrategies";

const BoldText = ({ text }: { text: string }) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
};

const ResearchCellContent = ({ content }: { content: string }) => {
  const lines = content
    .split(/\n/)
    .map((l) => l.replace(/^\s*[-•]\s+/, "").trim())
    .filter(Boolean);

  return (
    <ul className="list-disc pl-4 flex flex-col gap-1">
      {lines.map((line, idx) => (
        <li key={idx} className="body-100 text-foreground leading-relaxed">
          <BoldText text={line} />
        </li>
      ))}
    </ul>
  );
};

const CompanyResearchPanel = ({
  isOpen,
  onClose,
  companyName,
  strategy,
}: {
  isOpen: boolean;
  onClose: () => void;
  companyName: string;
  strategy: CompanyStrategyVariant;
}) => {
  const rows = strategy.researchTable ??
    strategy.sections.map((s) => ({ category: s.heading, content: s.body }));

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          key="research-panel"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.8 }}
          className="fixed top-12 right-0 bottom-0 w-[640px] max-w-[80vw] z-40 flex flex-col bg-card border-l border-core-subtle shadow-400"
          aria-label={`Company research — ${companyName}`}
        >
          <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-core-subtle shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <TrellisIcon name="artificialIntelligence" size={14} className="text-trellis-magenta-900 shrink-0" />
              <h2 className="heading-200 text-foreground truncate">
                Company Research — {companyName}
              </h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="p-2 h-8 w-8 shrink-0"
              aria-label="Close research panel"
              onClick={onClose}
            >
              <X size={16} />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px] align-top">Topic</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="align-top font-medium whitespace-nowrap body-100 text-muted-foreground">
                      {row.category}
                    </TableCell>
                    <TableCell className="align-top">
                      <ResearchCellContent content={row.content} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {strategy.researchConflicts && (
              <div className="mx-4 my-4 rounded-[var(--borderRadius-200,8px)] border border-[var(--color-border-caution-default)] bg-[var(--color-fill-caution-subtle)] p-4 flex flex-col gap-2">
                <span className="heading-50 text-[var(--color-border-caution-default)]">
                  Key Conflicts & Data Gaps
                </span>
                <ResearchCellContent content={strategy.researchConflicts} />
              </div>
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default CompanyResearchPanel;
