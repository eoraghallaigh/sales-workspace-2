# **BoB in the Workspace Prototype: Research Plan**

**Last updated:** 2026-04-30
**Owner:** Eoin Ó Raghallaigh (Research/Design)
**Stage:** Pre-Alpha prototype evaluation (Variant C)

---

# **Background**

The Flywheel Sales Workspace is HubSpot's daily prospecting cockpit for SMB SDRs and Growth Specialists. Sales managers describe effective prospecting as the combination of three skills, and the prototype is designed to make each one easier:

- **Structured planning** — reps block time for prospecting and prepare in advance (reactive vs. proactive, install base vs. net new). The workspace should make it cheap to plan tomorrow's work today.
- **Strategic targeting** — fit beats intent. The workspace should surface high-fit accounts together with the signals that justify them, and make it fast to act when fit and intent align.
- **Depth of work** — top performers reach 3–4 distinct touches at the same account across multiple decision-makers. The workspace should make multi-threading the default, not an extra step.

Variant C of the prototype takes a deliberate stance: it commits to a **company-centric, deep-prospecting** layout where each company is a strategy page (not a row in a queue), the AI pre-stages outreach (call script, LinkedIn DM, three-email sequence), and engagement state (touches, activity, sequence status) is unified across surfaces. Several rep-workflow assumptions are baked into that stance — bets we have not yet validated:

- **The strategy page is the right place to initiate a call.** We know reps do batch their dialling — power hours, blitzes, manager-mandated call windows. The prototype currently puts a call CTA next to every outreach target on the strategy page, which encourages one-off dials in flow. The open question is whether that's right, or whether the affordance should instead let reps *add a target to a call list* and dial through that list later in a dedicated batch surface.
- **AI-generated outreach is the right starting point** — reps would rather edit a draft than author from scratch.
- **Once the AI has read the source signals, the rep doesn't need them in front of them** — recent activity and conversion context can be collapsed or hidden in service of a cleaner workspace.
- **A connected call should automatically pause the email sequence for that contact** — the conversation supersedes the automation.

Before Alpha (Dec 8, 2025) we want to know whether these bets match how reps actually want to work. This study is the gating evaluation.

# **Research Objectives**

1. Validate whether reps trust the AI-generated outreach enough to act on it without re-deriving the underlying signals themselves.
2. Pressure-test the "auto-pause sequence on connected call" automation against how reps actually want to handle that moment.
3. Confirm that the affordance for editing AI outreach is discoverable and that reps feel ownership of what gets sent.
4. Assess whether the deep-per-company workflow matches the rep's natural daily loop, or whether a centralized burst-call list is a better default.
5. Map every finding back to the [customer-feedback themes](../customer-feedback.md) and [design principles](../design-principles.md) so we know which existing pains are addressed, which remain, and which the new design may have introduced.

# **Research Questions and Hypotheses**

### Trust in automated outreach

The prototype doesn't generate live AI outreach against real companies, so we can't measure trust in *this* AI directly. Instead, we use reps' lived experience with HubSpot's existing automated email sequences as the starting point and probe whether the prototype's review affordances would close the gaps they currently feel.

1. **What is reps' current experience with automated outreach (sequences, AI-assisted email)? Where has it served them well, and where has it embarrassed or burned them?**
   *H1: Most reps have at least one story of an automated email going out that they would not have approved if they'd seen it — bad personalization, wrong context, sent after the deal closed. That story shapes how willing they are to delegate authorship.*

2. **What would have to be true for a rep to trust an AI-drafted call script / LinkedIn DM / email enough to send it with light edits?**
   *H2: Trust will hinge on (a) seeing the reasoning behind the draft — which signals were used and how, (b) being able to verify the facts the draft asserts about the company/contact, and (c) a track record of the AI not making unforced errors. The prototype can address (a) and (b) directly; (c) is earned over time.*

3. **How do reps actually review and verify outreach content today? What's their checklist, and where do they go to confirm each piece?**
   *H3: Reps cross-reference against the company record, LinkedIn, recent emails, and (for renewals) past conversations. They are doing this verification regardless of whether the draft was AI-generated or self-written — and the prototype needs to support that verification flow without forcing them out of the workspace.*

4. **Does the prototype's design support that review-and-verify workflow? Where does it help, and where does it get in the way?**
   *H4: The collapsed "AI has used this signal" pattern will frustrate reps who want to verify before sending. They will ask for source data to be visible at review time, even if it's tucked away during normal browsing.*

   *Across questions 1–4, this section ties to feedback themes:* Distrust in P1–P4 framework; Lead data quality is the biggest trust-breaker; Insufficient context on the card. *Tests principles:* #1 Reduce decision-making, not information; #2 Action without leaving context; #4 Trust the prioritization.

### Automation logic

5. **When a rep has a connected call with a contact, is automatically pausing/unenrolling the email sequence the correct default?**
   *H5: Reps will accept auto-pause for the contact who connected, but not for other contacts at the same company. They will also want a clear undo and visibility into what was paused.*
   *Ties to feedback themes:* SLA and "worked" status logic is buggy / opaque; Dismiss & feedback loop. *Tests principle:* #5 Progress is visible; #7 Respect the operating model.

6. **Beyond connected calls, what other moments should auto-end a sequence?** (e.g. reply, meeting booked, LinkedIn-accepted-and-engaged, closed-lost)
   *H6: Reps already have a strong mental model: any signal that the conversation has moved off rails ends automation. Meeting booked and reply are universally accepted; LinkedIn acceptance is contested.*

### Feature discoverability

7. **Can reps find and use the affordance for editing AI-drafted outreach without prompting?**
   *H7: Edit affordances inside the outreach panel will be discovered quickly; deeper edits (changing tone, swapping a CTA, regenerating) will not be — reps will work around them with copy-paste.*
   *Ties to feedback themes:* Calling UX is clunky; Lack of clear in-product guidance. *Tests principle:* #2 Action without leaving context.

8. **Once edits are discovered, do reps feel safe making them?** (i.e. do they understand what's editable, what's locked, and what saves vs. resets)
   *H8: Reps will edit cautiously the first time and need explicit confirmation that their edits stick before trusting the system.*

### Workflow preferences (deep vs. burst)

9. **When reps batch their dialling (power hour, blitz, manager-mandated call window), where does the call actually start? From the strategy page in flow, or from a separate call list they assembled earlier?**
   *H9: Reps already separate "research / strategy" mode from "dialling" mode by time of day. The strategy page is where they decide *who* to call; the dialling itself happens later, in a list, often with a coffee and headphones on. An inline call CTA next to every target risks being used in the wrong mode (one-off interruptions during research) and missed in the right mode (batch dialling, when the rep wants a list to chew through).*

10. **Should the per-target affordance on the strategy page be "call now" or "add to call list"?**
    *H10: Most reps will want both, but only one as the default. The default likely depends on rep cohort: SDRs in blitz mode prefer "add to call list"; GS reps doing reactive triage prefer "call now." Without an explicit call-list surface, reps will either ignore the inline call buttons or build their own list outside the workspace.*
    *Ties to feedback themes:* Reps work around the system via their own company views; Blitz mode (secondary); Calling UX is clunky. *Tests principle:* #6 Safe defaults, powerful overrides; #3 Company-centric, contact-aware.

11. **Where in the daily loop does the prototype break down?** (planning the night before, executing during a power hour, reactive triage between meetings)
    *H11: The prototype will support strategic targeting and depth of work well, but will under-serve structured planning — reps will not feel they can "set up tomorrow" inside the workspace.*
    *Tests:* the three skills framing in [design principles](../design-principles.md) — Structured planning, Strategic targeting, Depth of work.

# **Methodology**

* **Approach:** Moderated, task-based usability evaluation with concurrent think-aloud, followed by a short semi-structured interview. Each session combines (a) **directed tasks** that exercise the four objective areas, (b) **a free-form "show me a normal morning"** segment so we observe the workflow uncoached, and (c) **comparative probes** showing the deep-per-company view alongside a stripped-back list view to elicit preference and reasoning.

* **Data Collection Method:** 60-minute remote sessions over Zoom with screen share. Recorded with consent. Notes captured live in a structured grid keyed to the research questions; tagged against the customer-feedback themes and design principles in post-analysis. Brief post-session SUS-style rating on five dimensions (trust in AI, ease of editing, confidence sending, fit to workflow, likelihood of daily use).

* **Participants:** 8–10 reps, mixed across the dimensions that matter for our hypotheses. Recruit live, currently in a BoB workflow — not retired/promoted reps.

* **Data Analysis:** Affinity-mapped against the eleven research questions. Each finding tagged with: (a) which customer-feedback theme it touches (resolves / persists / introduces), (b) which design principle it pressures, (c) severity for Alpha (ship-blocker / fix-before-GA / backlog). Final output: a one-page "go / fix / re-think" summary per objective, plus a regression matrix showing which Beta pains the prototype addresses.

## **Recruitment**

* Recruited via the Beta participant list and manager nominations (Soraya Hatcher, Fancy Lai, Katherine Sanders have provided strong signal in the past — re-engage). Skew toward reps who have left substantive feedback in the CSV so we can probe specific past complaints. Avoid reps who have only used the workspace for <2 weeks — they can't compare against the prior daily loop.

| Research Group | Group Size | # of participants | Recruitment List |
| :---- | :---- | :---- | :---- |
| SMB SDRs (net-new prospecting, blitz-heavy) | 3 | 3 | Beta CSV respondents flagged as SDR; Dan Taft, Anne Twombly tier |
| Growth Specialists (install + net-new, strategic) | 3 | 3 | Beta CSV respondents flagged as GS; Kris Wemyss, Jenna Sweeney tier |
| High-performers / power users | 2 | 2 | Manager-nominated; reps already running their own custom views |
| Newer reps (<6 months tenure) | 1–2 | 1–2 | Recent onboards from manager Slack — tests discoverability without learned workarounds |

# **Open questions to resolve before fielding**

- Do we show participants Variant C only, or also expose them to A/B/Original to elicit comparative preference? (Recommendation: C-only for tasks; A/B reveal at the end as a forced-choice probe to surface what they value.)
- Do we use seeded prototype data or push their own BoB into a sandbox? Seeded data keeps sessions controlled but loses the lead-quality realism that drives so much of the existing distrust. (Recommendation: seeded for tasks, then ask them to imagine three accounts from their real BoB to stress-test trust.)
- How do we measure "trust" beyond self-report? (Proposed proxy: edit volume + send-without-edit rate during tasks.)
