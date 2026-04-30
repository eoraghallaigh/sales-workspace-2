import type { TouchStatus } from "@/components/TouchDot";
import {
  getOutreachState,
  type OutreachState,
  type EmailStatus,
} from "@/data/outreachStates";

const callSlot = (state: OutreachState): TouchStatus => {
  switch (state.call.kind) {
    case "no-answer":
    case "voicemail":
    case "connected":
      return "completed";
    default:
      return "empty";
  }
};

const linkedinSlot = (state: OutreachState): TouchStatus => {
  switch (state.linkedin.kind) {
    case "pending":
    case "accepted":
    case "declined":
    case "already-connected":
      return "completed";
    default:
      return "empty";
  }
};

const emailSlot = (status: EmailStatus | undefined): TouchStatus => {
  if (!status) return "empty";
  if (status.kind === "sent") return "completed";
  if (status.kind === "scheduled") return "scheduled";
  return "empty";
};

const emailStatuses = (state: OutreachState): EmailStatus[] => {
  if (state.sequence.kind === "not-enrolled") return [];
  return [...state.sequence.statuses];
};

export const deriveTouchStatuses = (state: OutreachState): TouchStatus[] => {
  const emails = emailStatuses(state);
  return [
    callSlot(state),
    linkedinSlot(state),
    emailSlot(emails[0]),
    emailSlot(emails[1]),
    emailSlot(emails[2]),
  ];
};

export const deriveTouchCount = (state: OutreachState): number =>
  deriveTouchStatuses(state).filter((s) => s === "completed").length;

export const deriveTouchesForContact = (
  contactId: string,
  fullName: string,
): { statuses: TouchStatus[]; count: number; state: OutreachState } => {
  const firstName = fullName.split(" ")[0] || fullName;
  const state = getOutreachState(contactId, firstName);
  return {
    state,
    statuses: deriveTouchStatuses(state),
    count: deriveTouchCount(state),
  };
};

export type ActivityEmail = {
  type: "email";
  id: string;
  index: number;
  status: EmailStatus;
};

export type ActivityCall = {
  type: "call";
  id: string;
  state: OutreachState["call"];
};

export type ActivityLinkedIn = {
  type: "linkedin";
  id: string;
  state: OutreachState["linkedin"];
};

export type ActivityItem = ActivityEmail | ActivityCall | ActivityLinkedIn;

export const getActivityTimeline = (state: OutreachState): ActivityItem[] => {
  const items: ActivityItem[] = [];
  if (state.call.kind !== "not-attempted") {
    items.push({ type: "call", id: "call", state: state.call });
  }
  if (state.linkedin.kind !== "not-sent") {
    items.push({ type: "linkedin", id: "linkedin", state: state.linkedin });
  }
  emailStatuses(state).forEach((status, i) => {
    if (status.kind === "sent" || status.kind === "scheduled") {
      items.push({ type: "email", id: `email-${i}`, index: i, status });
    }
  });
  return items;
};
