// Per-contact "dossier": coherent, record-specific outreach content generated
// from the same facts the rest of the workspace already shows — the contact's
// intent signals (src/data/signals.ts), their outreach state
// (src/data/outreachStates.ts), their role, and their company.
//
// Everything a rep reads about a contact (conversions, activity, blurb,
// friction, call script, LinkedIn message, email sequence) is derived from
// ONE source of truth, so the popover on a chip, the activity feed, and the
// call script all reference the same events. Authored hero overrides
// (DOSSIER_OVERRIDES) take precedence for demo focal points.

import {
  getOutreachState,
  type OutreachState,
} from "@/data/outreachStates";
import {
  resolveSignalDetail,
  type SignalDetail,
  type SignalId,
  type SignalInstance,
  type SignalOwner,
} from "@/data/signals";

export interface ConversionItem {
  id: string;
  label: string;
  detail: string;
  when: string;
}

export interface DossierActivityItem {
  id: string;
  direction: "inbound" | "outbound";
  type: "email" | "call" | "meeting" | "linkedin" | "pageview" | "form" | "webinar";
  title: string;
  detail?: string;
  when: string;
}

export interface EmailStep {
  subject: string;
  body: string;
}

export interface ContactDossier {
  blurb: string;
  primaryFriction: string;
  conversions: ConversionItem[];
  activity: DossierActivityItem[];
  callScript: string;
  callBullets: string[];
  linkedInMessage: string;
  emails: EmailStep[];
}

export interface DossierContact {
  id: string;
  name: string;
  role: string;
  signals: SignalInstance[];
  qlData?: { requestType: string; requestDate: string; deadline: string };
}

export interface DossierCompany {
  id: string;
  name: string;
  industry?: string;
}

// --- seeded helpers (deterministic; no Math.random / Date) -------------------

const hashSeed = (input: string): number => {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

const pick = <T>(arr: T[], seed: number, salt = 0): T => arr[(seed + salt) % arr.length];

const rowVal = (detail: SignalDetail, label: string): string | undefined =>
  detail.rows.find((r) => r.label === label)?.value;

// --- role framing ------------------------------------------------------------

interface RoleAngle {
  owns: string;
  value: string;
  peers: string;
}

const roleAngle = (role: string): RoleAngle => {
  const r = role.toLowerCase();
  if (/(cmo|marketing|demand|brand|content|growth)/.test(r)) {
    return {
      owns: "demand generation and the marketing tech stack",
      value:
        "attribute pipeline back to campaigns and run marketing and the CRM off one data model",
      peers: "marketing leaders",
    };
  }
  if (/(cro|sales|account executive|\bae\b|revenue|sdr|bdr)/.test(r)) {
    return {
      owns: "the number and how reps actually spend their day",
      value: "give reps a CRM they'll actually use and claw back the hours lost to admin",
      peers: "sales leaders",
    };
  }
  if (/(revops|operations|ops|enablement)/.test(r)) {
    return {
      owns: "the systems and data the revenue team runs on",
      value: "a clean, governable data model that doesn't need an admin army to maintain",
      peers: "RevOps and enablement leaders",
    };
  }
  if (/(cto|engineer|product|platform|technical|developer|architect|data)/.test(r)) {
    return {
      owns: "the technical evaluation and platform decisions",
      value: "an extensible platform with real APIs and a data model that scales with you",
      peers: "technical leaders",
    };
  }
  if (/(cfo|finance|controller|procurement)/.test(r)) {
    return {
      owns: "the budget and the ROI case",
      value: "lower total cost of ownership and a payback story you can defend",
      peers: "finance leaders",
    };
  }
  if (/(ceo|coo|founder|chief|president|managing)/.test(r)) {
    return {
      owns: "the growth strategy across the business",
      value: "a unified Smart CRM that scales go-to-market without the tool sprawl",
      peers: "founders and operators",
    };
  }
  return {
    owns: "a key part of the buying decision",
    value: "a unified platform that replaces a stack of disconnected point tools",
    peers: "leaders in your seat",
  };
};

// --- per-signal angles, hydrated from the SAME resolved signal detail --------

const SIGNAL_PRIORITY: SignalId[] = [
  "recent-ql",
  "viewed-pricing",
  "attended-webinar",
  "past-hubspot-user",
  "recent-hire",
];

interface SignalAngle {
  id: SignalId;
  hook: string; // call/email opener
  blurbClause: string;
  frictionClause: string;
  conversion?: ConversionItem;
  inboundActivity?: DossierActivityItem;
}

const buildSignalAngle = (
  signal: SignalInstance,
  owner: SignalOwner,
): SignalAngle | null => {
  const detail = resolveSignalDetail(signal, owner);
  switch (signal.id) {
    case "recent-ql": {
      const trigger = (rowVal(detail, "Trigger") ?? detail.headline ?? "an inbound request").toLowerCase();
      const when = rowVal(detail, "Occurred") ?? "recently";
      return {
        id: signal.id,
        hook: `thanks for ${trigger} — that's exactly the kind of timing worth a quick call`,
        blurbClause: `they've just raised their hand (${trigger}), so a buying motion is already underway`,
        frictionClause: `they're actively evaluating right now, and the window to be the vendor who responds first is short`,
        conversion: {
          id: "cv-ql",
          label: "Marketing-qualified lead",
          detail: rowVal(detail, "Trigger") ?? detail.headline ?? "Inbound request",
          when,
        },
        inboundActivity: {
          id: "ac-ql",
          direction: "inbound",
          type: "form",
          title: rowVal(detail, "Trigger") ?? "Submitted an inbound request",
          when,
        },
      };
    }
    case "viewed-pricing": {
      const views = rowVal(detail, "Views") ?? "several";
      const last = rowVal(detail, "Last viewed") ?? "recently";
      return {
        id: signal.id,
        hook: `I noticed your team has been back on our pricing page a few times this week`,
        blurbClause: `they're already comparing pricing (${views} views), which usually means an evaluation is live`,
        frictionClause: `they're weighing cost and ROI right now and will be comparing you against the incumbent`,
        conversion: {
          id: "cv-pricing",
          label: "Viewed pricing page",
          detail: `${views} views · last ${last}`,
          when: last,
        },
        inboundActivity: {
          id: "ac-pricing",
          direction: "inbound",
          type: "pageview",
          title: `Viewed pricing page (${views}×)`,
          detail: rowVal(detail, "Pages"),
          when: last,
        },
      };
    }
    case "attended-webinar": {
      const title = rowVal(detail, "Webinar") ?? "our recent session";
      const date = rowVal(detail, "Date") ?? "recently";
      return {
        id: signal.id,
        hook: `great to see you join our session "${title}"`,
        blurbClause: `they're actively researching — they joined our "${title}" webinar`,
        frictionClause: `they're in learning mode and open to a point of view, not a hard pitch`,
        conversion: {
          id: "cv-webinar",
          label: "Attended webinar",
          detail: title,
          when: date,
        },
        inboundActivity: {
          id: "ac-webinar",
          direction: "inbound",
          type: "webinar",
          title: `Attended webinar: ${title}`,
          when: date,
        },
      };
    }
    case "past-hubspot-user": {
      const hub = rowVal(detail, "Product") ?? "HubSpot";
      const prev = rowVal(detail, "Previously at") ?? "a previous company";
      return {
        id: signal.id,
        hook: `I saw you worked in ${hub} back at ${prev} — figured the context would be useful`,
        blurbClause: `they already know the product from ${hub} at ${prev}, so there's no education curve`,
        frictionClause: `they know what good looks like and will be quick to spot where their current stack falls short`,
      };
    }
    case "recent-hire": {
      const joined = rowVal(detail, "Joined") ?? "recently";
      return {
        id: signal.id,
        hook: `congrats on the new role — the first 90 days are usually when the stack gets a hard look`,
        blurbClause: `they're new in seat (joined ${joined}), with a fresh mandate and few sunk-cost loyalties`,
        frictionClause: `as a recent hire they're under pressure to show early wins and are re-evaluating inherited tools`,
      };
    }
    default:
      return null;
  }
};

// --- outbound activity, sourced from the contact's outreach state ------------

const outboundActivity = (state: OutreachState): DossierActivityItem[] => {
  const items: DossierActivityItem[] = [];

  switch (state.call.kind) {
    case "connected":
      items.push({
        id: "ob-call",
        direction: "outbound",
        type: "call",
        title: "Logged call — connected",
        detail: `${state.call.durationMin} min conversation`,
        when: state.call.at,
      });
      break;
    case "no-answer":
      items.push({
        id: "ob-call",
        direction: "outbound",
        type: "call",
        title: "Logged call — no answer",
        detail: `${state.call.attempts} attempt${state.call.attempts === 1 ? "" : "s"}`,
        when: state.call.lastAttemptAt,
      });
      break;
    case "voicemail":
      items.push({
        id: "ob-call",
        direction: "outbound",
        type: "call",
        title: "Logged call — left voicemail",
        when: state.call.lastAttemptAt,
      });
      break;
    default:
      break;
  }

  if (state.linkedin.kind === "pending") {
    items.push({
      id: "ob-li",
      direction: "outbound",
      type: "linkedin",
      title: "LinkedIn request sent",
      when: state.linkedin.sentAt,
    });
  } else if (state.linkedin.kind === "accepted") {
    items.push({
      id: "ob-li",
      direction: "inbound",
      type: "linkedin",
      title: "LinkedIn request accepted",
      when: state.linkedin.acceptedAt,
    });
  }

  if (state.sequence.kind !== "not-enrolled") {
    state.sequence.statuses.forEach((status, i) => {
      if (status.kind === "sent") {
        if (status.reply) {
          items.push({
            id: `ob-reply-${i}`,
            direction: "inbound",
            type: "email",
            title: `Replied to email ${i + 1}`,
            detail: status.reply.preview,
            when: status.reply.at,
          });
        } else {
          items.push({
            id: `ob-email-${i}`,
            direction: "outbound",
            type: "email",
            title: `Sequence email ${i + 1} sent`,
            detail:
              status.opens > 0
                ? `opened ${status.opens}×${status.clicks > 0 ? `, ${status.clicks} click${status.clicks === 1 ? "" : "s"}` : ""}`
                : "not opened yet",
            when: status.sentAt,
          });
        }
      }
    });
  }

  return items;
};

// --- composition -------------------------------------------------------------

const orderedAngles = (
  contact: DossierContact,
  owner: SignalOwner,
): SignalAngle[] => {
  const angles = contact.signals
    .map((s) => buildSignalAngle(s, owner))
    .filter((a): a is SignalAngle => a !== null);
  return angles.sort(
    (a, b) => SIGNAL_PRIORITY.indexOf(a.id) - SIGNAL_PRIORITY.indexOf(b.id),
  );
};

const buildBlurb = (
  contact: DossierContact,
  company: DossierCompany,
  angles: SignalAngle[],
): string => {
  const firstName = contact.name.split(" ")[0];
  const angle = roleAngle(contact.role);
  const lead = `${firstName} owns ${angle.owns} at ${company.name}.`;
  const why = angles[0]
    ? ` Worth prioritising because ${angles[0].blurbClause}.`
    : ` No active intent yet, but the role makes them a natural first thread into the account.`;
  const second =
    angles[1] && angles[1].blurbClause !== angles[0]?.blurbClause
      ? ` On top of that, ${angles[1].blurbClause}.`
      : "";
  return `${lead}${why}${second}`;
};

const buildFriction = (
  contact: DossierContact,
  company: DossierCompany,
  angles: SignalAngle[],
): string => {
  const firstName = contact.name.split(" ")[0];
  const industry = company.industry ? company.industry.toLowerCase() : "their market";
  const base = `In ${industry}, teams like ${company.name}'s tend to run on a patchwork of point tools that don't share a single source of truth.`;
  const angleClause = angles[0]
    ? ` For ${firstName} specifically, ${angles[0].frictionClause}.`
    : ` ${firstName} hasn't shown a hand yet, so the opening is a sharp, well-researched point of view rather than a pitch.`;
  return `${base}${angleClause}`;
};

const buildConversions = (
  angles: SignalAngle[],
  seed: number,
): ConversionItem[] => {
  const fromSignals = angles
    .map((a) => a.conversion)
    .filter((c): c is ConversionItem => c !== undefined);
  const sessions = pick(["3", "5", "7", "9"], seed);
  const lastVisit = pick(["yesterday", "2 days ago", "4 days ago", "last week"], seed, 1);
  fromSignals.push({
    id: "cv-visits",
    label: "Visited website",
    detail: `${sessions} sessions in the last 30 days`,
    when: lastVisit,
  });
  return fromSignals;
};

const buildCallBullets = (
  contact: DossierContact,
  company: DossierCompany,
  angles: SignalAngle[],
): string[] => {
  const angle = roleAngle(contact.role);
  const bulletFor = (a: SignalAngle): string => {
    switch (a.id) {
      case "recent-ql":
        return `Inbound signal: ${a.conversion?.detail ?? "recent qualified lead"}`;
      case "viewed-pricing":
        return `Comparing pricing now — ${a.conversion?.detail ?? "evaluation likely live"}`;
      case "attended-webinar":
        return `Engaged with our webinar: ${a.conversion?.detail ?? "recent session"}`;
      case "past-hubspot-user":
        return "Has used HubSpot before — minimal education curve";
      case "recent-hire":
        return "New in seat — actively re-evaluating the inherited stack";
      default:
        return a.hook;
    }
  };
  const bullets = angles.slice(0, 2).map(bulletFor);
  bullets.push(`HubSpot helps ${company.name} ${angle.value}`);
  bullets.push(`Can get a team like ${company.name}'s live in weeks, not quarters`);
  return bullets;
};

const buildCallScript = (
  contact: DossierContact,
  company: DossierCompany,
  angles: SignalAngle[],
): string => {
  const firstName = contact.name.split(" ")[0];
  const angle = roleAngle(contact.role);
  const opener = angles[0]
    ? `Hi ${firstName} — ${angles[0].hook}.`
    : `Hi ${firstName} — I've been looking at what ${company.name} is building and wanted to reach out directly.`;
  const bridge = `Teams in your seat usually tell me the hard part is less about features and more about pulling everything into one place your team will actually use.`;
  const value = `That's exactly where we help — we ${angle.value}, and we can get a team like ${company.name}'s live in weeks, not quarters.`;
  const ask = `Worth a quick 15 minutes this week to see if it's a fit?`;
  return `"${opener} ${bridge} ${value} ${ask}"`;
};

const buildLinkedIn = (
  contact: DossierContact,
  company: DossierCompany,
  angles: SignalAngle[],
): string => {
  const firstName = contact.name.split(" ")[0];
  if (angles[0]) {
    return `"Hi ${firstName} — ${angles[0].hook}. I work with ${company.industry ?? "teams like yours"} on exactly this; would love to connect and share what we're seeing."`;
  }
  return `"Hi ${firstName} — I've been following ${company.name}'s growth and work with teams in your space on consolidating their go-to-market stack. Would love to connect."`;
};

const buildEmails = (
  contact: DossierContact,
  company: DossierCompany,
  angles: SignalAngle[],
): EmailStep[] => {
  const firstName = contact.name.split(" ")[0];
  const angle = roleAngle(contact.role);
  const primary = angles[0];
  const secondary = angles[1];

  const subject1 = primary
    ? primary.id === "viewed-pricing"
      ? `Saw ${company.name} comparing options`
      : primary.id === "recent-ql"
        ? `Following up on your request`
        : primary.id === "attended-webinar"
          ? `Glad you joined the session`
          : primary.id === "recent-hire"
            ? `Congrats on the new role at ${company.name}`
            : `A quick note for your ${company.name} stack`
    : `Helping ${company.name} consolidate the GTM stack`;

  const open1 = primary
    ? `${primary.hook}.`
    : `I've been researching ${company.name} and how teams in ${company.industry ?? "your space"} are scaling go-to-market.`;

  const email1: EmailStep = {
    subject: subject1,
    body: `Hi ${firstName},\n\n${open1}\n\nMost ${angle.peers} I talk to are trying to ${angle.value}. We do exactly that, and the teams that switch usually feel it first in time saved every week.\n\nWould you be open to a quick 15 minutes to see whether it's a fit for ${company.name}?`,
  };

  const proof = secondary
    ? `It connects to the other thing I noticed — ${secondary.blurbClause}.`
    : `A ${company.industry ?? "similar"} team your size recently consolidated three tools into one and cut their reps' admin time by roughly a third.`;

  const email2: EmailStep = {
    subject: `One more reason it's worth a look, ${firstName}`,
    body: `Hi ${firstName},\n\nFollowing up on my last note. ${proof}\n\nI put together a short before/after of what a move would look like for a team like ${company.name}'s — happy to walk you through it. Does later this week work?`,
  };

  const email3: EmailStep = {
    subject: `Should I close the loop, ${firstName}?`,
    body: `Hi ${firstName},\n\nI know things get busy, so I'll keep this short. If consolidating ${company.name}'s stack and giving your team back time isn't a priority this quarter, no problem at all — just let me know and I'll stop reaching out.\n\nIf it is worth a look, I'm happy to share the analysis either way.`,
  };

  return [email1, email2, email3];
};

// Authored hero overrides for demo focal points (merged over the generated dossier).
const DOSSIER_OVERRIDES: Record<string, Partial<ContactDossier>> = {};

export const getContactDossier = (
  contact: DossierContact,
  company: DossierCompany,
): ContactDossier => {
  const seed = hashSeed(contact.id);
  const owner: SignalOwner = {
    kind: "contact",
    id: contact.id,
    name: contact.name,
    role: contact.role,
    companyName: company.name,
  };
  const angles = orderedAngles(contact, owner);

  const generated: ContactDossier = {
    blurb: buildBlurb(contact, company, angles),
    primaryFriction: buildFriction(contact, company, angles),
    conversions: buildConversions(angles, seed),
    activity: [
      ...outboundActivity(getOutreachState(contact.id, contact.name.split(" ")[0])),
      ...angles
        .map((a) => a.inboundActivity)
        .filter((a): a is DossierActivityItem => a !== undefined),
    ],
    callScript: buildCallScript(contact, company, angles),
    callBullets: buildCallBullets(contact, company, angles),
    linkedInMessage: buildLinkedIn(contact, company, angles),
    emails: buildEmails(contact, company, angles),
  };

  return { ...generated, ...DOSSIER_OVERRIDES[contact.id] };
};
