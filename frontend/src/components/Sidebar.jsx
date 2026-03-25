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
        width: 250,
        height: "100vh",
        background: "#222",
        color: "white"
      }}
    >

      <h3>Projects</h3>

      {
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