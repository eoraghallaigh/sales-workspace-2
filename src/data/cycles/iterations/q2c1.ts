import type { IterationEntry } from "../types";

// Iteration entries are auto-appended by the /ship slash command.
// New entries should be added at the TOP of this array (newest first).
// Each entry's `id` matches the folder name under public/about/iterations/.
export const q2c1Iterations: IterationEntry[] = [
  {
    id: "2026-05-29-contact-reordering-and-enrollment-2",
    date: "2026-05-29",
    label: "contact-reordering-and-enrollment",
    whatChanged: [
      "Bulk Hide on the company-card multi-select now opens a \"Contact Feedback\" modal — the same one used when hiding a contact on the strategy page — instead of removing immediately.",
      "The modal's copy adapts to the selection: \"These contacts…\" for several, \"This contact…\" for one.",
      "Removed the \"Remove this contact from the outreach targets\" checkbox; submitting feedback now always hides the selected contact(s).",
      "Strategy page and company-card hide now share one modal component.",
    ],
    why: [
      "Capture a reason when reps hide contacts in bulk, not just one at a time.",
      "The remove checkbox was redundant once \"Hide\" is the action you already picked.",
      "A single shared modal keeps the hide experience consistent across the workspace.",
    ],
    commitment: "bob-view-optimisations",
    screenshots: [
      {
        src: "/about/iterations/2026-05-29-contact-reordering-and-enrollment-2/bulk-hide-modal.png",
        alt: "bulk-hide-modal screenshot",
      },
      {
        src: "/about/iterations/2026-05-29-contact-reordering-and-enrollment-2/strategy-hide-modal.png",
        alt: "strategy-hide-modal screenshot",
      },
    ],
  },
  {
    id: "2026-05-29-contact-reordering-and-enrollment",
    date: "2026-05-29",
    label: "contact-reordering-and-enrollment",
    whatChanged: [
      "Hovering a contact card now reveals a selection checkbox where the drag handle used to be; ticking one puts every card into multi-select mode.",
      "Selected cards get a 2px teal border, and an \"Enrol (N) / Hide (N) / Clear\" action row appears beneath the contacts.",
      "Enrol opens the sequence modal pre-scoped to the selected contacts — the in-modal contact-selection panel is gone, leaving just sequence selection.",
      "Hide bulk-removes all selected contacts at once.",
      "Contacts now reorder by dragging anywhere on the card, instead of via a dedicated grip handle.",
    ],
    why: [
      "Let reps act on several contacts at once (enrol/hide in bulk) rather than one card at a time.",
      "Match how production actually works: contact selection and sequence enrollment are two separate steps, so contacts are picked first and their IDs handed to the enroll flow.",
      "Make reordering feel more direct by grabbing the whole card.",
    ],
    prUrl: "https://github.com/eoraghallaigh_hubspot/flywheel-sales-workspace/pull/2",
    commitment: "bob-view-optimisations",
    screenshots: [
      {
        src: "/about/iterations/2026-05-29-contact-reordering-and-enrollment/prospecting-selection.png",
        alt: "prospecting-selection screenshot",
      },
      {
        src: "/about/iterations/2026-05-29-contact-reordering-and-enrollment/enroll-modal.png",
        alt: "enroll-modal screenshot",
      },
    ],
  },
  {
    id: "2026-04-22-disable-call-no-phone",
    date: "2026-04-22",
    label: "disable-call-no-phone",
    whatChanged: [
      "Disabled the Call button on ContactCard when a contact has no phone number, with an explanatory tooltip.",
      "Missing-phone state is now visible on the card itself rather than only surfacing after a click into the dialler.",
    ],
    why: [
      "Reps were clicking Call on contacts without a number and hitting a dead-end in the dialler, eroding trust in the contact-level affordances.",
      "Surfacing the data gap on the card helps reps decide whether to hunt down a number or pivot to email/LinkedIn.",
    ],
    prUrl: "https://git.hubteam.com/eoraghallaigh/flywheel-sales-workspace/pull/5",
    commitSha: "f7eb244f002ddd4a6006d739ff6cc75d172bc0b3",
    commitment: "bob-view-optimisations",
    screenshots: [],
  },
  {
    id: "2026-04-22-redesign-dismissal-enrollment",
    date: "2026-04-22",
    label: "redesign-dismissal-enrollment",
    whatChanged: [
      "ContactCard now surfaces persistent Call / Enrol / Hide CTAs instead of hiding actions behind a kebab menu.",
      "In-card dismissal countdown with pause-on-hover and inline feedback chips — reps can reverse a hide without leaving the card.",
      "New two-column SequenceEnrollmentModal lets reps enrol multiple contacts from one company in a single flow.",
      "Modal backgrounds unified to white across the company-card surface.",
    ],
    why: [
      "Reps need lightweight, trustworthy ways to shape their BoB without leaving the workspace.",
      "Reversible dismissals lower the cost of pruning the list, so reps actively curate instead of tolerating noise.",
      "Multi-contact enrolment matches how reps actually work a company — they decide who to sequence as a group, not one at a time.",
    ],
    prUrl: "https://git.hubteam.com/eoraghallaigh/flywheel-sales-workspace/pull/2",
    commitSha: "5b2479647fa57db9819a33ec38d230ad51111a47",
    commitment: "bob-view-optimisations",
    screenshots: [],
  },
  {
    id: "2026-04-22-contact-level-controls",
    date: "2026-04-22",
    label: "contact-level-controls",
    whatChanged: [
      "Added thumbs-down feedback + remove on contact tiles within a CompanyCard.",
      "Drag-to-reorder for contacts within a company via the new SortableContactCard.",
      "Add-from-pool flow via AddContactsModal + AddContactTile, backed by a new allContacts dataset.",
      "ContactFeedbackModal captures reason codes when reps dismiss a suggested contact.",
    ],
    why: [
      "Reps need direct control over their recommended contacts so the list reflects reality on the ground.",
      "Without these affordances, reps work around bad AI suggestions instead of correcting them — the BoB stops being trustworthy.",
      "Capturing reason codes on dismissal gives us a feedback loop into the suggestion model.",
    ],
    prUrl: "https://git.hubteam.com/eoraghallaigh/flywheel-sales-workspace/pull/1",
    commitSha: "9dfa8cb518a9c7cfb2cbff96f3c59bbbff0707ee",
    commitment: "bob-view-optimisations",
    screenshots: [],
  },
  {
    id: "2026-04-06-performance-tab-lovable",
    date: "2026-04-06",
    label: "performance-tab-lovable",
    whatChanged: ["Initial implementation of the performance tab."],
    why: ["No major changes yet."],
    commitment: "performance-tab",
    screenshots: [],
  },
];
