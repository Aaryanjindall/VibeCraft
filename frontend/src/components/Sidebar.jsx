import { useEffect } from "react";

const Sidebar = ({
  showSidebar,
  projects,
  getProjects,
  loadProject,
  deleteProject
}) => {

  useEffect(() => {

    if (showSidebar) {
      getProjects();
    }

  }, [showSidebar]);


  if (!showSidebar) return null;


  return (

    <div
      style={{
        position: "fixed",
        right: 0,
        top: 0,
        width: 270,
        height: "50vh",
        background: "#231010",
        color: "white",
        
        
      }}
    >

      <h3 style={{
        textAlign: "center"
      }}>Projects</h3>

      {

        Array.isArray(projects) && 
        projects.map((p) => (
          <div key={p._id}>
            {p.name}
            <button
              onClick={() =>
                loadProject(p._id)
              }
            >
              Open
            </button>

            <button onClick={()=>deleteProject(p._id)}>Delete</button>
          </div>

        ))
      }

    </div>

  );

};

export default Sidebar;