import { useEffect, useState } from "react";

const CommunityPage = () => {

  const [communities, setCommunities] = useState([]);
  const [selected, setSelected] = useState(null);
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [name,setName] = useState("");


  const createCommunity = async() => {

    await fetch("http://localhost:5001/api/community/create",{
        method: "POST",
        headers: { "Content-Type": "application/json"},
        credentials: "include",
        body: JSON.stringify({ name }),
    });

    setName("");
    loadCommunities();

  }


  // 🔹 load user communities
  const loadCommunities = async () => {
    const res = await fetch(
      "http://localhost:5001/api/community/my",
      { credentials: "include" }
    );
    const data = await res.json();
    setCommunities(data);
  };

  // 🔹 load projects
  const loadProjects = async (id) => {
    const res = await fetch(
      "http://localhost:5001/api/community/projects/" + id,
      { credentials: "include" }
    );
    const data = await res.json();
    setProjects(data);
  };

  // 🔹 load members
  const loadMembers = async (id) => {
    const res = await fetch(
      "http://localhost:5001/api/community/" + id,
      { credentials: "include" }
    );
    const data = await res.json();
    setMembers(data.members || []);
  };

  useEffect(() => {
    loadCommunities();
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh", color: "white" }}>

      {/* LEFT SIDEBAR */}
      <div style={{ width: "200px", background: "#111", padding: "10px" }}>
        <input placeholder="New Community" value={name} onChange={(e) => setName(e.target.value)}/>
        <button onClick={createCommunity}>Create</button>

        <h3>Communities</h3>

        {communities.map((c) => (
          <div
            key={c._id}
            onClick={() => {
              setSelected(c);
              loadProjects(c._id);
              loadMembers(c._id);
            }}
            style={{
              padding: "8px",
              cursor: "pointer",
              background:
                selected?._id === c._id ? "#333" : "transparent",
            }}
          >
            {c.name}
          </div>
        ))}
      </div>

      {/* CENTER */}
      <div style={{ flex: 1, padding: "20px" }}> 
        {selected ? (
          <>
            <h2>{selected.name}</h2>
            <h4>Projects</h4>
            {projects.map((p) => (
              <div
                key={p._id}
                style={{
                  padding: "10px",
                  borderBottom: "1px solid #333",
                }}
              >
                {p.name}
              </div>
            ))}

          </>
        ) : (
          <h2>Select a community</h2>
        )}

      </div> 

      {/* RIGHT MEMBERS */}
      <div style={{ width: "200px", background: "#111", padding: "10px" }}>
        <h3>Members</h3>

        {members.map((m) => (
          <div key={m._id}>
            {m.username}
          </div>
        ))}
      </div>

    </div>
  );
};

export default CommunityPage;