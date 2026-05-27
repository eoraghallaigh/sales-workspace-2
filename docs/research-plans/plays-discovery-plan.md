# Plays Discovery Plan

**Last updated:** 2026-05-20
**Owner:** Eoin Ó Raghallaigh (Research/Design), co-led with Caity Corbin
**Window:** 2026-05-21 → 2026-06-04 (two weeks)

---

## Background

We have wanted to ship a plays motion inside the Sales Workspace for a while. With BoB launches done and agent work in progress, Lucy is pulling Plays back into scope, targeting an alpha to reps in **July 2026**.

Today, plays are created by Alex Riffle's NAMM revenue marketing team (3 ICs under her), with parallel, often unsanctioned, play creation happening from sales managers, RO, and ad-hoc director emails. Alex's team's current delivery mechanism is **Lovable microsites** that bundle a 53 list, a sequence, and product-marketing assets. Reps prospect out of bespoke views and dashboards and frequently can't tell which pushes from the business are trustworthy.

Before we design anything, we need to understand the current state, the people who do this work today, and where the seams are. This document plans that discovery.

## Goals

1. Map the **current process** for creating, distributing, and measuring plays, including the unsanctioned channels.
2. Surface **jobs to be done** for the three personas this will touch: play creators, reps, and managers.
3. Identify **measurement and governance gaps** that need an ops/analytics partner to close.
4. End the two weeks with a **reactable concept design**: rough, not finished, so a smaller working group can argue about specifics rather than abstractions.

## Open questions

The questions discovery is meant to close, or at least sharpen, over the next two weeks. Sourced from prep notes and the 2026-05-20 kickoff.

### Operating model and measurement

- Who creates plays currently vs. who *should* create them?
- How many plays are running simultaneously? An audit of the last month / quarter would be a useful evidence base.
- What does "worked" mean? No consistent definition today; some views use "sales rep engaged with company in last 30 days," while P-buckets use different criteria.
- How do we measure and attribute play success? Companies often fit multiple plays simultaneously, making attribution murky. No agreed-upon framework yet.
- What are the play categories and completion criteria? The "always-on vs. time-bound" structure was proposed but not fully defined, especially around whether always-on plays should have strict completion requirements.
- Which filters / properties should be curated? A standardised, vetted set of prospecting-relevant properties is needed, but the validation work can't be done by the product triad alone.
- How does a play interact with PPF / QL priority?

### Governance and scope

- What does the governance and permissions structure look like? Who can publish to reps vs. propose?
- Regional customisation needs: what we learned from the Gong analyser work suggests reps over-estimate how much should differ by region. Where does customisation actually matter?

### Rep experience and tensions

- How much does a rep need to know that they're working against a play? Do they care?
- Are there incentives for reps to work against a play?
- Reps find it hard to context-switch and prefer batching, but PPF pushes the opposite. How do we strike the balance?
  - One idea: daily goals reps must hit, while still allowing batching inside those goals.
- We seem to be talking about two surfaces: how a play shows up to a rep, and the creation flow for a play. Which should be our first focus?
- Do we have issues with conflicting or clashing plays when a company is eligible for several at once?

## Out of scope

- Finalising the operating model for plays (always-on vs. company focuses vs. play-of-the-day). Lucy noted Ro has already pulled play-of-the-day off the table.
- Designing the agent ↔ play integration in detail. Education on agent capabilities is in scope so the working group designs with the right mental model.
- Solving governance/sunsetting of rep-created views. Out of scope as a deliverable; in scope as evidence-gathering for Lucy's leadership conversations.

---

## Approach

A two-week funnel: gather current state and stakeholder context in week 1, then draft a concept design that reps and managers react to in week 2.

- **Discovery is mostly 1:1.** Group workshops are reserved for synthesis and the final reaction session.
- **One discussion guide, four flavors.** Same spine across every conversation so the synthesis is apples-to-apples.

---

## Schedule

### Week 1: current state + stakeholder context (May 21–28)

| # | Session | Format | Participants | Duration | When |
|---|---|---|---|---|---|
| 1 | **Play creator deep-dive**: walk through the most recent play end-to-end (the Lovable microsite, the 53 list, sequence, sales handoff). Where it's slow, where it breaks. Also map who else creates plays today (sales managers, RO, ad-hoc directors, ops). | 1:1 workshop | Eoin + Caity ← Alex Riffle, Maura Cantoni | 60 min | This week |
| 2 | **Agents capabilities walkthrough**: Alex flagged this as a gap. Designing without it = designing for yesterday. | Group | Eoin + an eng partner → Alex, Maura, Caity, ops (if assigned) | 30 min | This week |
| 3 | **Ops/analytics intro**: what data exists today on play performance, what apples-to-apples could realistically look like. | 1:1 | Eoin + Lucy ← assigned DRI | 30 min | When DRI lands |
| – | **Internal synthesis block** | Working session | Eoin + Caity | 60 min | End of week 1 |

### Week 2: concept design + rep/manager validation (June 1–4)

| # | Session | Format | Participants | Duration | When |
|---|---|---|---|---|---|
| – | **Concept design draft** | Solo | Eoin | ~1 day | Start of week 2 |
| 4 | **Top pipe-gen rep sessions**: how they actually prospect, what they trust, what they ignore. | 1:1 listening sessions | Eoin + Caity ← 2–3 reps | 30 min each | Early week 2 |
| 5 | **Manager sessions**: how they decide what to push to their team, how they measure rep engagement on a play. | 1:1 listening sessions | Eoin + Caity ← 1–2 managers | 30 min each | Early week 2 |
| 6 | **Reaction workshop**: Eoin brings the concept design, group pokes holes. | Group workshop | Eoin drives, Caity, Alex's team, 1–2 reps, ops, Lucy (back from OOO) | 60 min | End of week 2 |
| – | **Final synthesis + concept revision** | Solo | Eoin | Half day | End of week 2 |

---

## Discussion guide

One guide, four flavors. Same spine: current state → pain points → wishes → guardrails. Don't read these verbatim; they're prompts for a conversation.

### Spine (every session, in some form)

- Walk me through your current process from the start.
- Where does it work? Where does it break?
- How do you know if it worked?
- If you could change three things, what would they be?

### Play creators (Alex, Maura, sales managers who create plays)

- Walk me through the most recent play you shipped, from idea to a rep working it.
- Where in that process do you spend the most time?
- Where does it break down? Where do you need to chase someone, or rebuild something from scratch?
- How do you measure whether the play worked? What data do you wish you had?
- Who else creates plays in your world? What do you think of their quality?
- If the workspace became the *only* place reps saw plays (no Slack pings, no director emails, no side microsites), what would change about how you reach reps today? What would you miss?
- If publishing a play to reps required going through a rigorous central process (vetted filters, measurement attached, a quality bar), what would you fight to keep about how you work today, and what would you happily route through that process?

### Reps (top pipe-gen)

- Walk me through how you decide what to work today.
- Of all the things pushed at you (signals, plays, lists, manager pings, emails from directors), which do you trust? Why?
- Tell me about a play you ignored. Why?
- Tell me about a play that worked for you. What made it different?
- How do you batch your day: do you work themes, or one company at a time?
- If you could remove three things from your prospecting day, what would they be?
- What would break your trust in a play enough that you'd ignore the surface entirely?

### Managers

- How do you decide what plays to push to your team?
- How do you know if your reps actually acted on a play?
- What's your role in deciding what reps work each day: do you set themes, or let them self-direct?
- What would the plays surface need to give you to be worth your attention?
- What's the cost to you when the business sends down a play that turns out to be low-quality?
- What would break your trust in the plays surface enough that you'd go back to managing your team's prospecting your own way?

### Ops / analytics partner

- What data exists today on play performance? Where does it live?
- What's the cleanest way to compare two plays apples-to-apples?
- What's the gap between rep engagement data (did they act?) and pipeline data (did it convert?)?
- What governance mechanisms are realistic vs. aspirational?
- What's the minimum bar for measurement quality you'd need before you'd stand behind "this play worked" to leadership?

---

## Outputs

By end of Week 2, the team walks away with:

1. **Current-state map**: who creates plays today, how, with what tooling, with what handoffs. Includes the unsanctioned channels.
2. **Jobs-to-be-done summary** for each persona (creator, rep, manager).
3. **Reactable concept design**: Figma or Lovable. Roughly: always-on plays + company focuses, with curated filters and a clear creator flow. Not pixel-perfect.
4. **Measurement open-questions list**: handed to the ops/analytics DRI as the agenda for their workstream.
