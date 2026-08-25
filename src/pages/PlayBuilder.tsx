import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import WorkspaceHeader from "@/components/WorkspaceHeader";
import CreateViewModal from "@/components/CreateViewModal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { StatusIndicator } from "@/components/ui/status-indicator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCyclePath } from "@/hooks/useCyclePath";
import { usePlays } from "@/contexts/PlaysContext";
import { Play, PlayStatus } from "@/data/playData";

// How long after the last edit we commit the draft and flip to "Changes saved".
const AUTOSAVE_DELAY_MS = 1000;

type SaveState = "idle" | "saving" | "saved";

const PlayBuilder = () => {
  const navigate = useNavigate();
  const { cyclePath } = useCyclePath();
  const { playId } = useParams();
  const { plays, addPlay, updatePlay } = usePlays();

  const editing = playId ? plays.find((c) => c.id === playId) ?? null : null;
  const isEditMode = !!editing;

  // The latest play assembled by the form, plus whether it's ready to publish.
  const [latestPlay, setLatestPlay] = useState<Play | null>(editing ?? null);
  const [canPublish, setCanPublish] = useState(false);
  // Drives the bottom-panel status: nothing until the first edit, then it
  // cycles saving -> saved. An existing play starts already "saved".
  const [saveState, setSaveState] = useState<SaveState>(isEditMode ? "saved" : "idle");
  // The id of the row we're auto-saving into. Set on first create so later
  // edits update the same draft instead of spawning duplicates.
  const draftIdRef = useRef<string | null>(editing?.id ?? null);
  // The form emits once on mount; skip it so we don't show "Saving" on load.
  const sawFirstChangeRef = useRef(false);
  // Serialized snapshot of the last play we processed. Auto-saving writes back
  // into the plays store, which re-emits a content-identical play; comparing
  // against this lets us ignore that echo so the status can settle on "saved".
  const lastSavedRef = useRef<string | null>(null);
  // Whether the user has actually edited a form field. Stays false through the
  // mount emit, so backing straight out of a fresh form saves nothing.
  const hasEditedRef = useRef(false);
  const [isPotm, setIsPotm] = useState(editing?.isPotm ?? false);

  const handlePlayChange = useCallback((play: Play, publishable: boolean) => {
    setLatestPlay(play);
    setCanPublish(publishable);
  }, []);

  // On each edit: show "Saving changes" immediately, then a beat after the user
  // stops interacting commit the draft and flip to "Changes saved". In create
  // mode the actual write waits until the play has a real name.
  useEffect(() => {
    if (!latestPlay) return;
    // Compare on content only: buildPlay regenerates a volatile id on every
    // emit, so including it would flag benign re-emits (e.g. the form resetting
    // on mount) as edits and surface "Saving changes" before any real change.
    const serialized = JSON.stringify({ ...latestPlay, id: "" });
    if (!sawFirstChangeRef.current) {
      sawFirstChangeRef.current = true;
      lastSavedRef.current = serialized;
      return;
    }
    // Ignore re-emits whose content matches what we already saved — notably the
    // echo from auto-saving writing back into the plays store — otherwise the
    // status would loop "saving" → "saved" → "saving" and never settle.
    if (serialized === lastSavedRef.current) return;

    // Reaching here means real content changed (the mount emit and echoes are
    // filtered above), so this is a genuine user edit.
    hasEditedRef.current = true;
    setSaveState("saving");

    const timer = setTimeout(() => {
      if (draftIdRef.current) {
        // Pin the id: in create mode buildPlay regenerates it each keystroke, so
        // keep updating the same draft row rather than spawning duplicates.
        updatePlay(draftIdRef.current, { ...latestPlay, isPotm, id: draftIdRef.current });
      } else {
        draftIdRef.current = latestPlay.id;
        addPlay({ ...latestPlay, isPotm, status: "draft" });
      }
      lastSavedRef.current = serialized;
      setSaveState("saved");
    }, AUTOSAVE_DELAY_MS);

    return () => clearTimeout(timer);
  }, [latestPlay, addPlay, updatePlay]);

  const handlePublish = () => {
    if (!latestPlay || !canPublish) return;
    const today = new Date().toISOString().slice(0, 10);
    const status: PlayStatus = latestPlay.startDate > today ? "scheduled" : "live";
    const published = { ...latestPlay, status, isPotm };
    if (draftIdRef.current) {
      updatePlay(draftIdRef.current, { ...published, id: draftIdRef.current });
    } else {
      addPlay(published);
    }
    navigate(cyclePath("/plays"));
  };

  const handleSaveDraft = () => {
    if (!latestPlay) return;
    const draft: Play = {
      ...latestPlay,
      label: latestPlay.label.trim() || "Untitled Play",
      status: "draft",
      isPotm,
    };
    if (draftIdRef.current) {
      updatePlay(draftIdRef.current, { ...draft, id: draftIdRef.current });
    } else {
      draftIdRef.current = draft.id;
      addPlay(draft);
    }
    navigate(cyclePath("/plays"));
  };

  const handleClose = () => {
    if (hasEditedRef.current && latestPlay) {
      const finalPlay: Play = {
        ...latestPlay,
        label: latestPlay.label.trim() || "Untitled Play",
        status: isEditMode ? latestPlay.status : "draft",
        isPotm,
      };
      if (draftIdRef.current) {
        updatePlay(draftIdRef.current, { ...finalPlay, id: draftIdRef.current });
      } else {
        draftIdRef.current = finalPlay.id;
        addPlay(finalPlay);
      }
    }
    navigate(cyclePath("/plays"));
  };

  const publishTooltip = (() => {
    if (!latestPlay?.startDate) return null;
    const today = new Date().toISOString().slice(0, 10);
    if (latestPlay.startDate > today) {
      const formatted = new Date(latestPlay.startDate + "T00:00:00").toLocaleDateString(
        undefined,
        { month: "short", day: "numeric", year: "numeric" }
      );
      return `Reps won't see the play until ${formatted}`;
    }
    return "Reps will see this play immediately";
  })();

  const formFooter = (
    <div className="border-t border-[var(--color-border-container-default)]">
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="primary"
                  size="medium"
                  onClick={handlePublish}
                  disabled={!canPublish}
                >
                  Publish
                </Button>
              </TooltipTrigger>
              {canPublish && publishTooltip && (
                <TooltipContent side="top">
                  {publishTooltip}
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
          <Button
            variant="secondary"
            size="medium"
            onClick={handleSaveDraft}
          >
            Save as Draft
          </Button>
        </div>
        <label className="flex items-center gap-1.5 cursor-pointer body-75 text-[var(--color-text-core-default)]">
          <Checkbox checked={isPotm} onCheckedChange={(v) => setIsPotm(v === true)} />
          POTM
        </label>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="flex flex-col h-[var(--page-content-height)] overflow-hidden bg-muted/30 pb-4">
        <WorkspaceHeader
          backLink={{ to: cyclePath("/plays"), label: "Plays" }}
          title={isEditMode ? "Edit play" : "Create play"}
        />

        <div className="flex-1 min-h-0 overflow-hidden">
          <CreateViewModal
            isOpen
            onClose={handleClose}
            onPlayChange={handlePlayChange}
            footer={formFooter}
            initialPlay={editing ?? undefined}
          />
        </div>
        {saveState !== "idle" && (
          <div className="ml-12 pb-1">
            <StatusIndicator
              key={saveState}
              className="animate-fade-in"
              loading={saveState === "saving"}
              dotClassName="bg-trellis-green-600"
              label={saveState === "saving" ? "Saving changes" : "Changes saved"}
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PlayBuilder;
