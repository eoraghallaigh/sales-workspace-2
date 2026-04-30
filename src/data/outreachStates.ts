export type CallState =
  | { kind: "not-attempted" }
  | { kind: "no-answer"; attempts: number; lastAttemptAt: string }
  | { kind: "voicemail"; lastAttemptAt: string }
  | { kind: "connected"; at: string; durationMin: number };

export type LinkedInState =
  | { kind: "not-sent" }
  | { kind: "pending"; sentAt: string; daysWaiting: number }
  | { kind: "accepted"; acceptedAt: string }
  | { kind: "declined" }
  | { kind: "already-connected" };

export type EmailStatus =
  | { kind: "scheduled"; sendsAt: string }
  | {
      kind: "sent";
      sentAt: string;
      opens: number;
      clicks: number;
      reply?: { at: string; preview: string };
    }
  | { kind: "cancelled" };

export type SequenceState =
  | { kind: "not-enrolled" }
  | { kind: "active"; statuses: [EmailStatus, EmailStatus, EmailStatus] }
  | { kind: "completed"; statuses: [EmailStatus, EmailStatus, EmailStatus] }
  | {
      kind: "unenrolled";
      reason: string;
      statuses: [EmailStatus, EmailStatus, EmailStatus];
    };

export type OutreachState = {
  call: CallState;
  linkedin: LinkedInState;
  sequence: SequenceState;
};

const pristine: OutreachState = {
  call: { kind: "not-attempted" },
  linkedin: { kind: "not-sent" },
  sequence: { kind: "not-enrolled" },
};

export function getOutreachState(
  contactId: string,
  firstName: string,
): OutreachState {
  switch (contactId) {
    case "c1": // Jennifer Park — mid-flight
      return {
        call: { kind: "no-answer", attempts: 2, lastAttemptAt: "2 days ago" },
        linkedin: { kind: "pending", sentAt: "3 days ago", daysWaiting: 3 },
        sequence: {
          kind: "active",
          statuses: [
            { kind: "sent", sentAt: "Apr 27", opens: 2, clicks: 0 },
            { kind: "scheduled", sendsAt: "Tue Apr 30, 9:00am" },
            { kind: "scheduled", sendsAt: "Mon May 5, 9:00am" },
          ],
        },
      };
    case "c2": // Keisha Blue — fresh prospect, not yet enrolled
      return {
        call: { kind: "not-attempted" },
        linkedin: { kind: "not-sent" },
        sequence: { kind: "not-enrolled" },
      };
    case "c3": // Elowen Green — replied to email 2
      return {
        call: { kind: "not-attempted" },
        linkedin: { kind: "pending", sentAt: "5 days ago", daysWaiting: 5 },
        sequence: {
          kind: "unenrolled",
          reason: `Sequence ended because ${firstName} replied`,
          statuses: [
            { kind: "sent", sentAt: "Apr 22", opens: 2, clicks: 0 },
            {
              kind: "sent",
              sentAt: "Apr 25",
              opens: 4,
              clicks: 2,
              reply: {
                at: "Apr 26, 10:14am",
                preview: `Hi — thanks for reaching out. The ROI question is timely; we're actually reviewing our content stack right now. Could you send over that case study? Open to a 20-min call next week.`,
              },
            },
            { kind: "cancelled" },
          ],
        },
      };
    case "c1a": // Marcus Chen — connected call ended sequence
      return {
        call: { kind: "connected", at: "yesterday", durationMin: 12 },
        linkedin: { kind: "accepted", acceptedAt: "3 days ago" },
        sequence: {
          kind: "unenrolled",
          reason: `Sequence ended because you had a connected call with ${firstName}`,
          statuses: [
            { kind: "sent", sentAt: "Apr 22", opens: 3, clicks: 1 },
            { kind: "cancelled" },
            { kind: "cancelled" },
          ],
        },
      };
    case "c1b": // Diana Ross — LinkedIn accepted ended sequence
      return {
        call: { kind: "voicemail", lastAttemptAt: "yesterday" },
        linkedin: { kind: "accepted", acceptedAt: "yesterday" },
        sequence: {
          kind: "unenrolled",
          reason: `Sequence ended because ${firstName} accepted your LinkedIn request`,
          statuses: [
            { kind: "sent", sentAt: "Apr 24", opens: 1, clicks: 0 },
            { kind: "cancelled" },
            { kind: "cancelled" },
          ],
        },
      };
    default:
      return pristine;
  }
}

export type OutreachStripSegments = {
  engaged: number; // replied, connected call, or linkedin accepted
  inFlight: number; // any touch made, no positive response yet
  notStarted: number; // no outreach at all
  total: number;
};

export function getOutreachStripSegments(
  contacts: Array<{ id: string; name: string }>,
): OutreachStripSegments {
  let engaged = 0;
  let inFlight = 0;
  let notStarted = 0;

  for (const c of contacts) {
    const firstName = c.name.split(" ")[0];
    const s = getOutreachState(c.id, firstName);

    const isEngaged =
      (s.sequence.kind === "unenrolled" &&
        s.sequence.reason.includes("replied")) ||
      s.call.kind === "connected" ||
      s.linkedin.kind === "accepted";

    const hasAnyTouch =
      s.call.kind !== "not-attempted" ||
      s.linkedin.kind !== "not-sent" ||
      s.sequence.kind !== "not-enrolled";

    if (isEngaged) engaged += 1;
    else if (hasAnyTouch) inFlight += 1;
    else notStarted += 1;
  }

  return { engaged, inFlight, notStarted, total: contacts.length };
}

export function getAggregateSummary(
  state: OutreachState,
  firstName: string,
): string | null {
  if (state.sequence.kind === "unenrolled") {
    return state.sequence.reason;
  }
  if (state.call.kind === "connected") {
    return `Connected with ${firstName} ${state.call.at}`;
  }

  const touchCount =
    (state.call.kind === "no-answer" || state.call.kind === "voicemail" ? 1 : 0) +
    (state.linkedin.kind === "pending" || state.linkedin.kind === "accepted"
      ? 1
      : 0) +
    (state.sequence.kind === "active"
      ? state.sequence.statuses.filter((s) => s.kind === "sent").length
      : 0);

  if (touchCount === 0) return null;

  const channelCount =
    (state.call.kind !== "not-attempted" ? 1 : 0) +
    (state.linkedin.kind !== "not-sent" ? 1 : 0) +
    (state.sequence.kind !== "not-enrolled" ? 1 : 0);

  return `${touchCount} ${touchCount === 1 ? "touch" : "touches"} across ${channelCount} ${channelCount === 1 ? "channel" : "channels"} · awaiting reply`;
}
