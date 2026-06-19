# PPF in the Workspace \-  User Testing Report

[Eoin Ó Raghallaigh](mailto:eoraghallaigh@hubspot.com) Nov 14, 2025

# **Research Objectives**

1. **Evaluate Current State:** Understand how reps use, perceive, and "work around" the BoB pilot within the *existing CRM task queue*.  
2. **Validate Future State:** Test the usability, comprehension, and perceived value of the *new workspace prototype*.  
3. **Identify Gaps:** Discover what's missing from the prototype and if it successfully supports the reps desired workflow, by replicating what’s good about the CRM task queues and eliminating any problems identified with task queues.

	[PPF Research Plan](https://docs.google.com/document/u/0/d/1yS_a3DZZ8ckBsy9rcKmrSFeNSxSLtzLiLxADZiJw2uQ/edit)

# **Key Insights**

#### How do reps currently access, understand and prioritise BoB leads?

* **Reps are still primarily using their own company views** to find and work BoB leads, rather than the prescribed task queues. This is because the company views allow them to sort and filter their companies and make sure they are working the highest fits first. P1 to P4 then, simply becomes a filter that the reps apply to their company views.

  * *“If I do the task view, sometimes I feel like I'm reaching out to low accounts rather than the high accounts”*

  * *"So then I'll go through my own view in the company view, rate them all. I'll come into \[task view\], select all and complete tasks."*

  * *"So what I've done is just added the column for priority and I'll just filter by P1 and then start to take a look at some of these."*

  * *[using-own-company-views.mp4](https://drive.google.com/file/d/1Ly7rWVPC8hOtQ71mNuRwRXIk4h6s6jmO/view?usp=drive_link)*

* **There is widespread confusion and a lack of awareness regarding the Prospect Priority (P1-P4) framework.** Several participants did not understand the criteria for each level or what triggered a high-priority rating, leading them to distrust the system's suggestions. 

  * *“I'm not exactly sure what's triggering a P1 because sometimes I'll get accounts that I wouldn't consider P1… There was no Ql or Hinkle. So I'm kind of like, why? Why are they P1, you know?”*

  * *[confusion-about-prioritisation.mp4](https://drive.google.com/file/d/1Z52NGzU5lCEFFoY0gczLsRDN76a3j77l/view?usp=drive_link)*

* **Reps universally augment the system's prioritization with their own manual vetting process.** They rely on “classic” data points (e.g., conversion triggers, recent activity, decision maker job titles, company website) and deep record research to determine lead priority, rather than trusting the assigned P-level. 

  * *"From there, I immediately click on each account and I rate them and I do a next step."*

  * *"Maybe they are P1, but if they're a blogger about, you know, like a group that manage games of wizards and warlocks in the local park, like, I don't feel like I need to spend time on that."*

  * *"So I kind of have my own system of finding the ones that I feel like I really want to do first."*

#### Do reps currently use tasks to track their prospecting activity?

* **Multiple participants actively ignore system-generated tasks**, viewing them as low-value "administrative burden" and "pollution" that clutters their workspace. This leads to behaviors like bulk-completing tasks without acting on them just to clear the queue. 

  * [ignoring-tasks.mp4](https://drive.google.com/file/d/1smd3uAHpUvT9fQ9pOkojVrDQ1dn7kuW6/view?usp=drive_link)

* While system tasks are ignored, several participants rely on their own self-created tasks for high-value follow-ups.

  * *"Because I mean I do tasks every day but some of it's like the task is evaluating deals, contact every deal, like seeing who I haven't contacted in companies. How I manage tasks is more like I make these little filters and I like, you know, do tasks that really matter to me and make sure those stand out among others."*

#### How do reps currently get the context they need to make a call?

* Multiple reps described a consistent workflow of opening the full company and contact records, checking activity history and notes, and often using external tools like LinkedIn before feeling prepared to make a call. A couple of reps said they wouldn’t just call from the workspace or a task CTA.

#### How is the prototype's usability and comprehension?

* While the prototype was generally seen as an improvement over the task queue, several participants found key UI elements ambiguous (e.g., "recent touch") and felt that the most critical prioritization signals (e.g., a lead requesting a call) were not visually prominent enough. 

* There is low awareness of the SLA mandates for P1 leads. Several participants were unaware that there was a due date associated with these high-priority accounts. 

  * *"I didn't know there was a due date on P1s, but I do regularly check my P1s and reach out to them."*

#### What does a rep naturally want to do when they determine that a P1 lead is not a good fit?

* When a lead is deemed a bad fit after manual review, reps want to take an explicit action to dismiss or complete the item to remove it from their active queue, document their findings, and move on. 

#### What specific data points are missing from the prototype?

* Multiple participants identified critical information gaps on the prototype card that would still force them to open the full record before taking action. Key missing data includes account-level context (industry, employee count, HubSpot usage summary), contact-level context, and activity history (notes, past conversations). 

* The lack of sufficient context on the card leads to a hesitation to use the embedded action buttons (call, email). Multiple participants stated they would not feel comfortable using these shortcuts without first doing their own research on the full record. 

# **Critical Issues**

**Fundamental Distrust in System-Driven Prioritization:** Reps do not trust the quality of BoB leads or the validity of the P-level framework that prioritizes them. This is the root cause of nearly all workarounds and manual vetting behaviors.

**Current Workflow is an Administrative Burden that Disrupts Sales Activity**: The prescribed task-based workflow is perceived by multiple participants as a high-volume, low-value administrative task that actively detracts from revenue-generating activities, leading to its abandonment.

**Insufficient Context Blocks Immediate Action**: Reps feel they cannot take immediate action from any summary view (task queue or prototype) because it lacks the critical context they need to have a relevant conversation. This forces a multi-step, multi-tab research process for every lead.

# **Secondary Issues**

**Lack of Program Awareness:** Some participants demonstrated a significant awareness gap regarding the fundamental rules and tools of the BoB pilot program, including P-level definitions and SLAs.

**Overwhelming Volume Creates Task Blindness:** The sheer volume of automatically generated tasks is overwhelming for reps, contributing to their decision to ignore the task queue entirely.

# **Opportunities & Recommendations**

### **Immediate Actions (Implement ASAP)**

1\.  **Enrich the workspace UI with critical context.** Prioritize adding some missing data/properties to the company preview panel: Next Step, Rep Rating and Hub Summary. Reps need this context before they will execute any outreach to a company, and they will continue to go to the company record to find it if it's not in the workspace.

2\.  **Implement a "Dismiss" or "Complete" Action.** Provide a clear mechanism for reps to remove companies from their P1 list. Currently, the P1 list is ordered by task urgency (most overdue at the top). 

3\.  **Increase visual prominence of high-intent signals.** Redesign the UI to make critical signals like "Requested a call" or "QL" immediately and obviously apparent to the user at a glance.

### **Medium-Term Initiatives**

1\.  **Surface reasoning to build trust.** For each lead, clearly explain \*why\* it was prioritized (e.g., "P1 because: New Hire \+ Pricing Page View"). This transparency is crucial for overcoming the fundamental distrust in the system.

2\. **Address perceived low lead quality.** Launch a quantitative analysis to compare rep-rated "good fit" accounts with system-prioritized P1s to identify and correct discrepancies in the lead scoring model.

### **Long-Term Initiatives**

**Re-evaluate the role of automated tasks in prospecting.** Given the universal abandonment of the task-based workflow, pivot the strategy away from pushing specific tasks to reps and instead focus on creating a trusted, comprehensive "homebase" where they can find and work their best leads.