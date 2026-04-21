# Customer Feedback Themes

**Last updated:** 2026-04-21

Themes synthesized from the two primary feedback sources we have to date. Keep this curated — don't paste raw transcripts. When a new theme emerges, add it here with one or two representative quotes so Claude can ground design proposals in real evidence.

## Sources

- **[PPF in the Workspace — User Testing Report](../.context/attachments/PPF in the Workspace -  User Testing Report.md)** · Eoin Ó Raghallaigh · Nov 14, 2025
  - Qualitative research with reps on the prototype pre-Alpha. Validated future state + surfaced current-state workarounds.
- **[BoB in Workspace — Beta Launch Feedback CSV](../.context/attachments/BoB in Workspace - Beta Launch Feedback and Enhancements - Feedback.csv)** · ongoing since Feb 5, 2026
  - ~390 rows of in-app CSAT, manager Slack channel, and direct manager/rep feedback during Alpha + Beta.

---

## Theme: Distrust in the P1–P4 prioritization framework

**Sources:** PPF report (root-cause "critical issue"); CSV throughout Feb–Apr (dozens of "this shouldn't be a P1" entries, esp. Marc Masana batch on Mar 16).
**Frequency:** Very high — cuts across regions, roles, and all feedback channels.
**Summary:** Reps do not trust that a "P1" label means the lead is actually high-quality or timely. They can't see *why* an account is prioritized, so they augment the system with their own manual vetting (LinkedIn, website, job title, notes history). Without reasoning, the label is noise.

> *"I'm not exactly sure what's triggering a P1 because sometimes I'll get accounts that I wouldn't consider P1… There was no QL or Hinkle. So I'm kind of like, why? Why are they P1, you know?"* — PPF research participant

> *"Half of my P3s have no intent or recent engagements. What separates them from P4s in that case?"* — Stephen Berg, Apr 21

> *"Viewed Pricing Page… Yes, who?? If it's not logged against a contact this information is useless. Get a random HubSpot employee to look at this workspace with the goal of seeing if they know what action to take next. If they can't figure it out then neither can we."* — Daniel Budreika, Apr 21

**Implications for design:** surface the "P1 because: [New Hire] + [Pricing Page View]" reasoning prominently; tie intent signals to specific contacts (not just accounts); consider a transparency pattern users can drill into without leaving the card.

---

## Theme: Lead data quality is the biggest trust-breaker

**Sources:** CSV — the single largest category ("Data Quality & Account Accuracy" appears >100 times).
**Frequency:** Very high · **Severity:** ship-blocker for perceived value
**Summary:** Reps report that a large fraction of P1–P4 accounts are unworkable or simply wrong: existing customers (often tied to a different domain), redirects, non-US / out-of-territory, sub-4-employee solo operators, dead domains, duplicate records, gmail addresses masquerading as intent, year-old QLs, marketing-agency "intent" from people using HubSpot for ed. Even good features (prioritization, signals) get discounted because the inputs are distrusted.

> *"This might not be workspace specific and more data specific but it feels like 90% of the P1's are fake Gmails, contacts in other countries, academy sign ups by interns… I want to see who are the actual high fit contacts with business emails, strong job titles, at good companies that are not ecommerce and marketing agencies."* — Dan Taft, Feb 20

> *"We need to figure out a way to weed out marketing agencies from P1 — 99% of the time agencies are doing 'high intent' actions like downloading white papers or signing up for the academy with zero intention of buying HubSpot."* — Anne Twombly, Feb 11

> *"I am getting companies suggested to me that I have been actively working."* — Eva Barrett, Apr 21

**Implications for design:** workspace UX can't fix upstream data, but it should (a) let reps quickly flag bad leads with reason codes that feed back to the routing/scoring model, (b) visually de-prioritize or filter obvious disqualifiers (redirects, already-customers, out-of-territory), and (c) not surface anything marked "Not a fit" or "Not a fit — already customer."

---

## Theme: Insufficient context on the card forces reps back to the company/contact record

**Sources:** PPF report ("critical issue #3"); CSV — "Missing Info or Properties" is the second-largest category, plus "Desire for full company/contact record."
**Frequency:** Very high
**Summary:** The preview/card lacks the data reps need *before* they'll pick up the phone or draft an email. They end up opening the full company record to check rating, next-step notes, hub summary, portal/trial status, past conversations, email opens/clicks, LinkedIn, industry, and employee count. The preview pane is seen as a slow middle-step between card and record, so reps ask for one-click "open record in new tab" instead.

> *"At risk of us reps sounding like a broken record — I would like rating and next step notes somewhere more obvious. Still having to jump out of the prospecting workspace to see that."* — Katie Walsh (relayed), Feb 5

> *"The lack of sufficient context on the card leads to a hesitation to use the embedded action buttons (call, email). Multiple participants stated they would not feel comfortable using these shortcuts without first doing their own research."* — PPF report

> *"It's really difficult for me to properly use workspace if I cannot access the company record in 1 click."* — Katie Elsey, Mar 6

**Implications for design:** enrich the card/preview with rating, next step, hub summary, recent notes, key intent detail, and phone/LinkedIn presence at a glance — the "About this company" work in flight directly addresses this. Also: consider a one-click-to-record affordance for power users who'd rather jump to the full record than use the side panel.

---

## Theme: SLA and "worked" status logic is buggy, opaque, and punitive

**Sources:** CSV — "SLA & Worked Status Logic" is a top-3 category, appearing weekly since Feb 5.
**Frequency:** Very high · **Severity:** actively erodes rep confidence in the tool
**Summary:** A large cluster of complaints: activities don't update the "over SLA" banner; LinkedIn doesn't count as a touch; IGAs / closed-lost meetings don't count; accounts stay "unworked" after a meeting is booked; multi-contact accounts require *every* associated contact to be worked to clear; reps get docked for accounts they received <24h ago; dismissed accounts keep returning; closed-lost deals reappear as P1s. Many reps don't know what the SLA actually is.

> *"Clunky UI. A lot of these accounts I've already worked but it's showing as 'over SLA' and there's no way for me to dismiss it from my view after I've worked the account."* — Hunter Davis, Feb 5

> *"I didn't know there was a due date on P1s, but I do regularly check my P1s and reach out to them."* — PPF participant

> *"Was auto-assigned a P1 account from another rep who didn't work it today. The intent was from March, but it's docked my P1 work rate by 5% when I've had the account for less than 24 hours."* — Hunter Davis, Apr 21

**Implications for design:** (a) fix the activity-syncing bugs — this is table stakes; (b) include LinkedIn + connected IGAs in touch counts; (c) clarify SLA requirements inline (e.g. "P1: 5 touches within 14 days, at least one call") per Soraya Hatcher's Feb 5 ask; (d) recognize meeting-booked and closed-lost as terminal states that clear the card; (e) rethink the "all contacts must be worked" clearing rule.

---

## Theme: Dismiss / snooze / "not a fit" needs to actually remove the account — and stay removed

**Sources:** CSV — "Dismiss & Feedback Loop" appears ~30 times.
**Frequency:** High
**Summary:** Dismiss and snooze are the primary mechanisms reps use to triage bad leads, but (1) the action doesn't always work (account returns hours later, notification count doesn't decrement), (2) options are limited (only a few snooze durations — reps want 1-day, 3-day, 1-month, custom dates), (3) there's no reason code, so managers can't coach, and (4) there's no "undo" if dismissed by accident. Reps also want dismissal at the *contact* level — not just company.

> *"I dismissed a few companies since I had already worked them and need to wait a few months, BUT the dismissed companies still show up at the top of my P3 list."* — Katie Visco, Feb 24

> *"For newer reps dismissing due to 'no phone number,' managers should be able to see and coach. Wants a way to flag data viability issues."* — Soraya Hatcher (manager feedback), Feb 5

> *"And then for P2s would be great to have a 'Swap Out' button. There are some P2s I know won't be buying soon (due to recent convos), so if I could swap those out that would be great."* — Kris Wemyss, Feb 17

**Implications for design:** hardening the dismiss/snooze contract (fast, reliable, doesn't reappear); custom snooze durations; optional reason codes that feed back to managers + the scoring model; un-dismiss control; contact-level dismiss (also addresses the multi-threading theme).

---

## Theme: Multi-threading is still hard because suggested contacts are often wrong

**Sources:** PPF report (identified as a core PRD problem); CSV — "Contact display and control" is a top-5 category.
**Frequency:** High
**Summary:** The 1–5 suggested contacts include people who've left the company, have bounced/opted-out emails, have low-fit titles, or are duplicates. Reps want to (a) dismiss individual contacts, (b) pin/prioritize preferred contacts (e.g. marketing DMs), (c) see *all* available contacts so they can extend outreach, (d) filter out bounced/unsubscribed automatically. The system should respect "Still with company? = No."

> *"Jan here is an example of a contact that I would not want to see show up as a recommended contact as she's no longer working at the company, but is listed as a director of operations on LinkedIn, so she's being shown instead of the marketing contact whom I'd prefer to keep eyes on."* — Peter Conn, Feb 6

> *"When they are working through P1s/P2s, is there an ability to pin certain contacts like DMs/Marketing (i.e. some of the suggested contacts are not good contacts)?"* — Fancy Lai (manager), Feb 5

**Implications for design:** contact sorting + dismiss; use existing data signals ("Still with company," bounced, unsubscribed) as automatic exclusions; allow rep overrides (pin, manual pull-in via LeadIQ workflow).

---

## Theme: Calling UX is clunky — the single biggest friction in the daily loop

**Sources:** CSV — "Calling & Outreach" is the largest category after data quality.
**Frequency:** Very high
**Summary:** Multiple recurring complaints: calling opens two windows instead of one; dialler auto-hangs-up; side panel covers the dial pad; calling button appears when there's no phone number (so reps call themselves via the nurturing-owner fallback); power dialer isn't available from the workspace; can't call mobile; InMail/LinkedIn messages don't log. "It's not the easiest place to work out of from a calls/emails perspective."

> *"My rep is calling out of Sales Workspace and it is auto hanging up (not happening from the contact record itself)."* — Katherine Sanders (manager), Feb 5

> *"Have to click the call button multiple times to actually call. Also it should pop up with the normal calling feature, it's really inconvenient with the calling on the main page and having to toggle back and forth between the preview."* — Clare Gorman, Feb 5

> *"Can take out Nurturing Owner Phone Number. I constantly am accidentally calling myself."* — Katie Walsh (relayed), Feb 5

**Implications for design:** bring the dialler experience to parity with the contact record (single window, above side panel, power dialer support); disable call buttons when there's no valid phone number; log LinkedIn + InMail as touches.

---

## Theme: Reps currently work around the system via their own company views + ignore system tasks

**Sources:** PPF report (primary current-state finding).
**Frequency:** Universal among research participants
**Summary:** Reps filter, sort, and triage from their own company views — P1–P4 is just another filter. They actively ignore system-generated tasks, viewing them as "administrative burden" and "pollution," and will bulk-complete tasks without acting on them just to clear the queue. Self-created tasks for high-value follow-ups *are* trusted. This is a strong signal that a "trusted homebase" (not a task queue) is the right long-term direction.

> *"If I do the task view, sometimes I feel like I'm reaching out to low accounts rather than the high accounts."* — PPF participant

> *"I make these little filters and I like, you know, do tasks that really matter to me and make sure those stand out among others."* — PPF participant

**Implications for design:** treat the workspace as a trusted homebase, not a push-tasks queue (PPF report's long-term recommendation). Preserve power-user affordances (saved views, filters that stick, list-view option) so the workspace can replace, not compete with, the company view workflow.

---

## Theme: Lack of clear in-product guidance / "what good looks like"

**Sources:** PPF report (secondary issue: "lack of program awareness"); CSV — "Clarity of Guidance" is a recurring category across managers and reps.
**Frequency:** Medium-high
**Summary:** Reps (especially newer AEs) don't know: how many touches satisfy each P bucket, what counts as a touch, what to do when a contact has no phone/LI, what happens when they dismiss, how to handle a closed-lost account that reappears. Managers are asking for an in-product reference — currently reps are going back to onboarding slide decks. Explicit, inline expectations ("This P1 won't clear until you call it") would reduce analysis paralysis.

> *"Wants a sidebar or easily accessible reference within the workspace showing 'what good looks like.' Reps are going back to slide decks to check touch requirements."* — Soraya Hatcher (manager), Feb 5

> *"Do we work the suggested contacts? If they are partner-managed or have a cancellation request, why do they still populate? Do I press complete when I reach out to the one or two suggested contacts or when I go and prospect the entirety of that account outside of the sales workspace?"* — Jenna Sweeney, Feb 25

**Implications for design:** inline SLA requirements per bucket; a "next best action" hint when state is ambiguous; in-product reference (or tooltip) summarizing touch expectations; explicit empty/complete states (Emily Timmons Feb 12 case informed the P1 → P2 redirect design).

---

## Theme: Signals & enrichment — reps want more, earlier, with more specificity

**Sources:** CSV — "Signals & Enrichment" category; several manager requests.
**Frequency:** Medium (but high perceived value)
**Summary:** Reps value intent signals but want more of them and clearer ones: new-hire signals (highest-ROI trigger historically), funding events, recent website visits / "time of last session," live email opens and clicks (for speed-to-lead), decision-maker enrichment extended beyond P2, and AI-rotated-lead visibility. Conversely, "hand raise" triggers are too sensitive — a cold "no" reply is being read as hand-raise intent.

> *"Very excited about potential new hire signals. New hire was her highest ROI trigger as a rep, especially new marketers."* — Soraya Hatcher, Feb 5

> *"Take some of these intent signals… and we're actually layering them into maybe a one-line intro or something for reps to call so that it cuts down on our research."* — Kris Wemyss, Feb 17

**Implications for design:** expand signal coverage; make signals contact-linked not just account-linked (ties to Daniel Budreika's critique); consider AI-generated opening-line suggestions powered by signals; tighten hand-raise logic so polite-no replies don't trigger.

---

## Theme: Positive reception — concept and layout are broadly praised

**Sources:** CSV — scattered across all categories.
**Frequency:** Present in ~15–20% of entries
**Summary:** Despite the volume of complaints, reps repeatedly describe the concept and layout as "great," "clean + easy to use," "much better than the task queue," "incredibly organized." The frustration is with execution details (bugs, data, missing properties), not the direction. This is a useful counterweight when reading the feedback list in bulk.

> *"I've actually enjoyed the layout of the workspace."* — Jacob Stansell, Feb 5

> *"This is clean + easy to use. Great workspace."* — Rachel Blankenship, Feb 5

> *"Love the workspace — it's getting better every day."* — Rachel Blankenship (paraphrased), Mar 16

---

## Secondary themes (smaller but tracked)

- **Filters don't persist** — frustrating when reps tab out or blitz (Katie Walsh, Feb 5).
- **Saved views limitations** — can't reorder, can't save new views cleanly, contact names don't show in custom contact views.
- **Task queue edge cases** — tasks not marking completed, "all is not lost" errors on 30+ task queues, tasks not showing at company level when on contact.
- **Manager-specific asks** — customize the dashboard shown in Sales Workspace; favourite-reps list for coaching; visibility into rep dismissal reasons.
- **Blitz mode** — DC-mandated 3×/week blitzes need a list of contacts filtered by criteria (industry, incumbent tool, recent funding) for targeted calling.
- **Recycle / capacity control** — reps want the ability to recycle obvious-garbage accounts out of capacity themselves, rather than wait for auto-recycler (Kevin Fraser, Feb 20).

---

## Open research questions

- What's the actual false-positive rate on P1s? Need a quantitative comparison of rep-rated "good fit" accounts vs system P1s to know how much of the trust problem is perception vs model accuracy.
- Among reps who *do* use the workspace as their primary view, what made it click for them? (vs the rep population still working from company views.)
- For SDRs specifically (vs GS): is the feedback pattern different? Most of the CSV is AE/GS-heavy; we should validate SDR signal separately.
- Does in-product SLA clarification meaningfully change behavior, or do reps already know and simply disagree with the requirements?
