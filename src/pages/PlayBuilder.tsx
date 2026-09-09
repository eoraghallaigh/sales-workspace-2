import { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import WorkspaceHeader from "@/components/WorkspaceHeader";
import CreateViewModal from "@/components/CreateViewModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCyclePath } from "@/hooks/useCyclePath";
import { usePlays } from "@/contexts/PlaysContext";
import { Play, PlayState, PlayStatus, getPlayState } from "@/data/playData";

const PlayBuilder = () => {
  const navigate = useNavigate();
  const { cyclePath } = useCyclePath();
  const { playId } = useParams();
  const { plays, addPlay, updatePlay } = usePlays();

  const editing = playId ? plays.find((c) => c.id === playId) ?? null : null;
  const isEditMode = !!editing;

  const [latestPlay, setLatestPlay] = useState<Play | null>(editing ?? null);
  const [canPublish, setCanPublish] = useState(false);
  const [isPotm, setIsPotm] = useState(editing?.isPotm ?? false);

  const editingState: PlayState | null = editing ? getPlayState(editing) : null;

  type PendingModal =
    | { kind: "lifecycle-change"; fromState: PlayState; toState: PlayState }
    | { kind: "move-to-draft" };
  const [pendingModal, setPendingModal] = useState<PendingModal | null>(null);

  const handlePlayChange = useCallback((play: Play, publishable: boolean) => {
    setLatestPlay(play);
    setCanPublish(publishable);
  }, []);

  const handlePublish = () => {
    if (!latestPlay || !canPublish) return;
    const today = new Date().toISOString().slice(0, 10);
    const status: PlayStatus = latestPlay.startDate > today ? "scheduled" : "live";
    const published = { ...latestPlay, status, isPotm };
    if (isEditMode && editing) {
      updatePlay(editing.id, { ...published, id: editing.id });
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
    if (isEditMode && editing) {
      updatePlay(editing.id, { ...draft, id: editing.id });
    } else {
      addPlay(draft);
    }
    navigate(cyclePath("/plays"));
  };

  const computeNewState = (play: Play): PlayState => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(`${play.startDate}T00:00:00`);
    const end = new Date(`${play.endDate}T00:00:00`);
    if (start > today) return "upcoming";
    if (end < today) return "ended";
    return "active";
  };

  const commitSave = () => {
    if (!latestPlay || !editing) return;
    const today = new Date().toISOString().slice(0, 10);
    const status: PlayStatus = latestPlay.startDate > today ? "scheduled" : "live";
    const saved = { ...latestPlay, status, isPotm, id: editing.id };
    updatePlay(editing.id, saved);
    navigate(cyclePath("/plays"));
  };

  const repVisibilityChanges = (fromState: PlayState, toState: PlayState): boolean =>
    fromState === "active" || toState === "active";

  const handleSave = () => {
    if (!latestPlay || !canPublish || !editingState) return;
    const newState = computeNewState(latestPlay);
    if (newState !== editingState && repVisibilityChanges(editingState, newState)) {
      setPendingModal({ kind: "lifecycle-change", fromState: editingState, toState: newState });
      return;
    }
    commitSave();
  };

  const handleMoveToDraft = () => {
    if (!latestPlay || !editing) return;
    if (editingState === "active") {
      setPendingModal({ kind: "move-to-draft" });
      return;
    }
    const draft: Play = {
      ...latestPlay,
      label: latestPlay.label.trim() || "Untitled Play",
      status: "draft",
      isPotm,
      id: editing.id,
    };
    updatePlay(editing.id, draft);
    navigate(cyclePath("/plays"));
  };

  const confirmModal = () => {
    if (!latestPlay || !pendingModal || !editing) return;
    if (pendingModal.kind === "move-to-draft") {
      const draft: Play = {
        ...latestPlay,
        label: latestPlay.label.trim() || "Untitled Play",
        status: "draft",
        isPotm,
        id: editing.id,
      };
      updatePlay(editing.id, draft);
    } else {
      commitSave();
      setPendingModal(null);
      return;
    }
    setPendingModal(null);
    navigate(cyclePath("/plays"));
  };

  const dismissModal = () => setPendingModal(null);

  const handleClose = () => {
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

  const saveTooltip = (() => {
    if (!latestPlay || !editingState) return null;
    const newState = computeNewState(latestPlay);
    if (newState === editingState) return null;
    const stateLabel: Record<PlayState, string> = {
      draft: "Draft",
      upcoming: "Upcoming",
      active: "Active",
      ended: "Ended",
    };
    return `This will move the play from ${stateLabel[editingState]} to ${stateLabel[newState]}`;
  })();

  const stateLabel: Record<PlayState, string> = {
    draft: "Draft",
    upcoming: "Upcoming",
    active: "Active",
    ended: "Ended",
  };

  const lifecycleModalCopy = (() => {
    if (pendingModal?.kind !== "lifecycle-change") return null;
    const { fromState, toState } = pendingModal;
    const from = stateLabel[fromState];
    const to = stateLabel[toState];
    if (toState === "ended") {
      return {
        title: "This will end the play",
        description: `The dates you've chosen will move this play from ${from} to ${to}. Reps will lose access.`,
        action: "Save & End Play",
      };
    }
    if (toState === "upcoming") {
      return {
        title: "This will reschedule the play",
        description: `The dates you've chosen will move this play from ${from} to ${to}. Reps will lose access until the new launch date.`,
        action: "Save & Reschedule",
      };
    }
    if (toState === "active") {
      return {
        title: "This will activate the play",
        description: `The dates you've chosen will move this play from ${from} to ${to}. Reps will see this play immediately.`,
        action: "Save & Activate",
      };
    }
    return {
      title: "This will change the play's status",
      description: `The dates you've chosen will move this play from ${from} to ${to}.`,
      action: "Save",
    };
  })();

  const potmCheckbox = (
    <label className="flex items-center gap-1.5 cursor-pointer body-75 text-[var(--color-text-core-default)]">
      <Checkbox checked={isPotm} onCheckedChange={(v) => setIsPotm(v === true)} />
      POTM
    </label>
  );

  const formFooter = (() => {
    const wrap = (buttons: React.ReactNode) => (
      <div className="border-t border-[var(--color-border-container-default)]">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2">{buttons}</div>
          {potmCheckbox}
        </div>
      </div>
    );

    if (!isEditMode || editingState === "draft") {
      return wrap(
        <>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="primary" size="medium" onClick={handlePublish} disabled={!canPublish}>
                  Publish
                </Button>
              </TooltipTrigger>
              {canPublish && publishTooltip && (
                <TooltipContent side="top">{publishTooltip}</TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
          <Button variant="secondary" size="medium" onClick={handleSaveDraft}>
            Save as Draft
          </Button>
        </>
      );
    }

    if (editingState === "upcoming" || editingState === "active") {
      return wrap(
        <>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="primary" size="medium" onClick={handleSave} disabled={!canPublish}>
                  Save
                </Button>
              </TooltipTrigger>
              {canPublish && saveTooltip && (
                <TooltipContent side="top">{saveTooltip}</TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
          <Button variant="secondary" size="medium" onClick={handleMoveToDraft}>
            Move to Draft
          </Button>
        </>
      );
    }

    // Ended — save only (Ended → Draft is blocked)
    return wrap(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="primary" size="medium" onClick={handleSave} disabled={!canPublish}>
              Save
            </Button>
          </TooltipTrigger>
          {canPublish && saveTooltip && (
            <TooltipContent side="top">{saveTooltip}</TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  })();

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
      </div>

      {/* Lifecycle change confirmation — only when reps lose access (Active → non-Active) */}
      <AlertDialog open={pendingModal?.kind === "lifecycle-change"} onOpenChange={(open) => { if (!open) dismissModal(); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{lifecycleModalCopy?.title}</AlertDialogTitle>
            <AlertDialogDescription>{lifecycleModalCopy?.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={dismissModal}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmModal}>{lifecycleModalCopy?.action}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Move to draft confirmation (Active → Draft, reps lose access) */}
      <AlertDialog open={pendingModal?.kind === "move-to-draft"} onOpenChange={(open) => { if (!open) dismissModal(); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Move to draft?</AlertDialogTitle>
            <AlertDialogDescription>
              Reps will lose access to this play immediately. You can re-publish it later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={dismissModal}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmModal}>Move to Draft</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default PlayBuilder;
