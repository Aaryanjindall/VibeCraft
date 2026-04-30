import ProjectCard from "./ProjectCard";
import { useProject } from "../hooks/useProject";
import { useNavigate } from "react-router-dom";
import { useFiles } from "../context/FileContext";


const ProjectsGrid = ({ projects,onSelect,deleteProject,onOpen }) => {
  const { loadProject } = useProject();
  const navigate = useNavigate();

  const handleOpen = async (id) => {
    await loadProject(id);
    navigate("/app"); // redirect
  };

//   const handleDelete = async (id) => {
//     await fetch("https://vibecraft-zodr.onrender.com/api/project/delete/" + id, {
//       method: "DELETE",
//       credentials: "include",
//     });
    
//     // refresh karna mat bhool
    
//   };

//   useEffect(()=>{
//     window.location.reload();
//   },[projects])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
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