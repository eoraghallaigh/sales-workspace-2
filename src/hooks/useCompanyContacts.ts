import { useCallback, useMemo, useState } from "react";
import type { RecommendedContact } from "@/components/CompanyCard";

export interface ContactFeedback {
  contactId: string;
  contactName: string;
  reason: string;
  note?: string;
  removed: boolean;
  submittedAt: string;
}

interface RemoveResult {
  contact: RecommendedContact;
  index: number;
}

export interface UseCompanyContactsReturn {
  contacts: RecommendedContact[];
  reorder: (fromId: string, toId: string) => void;
  remove: (id: string) => RemoveResult | null;
  add: (newContacts: RecommendedContact[]) => void;
  restore: (contact: RecommendedContact, index: number) => void;
  recordFeedback: (feedback: ContactFeedback) => void;
  feedbackHistory: ContactFeedback[];
}

export const useCompanyContacts = (
  initial: RecommendedContact[],
): UseCompanyContactsReturn => {
  const [contacts, setContacts] = useState<RecommendedContact[]>(initial);
  const [feedbackHistory, setFeedbackHistory] = useState<ContactFeedback[]>([]);

  const reorder = useCallback((fromId: string, toId: string) => {
    if (fromId === toId) return;
    setContacts((prev) => {
      const fromIndex = prev.findIndex((c) => c.id === fromId);
      const toIndex = prev.findIndex((c) => c.id === toId);
      if (fromIndex === -1 || toIndex === -1) return prev;
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  }, []);

  const remove = useCallback((id: string): RemoveResult | null => {
    let removed: RemoveResult | null = null;
    setContacts((prev) => {
      const index = prev.findIndex((c) => c.id === id);
      if (index === -1) return prev;
      removed = { contact: prev[index], index };
      return prev.filter((c) => c.id !== id);
    });
    return removed;
  }, []);

  const add = useCallback((newContacts: RecommendedContact[]) => {
    if (newContacts.length === 0) return;
    setContacts((prev) => {
      const existingIds = new Set(prev.map((c) => c.id));
      const toAppend = newContacts.filter((c) => !existingIds.has(c.id));
      return [...prev, ...toAppend];
    });
  }, []);

  const restore = useCallback(
    (contact: RecommendedContact, index: number) => {
      setContacts((prev) => {
        if (prev.some((c) => c.id === contact.id)) return prev;
        const next = [...prev];
        const safeIndex = Math.max(0, Math.min(index, next.length));
        next.splice(safeIndex, 0, contact);
        return next;
      });
    },
    [],
  );

  const recordFeedback = useCallback((feedback: ContactFeedback) => {
    setFeedbackHistory((prev) => [...prev, feedback]);
  }, []);

  return useMemo(
    () => ({
      contacts,
      reorder,
      remove,
      add,
      restore,
      recordFeedback,
      feedbackHistory,
    }),
    [contacts, reorder, remove, add, restore, recordFeedback, feedbackHistory],
  );
};
