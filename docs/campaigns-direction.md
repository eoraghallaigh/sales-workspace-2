# Campaigns — direction and open questions

**Last updated:** 2026-05-20
**Source meeting:** Campaigns Sync, 2026-05-18 — Eoin Ó Raghallaigh, Lucy Alexander, Alicia Chui
**Full transcript:** `.context/attachments/Campaigns Sync 18 May 2026.txt`
**Status:** Pre-PRD. Campaigns was a Q2C2 commitment but is being **descoped from Q2C2** and likely pulled into Q3C1 (or later) once a working group lands on the model.

---

## Headline decisions

1. **Descope from Q2C2.** Too many open questions on the operating model, measurement, and ownership to send engineering down a build path now. Risk of building something that gets re-philosophised mid-cycle.
2. **Not agentic in v1.** Manual creation flow first. Agents are non-deterministic; reps with a campaign already in mind will fight the agent, bail to manual, and never return. Agentic discovery (e.g. "find me new segments to target") is interesting later but not the wedge.
3. **We do not own the pipe-gen outcome.** Lucy synced with Kieran on this. A marketing team owns creating, vetting, and tweaking campaigns. Our team builds the surface; another team owns the content and the conversion outcome.
4. **Working group forming.** Lucy is spinning up a group with: the marketing manager who would create campaigns + an analytics partner Kieran Egan is assigning + the triad. Goal: fleshed-out PRD before engineering starts.

---

## The conceptual model (working)

Two distinct shapes, currently lumped under "campaigns":

### Always-on plays
- Standing, vetted views (Salesforce switchers, new hires, closed-lost, etc.).
- Replaces today's "static views" under the *Other* bucket — rebranded with intentionality (what is this play, why does it exist).
- **No completion criteria.** These exist to *expose* companies worth working, not to add a clear-the-list obligation on top of P1–P4. Lucy is explicit: don't create competing definitions of done that conflict with the BoB P-bucket model.

### Time-bound campaigns / play of the day
- Company focus areas (credits, agents, AEO right now) or a daily push.
- *Might* need completion criteria — but only here, because leaders want accountability ("did my rep actually action the AEO play?").
- Measurement modelled on Nooks: daily action rate ("we said work these today; how many did you act on?") + downstream conversion within N days.

The differentiator vs. "just more views/dashboards in 53":
- **Centralized + opinionated** (the company tells you which views to work)
- **Vetted filters** (rep trust is burned by un-vetted lists pointing at companies that won't buy)

---

## Implications for design

- **Creation flow can proceed in skeleton form.** The basic shape is settled: a creator picks settings, applies filters, pushes a view into the workspace. The Lovable / current loom captures this. Safe to keep iterating on the creation UX while the operating model is debated.
- **Don't design completion-state UI for always-on plays.** No progress bars, no "100% complete" framing. Save that pattern for play-of-the-day if/when it lands.
- **Don't conflate always-on with play-of-the-day in the same surface treatment.** Lucy is leaning toward separating them visually — they have different jobs.
- **Filter curation is the real unlock.** The core problem isn't "build a campaign builder" — it's that there are too many properties in HS53 and not enough people who know which filters matter. Design needs to assume a curated subset, set by ops/marketing, not the full firehose.
- **Avoid stacking new rep obligations.** Eoin's concern in the meeting: reps already have QLs + P1–P4. Adding "and finish your campaigns" risks overload. The always-on framing (exposure, not obligation) is the answer.
- **Measurement framework needs to exist before campaigns ship.** Not our team's deliverable, but the surface needs to support whatever the analytics partner defines (likely action rate + conversion windows). Worth flagging in the PRD draft.

## Implications for the roadmap

- BoB / Priority Prospects (current in-flight) is unaffected — keep momentum.
- Campaigns slips out of Q2C2. Either Q3C1 with a tight PRD, or later.
- Plenty of BoB optimisations and agent-side work in the backlog to keep engineering busy in the meantime.

---

## Open questions for the working group

- Always-on vs. time-bound — one surface or two?
- Where exactly does completion criteria live? (Lucy: probably only play-of-the-day; needs confirmation.)
- Who sets and maintains the curated filter set? (Verbal yes from one marketing team; not formalised.)
- Apples-to-apples experimentation framework — what does it look like, and how much does the surface need to support it?
- How do we represent the overlap when a company is in multiple plays AND is a P1? Whose definition of "done" wins?
- "Rep-driven plays" / saved-views-as-campaigns — Alicia raised that the rep request for saved views is adjacent. Do reps get their own campaign-like surface that they can share with their team?

---

## Pointers

- Eoin's loom + Lovable clone — the current artifact the team is reacting to. Treat as direction, not committed design.
- Nooks' reporting model is the reference for daily action-rate + downstream conversion measurement.
- Looker is where the campaign data lives today; whoever owns measurement will need to wire that up.
