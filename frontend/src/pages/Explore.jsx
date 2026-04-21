import { useEffect } from "react";
import { useProject } from "../hooks/useProject";
import PublicProjectGrid from "../components/Publicprojectgrid";

const Explore = () => {
  const { loadpublic, Publicprojects } = useProject();

  useEffect(() => {
    loadpublic();
  }, []);

  return (
    <div className="p-6 bg-[#020617] min-h-screen text-white">
      <h1 className="text-2xl mb-6">🌍 Explore Projects</h1>

      <PublicProjectGrid projects={Publicprojects} />
      
    </div>
  );
};
export default Explore;