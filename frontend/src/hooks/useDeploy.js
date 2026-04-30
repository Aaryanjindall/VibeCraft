import { useState } from "react";
import { useFiles } from "../context/FileContext";
import { toast } from "react-toastify";

export const useDeploy = () => {

    const [deploys,setDeploys] = useState([]);
    const [deployStatus, setDeployStatus] = useState("");
    const {currentProject, setCurrentProject} = useFiles();

const deploy = async() => {
  try{
  if(!currentProject){
    return;
  }
  setDeployStatus("Deploying...");
  const id = currentProject.id;
  const res = await fetch("https://vibecraft-zodr.onrender.com/api/deploy/internal/"+id,
  {
    method : "POST",
    credentials: "include"
  }
);
  const data = await res.json();
  setDeployStatus("Success");
  toast.success("Deployed SuccessFully")
  await loadDeploys();
  const url = data.url;
  navigator.clipboard.writeText(url);
  window.open(url,'_blank').focus();
  
}catch(err){
  setDeployStatus("Error");
  toast.error("Deploy failed ❌");
}
}
const deploynet = async () => {
  try {
    if (!currentProject) return;

    setDeployStatus("Deploying...");

    const res = await fetch(
      "https://vibecraft-zodr.onrender.com/api/deploy/netlify/" + currentProject.id,
      {
        method: "POST",
        credentials: "include",
      }
    );

    const data = await res.json();

    if (data.url) {
      setDeployStatus("Success");
      toast.success("Netlify Deploy 🚀");

      await loadDeploys(); // 🔥 important

      navigator.clipboard.writeText(data.url);
      window.open(data.url, "_blank");
    } else {
      setDeployStatus("Failed");
    }
  } catch (err) {
    setDeployStatus("Error");
    toast.error("Deploy failed ❌");
  }
};

const loadDeploys = async () => {
  if (!currentProject) return;
  const res = await fetch(
    "https://vibecraft-zodr.onrender.com/api/deploy/history/" +
      currentProject.id,
    {
      credentials: "include",
    }
  );
  const data = await res.json();
  setDeploys(data);
};
return{
    deploys,
    setDeploys,
    deployStatus,
    setDeployStatus,
    deploy,
    loadDeploys,
    deploynet,
}};
