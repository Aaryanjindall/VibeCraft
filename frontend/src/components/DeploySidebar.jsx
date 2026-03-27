import { useEffect } from "react";

const DeploySidebar = ({
  loadDeploys,
  depsidebar,
  deploys
}) => {

  useEffect(() => {
    if (depsidebar) {
      loadDeploys();
    }
  }, [depsidebar]);

  if (!depsidebar) return null;

  return (
    <div style={
        {
            position: "fixed",
            right: 0,
            bottom: 0,
            width: 300,
            height: "50vh",
            background: "#411313",
            color: "white"
        }
    }>
        
      <h3 style={{
        textAlign: "center"
      }}>Deploys</h3>

      {Array.isArray(deploys) &&
        deploys.map((d) => (
          <div key={d._id}>
            <p>{d.type}</p>
            <p>{d.status}</p>

            <a href={d.url} target="_blank" rel="noreferrer">
              {d.url}
            </a>
          </div>
        ))}
    </div>
  );
};

export default DeploySidebar;