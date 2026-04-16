import { useState,useEffect } from "react";


export const useCommunity = () => {
    const [communities,setCommunities] = useState([]);
    const [selectedCommunity,setSelectedCommunity] = useState("");
    const [communityProjects,setcommunityProjects] = useState([]);
    const [communitymembers,setcommunitymembers] = useState([]);
    const [exploreCommunities, setExploreCommunities] = useState([]);
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
    setCommunities(prev => [...prev, data]);
    console.log(data);

  };

  useEffect(() => {
  fetch("http://localhost:5001/api/community/my", {
    credentials: "include",
  })
    .then((res) => {
      if (!res.ok) throw new Error("Unauthorized");
      return res.json();
    })
    .then((data) => {
      setCommunities(Array.isArray(data) ? data : []);
    })
    .catch((err) => {
      console.log(err);
      setCommunities([]);
    });
}, []);

    const joinCommunity = async (id) => {
    await fetch(
      "http://localhost:5001/api/community/join/"+id,{
        method: "POST",
        credentials: "include",
      }
    );
    exploreCommunitiesFn();
    loadCommunities();

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
  const exploreCommunitiesFn = async () => {
  const res = await fetch(
    "http://localhost:5001/api/community/all",
    {
      method: "GET",
      credentials: "include",
    }
  );

  const data = await res.json();

  setExploreCommunities(
    Array.isArray(data) ? data : []
  );
};

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

const addProjectToCommunity = async (projectId, communityId) => {
  await fetch(
    "http://localhost:5001/api/community/add-project",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ projectId, communityId }),
    }
  );
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
    communitymembers,exploreCommunities, setExploreCommunities,
    exploreCommunitiesFn,addProjectToCommunity
  }

}