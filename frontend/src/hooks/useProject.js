import { useState, useEffect } from "react";
import { useFiles } from "../context/FileContext";

export const useProject = () => {

  const [Projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const {files,setFiles,runFiles,setRunFiles,currentProject,setCurrentProject,unsaved,setUnsaved} = useFiles();

  const handleGenerate = async (prompt) => {
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5001/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      setFiles(data.files);
      setRunFiles(data.files);
      setCurrentProject(null);
      setUnsaved(true);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const loadProject = async (id) => {
    try {
      const res = await fetch(
        "http://localhost:5001/api/project/" + id,
        { credentials: "include" }
      );

      const data = await res.json();

      setFiles(data.files);
      setRunFiles(data.files);
      setUnsaved(false);

      setCurrentProject({
        id: data._id,
        name: data.name,
      });

      localStorage.setItem("lastProjectId", data._id);

    } catch (err) {
      console.log(err);
    }
  };

  const getProjects = async () => {
    const res = await fetch(
      "http://localhost:5001/api/project",
      { credentials: "include" }
    );

    const data = await res.json();
    setProjects(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    const lastId = localStorage.getItem("lastProjectId");
    if (lastId && lastId !== "undefined") {
      loadProject(lastId);
    }
  }, []);

  const deleteProject = async(id) => {
  await fetch(
    "http://localhost:5001/api/project/delete/"+ id,
    {
      method: "DELETE",
      credentials: "include"
    }
  );
  // getProjects();
  if (
    currentProject &&
    currentProject.id === id
  ) {
    setFiles({});
    setCurrentProject(null);
    localStorage.removeItem(
    "lastProjectId"
    )
  }
}

  return {
    Projects,
    getProjects,
    loadProject,
    handleGenerate,
    loading,
    deleteProject
  };
};