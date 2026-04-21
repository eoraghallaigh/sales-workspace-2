# Flywheel Sales Workspace

> A single workspace to view and engage all of a rep's prospects.

This project designs and builds prospecting experiences for HubSpot's SMB sales reps (SDRs and Growth Specialists) inside the Sales Workspace. The north star is reducing CAC by giving reps a trustworthy daily cockpit that replaces fragmented dashboards and lets them prioritize, multi-thread, and take action without leaving the workspace.

**Owner:** Eoin Ó Raghallaigh (Research/Design) · **Org:** Flywheel Product (FPL)

---

## How to use this repo as a thought partner

When I ask for help designing features, proposing ideas, or reviewing concepts:

1. **Ground suggestions in the current roadmap** (`docs/roadmap.md`) — don't propose things that conflict with committed work or miss current priorities.
2. **Anchor rationale in customer evidence** (`docs/customer-feedback.md`) — cite specific rep problems, not generic best practices.
3. **Check design principles** (`docs/design-principles.md`) before proposing UI patterns.
4. **Consider the target user** (`docs/personas.md`) — SDRs and GS reps have different contexts; don't conflate them.
5. **Respect in-flight PRDs** (`docs/prds/`) — if a feature is already spec'd, extend it rather than reinventing.

When context is missing or stale, **ask before assuming**. Flag when a doc looks out of date (each doc has a `Last updated` line).

---

## Key docs

### Always read first
- [Business goals & OKRs](docs/business-goals.md)
- [Roadmap & current priorities](docs/roadmap.md)
- [Design principles](docs/design-principles.md)

### Read when relevant
- [Customer feedback themes](docs/customer-feedback.md)
- [User personas](docs/personas.md)

### Active PRDs
- [BoB in the Workspace — Priority Prospects view](docs/prds/prd-bob-workspace.md) *(Alpha Dec 8, 2025 · GA Feb 1, 2026)*

---

## Working directory conventions

- `docs/` — living product context (goals, roadmap, feedback, principles, personas)
- `docs/prds/` — individual PRD summaries, one per feature
- `.context/` — workspace scratch space (gitignored); attachments, notes, todos
- `Downloads/` — raw artifacts pulled in from Drive, Figma, etc. Treat as source material, not canonical.

---

## Stack context

The user works on HubSpot projects. Global rules in `~/.claude/CLAUDE.md` apply (CHIRP, Trellis, `bend` tooling, Immutables, etc.). This workspace is primarily design/product work, not code — but any frontend prototyping should follow HubSpot frontend conventions.
