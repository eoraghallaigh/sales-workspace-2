# Design Principles

**Last updated:** 2026-04-30

The rules of thumb for how we design the prospecting workspace. When proposing a new pattern, check here first — if the idea conflicts with a principle, either rethink it or flag the tradeoff explicitly.

---

## What we're trying to enhance

Sales managers describe effective prospecting as the combination of three skills. Every feature we ship should make at least one of these easier — and shouldn't undermine the others.

### Structured planning
Effective reps block time for prospecting and know in advance how they are going to use that time.
- They decide ahead when they're working reactive vs proactive, install base vs net new.
- They prepare call lists the night before so they can execute immediately during power hours.

**Designs should:** make it cheap to plan tomorrow's work today; make it obvious what falls into reactive vs proactive and install vs net new; preserve a rep's plan when they come back to the workspace the next morning.

### Strategic targeting
Intent does not equal fit. Effective reps prioritise high-fit accounts (employee size, industry) over low-quality high-intent leads, and they personalise outreach when it matters.
- Recent conversions and intent signals are valuable, but only when paired with high fit.
- Personalised emails and LinkedIn messages still beat generic blasts.

**Designs should:** surface fit alongside intent — never one without the other; make it fast to act on a strong signal *only when* the account is also worth working; support personalisation without slowing the rep down.

### Depth of work
High performers don't just contact one person — they map the account and reach multiple decision-makers in parallel. They prefer 3–4 distinct touches per account over a single touch across many accounts.
- Top reps reach into multiple roles (CMO, VP Sales, CEO) at the same account.
- They use creative formats like Loom videos to break through, not just automated sequences.

**Designs should:** make multi-threading the default, not an extra step; show coverage across an account, not just per-contact activity; encourage variety in touch types — calls, LinkedIn, personalised email, video — over volume of identical sends.

---

## 1. Reduce decision-making, not information

Reps don't need fewer data points — they need less time spent deciding what to do next. Prioritize, sort, and recommend by default. Filters are for exceptions, not the starting point.

## 2. Action without leaving context

Engagement (email, call) should be initiated from where the rep is looking. Side panels and new tabs break momentum. The daily loop is: see → decide → act → next — in one place.

## 3. Company-centric, contact-aware

Reps think about companies; outreach happens at contacts. Every view should let a rep assess a company at a glance and drill into contacts without losing company context.

## 4. Trust the prioritization

If we tell a rep "work this first", we need to be right often enough that they stop second-guessing. Prioritization must be deterministic and explainable — no black-box ranking that reps can't reason about.

## 5. Progress is visible

"Worked" status, contacts reached, task completion — surface these so reps build momentum and managers see signal. Invisible progress is demotivating and hard to coach against.

## 6. Safe defaults, powerful overrides

Default views should work for the median rep on day one. Power users (high performers, specialists) should be able to filter, sort, and customize — but never at the cost of the default experience.

## 7. Respect the operating model

BoB, P buckets, SLAs, PPF/geo variations — these are real constraints, not suggestions. Designs must accommodate the fact that "worked" means different things in different contexts.

## 8. { 👉 add more principles as they crystallize }

---

## Anti-patterns to avoid

> *Things we've tried or seen that don't work. Specific is better than generic.*

- **Dumping every signal into a row** — if everything is bold, nothing is.
- **Requiring reps to pick a view before they can start** — the default should be opinionated.
- { 👉 }
