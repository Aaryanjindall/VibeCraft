import ProjectCard from "./ProjectCard"
import Publiccard from "./Publiccard"
import { useProject } from "../hooks/useProject"
import { useNavigate } from "react-router-dom"

const PublicProjectGrid = ({ projects }) => {
  const { loadProject } = useProject();

  const handleOpen = async (id) => {
    await loadProject(id);
    window.open(`/viewer/${id}`, "_blank");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
      {Array.isArray(projects) &&
        projects.map((p) => (
          <Publiccard
            key={p._id}
            project={p}
            onOpen={handleOpen}
          />
        ))}
    </div>
  );
};

export default PublicProjectGrid