import { useState,useEffect } from "react";


export const useCommunity = () => {
    const [communities,setCommunities] = useState([]);
    const [selectedCommunity,setSelectedCommunity] = useState("");
    const [communityProjects,setcommunityProjects] = useState([]);
    const [communitymembers,setcommunitymembers] = useState([]);
    const createCommunity = async (name) => {
    console.log(name);
    const res = await fetch(
      "http://localhost:5001/api/community/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ name }),
        
      }
    );
    const data = await res.json();
    console.log(data);

  };

  useEffect(()=>{
      fetch("http://localhost:5001/api/community/my",{
        credentials: "include",
      }).then((res) => res.json())
      .then(setCommunities);
    },[]);

    const joinCommunity = async (id) => {
    await fetch(
      "http://localhost:5001/api/communtity/join/"+id,{
        method: "POST",
        credentials: "include",
      }
    );

  };

  const loadCommunities = async() => {
    const res = await fetch(
      "http://localhost:5001/api/community/my",{
        credentials: "include",
        method: "GET",
      }
    );
    const data = await res.json();
    console.log(data);
    setCommunities(Array.isArray(data) ? data : []);
    
  }
  const getCommunityProjects = async(id) => {
    const res = await fetch(
      "http://localhost:5001/api/community/projects/"+id,{
        method: "GET",
        credentials: "include",
      }
    );
    const data = await res.json();
    setcommunityProjects(data);
  }

  const getCommunityMembers = async (id) => {
  const res = await fetch(
    "http://localhost:5001/api/community/members/" + id,
    {
      credentials: "include",
    }
  );

  if (!res.ok) {
    setcommunitymembers([]);
    return;
  }

  const data = await res.json();
  setcommunitymembers(Array.isArray(data) ? data : []);
};

  return {
    loadCommunities,
    setCommunities,
    communities,
    joinCommunity,
    createCommunity,
    getCommunityProjects,
    communityProjects,
    getCommunityMembers,
    communitymembers
  }

}