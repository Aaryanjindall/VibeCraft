import ProjectCard from "./ProjectCard";
import { useProject } from "../hooks/useProject";
import { useNavigate } from "react-router-dom";
import { useFiles } from "../context/FileContext";


const ProjectsGrid = ({ projects,onSelect,onOpen }) => {
  const { loadProject } = useProject();
  const {deleteProject} = useFiles();
  const navigate = useNavigate();

  const handleOpen = async (id) => {
    await loadProject(id);
    navigate("/app"); // redirect
  };

//   const handleDelete = async (id) => {
//     await fetch("http://localhost:5001/api/project/delete/" + id, {
//       method: "DELETE",
//       credentials: "include",
//     });
    
//     // refresh karna mat bhool
    
//   };

//   useEffect(()=>{
//     window.location.reload();
//   },[projects])

  return (
    <div className="grid grid-cols-3 gap-5">
      {projects.map((p) => (
        <ProjectCard
          key={p._id}
          project={p}
          onOpen={onOpen}
          deleteProject={deleteProject}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};

export default ProjectsGrid;