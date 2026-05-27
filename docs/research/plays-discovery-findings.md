# Plays Discovery: Findings

**Last updated:** 2026-05-26
**Owner:** Eoin Ó Raghallaigh (Research/Design), co-led with Caity Corbin
**Window:** 2026-05-21 → 2026-06-04
**Companion doc:** [Plays Discovery Plan](../research-plans/plays-discovery-plan.md)

Working notes for the two-week Plays discovery, capturing the session-by-session findings.

---

## Sessions

### 1. Play creator deep-dive: Alex Riffle & Maura Cantoni (2026-05-22)

**Format:** 60-min 1:1 workshop · Eoin + Caity ← Alex Riffle, Maura Cantoni
**Fellow recording:** [Campaign creation process](https://hubspot.fellow.app/meetings/0mi2k4j7pv46no1usnghl4tc10/)

Discovery session with the revenue marketing team to walk through their end-to-end play creation workflow, from strategy through list build, sequence creation, stakeholder review, and the ongoing struggle to drive rep adoption.

#### Current process

Plays follow a structured Asana workflow with distinct phases: strategy definition, data analysis, list building, asset creation, stakeholder review, and adoption/activation. Every play starts with defining targeting criteria (which signals trigger the play, who the audience is) before any building begins. The team analyses database volume, win rates, deals closed in the segment (last 6–12 months), and ASP before committing to build. Clay enrichment is used when net-new companies need to be imported.

Recent plays bundle resources into a Lovable microsite (overview, demand buckets, target personas, views, sequences, pain points, value props, discovery questions, objection handling, proof points) as a single page reps can land on.

Plays originate two ways:

- **Top-down** from executives (John Dick, Katz, Ro) aligned with global themes like AEO at Spring Spotlight.
- **Bottom-up** from regional teams doing their own competitive and industry analysis.

The team organises plays into four categories: **industry, competitive, reactive** (ad-hoc requests from sales), and **global themes** (tied to twice-yearly product spotlights). They enter each quarter with agreed-upon play plans to align with integrated campaigns and go-to-market enablement (e.g., a competitive webinar in late May feeding a June prospecting motion). 2026 has shifted noticeably toward centralised, globally aligned priorities versus prior years' more regional/bottoms-up approach.

#### Where it breaks

1. **List building in Portal 53 is the single biggest time sink.** Segments load slowly and the process is iterative: check volume, adjust filters, re-check. Company segments are built first, then contact-level filters (hub persona, job titles) are overlaid. Final views are dynamic, filtered by *contact owner is me*, so each rep sees only their owned contacts.

2. **Filter sprawl is unmanageable.** Hundreds of filters exist in Portal 53, many flagged "do not use," with inconsistent labelling. Alex maintains a living document of standard filters but discovery of new ones is informal, driven by conversations with demand management rather than systematic updates. PVS was recently rolled out and converts better than Fit Score, but reps don't know it exists; some still ask about deprecated ZoomInfo filters from years ago. This is institutional knowledge (Alex has 8 years at HubSpot), not scalable.

3. **Stakeholder approval is the second-biggest bottleneck.** Getting sales leaders and product marketing to give feedback on copy and messaging requires multiple rounds of review and creates launch delays.

4. **Cross-functional planning is short-horizon.** Go-to-market enablement plans only ~1 month out due to 2026 business volatility, making longer-term coordination hard.

5. **Executive-driven plays aren't always viable.** The team pushes back with data when volume is too low (the Monday competitive play was rejected on this basis); sometimes they work with demand management to assess whether new accounts can be purchased; sometimes they decline.

#### Sales adoption: the biggest current struggle

> "Half the battle, or more, is just getting plays in front of reps."

- **Reps clone sequences** and rebrand them (initials, personal labels) rather than using team-provided sequences directly. This makes reporting more challenging.
- The cloning behavior appears **learned over time**, not driven by tracking concerns. Reps want ownership even when not making meaningful changes.
- Classic sales rep belief: "if I didn't make it, it won't work." Changing this needs data-driven proof.
- The team still gets attribution from **first-generation clones**, so they're not incentivised to prevent cloning entirely; they tolerate minor modifications (sentence tweaks, link swaps, meeting links).
- Plays are communicated through layered channels: VP launch emails, manager + director Slack messages, coordinated power-hour blitzes.
- Without active change management (contests, blitzes, rep credibility stories), only a small subset of reps adopts; the rest default to status quo.

#### Sequencing and messaging

- The team has built a **Claude-based tool** to draft sequences from best practices and historical data; humans refine.
- They are **removing links from emails**. Data shows higher bounce rates and spam triggers. Some sales managers push back, viewing it as limiting.
- Messaging feedback is highly subjective: one manager called sequences "trash" for lacking curiosity statements despite the sequences performing well in the data.
- Initial reaction to a workspace sequencing agent: cautiously interested but want a **hybrid** where AI does the bulk and humans retain quality/strategic alignment. Close partnership with product marketers on persona-appropriate messaging is non-negotiable.

#### Segment nuance (important for concept design)

- **Small business sellers** focus on high-volume outreach; mass enrolment is acceptable.
- **Upmarket reps** should take a target-account approach: lower intent, high fit, *not* mass enrol contacts.
- High personalisers convert more than mass enrollers; this is a former-sales-manager observation, not just a hunch.
- No automation capabilities exist on the revenue marketing side today.

#### Measurement gaps

- Only sequences are submitted to Looker and tmac. Sequence cloning creates attribution gaps; the team can't see a complete picture of play performance.
- HubSpot switched to a new attribution model at the start of 2025 based on trackable assets (primarily sequences). Pre-2025 data is not comparable; lists were huge and unstandardised.
- Unlike marketing emails (controlled sends, known list size), play performance depends entirely on rep usage, which varies wildly by campaign.
- Target is a minimum **70% work rate** on lists. The team tracks enrolments, reply rates, conversion, but with only one year of standardised history.
- MOPS suggested measuring by **deals per rep** or **pipeline per rep** for different campaign types, rather than total outcomes, to control for variables.

#### Workspace vision: what Alex and Maura want

- Plays live in the workspace, surfaced weekly to reps, with new-badges and push notifications.
- A regular update cadence (e.g., beginning of each month) would eliminate the need for big launch emails and Slack blitzes.
- The team would **happily let go of activation and adoption-driving** if the workspace provides the trust, credibility, and reporting that managers use to drive accountability, freeing them to focus on strategy and the creative process.
- They want **one sequence per play** surfaced through the workspace that reps enrol into directly (vs. clone + modify), to fix the attribution problem.
- Quality control and persona-appropriate personalisation must be preserved.

---

## Rolling synthesis

To be filled in as sessions occur. Reserved for the four outputs the plan commits to.

### Current-state map

[insert mermaid diagram]

Anchors so far (from Alex & Maura):

- Creators today: Alex's NAMM revenue marketing team (Alex + 3 ICs).
- Tooling: Portal 53 (lists, filters), sequences in 53 (drafted in Claude), Asana (project management), Lovable (microsites fo enablement materials).
- Handoffs: PMM for copy/value props, sales leaders for approval, VP/director/manager for launch comms, GTM enablement for coordination.

### Jobs to be done

TBA

### Measurement open questions

*Living list for the ops/analytics DRI.*

Current entries from session 1:

- Attribution model changed Jan 2025; how do we benchmark a play given only one year of comparable data?
- How do we attribute when reps clone sequences? Is first-gen-clone attribution sufficient, or should the workspace force a single sequence per play?
- What's the minimum measurement bar leadership will accept to say "this play worked"?
- Is deals-per-rep / pipeline-per-rep the right unit of measure across campaign types? MOPS suggested it.
- How do we account for the rep-usage variable, given play performance fully depends on rep adoption?
