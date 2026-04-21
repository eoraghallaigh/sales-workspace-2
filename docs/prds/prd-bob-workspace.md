# PRD Summary — BoB in the Workspace (Priority Prospects view)

**Last updated:** 2025-10-03 (PRD) · summary written 2026-04-21
**Source:** `.context/attachments/[PRD] FPL Prospecting - BoB in the Workspace v1-v1.md`
**Status:** In Progress · **Alpha:** 2025-12-08 · **GA:** 2026-02-01

**Driver (PM):** Martina Locke · **Eng:** Alicia Chui · **Research/Design:** Eoin Ó Raghallaigh · **BSA/Strat&Ops:** Mike Sullivan, Lucy Alexander
**Aligned OGP:** Scale Downmarket — Automate SB Prospecting

---

## Why

Flywheel is reducing CAC by automating prospecting downmarket. The Feb 1 global launch of the new **Book of Business (BoB)** operating model for SMB needs a workspace view that makes reps more productive, not less.

Three rep problems today:

1. **Fragmented tracking** — reps consult multiple dashboards; visibility is lost once a task closes. Reps are asked to do more than automated tasks represent.
2. **Overwhelming P2 load** — high-effort proactive tasks (P2) arrive in bulk at month start; reps deprioritize them due to unclear direction.
3. **Narrow focus per company** — multi-threading is hard because P1/P3 tasks target a single contact.

**Vision:** a trustworthy daily cockpit — Sales Workspace → Prospecting → **Priority Prospects view** — that consolidates insights and enables deeper engagement across high-value companies.

## Who

SMB reps on Phase 1 BoB teams:
- **Growth Specialists (GS)** — manage deals
- **SDRs** — don't manage deals, but same prospecting automation/process expectations

## What — end-to-end

Rep lands in Workspace → Prospecting → Priority Prospects. Default view is **Unworked** companies across P buckets in priority order. Each company row expands to show:

- 1–5 recommended nested contacts, sorted by urgency, with task-presence and enrichment indicators
- Inline engagement/action buttons (email, call) — initiate outreach without leaving the view
- Snooze/dismiss at company or contact level
- Progress: # contacts worked, task status, signal tags
- Filtering: P bucket, industry, full company-property filters, quick filters (work status, signals, outstanding tasks)

## Functional requirements

### P0 (must-have, Alpha + GA)

| Area | Requirement |
|---|---|
| Company collapsed | Signal tags visible |
| Company collapsed | Count of open tasks (company + contacts) |
| Company collapsed | Progress toward 100% "worked" status |
| Contact list | 1–5 recommended contacts in expanded view, urgency-sorted |
| Contact preview | Open task count, required vs suggested, role title, date added to "53" |
| Engagement | Action buttons on contact; initiate without side panel |
| Filtering | Multi-filter by any company property |
| Quick filters | Work status, signals, PPF bucket, outstanding tasks; view-all-in-capacity |
| Side panel | Opens for company and contact previews |
| Dismiss/snooze | At company level from unworked view |
| Worked visualization | Depth-of-work reflects PPF/geo-specific definition |
| Mark as worked | Manual, single + multi-select |
| Priority order | Deterministic sort based on urgency + account potential |
| Reranking | View reranks after daily required action is taken |

### P1 (nice-to-have)

- Dismiss contact (not just company)
- Auto-close associated task when satisfying activity occurs (e.g. call task + call made)
- Auto-mark-as-worked when all criteria satisfied
- Auto-load next contact after one is dismissed

## Success metrics

**Primary KPI:** contacts worked per rep (by P bucket)
**Secondary:** successful task execution rate · workrate by bucket · avg contacts worked per account

## Release plan

| Stage | When | Audience | Exit criteria |
|---|---|---|---|
| Alpha | 2025-12-08 | 10 GS + AEs (mostly Nordics/Benelux under Sandra Kater; plus Katie Walsh's team) | No regression in task completion (measured by outcome, not object); no major usability blockers |
| GA | 2026-02-01 | All BoB reps globally | — |

*(PRD text reads "Feb 1, 2025" for GA — assumed typo given Alpha in Dec 2025.)*

### Alpha participants
Moa Stakeberg, John Brady, Iina Sintonen, Leigh MacFadyen, Emma Robinson (GS, Nordics/Benelux); Jurjen de Vries, Billy Morley (AE SMB, Nordics/Benelux); Abbie Bingham, Macey Montgomery, Logan Nichol (GS, Katie Walsh's team).

## Open questions

- What is the final depth-of-work requirement?
- Can reps dismiss *all* companies? Should this vary by P bucket or presence of open tasks?
- Are there guardrails on marking as worked?

## Related links

- [Figma — FPL Prospecting / New Business Automation](https://www.figma.com/design/cApjMAkCLLFgWO56WC9ETJ/FPL-Prospecting--%E2%80%A8New-Business-Automation?node-id=2758-177227)
- [UX Brief — SMB Prospecting Automation](https://docs.google.com/document/d/1bXZYeDPgDd-nTxmEBNgGhG04Xv-kvyxvHsDBCrKmc-o/edit)
- [Central Offsite Doc — Automating SB Prospecting Sept 23–25](https://docs.google.com/document/d/13EDXHb1Q2txglYdKRvJ7SFs7CYabalSuJV3gyQ7VRiY/edit)
- [BoB Plan to Set SLAs for all Priority Buckets](https://docs.google.com/document/d/1nHOLy1o1eyxWZ7cki7EEo-aX6w_VaPl7mFWmpHv7km8/edit)
- Lovable prototypes: [linear-knob-40132110.figma.site](https://linear-knob-40132110.figma.site/) · [lead-light-board](https://preview--lead-light-board.lovable.app/)
