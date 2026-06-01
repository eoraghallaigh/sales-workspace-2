# Plays — direction and open questions

**Last updated:** 2026-05-29
**Source meetings:**
- Campaigns Sync, 2026-05-18 — Eoin Ó Raghallaigh, Lucy Alexander, Alicia Chui · `.context/attachments/Campaigns Sync 18 May 2026.txt`
- Measuring the success of prospecting plays, 2026-05-29 — Eoin Ó Raghallaigh, Josh Chang (Sales/Marketing Ops) · `.context/attachments/8V2QoX/Measuring the success of prospecting plays_2026_05_29_17_31_CEST_Transcript.txt`

**Status:** Pre-PRD on the operating model, but the **rep-experience slice has a firm date: global rep launch + enablement Aug 3, 2026** (July alpha/MVP, beta with ~10–20 reps beforehand). The **play *creation* experience is deferred past August** — Aug 3 is a rep-enablement moment, so the rep experience is the focus. Creation stays manual for now.

---

## Headline decisions

1. **Descope from Q2C2.** Too many open questions on the operating model, measurement, and ownership to send engineering down a build path now. Risk of building something that gets re-philosophised mid-cycle.
2. **Not agentic in v1.** Manual creation flow first. Agents are non-deterministic; reps with a play already in mind will fight the agent, bail to manual, and never return. Agentic discovery (e.g. "find me new segments to target") is interesting later but not the wedge.
3. **We do not own the pipe-gen outcome.** Lucy synced with Kieran on this. A marketing team owns creating, vetting, and tweaking plays. Our team builds the surface; another team owns the content and the conversion outcome.
4. **Working group forming.** Lucy is spinning up a group with: the marketing manager who would create plays + an analytics partner Kieran Egan is assigning + the triad. Goal: fleshed-out PRD before engineering starts.

---

## The conceptual model (working)

Two distinct shapes, currently lumped under "plays":

### Always-on plays
- Standing, vetted views (Salesforce switchers, new hires, closed-lost, etc.).
- Replaces today's "static views" under the *Other* bucket — rebranded with intentionality (what is this play, why does it exist).
- **No completion criteria.** These exist to *expose* companies worth working, not to add a clear-the-list obligation on top of P1–P4. Lucy is explicit: don't create competing definitions of done that conflict with the BoB P-bucket model.

### Time-bound plays / play of the day
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
- **Filter curation is the real unlock.** The core problem isn't "build a play builder" — it's that there are too many properties in HS53 and not enough people who know which filters matter. Design needs to assume a curated subset, set by ops/marketing, not the full firehose.
- **Avoid stacking new rep obligations.** Eoin's concern in the meeting: reps already have QLs + P1–P4. Adding "and finish your plays" risks overload. The always-on framing (exposure, not obligation) is the answer.
- **Measurement framework needs to exist before plays ship.** Not our team's deliverable, but the surface needs to support whatever the analytics partner defines (likely action rate + conversion windows). See the dedicated section below.

## Implications for the roadmap

- BoB / Priority Prospects (current in-flight) is unaffected — keep momentum.
- Plays slipped out of Q2C2, but the **rep-experience slice is now firmly targeted for Aug 3, 2026** (July alpha, beta with ~10–20 reps before). The operating-model/creation work continues behind that date.
- Plenty of BoB optimisations and agent-side work in the backlog to keep engineering busy in the meantime.

---

## Measurement & attribution (Josh Chang sync, 2026-05-29)

Josh Chang leads Marketing Ops & Strategy (central ops, reports to Kieran Egan; long history with revenue-marketing measurement; works closely with Lucy + Mintus/Mentis). No concrete design actions came out of this sync, but it set the measurement direction.

- **Attribution is the core problem — and it's a trust/judgment problem, not a technical one.** The pattern keeps repeating: revenue marketing was attributed via dashboard views → reps cloned dashboards → marketing got "too much credit" in sales leaders' eyes → trust in the number eroded → pulled back. Same dynamic now with sequences: marketing gets credit when its sequence is used, but reps clone sequences and attribution leaks after the 1st-gen clone. You can attribute however you like and none of it is "right"; the goal is a metric trusted enough to answer one question — **"is it worth running this type of play?"** ("Marketing drove all revenue" is true but useless.)
- **No framework to measure plays exists today.** Plays get run, then the team digs for data to prove it worked, rather than setting targets/baselines first. Output metrics (deal creation, velocity, close rate) are too noisy to isolate — the AEO blitz drove the year's highest deal-creation day, but John was simultaneously pushing sales leaders on pipe-gen that same week. "What does good look like" is undefined; there are no baselines.
- **Productizing plays in the workspace strengthens attribution** (Josh agreed). We get concrete signals: rep was on the play page, read the enablement, clicked into a company *from* the play, enrolled the contact. Lean on these over noisy output metrics.
- **AI-generated sequences reduce clone leakage.** Because reps edit (not freely clone-and-recreate) the agent's sequence, attribution survives — an attribution benefit of the agentic design, not just a UX one.
- **P1-in-a-play overlap:** Eoin's POV — if a company is in a play and the rep works it, attribute to the play even if they arrived via the P1 list, because they saw the play membership. Josh: never perfectly clean, but defensible with enough data points (on P1 list + in specific play + clicked in).
- **Recommended first step:** inventory *all* trackable data (noisy output metrics AND the concrete page/activity signals the product enables), then define measures of success vs. things we don't care about. Build the framework before running, not after.
- **Experimentation options, all imperfect:** clean split test (hard in sales — control teams feel disadvantaged; though if they complain, that itself signals value); region/segment comparison (Nordics vs UKI); time-series with baseline + outlier removal. Incrementality ("what would've happened without the play") is the genuinely hard part.
- **Next steps:** Josh to follow up with Eoin + Lucy on approach + resourcing (resourcing is the constraint); wants a sales-ops lens. Pull in Gary Zhao (product analyst) for tracking depth.

---

## Open questions for the working group

- Always-on vs. time-bound — one surface or two?
- Where exactly does completion criteria live? (Lucy: probably only play-of-the-day; needs confirmation.)
- Who sets and maintains the curated filter set? (Verbal yes from one marketing team; not formalised.)
- Apples-to-apples experimentation framework — what does it look like, and how much does the surface need to support it?
- How do we represent the overlap when a company is in multiple plays AND is a P1? Whose definition of "done" wins? (And on the measurement side: how is the conversion attributed when both the P1 list and the play touched it?)
- What level of attribution fidelity is "good enough" to build trust without over-crediting marketing? What's the agreed baseline / definition of success, set *before* a play runs?
- "Rep-driven plays" / saved-views-as-plays — Alicia raised that the rep request for saved views is adjacent. Do reps get their own play-like surface that they can share with their team?

---

## Pointers

- Eoin's loom + Lovable clone — the current artifact the team is reacting to. Treat as direction, not committed design.
- Nooks' reporting model is the reference for daily action-rate + downstream conversion measurement.
- Looker is where the play data lives today; whoever owns measurement will need to wire that up.
- **Measurement partners:** Josh Chang (Marketing Ops & Strategy, owns the attribution lens) and Gary Zhao (product analyst, tracking depth).
- Enablement materials are delivered as **Lovable microsites** built by revenue marketing; reps' current job is just to enrol the play's contact list in the sequence.
