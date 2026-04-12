import { useEffect, useState } from "react";
import { useDeploy } from "../hooks/useDeploy";
import { ExternalLink, Trash2 } from "lucide-react";
import { useProject } from "../hooks/useProject";

const ProjectDetails = ({ project,onOpen }) => {

  const {deploys,deploy,loadDeploys,deploynet} = useDeploy();
  useEffect(()=> {
    loadDeploys();
  },[]);
  const {deleteProject} = useProject();
  return (
    <>
      <h2 className="text-xl font-semibold mb-2">{project.name}</h2>

      <p className="text-gray-400 text-sm mb-5">
        {new Date(project.createdAt).toDateString()}
      </p>

      {/* ACTIONS */}
      <div className="space-y-3">

          <div>
            <h2>Deploy Status</h2>
            <div>
            <button onClick={deploy} >Quick Deploy</button>
            <button onClick={deploynet}>
              Deploy on netlify 
            </button>
            </div>
            <div>
            <h3>All Deploys</h3>
              <div>

              </div>
            </div>
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

        <button className="w-full bg-green-500 py-2 rounded-lg">
          + Add to Community
        </button>
        <div>
          <h3>Edit Project</h3>
          <button
          onClick={(e) => {
            e.stopPropagation();
            onOpen(project._id)}}
          className="text-indigo-400 hover:text-indigo-300 text-sm"
        >
          <ExternalLink size={16} />
          Open
        </button>
        </div>
        <div>
          <h3>Delete Project</h3>
            <button
          onClick={(e) => {
            e.stopPropagation();
            deleteProject(project._id);
          }}
          className="text-red-400 hover:text-red-300 text-sm"
        >
          <Trash2 size={16} />
          Delete
        </button>
          
        </div>
        <button className="text-red-400 mt-4">
          🗑 Delete Project
        </button>

      </div>
    </>
  );
};

export default ProjectDetails;