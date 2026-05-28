# Plays Discovery: Findings

**Last updated:** 2026-05-28
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
- Unlike marketing emails (controlled sends, known list size), play performance depends entirely on rep usage, which varies wildly by play.
- Target is a minimum **70% work rate** on lists. The team tracks enrolments, reply rates, conversion, but with only one year of standardised history.
- MOPS suggested measuring by **deals per rep** or **pipeline per rep** for different play types, rather than total outcomes, to control for variables.

#### Workspace vision: what Alex and Maura want

- Plays live in the workspace, surfaced weekly to reps, with new-badges and push notifications.
- A regular update cadence (e.g., beginning of each month) would eliminate the need for big launch emails and Slack blitzes.
- The team would **happily let go of activation and adoption-driving** if the workspace provides the trust, credibility, and reporting that managers use to drive accountability, freeing them to focus on strategy and the creative process.
- They want **one sequence per play** surfaced through the workspace that reps enrol into directly (vs. clone + modify), to fix the attribution problem.
- Quality control and persona-appropriate personalisation must be preserved.

---

### 2. Prospecting agent walkthrough: Maura Cantoni (2026-05-27)

**Format:** 30-min walkthrough · Eoin + Anirudha Simha (eng) + Caity ← Maura Cantoni

Showed Maura the prospecting agents being built into the workspace (company research, sequencing) so she could see how they'll interact with plays. Half walkthrough of our work, half open conversation about how plays slot in.

#### What we showed

The current rep experience first: PPF framework with P1–P4 buckets, recommended contacts, recent conversions and touches. Engagement expectations differ per bucket (P1: 5 touches in 14 days; P2: 10 touches in 90 days; P3 high-intent but low-value so lighter; P4 no expectation). Maura asked for the doc that lays this out, so I shared the BoB expected rep engagement resource in DMs.

Then the prototype: click Work on a company and the agents pop a research summary, recommended contacts, and a pre-generated sequence for each contact that the rep can edit inline and enrol with one click. Outreach is the missing piece in today's workspace. Agents fill it.

Then the plays surface we mocked in Lovable: active plays list, individual play page with targets, dates, enablement materials. The key point: working a play is the *same* experience as working a P-bucket company. The rep opens the company and the research and sequencing agents know it's part of a play, so the output is tailored accordingly. There isn't a separate "play execution" mode.

#### Tension between play "done" and P-bucket "done"

P1s have a hard engagement bar: 5 touches across emails and calls in 14 days. A play might define done as "enrol one contact in the sequence." These two definitions of done can sit on the same company at the same time. We don't have an answer yet, but it's a real overlap to design for.

#### What landed for Maura

> "I like that they can edit some of the sequences. I think it's really cool and I think servicing plays in this space is going to be awesome."

- The unified execution experience. She immediately started asking how plays and P values merge: through the outreach, through the research agent conditioning on which play a company is in. "Just basically merging all the worlds together" was her phrase.
- Enablement materials surfaced inline on the play page. She still wants to link out to the Lovable microsite for the long tail of resources, since the Lovable page stays dynamic and is the source of truth. Inline + link is the right shape.
- Heads-up that Maura is building a "prospecting HQ" in Lovable with the upmarket revenue marketing lead. Talk tracks, positioning, tools. Worth a two-way link with the workspace when it lands.

#### Agents under the hood (Anirudha walkthrough)

The research agent works two-pronged. A CRM Analyst tool pulls internal data (company snapshot, contacts, touches, communications). An external path visits the company website and does Google searches. The output is a research report at whatever depth the rep asks for. Tool calls are visible by design. Transparency is a deliberate choice — reps and Maura's team should be able to see what the agent looked at and why.

The sequencing agent needs research as a prerequisite. It then pulls the rep's tone of voice from prior comms using an existing HubSpot tool, searches existing sequences if the rep already has one in mind, and otherwise generates a 5-touch PROVES sequence (3 emails, 1 LinkedIn message, 1 video task) seeded from prompts other sales reps have used. Calls can be added on request but aren't in the default.

Create-sequence-in-53 isn't built yet. The sequences team is building the API surface. Right now the agent produces the content; enrolling it via the real sequences feature is the next integration.

#### Cross-pollination ideas

1. **Reverse the research agent to find companies for a play.** I asked: instead of plays defining the company list up front and the research agent enriching it after, could the agent itself identify which companies fit a play? Anirudha: in principle, yes. The LLMs are commodity. What matters is the context and tooling. If we tell it what makes a good company for, say, "Salesforce switchers with contract ending" *and* give it CRM access, it can rank candidates. Website signals like "they're on WooCommerce" (which came up in the live demo) are exactly the kind of thing a rep can't easily filter on but an agent can.

2. **Share sequence best practices between Maura's Claude tool and our agent.** Maura's team has a Claude-based template that bakes in data-driven choices (e.g. no links in emails). Our agent doesn't know any of this. Two options: connect to Maura's existing Claude skill, or consolidate the best practices into a living doc that both reps and the agent can read via Alexandria. Anirudha preferred the living doc. Humans and the LLM use the same source, and transparency holds.

#### The trade-offs to keep tracking

Plays today exist in part because revenue marketing writes sequences and gets attribution when reps enrol. If the agent writes sequences in the workspace instead, three things have to be figured out:

- **Consistency for reps.** If revenue marketing keeps owning sequence creation, the rep's experience inside a play looks different from their normal agent-driven flow. That's the exact friction we're trying to remove.
- **Attribution for revenue marketing.** If the agent writes the sequences, how does Maura's team prove the play worked? Probably by attributing the *company work* (any rep action on a company in the play counts) rather than the sequence enrolment. But that needs design.
- **Quality.** Whatever best practices Maura's team has accumulated need to live somewhere the agent can read.

Nothing to answer this week. These are the live tensions to keep surfacing as the design firms up.

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

For the revenue marketing play creators (Alex's NAMM team: Alex + 3 ICs including Maura). Synthesised from sessions 1 and 2. Each job leads with the JTBD statement and then the context that anchors it in observed evidence.

#### 1. Decide whether a play is worth building

**When** a play idea is originated, **I want to** assess volume, win rates, deals closed in the segment over the last 6–12 months, ASP, and competitive timing fast, **so that** I can validate the play viability before my team invests in the build.

This is the first phase of Alex's Asana template. The Monday competitive play was the example of pushing back: volume worked out to roughly one account per rep, even after demand management priced out net-new accounts. Alex declined the build and the team handed it to GTM enablement instead.

> "There's not enough opportunity here from our perspective to constitute a prospecting play." — Alex

#### 2. Translate the strategy into a vetted list

**When** the play's strategy is approved, **I want to** create a list of companies and/or contacts for each rep to work using a standard set of verified working filters, **so that** each rep opens the play, sees only the accounts they own, and can execute the play right away.

This is a big time sink in the current flow. Segments load slowly, the loop is iterative (check volume, adjust filters, recheck), and the filter set itself is unstable — hundreds of filters in P53, many flagged "do not use," and new ones (PVS) supersede old ones (Fit Score, ZoomInfo) on a cadence reps and most marketers don't track. Alex maintains a living standard-filters doc but discovery is informal. "A lot of this is tied to institutional knowledge and the fact that I've been here for eight years. It's not very scalable."

#### 3. Build the supporting enablement assets

**When** the list is locked, **I want to** draft the talk tracks, value props, discovery questions, objection handling, and proof points that go with the play, in partnership with PMM, **so that** reps have credible, persona-appropriate content to back up the outreach.

Final assets get bundled into a Lovable microsite (the April AEO launch is the reference) so reps have one page to land on. 

#### 4. Make sure the sequence output adheres to our best practices

**When** sequences are being created for a play, **I want to** make sure the output adheres to our team's best practices (no links because bounce and spam rates go up, PROVES structure, PMM-aligned value props per persona), **so that** the messaging performs and stays consistent with the strategy.

Today the team creates the sequences themselves using a Claude-based tool seeded with the team's best practices and historical data, then refine the output. How sequences are created for plays in the workspace is an open design question. One possible solution is that Maura prompts our sequencing agent the same way she prompts Claude today, with her play-specific prompt injected above the agent's system prompt. Plays then use the same authoring mechanism as non-play sequences, but with her steering on top. So the sequences are still created and pushed into the workspace by the sequencing agent, which gives the rep a consistent execution experience, but Maura and team can still maintain oversight.

> "Maybe there's a world in which AI does the bulk of the work, but then there's still this human touch." — Maura

#### 5. Get stakeholder sign-off without a two-week chase

**When** the assets are drafted, **I want** sales leaders and product marketing to review and approve copy and messaging in one or two passes, **so that** the play can launch on time.

Tied with list-building as the longest part of the cycle. Maura: "Getting finalised assets, getting feedback, getting those all ready to launch from our sales leaders can take time. Everyone's super busy."

#### 6. Drive rep adoption of the play

**When** a play is ready to launch, **I want** reps to be aware of it, find it, and use it, **so that** the work my team put into building it isn't wasted.

Today this is a layered launch campaign for every play: VP launch emails the team drafts, manager and director Slack pings, coordinated power-hour blitzes. Necessary work, but it eats a lot of cycles, and adoption is still patchy without active change management. Alex: "Half the battle, if not more, is actually getting it in front of reps and getting them using it. That's a consistent battle."

If the workspace became the single homebase for plays, that would make adoption much easier to drive. Alex's stated dream is to "let go of the activation and driving adoption piece" entirely, but conditional on reps trusting plays in the workspace the way they're starting to trust P-bucket prospecting, and managers being able to drive accountability through workspace reporting.

> "I would love to let go of that. I would love to give the reps that, and then I would love to give them really great reporting that managers can use to drive accountability and follow through. And then I would love to just like never have to worry about that again personally." — Alex

Maura hard-agrees but cautions that some launch work still needs to happen. In the workspace future she expects "less slack, less emails", but still wants structured positioning. The shape she described: blitzes that say "okay, we're gonna schedule a couple blitzes every Wednesday, go to the workspace, filter to this play and run it" rather than "we're live with this play, here's the link." So the launch campaign shrinks, it doesn't disappear.

#### 7. Cap how many plays a rep is asked to work at once

**When** I'm queueing up the team's plays, **I want to** keep the active play set per rep at around 3–5 at any given time, **so that** reps actually engage with each one instead of treating the queue as noise.

The team currently runs about one play per month, but reps can keep working a play after its launch month, so the active set accumulates. Maura's working recommendation is 3–5 concurrent plays per rep, pending sales feedback on what's manageable. Same balancing act flagged in session 1: keep plays top of mind without creating noise reps will tune out.

> "We would likely want to limit the amount of plays reps have at a time… my recommendation would be to have around 3–5 plays available to reps at a time but I would be curious to get sales feedback on what amount would be manageable." — Maura

#### 8. Know whether the play worked

**When** the play is running and after it ends, **I want to** see who used it, how, and whether it produced pipeline, **so that** I can iterate, push back when leadership asks for the wrong thing, and justify the team's work.

Sequence enrolment is the only trackable asset today. Reps frequently clone sequences and marketing team only get attribution on first-generation clones. Pre-2025 data isn't comparable because the attribution model changed. The working target is a 70% work rate on lists. The session 2 wrinkle: if the agent writes sequences in the workspace, attribution probably needs to shift from sequence enrolment to *company work* on any company in the play.

#### 9. Keep messaging quality and persona fit when the agent writes the sequences

**When** the prospecting agent drafts sequences in the workspace, **I want** the data-driven best practices (no links, PROVES structure, PMM-approved value props per persona) and the rep's tone of voice baked into what the agent produces, **so that** messaging doesn't drift into rep-vibes-based feedback like "there aren't enough curiosity statements."

This emerged in session 2 as the live tension. Maura is open to "AI does the bulk and humans retain quality and strategic alignment." The proposed shape is a living best-practices doc the agent can read via Alexandria, with the same doc visible to reps so transparency holds and rep credibility is preserved.

### Measurement open questions

*Living list for the ops/analytics DRI.*

Current entries from session 1:

- Attribution model changed Jan 2025; how do we benchmark a play given only one year of comparable data?
- How do we attribute when reps clone sequences? Is first-gen-clone attribution sufficient, or should the workspace force a single sequence per play?
- What's the minimum measurement bar leadership will accept to say "this play worked"?
- Is deals-per-rep / pipeline-per-rep the right unit of measure across play types? MOPS suggested it.
- How do we account for the rep-usage variable, given play performance fully depends on rep adoption?

From session 2:

- If the agent writes the sequence (not revenue marketing), how does revenue marketing get attribution for the play? Probably company-work attribution rather than sequence enrolment, but needs design.
- How do we reconcile P-bucket "done" (e.g. 5 touches in 14 days for a P1) with play "done" (e.g. enrol one contact) when both apply to the same company?
