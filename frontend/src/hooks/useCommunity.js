import { useState,useEffect } from "react";
import { toast } from "react-toastify";


export const useCommunity = () => {
    const [communities,setCommunities] = useState([]);
    const [selectedCommunity,setSelectedCommunity] = useState("");
    const [communityProjects,setcommunityProjects] = useState([]);
    const [communitymembers,setcommunitymembers] = useState([]);
    const [exploreCommunities, setExploreCommunities] = useState([]);

    const createCommunity = async (name) => {
  try {
    const res = await fetch(
      "http://localhost:5001/api/community/create",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name }),
      }
    );

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    setCommunities(prev => [...prev, data]);

    toast.success("Community created");

  } catch (err) {
    toast.error(err.message || "Failed to create community");
  }
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
  try {
    const res = await fetch(
      "http://localhost:5001/api/community/join/" + id,
      {
        method: "POST",
        credentials: "include",
      }
    );

    if (!res.ok) throw new Error("Join failed");

    toast.success("Joined community ");

    exploreCommunitiesFn();
    loadCommunities();

  } catch (err) {
    toast.error(err.message);
  }
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
    console.log(communities);
    
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
  console.log(exploreCommunities);
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
  try {
    const res = await fetch(
      `http://localhost:5001/api/community/${communityId}/add-project`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ projectId }),
      }
    );
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Something went wrong");
    }
    toast.success("Project SuccessFully Added");
    return data;
  } catch (err) {
    toast.error("Add Project Error:", err.message);
    throw err;
  }
};

const removeMember = async (targetUserId, communityId) => {
  try {
    // 🔥 Optimistic Update
    setcommunitymembers(prev => prev.filter(m => m.user._id !== targetUserId));

    const res = await fetch(
      `http://localhost:5001/api/community/${communityId}/remove`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ targetUserId }),
      }
    );
    const data = await res.json();
    if (!res.ok) {
      getCommunityMembers(communityId); // rollback on fail
      throw new Error(data.message || "Failed to remove member");
    }
    toast.success("Member SuccessFully Removed");
    return data;

  } catch (err) {
    toast.error("Remove Member Error:", err.message);
    throw err;
  }
};


const saveProject = async (communityId, projectId, files) => {
  try {
    const res = await fetch(
      `http://localhost:5001/api/community/${communityId}/save-project`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ projectId, files }),
      }
    );
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to save project");
    }
    toast.success("Successfully Contributed");
    return data;
  } catch (err) {
    toast.error("Save Project Error:", err.message);
    throw err;
  }
};
  
const forkCommunityProject = async (communityId, projectId) => {
  try {
    const res = await fetch(
      `http://localhost:5001/api/community/${communityId}/fork/${projectId}`,
      {
        method: "POST",
        credentials: "include",
      }
    );
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to fork project");
    }
    toast.success("Successfully Forked");
    return data;
  } catch (err) {
    toast.error("Fork Error:", err.message);
    throw err;
  }
};

const assignRole = async (communityId, targetUserId, newRole) => {
  try {
    // 🔥 Optimistic Update
    setcommunitymembers(prev => prev.map(m => 
      m.user._id === targetUserId ? { ...m, role: newRole } : m
    ));

    const res = await fetch(
      `http://localhost:5001/api/community/${communityId}/assign-role`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        
        body: JSON.stringify({ targetUserId, newRole }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      getCommunityMembers(communityId); // rollback on fail
      throw new Error(data.message || "Failed to assign role");
    }
    toast.success("Role SuccessFully Assigned");

    return data;
    

  } catch (err) {
    toast.error("Assign Role Error:", err.message);
    throw err;
  }
};

const deleteCommunity = async (communityId) => {
  try {
    const res = await fetch(
      `http://localhost:5001/api/community/${communityId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to delete community");
    }
    await loadCommunities();
    setCommunities(prev => prev.filter(c => c._id !== communityId));
    return data;
    toast.success("Community Deleted")
  } catch (err) {
    toast.error("Delete Community Error:", err.message);
    throw err;
  }


  

};
const removeProject = async (communityId, projectId) => {
  try {
    const res = await fetch(
      `http://localhost:5001/api/community/${communityId}/remove-project`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ projectId }),
      }
    );

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);
    setcommunityProjects(prev =>
      prev.filter(p => p._id !== projectId)
    );

    toast.success("Project removed ");

  } catch (err) {
    toast.error(err.message);
  }
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
    exploreCommunitiesFn,addProjectToCommunity,
    removeProject,
    deleteCommunity,
    assignRole,removeMember,saveProject,forkCommunityProject,
  }

}