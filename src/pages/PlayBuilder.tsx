import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import WorkspaceHeader from "@/components/WorkspaceHeader";
import CreateViewModal from "@/components/CreateViewModal";
import { useCyclePath } from "@/hooks/useCyclePath";
import { usePlays } from "@/contexts/PlaysContext";
import { Play } from "@/data/playData";

const PlayBuilder = () => {
  const navigate = useNavigate();
  const { cyclePath } = useCyclePath();
  const { playId } = useParams();
  const { plays, addPlay, updatePlay } = usePlays();

  const editing = playId ? plays.find((c) => c.id === playId) ?? null : null;
  const isEditMode = !!editing;

  const handleSave = (play: Play) => {
    if (editing) {
      updatePlay(editing.id, play);
    } else {
      addPlay(play);
    }
  };

  const handleClose = () => {
    navigate(cyclePath("/plays"));
  };

  return (
    <Layout>
      <div className="flex flex-col h-[calc(100vh-3rem)] overflow-hidden bg-muted/30">
        <WorkspaceHeader
          backLink={{ to: cyclePath("/plays"), label: "Plays" }}
          title={isEditMode ? "Edit play" : "Create play"}
        />

        <div className="flex-1 min-h-0 overflow-hidden">
          <CreateViewModal
            isOpen
            onClose={handleClose}
            onSave={handleSave}
            initialPlay={editing ?? undefined}
          />
        </div>
      </div>
    </Layout>
  );
};

export default PlayBuilder;
