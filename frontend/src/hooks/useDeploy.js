import { useState } from "react";
import { useFiles } from "../context/FileContext";

export const useDeploy = () => {

    const [deploys,setDeploys] = useState([]);
    const [deployStatus, setDeployStatus] = useState("");
    const {currentProject,
        setCurrentProject} = useFiles();

const deploy = async() => {
  try{
  if(!currentProject){
    return;
  }
  setDeployStatus()
  const id = currentProject.id;
  const res = await fetch("http://localhost:5001/api/deploy/internal/"+id,
  {
    method : "POST",
    credentials: "include"
  }
);
  const data = await res.json();
  const url = data.url;
  navigator.clipboard.writeText(url);
  window.open(url,'_blank').focus();
  
}catch(err){
  console.log(err);
}
}

const deploynet = async() => {
  try{
    if(!currentProject)return;
    setDeployStatus("Deploying...");
    const res = await fetch("http://localhost:5001/api/deploy/netlify/"+currentProject.id,{
      method: "POST",
      credentials: "include",
    });

    const data = await res.json();
    if(data.url){
      setDeployStatus("Success");
      const url = data.url;
      console.log(url);
      navigator.clipboard.writeText(url);
      window.open(url,"_blank");
    }
    else{
      setDeployStatus("Failed")
    }
  }catch(err){
    setDeployStatus("Error");
  }
}

const loadDeploys = async () => {
  if (!currentProject) return;
  const res = await fetch(
    "http://localhost:5001/api/deploy/history/" +
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
