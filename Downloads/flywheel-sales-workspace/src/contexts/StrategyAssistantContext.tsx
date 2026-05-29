import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { StrategyVariantId } from "@/data/companyStrategies";

export interface AssistantMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: number;
}

interface StrategyAssistantContextValue {
  messages: AssistantMessage[];
  activeVariantByCompany: Record<string, StrategyVariantId>;
  isRewriting: Record<string, boolean>;
  isAssistantBusy: boolean;
  requestRewrite: (companyId: string, userText: string) => void;
  askResearch: (companyId: string, userText: string) => void;
  revertVariant: (companyId: string) => void;
  resetConversation: () => void;
}

const StrategyAssistantContext = createContext<StrategyAssistantContextValue | null>(null);

const REWRITE_DELAY_MS = 7000;
const ASSISTANT_TYPING_DELAY_MS = 600;

const matchVariantFromText = (text: string): StrategyVariantId | null => {
  if (/salesforce/i.test(text)) return "salesforce-displacement";
  return null;
};

const newId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export const StrategyAssistantProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [activeVariantByCompany, setActiveVariantByCompany] = useState<
    Record<string, StrategyVariantId>
  >({});
  const [isRewriting, setIsRewriting] = useState<Record<string, boolean>>({});
  const [isAssistantBusy, setIsAssistantBusy] = useState(false);
  const timeoutsRef = useRef<number[]>([]);

  const pushMessage = useCallback((role: AssistantMessage["role"], text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: newId(), role, text, timestamp: Date.now() },
    ]);
  }, []);

  const requestRewrite = useCallback(
    (companyId: string, userText: string) => {
      const trimmed = userText.trim();
      if (!trimmed) return;

      pushMessage("user", trimmed);
      setIsAssistantBusy(true);

      const matched = matchVariantFromText(trimmed);

      if (!matched) {
        const t = window.setTimeout(() => {
          pushMessage(
            "assistant",
            "I can rewrite this strategy with a particular angle in mind — for example, emphasizing HubSpot's advantages over Salesforce. Try one of the suggested prompts and I'll regenerate the strategy.",
          );
          setIsAssistantBusy(false);
        }, ASSISTANT_TYPING_DELAY_MS);
        timeoutsRef.current.push(t);
        return;
      }

      const ackTimeout = window.setTimeout(() => {
        pushMessage(
          "assistant",
          "On it. I'm rewriting the strategy to emphasize HubSpot's advantages over Salesforce — this should only take a moment.",
        );
        setIsRewriting((prev) => ({ ...prev, [companyId]: true }));
      }, ASSISTANT_TYPING_DELAY_MS);
      timeoutsRef.current.push(ackTimeout);

      const completeTimeout = window.setTimeout(() => {
        setActiveVariantByCompany((prev) => ({ ...prev, [companyId]: matched }));
        setIsRewriting((prev) => {
          const next = { ...prev };
          delete next[companyId];
          return next;
        });
        pushMessage(
          "assistant",
          "Done. I've rewritten the business intelligence, primary friction, call script, LinkedIn note, and the full email sequence to position HubSpot against Salesforce. You can revert from the banner at the top of the strategy.",
        );
        setIsAssistantBusy(false);
      }, ASSISTANT_TYPING_DELAY_MS + REWRITE_DELAY_MS);
      timeoutsRef.current.push(completeTimeout);
    },
    [pushMessage],
  );

  // Research Q&A: answer a "go deeper" question against the loaded company research.
  // This is a read/explain interaction, distinct from requestRewrite (which regenerates
  // the strategy). The prototype returns a plausible, on-topic acknowledgement.
  const askResearch = useCallback(
    (_companyId: string, userText: string) => {
      const trimmed = userText.trim();
      if (!trimmed) return;

      pushMessage("user", trimmed);
      setIsAssistantBusy(true);

      const t = window.setTimeout(() => {
        pushMessage(
          "assistant",
          "Here's what I can pull together from the research and the CRM record. I've pieced this from public signals (hiring, funding, leadership moves, press) and the account's activity history — want me to go deeper on any one thread, or turn this into a call brief or outreach draft?",
        );
        setIsAssistantBusy(false);
      }, ASSISTANT_TYPING_DELAY_MS + 900);
      timeoutsRef.current.push(t);
    },
    [pushMessage],
  );

  const revertVariant = useCallback(
    (companyId: string) => {
      setActiveVariantByCompany((prev) => {
        const next = { ...prev };
        delete next[companyId];
        return next;
      });
      pushMessage("assistant", "Reverted to the default strategy for this company.");
    },
    [pushMessage],
  );

  const resetConversation = useCallback(() => {
    timeoutsRef.current.forEach((t) => window.clearTimeout(t));
    timeoutsRef.current = [];
    setMessages([]);
    setIsAssistantBusy(false);
  }, []);

  const value = useMemo<StrategyAssistantContextValue>(
    () => ({
      messages,
      activeVariantByCompany,
      isRewriting,
      isAssistantBusy,
      requestRewrite,
      askResearch,
      revertVariant,
      resetConversation,
    }),
    [
      messages,
      activeVariantByCompany,
      isRewriting,
      isAssistantBusy,
      requestRewrite,
      askResearch,
      revertVariant,
      resetConversation,
    ],
  );

  return (
    <StrategyAssistantContext.Provider value={value}>
      {children}
    </StrategyAssistantContext.Provider>
  );
};

export const useStrategyAssistant = (): StrategyAssistantContextValue => {
  const ctx = useContext(StrategyAssistantContext);
  if (!ctx) {
    throw new Error(
      "useStrategyAssistant must be used inside <StrategyAssistantProvider>",
    );
  }
  return ctx;
};
