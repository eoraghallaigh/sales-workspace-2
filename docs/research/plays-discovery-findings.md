# Plays Discovery: Findings

**Last updated:** 2026-06-02
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

### 3. Ops/analytics intro: Josh Chang (2026-05-29)

**Format:** 30-min 1:1 · Eoin ← Josh Chang (Director, Marketing Ops & Strategy)

This is the ops/analytics intro the plan reserves for what data exists today and what apples-to-apples could realistically look like. Kieran pointed me to Josh. He leads marketing ops & strategy on central ops, supporting all of marketing (demand, top-of-funnel, revenue marketing, global events) across data, strategy, and insights. He's worked with Alex's team through every version of revenue marketing and sat in the old measurement debates, so he came in with the scar tissue already.

I walked him through the same prototype I showed Maura, then framed the two tracking problems. One is the rep side: are they adopting the play, is it converting? The other is the creator side: does revenue marketing get attribution? His first reaction set the tone:

> "That attribution tracking is always the bane of my existence."

#### Every attribution mechanism eventually gets cloned

Josh has watched this exact problem recur. Early revenue marketing attributed off dashboard views. Then reps cloned the dashboards and the signal broke. Then it was contacts and companies pulled into the database. The net result was revenue marketing getting too much credit, so the team pulled back, and they've been hunting for a middle ground ever since. The sequence-cloning gap we have today is the same pattern in new clothes. Any attribution hook we build that reps can clone or detach from will erode the same way. That's the case for the productized surface: the rep can't clone their way out of it.

#### Attribution is a trust problem, not a technical one

This was the most important thing he said, and it changes where the ops work should go. You can define attribution however you want, and none of it will ever be "right".

> "You can do whatever you want with attribution. You can say it's all sequences or you can say it's specific sequences… and none of it's going to be perfect, none of it's going to be right. We just need to get folks bought in across the board."

The real constraint isn't the pipes, it's credibility with sales leaders. Marketing could technically claim almost anything (they built the workspace, they sourced the whole database at some point), and the argument would be "true and fair but not helpful for making business decisions". The job is to land on a number sales leaders trust enough to act on. The failure mode that actually hurts is marketing claiming a play worked when it didn't.

> "The attribution needs to build the trust in the metric, and then the metric needs to support the business decisions we're making."

> "The last thing anybody wants is for them to take credit and say something's working when it's actually not."

I'd assumed making plays more visible would earn marketing more attribution, and asked Josh if that's a problem. His answer: it depends entirely on whether the higher number erodes sales leaders' trust. So the goal of the measurement work isn't to maximise marketing's credit. It's to produce a number sales leaders believe. That's as much a buy-in job as an analytics one.

#### There's no framework today, and plays are measured backwards

Josh told Lucy a couple of weeks ago that we have no framework to measure plays. The habit today is to run the play, then look for an uplift in deal creation, velocity, or close rate. Sometimes you see it. Mostly it's too noisy to isolate. His example: last week's AEO blitz was the single highest deal-creation day all year, but that only read clearly because it was one day. Over a normal play window, John is separately telling sales leaders to pump pipe creation, reps are incentivised to create deals that week anyway, and the play's signal disappears into everything else moving at once.

I pushed on this. Why isn't "reps who used the sequence created more deals" enough? It's the noise. Output metrics like deal rate and close rate are real but easy to confound, so a 3% lift can't honestly be pinned on the play. The deeper problem is the order we work in:

> "The way that we've run plays historically is we run the play and then we try and figure out if it worked, rather than establishing that framework first."

Plays launch with no targets and no baseline, and success gets reverse-engineered from whatever data looks good afterwards. Fixing that order, defining what good looks like before launch, is the biggest process change he's pointing at.

#### What "good" looks like, and the baseline problem

I asked what baseline or definition of "good" exists today. "Not really." Building one is the prerequisite work. He laid out the options, none of them clean:

- Time-series triangulation. Pick the launch date, estimate a pre-launch baseline with outliers removed, compare after. Doable, but weak on causality.
- Clean split tests or control groups. The only way to actually measure incrementality, which is what would have happened without the play. He's fighting the same gap on the upmarket sprints running now, where the goal is "improve deal creation" with no concrete definition of improve.
- Regional or segment comparison. Run it in one region (he mentioned a Nordics test), compare the change over time against a holdout like UKI. Imperfect, but time stops being the confound. The team has done this, always as a one-off.

The tension with sales is real. Any team that doesn't get the play complains it's disadvantaged that month. Josh's dry counter: if they're complaining, "then it obviously works if you guys want this."

#### Does productizing plays help? Yes, concretely

This was the encouraging part. Productizing the play surface gives ops something they've never had: first-party activity data. We can see the rep landed on the play page, whether they read the enablement material, that they opened the company from the play, and that they enrolled the contact.

> "It's basically easier to attribute and make the case that they found this company or they talked to this company because of this page… you have the data points to back that up. I think that is definitely viable."

The enroll-don't-clone sequence model helps for the same reason. Reps can edit but can't clone and detach, which closes the second and third-generation gap that has dogged every prior mechanism. So two of our core design bets, the productized surface and agent-authored sequences, are exactly the levers ops needs to make attribution defensible. Worth saying back to the team.

#### The P1-also-in-a-play overlap

I raised the case that came up with Maura too. A company that's both a P1 and in a play. Today the rep might work it for reasons unrelated to the play, which is where attribution gets murky. My position: if the rep opens the company, sees it's part of a play, and works it, it should count toward the play even if they never clicked the plays tab. Josh agreed you'll never divide the pie perfectly, but said the productized data is what makes a defensible split possible. If you can see the company was on the P1 list, and part of the specific play, and that the rep clicked in, you have enough to build a rule around. Solvable with data we'll now have, but it needs a deliberate rule, not a default.

#### Josh's method: inventory the cards first

His recommended first move, which he came back to a few times: don't reach for a framework yet. Inventory every signal we can track, both what exists today and everything the new design would make measurable, and treat that as the repository. Then sort it. Output metrics (deal and close rates, noisy) against activity signals (page views, reads, enrollments, concrete). Work out the gaps and how much confidence each signal earns. The framework falls out of laying all the cards on the table and deciding which ones we trust.

> "There's really clearly outlining what is possible and then what are the gaps, and then using that as your repository and then what is your degree of confidence based on the data that you do have and can track."

#### Next steps

- Timeline anchored. I told Josh the shape: alpha/beta in July with a small group of 10–20 reps, global rep enablement launch August 3rd. Tracking needs to be in place before that. He didn't flinch at the date, but flagged resourcing as the real constraint.
- Josh to come back early the following week to me and Lucy on how to think about this, and on resourcing. He wants a sales ops lens on it too. He can cover some, but expects to pull in others, and he'll loop Kieran.
- Gary Zhao, our product analyst, to be pulled in. He has deeper knowledge of what tracking is available and how it's wired.
- First task on us: start the signal inventory Josh described, every trackable event the productized play surface and the agent flow expose, so the ops workstream has cards to sort. This becomes the spine of the measurement open-questions list (plan output #4).

---

### 4. Play creator deep-dive, EMEA: Martina Simon (2026-06-02)

**Format:** ~50-min 1:1 · Eoin ← Martina Simon (Revenue Marketing Lead, EMEA)

Martina is Alex's equivalent in EMEA, and her SB lead Vitalia is the Maura equivalent. Lucy connected us because EMEA runs plays differently, and Roisin Hughes (VP, global) wants the EMEA model exported to the other regions. Martina walked me through her Play of the Month deck and had built a slide specifically to ask which parts of it we could take off her plate. So this was a current-state map and the "what would you fight to keep" conversation in one.

The headline: EMEA is not NAMM. Book of Business hasn't rolled out here yet, and the Play of the Month is a motion the other regions don't run. It's more elaborate, the team is more emotionally bought into it, and it earns real revenue on its own. Her repeated ask was "help us, but please don't hurt us".

#### Play of the Month is a themed monthly motion, not a list

A play in EMEA isn't a list of contacts to enrol. It's a month-long sprint on one theme, one way of talking about a product. May was AEO with a marketing-hub focus. The theme gets chosen in the third week of the prior month with the sales directors in the room (Stephen Higgins, Connor O'Malley, Martina, and her SB lead), so it tracks whatever the business is pushing. Upmarket picks the competitor takedowns, downmarket follows, and it's validated against data and audience sizing first.

The four-week cycle, as she laid it out:

- Theme selection, with the sales directors.
- Package build. The SB lead does discovery with managers on messaging, adapts the upmarket sequences for SB, and builds the deck and talk tracks. Sometimes a solutions engineer helps.
- Localization. Everything is built in English then localized for Nordics, UKI, France, DACH, and sometimes Iberia. DACH and France have double opt-in and data-compliance rules that change the wording.
- Launch. A kickoff session with all of SB sales and leadership, a 150-person Q&A, a live demo from the previous month's top rep, pre-arranged Slack posts, and dedicated blitzes.
- Competition. Funded from the rev marketing budget, with a leaderboard and cash prizes.
- Deal tagging and tracking. Deals get tagged in TMAC, and the leaderboard and reporting are built by hand in Looker and Excel.
- Wrap. Targets are set up front, and a tracker shows what percent of SB revenue the play drove.

#### The competition is the EMEA difference, and it drives revenue

This is the part NAMM doesn't do. Martina funds a competition out of her rev marketing budget, around £2k a month, reps compete on a leaderboard, and the prizes are real money. That's why she's protective of it. If we automate the motion and the way they leaderboard it changes, "the part that helps drive that extra bucket of revenue in a way goes away". Roisin wants the motion kept and is exporting it, and Martina is meeting central enablement leadership to defend it.

The benchmark she shared: a Play of the Month can produce 800+ deals at roughly a 34% win rate, ASP around 800. "It's the money in it."

#### Attribution runs on deal tags, not sequences

This is the most important measurement finding, and it's a clean difference from NAMM. EMEA attributes plays through deal tags in TMAC, not through sequences.

TMAC is the regional marketing campaign tracker, the single source of truth for pipeline and MRR, owned by demand gen and managed by Lauren in EMEA. Every asset goes through it. Every play gets a deal tag, like "EMEA SB 2026 Play of the Month", and reps tag the deal at discovery stage.

> "Tmac is our regional marketing campaign tracker… that's our single source of truth for everything pipeline and MRR across all regions. So if it's not on there, it didn't happen."

The cost is real. Reps forget to tag, the deal can't be assigned to the play, and they lose the competition even though they did the work. Martina mentioned heated conversations over exactly this. So EMEA has the same leakage problem as NAMM, just located somewhere else: missed manual deal tags instead of sequence clones.

This reframes the Josh Chang conversation (session 3). NAMM attribution leaks through clones, EMEA attribution leaks through human error, and both are the kind of fragile manual hook the productized surface is meant to replace. If the rep works the company from the play page, the work is attributed without a tag. Martina was cautious here, though. The deal tag is used across the whole marketing function, so it may not disappear just because plays move into the workspace.

#### "Help us, but please don't hurt us": ring-fence the audience

Martina's biggest worry isn't sequences or tracking. It's the audience pool. Vitalia sources a bucket of contacts for each play, say 1,000 sized for a Zoho displacement. Martina needs a strict rule that a chunk of those contacts is reserved for the Play of the Month and Book of Business can't touch them.

The fear is that P1–P4 with its SLAs eats their lunch. If reps get pulled into working their P-buckets, SB won't have the audience share to run a blitz on the month's theme, and P1 and P2 are the core of the EMEA play.

> "We can't globalize because business has come in and eating its lunch."

I hadn't seen this coming. I'd assumed the P-bucket list and plays were complementary. From EMEA's side they compete for the same finite audience. That's a governance rule we need: how do you reserve a segment for a play so the rest of the workspace leaves it alone? Martina put it back on me, Lucy, and the team.

#### What she'd fight to keep vs. offload

Fight to keep:

- Strategy and theme selection, and the ability to respond to what the business is pushing.
- The contact list and audience segments, with a rule that ring-fences them. "It's the contact list and the audience segments that are the bit."
- The competition, because it drives revenue.

Happy to offload:

- Sequence creation and automation.
- Where the enablement lives.
- The manual tracking: deal tagging, leaderboard building, payment processing. She called it "the bane of everyone's existence" and wants it to run itself so the team can get to the strategic work.

The payment processing is the worst of it. A colleague nearly broke over it, manually pulling employee IDs from Workday and handling prizes across euros and sterling.

#### A third pillar: attribution

Showing Martina the prototype, I realised I'd been treating this as two surfaces, the creation experience and the execution experience. There's a third: the attribution back-end. Not necessarily a screen, but the system that attributes the work, runs the leaderboard, and makes sure reps get credit and payment. EMEA's whole competition motion lives or dies on that pillar, and today it's manual.

#### Localization and rep tweaking

Martina liked the base-sequence-plus-tweak model. EMEA needs the tweak for two reasons. First, DACH and France have double opt-in and compliance rules that change the wording, and northern France needs a different voice. Today Vitalia depends on the upmarket team to localize, which stalls when they're away, and Martina wants the SB lead able to localize in the workspace without that dependency. Second, reps tweak anyway. Some in France use Gemini to personalize. She paraphrased Kieran O'Flynn: once reps hear marketing made something, they want to redo it themselves, but if they think it's their own, they'll just tweak it.

I was honest that our sequencing agent isn't localizing to the double-opt-in or per-country level today. She was fine with that, as long as there's a base sequence and the freedom to adjust.

#### Other notes

- List building is "a bit of a black hole" in EMEA. Sometimes her team does it, sometimes sales support. In NAMM it's clearly the rev marketing team in the segments tool.
- EMEA is moving off decks toward digital experiences in Lovable. Martina built a prospecting playbook for Spring Spotlight, and reps prefer the digital format.
- Plays shift mid-flight. A late asset, a webinar with an X Funnel co-founder, got folded into a running play. She wants the freedom to adjust a play mid-month without breaking the rep's flow or the attribution.
- What makes a play "end" is the competition deadline. Win the prize by month end. Get the deal the next day and you keep the deal but lose the win.

#### Where this leaves the launch

EMEA is a more complicated and more fragile system than NAMM. More moving parts: incentives, leaderboards, competitions, localization, a reserved audience. NAMM is closer to "build the list, write the sequence, tell the reps to work it." My read is that the August 3rd launch will be mostly NAMM, with EMEA following once the audience-reservation rule and the stakeholder conversations are worked out. Stephen Higgins owns the motion, Roisin owns it globally, and Martina wants those conversations before anything that changes SB EMEA at a macro level gets locked in. She agreed with that read.

---

## Rolling synthesis

To be filled in as sessions occur. Reserved for the four outputs the plan commits to.

### Current-state map

[insert mermaid diagram]

Anchors so far (from Alex & Maura):

- Creators today: Alex's NAMM revenue marketing team (Alex + 3 ICs).
- Tooling: Portal 53 (lists, filters), sequences in 53 (drafted in Claude), Asana (project management), Lovable (microsites fo enablement materials).
- Handoffs: PMM for copy/value props, sales leaders for approval, VP/director/manager for launch comms, GTM enablement for coordination.
- Measurement today (from Josh Chang, session 3): no framework. Plays run, then a deal-creation/velocity/close-rate uplift is hunted for after the fact. Sequence enrolment is the only clean attribution signal and it leaks through clones. No baseline, no pre-set targets. Owned conceptually by marketing ops & strategy (Josh, central ops, reports to Kieran), but no plays-specific DRI assigned yet.
- EMEA divergence (from Martina, session 4): EMEA runs a "Play of the Month", a themed monthly sprint with a funded rep competition and leaderboard, which NAMM, JPAC, and Latam don't. Creator is Martina Simon's team, with SB lead Vitalia as the Maura equivalent. Book of Business isn't rolled out in EMEA yet. Attribution runs on deal tags in TMAC (the regional campaign tracker, owned by demand gen), not sequences, and leaks through missed tags. Roisin Hughes (VP, global) is exporting the EMEA model to the other regions.

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

#### EMEA-specific jobs (from session 4)

EMEA shares jobs 1–9 with NAMM, but the Play of the Month adds three that NAMM doesn't have. Worth holding separately, because they're the parts Martina would fight to keep and the parts most exposed if we centralise.

##### 10. Run a funded rep competition

**When** a Play of the Month launches, **I want to** put real money behind a leaderboard and run it as a contest between reps, **so that** I drive the extra bucket of revenue that the competition motion produces on top of normal SB activity.

Unique to EMEA. Funded from Martina's rev marketing budget, around £2k a month. She's protective of it because automating the motion could break the incentive that earns the revenue. The leaderboard, the prize payments, and the per-rep tracking are all manual today and all things she'd hand off, as long as the contest itself survives.

> "This drives real revenue and MRR, and if any element of how we leaderboard it changes because it's automated, the part that helps drive that extra bucket of revenue in a way goes away." — Martina

##### 11. Localize the play across EMEA markets

**When** the English package is built, **I want to** localize the sequences and messaging for Nordics, UKI, France, DACH, and sometimes Iberia, including the double opt-in and compliance rules specific to some markets, **so that** the play is usable and legal in every market without waiting on another team.

This is the strongest counter-evidence so far to the Gong-analyser learning that reps over-estimate regional difference. For EMEA the difference is real and partly legal. Today the SB lead depends on the upmarket team to localize, which stalls when they're away. Martina wants the SB lead empowered to do it in the workspace.

##### 12. Ring-fence the play's audience

**When** a play is sourced, **I want to** reserve its contact bucket so other motions (Book of Business, P-buckets) can't deplete it, **so that** SB has the audience share to actually run the blitz.

Martina's single biggest worry. The Play of the Month and the P1–P4 list compete for the same finite audience, and if the P-buckets eat the pool, the play has no one left to work. There's no rule for this today, and Martina handed the problem to me, Lucy, and the team.

> "Help us, but please don't hurt us, because we want the motion." — Martina

### Measurement open questions

*Living list for the ops/analytics DRI. This is plan output #4 — the agenda for the ops/analytics workstream.*

**Reframe from session 3 (Josh Chang).** Two things change how to read everything below. First, attribution is a trust problem, not a technical one. You can define it any way you like and none of it is "right". The real constraint is landing on a number sales leaders believe, and the failure mode that hurts is claiming a play worked when it didn't. Second, plays are measured backwards today. They launch with no baseline and no targets, and success gets reverse-engineered afterward. So the first task isn't to pick a metric. It's to inventory every trackable signal (what exists today plus everything the productized surface and agent flow newly expose), sort it into concrete activity signals against noisy output metrics, and define what good looks like before a play launches. Our two core design bets, the productized surface and enroll-don't-clone agent sequences, are what make a defensible attribution story possible.

Current entries from session 1:

- Attribution model changed Jan 2025; how do we benchmark a play given only one year of comparable data?
- How do we attribute when reps clone sequences? Is first-gen-clone attribution sufficient, or should the workspace force a single sequence per play?
- What's the minimum measurement bar leadership will accept to say "this play worked"?
- Is deals-per-rep / pipeline-per-rep the right unit of measure across play types? MOPS suggested it.
- How do we account for the rep-usage variable, given play performance fully depends on rep adoption?

From session 2:

- If the agent writes the sequence (not revenue marketing), how does revenue marketing get attribution for the play? Probably company-work attribution rather than sequence enrolment, but needs design.
- How do we reconcile P-bucket "done" (e.g. 5 touches in 14 days for a P1) with play "done" (e.g. enrol one contact) when both apply to the same company?

From session 3 (Josh Chang, ops/analytics):

- **Signal inventory first.** What is the full list of trackable events the productized play surface and the agent flow expose (landed on play page, read enablement, opened company from play, edited sequence, enrolled contact), and which existing signals (sequence enrolment, deal creation, velocity, close rate) do we pair them with? This is the prerequisite to any framework.
- **What threshold keeps sales leaders' trust?** Making plays more visible will earn marketing more attribution. At what point does the number stop being credible to sales leaders? This is a judgment call, not a calculation.
- **Define "good" before launch.** What baseline and target does each play type need set *up front*, so success is tested against a framework rather than reverse-engineered?
- **Can we run a clean experiment?** Is a split test / control group (or a regional holdout, e.g. Nordics vs. UKI) feasible to measure incrementality, given sales' objection that an excluded team is disadvantaged?
- **The P1-and-play overlap rule.** When a company is both a P1 and in a play, what's the explicit attribution rule? Josh: solvable now that we can see list membership + play membership + the click-in, but it needs a deliberate decision, not a default.
- **Resourcing + DRI.** Josh covers marketing ops but flagged we also need a sales ops lens; he's looping Kieran and Lucy. Who is the standing DRI for the plays measurement workstream, and is Gary Zhao (our product analyst) the right partner on the tracking detail?

From session 4 (Martina Simon, EMEA):

- **Deal tags vs. the workspace.** EMEA attributes plays through TMAC deal tags, not sequences. Does the productized surface replace the tag, or feed it? The tag is used across the whole marketing function, so it may not go away just because plays move into the workspace.
- **Audience ring-fencing.** How do we reserve a play's contact bucket so Book of Business and the P-buckets can't deplete it? This is the EMEA blocker and it sits between attribution and governance.
- **Does the competition survive automation?** The leaderboard depends on accurate per-rep attribution and is built by hand today. If we automate the tracking, does the incentive structure that drives the extra revenue survive intact?
- **Two attribution models, one surface.** NAMM measures on sequences, EMEA on deal tags. Can one workspace attribution model serve both, or do we need region-specific rules?
