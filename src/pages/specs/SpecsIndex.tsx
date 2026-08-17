import { Link } from "react-router-dom";
import { SpecLayout } from "./SpecLayout";
import { SpecHeader } from "./blocks";

interface SpecEntry {
  slug: string;
  title: string;
  description: string;
  category: string;
}

const specs: SpecEntry[] = [
  {
    slug: "feedback-popover",
    title: "Signal feedback popover",
    description:
      "The hover popover on signal chips with inline thumbs up/down feedback and a written feedback form.",
    category: "Component states",
  },
  {
    slug: "sequence-customisation",
    title: "Sequence customisation",
    description:
      "Scheduled starts, adjustable step timing, add/remove/reorder steps, and non-blocking manual tasks.",
    category: "Interaction flows",
  },
  {
    slug: "agent-configuration",
    title: "Agent configuration",
    description:
      "Custom instructions for the research and sequencing agents, with a live preview of agent output.",
    category: "Interaction flows",
  },
];

const categories = [...new Set(specs.map((s) => s.category))];

const SpecsIndex = () => (
  <SpecLayout>
    <SpecHeader
      title="Specs"
      description="Annotated screen flows, component state catalogues, and use case walkthroughs for engineers building from this prototype."
    />

    {categories.map((cat) => (
      <section key={cat} className="mb-12">
        <h2 className="detail-100 font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          {cat}
        </h2>
        <div className="space-y-3">
          {specs
            .filter((s) => s.category === cat)
            .map((spec) => (
              <Link
                key={spec.slug}
                to={`/specs/${spec.slug}`}
                className="block border border-core-subtle rounded-200 p-5 hover:border-trellis-blue-800 hover:bg-trellis-blue-300/20 transition-colors"
              >
                <h3 className="heading-50 text-foreground">{spec.title}</h3>
                <p className="detail-200 text-muted-foreground mt-1">
                  {spec.description}
                </p>
              </Link>
            ))}
        </div>
      </section>
    ))}
  </SpecLayout>
);

export default SpecsIndex;
