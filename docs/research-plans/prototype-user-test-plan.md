# **BoB in the Workspace Prototype: Research Plan**

**Last updated:** 2026-04-30
**Owner:** Eoin Ó Raghallaigh (Research/Design)
**Stage:** Pre-Alpha prototype evaluation (Variant C)

---

# **Background**

The Flywheel Sales Workspace is HubSpot's daily prospecting cockpit for SMB SDRs and Growth Specialists. The Beta has surfaced a clear and consistent set of pain points (see [customer feedback themes](../customer-feedback.md)): reps distrust the P1–P4 prioritization, are hindered by data quality issues, want to tsee the full context of the company/contact record, and strongly dislike the native HubSpot calling function

Variant C of the prototype takes a deliberate stance in response: it commits to a **company-centric, deep-prospecting** layout where each company is a strategy page (not a row in a queue), the AI pre-stages outreach (call script, LinkedIn DM, three-email sequence), and engagement state (touches, activity, sequence status) is unified across surfaces. Several behaviors in the prototype are bets we have not yet validated with reps:

- **AI-generated outreach is treated as the default**, with the rep editing rather than authoring from scratch.
- **Recent activity / conversion context** that justifies the prioritization may be hidden or de-emphasized once the AI has used it to draft outreach.
- **Connected calls automatically pause / unenroll the contact from the email sequence**, on the assumption that the conversation supersedes the automation.
- **The default workflow is one company at a time, in depth** (multi-thread, multi-channel) rather than a centralized list a rep blasts through.


# **Research Objectives**

1. Validate whether reps trust the AI-generated outreach enough to act on it without re-deriving the underlying signals themselves.
2. Pressure-test the "auto-pause sequence on connected call" automation against how reps actually want to handle that moment.
3. Confirm that the affordance for editing AI outreach is discoverable and that reps feel ownership of what gets sent.
4. Assess whether the deep-per-company workflow matches the rep's natural daily loop, or whether a centralized burst-call list is a better default.


# **Research Questions and Hypotheses**

### Trust in AI

1. **Do reps trust AI-generated call scripts, LinkedIn DMs, and email sequences enough to send them with light edits — or do they feel the need to rewrite from scratch?**
   *H1: Trust will correlate with whether the rep can see the reasoning ("why this account / why this opening line"). Reps who can drill into the source signals will accept lighter edits; reps who can't will rewrite or abandon.*


2. **Are reps comfortable with source data (recent activity, conversions, intent signals) being hidden or collapsed once the AI has used it, or do they want it persistently visible?**
   *H2: Most reps will want at least a one-click reveal of source signals before sending — full removal will erode trust, especially after past experiences with low-quality P1s and "fake Gmail" intent.*


### Automation logic

3. **When a rep has a connected call with a contact, is automatically pausing/unenrolling the email sequence the correct default?**
   *H3: Reps will accept auto-pause for the contact who connected, but not for other contacts at the same company. They will also want a clear undo and visibility into what was paused.*


4. **Beyond connected calls, what other moments should auto-end a sequence?** (e.g. reply, meeting booked, LinkedIn-accepted-and-engaged, closed-lost)
   *H4: Reps already have a strong mental model: any signal that the conversation has moved off rails ends automation. Meeting booked and reply are universally accepted; LinkedIn acceptance is contested.*

### Feature discoverability

5. **Can reps find and use the affordance for editing AI-drafted outreach without prompting?**
   *H5: Edit affordances inside the outreach panel will be discovered quickly; deeper edits (changing tone, swapping a CTA, regenerating) will not be — reps will work around them with copy-paste.*

6. **Once edits are discovered, do reps feel safe making them?** (i.e. do they understand what's editable, what's locked, and what saves vs. resets)
   *H6: Reps will edit cautiously the first time and need explicit confirmation that their edits stick before trusting the system.*

### Workflow preferences (deep vs. burst)

7. **Does the deep, per-company workflow match how reps actually prospect — or do they prefer a centralized list to burst-call through?**
   *H7: Workflow splits along role and time of day. SDRs and reps in DC-mandated blitz windows want a burst-style list with per-call context; GS reps doing strategic prospecting want the deep per-company view. The prototype will feel right to one cohort and wrong to the other.*


8. **Where in the daily loop does the prototype break down?** (planning the night before, executing during a power hour, reactive triage between meetings)
   *H8: The prototype will support strategic targeting and depth of work well, but will under-serve structured planning — reps will not feel they can "set up tomorrow" inside the workspace.*
   *Tests:* the three skills framing in [design principles](../design-principles.md) — Structured planning, Strategic targeting, Depth of work.

# **Methodology**

* **Approach:** Moderated, task-based usability evaluation.

* **Participants:** 8–10 reps, mixed across NAM and EMEA. All SB.

## **Recruitment**

* Recruited via the Beta participant list and manager nominations (Soraya Hatcher, Fancy Lai, Katherine Sanders have provided strong signal in the past — re-engage). Skew toward reps who have left substantive feedback in the CSV so we can probe specific past complaints. Avoid reps who have only used the workspace for <2 weeks — they can't compare against the prior daily loop.

| Research Group | Group Size | # of participants | Recruitment List |
| :---- | :---- | :---- | :---- |

