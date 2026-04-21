import { useEffect, useState } from "react";

const AdminPage = () => {
  const [dashboard, setDashboard] = useState({});
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userData, setUserData] = useState(null);

  // 🔥 LOAD DASHBOARD
  useEffect(() => {
    fetch("/api/admin/dashboard", { credentials: "include" })
      .then(res => res.json())
      .then(setDashboard);
  }, []);

  // 🔥 LOAD USERS
  useEffect(() => {
    fetch("/api/admin/users", { credentials: "include" })
      .then(res => res.json())
      .then(setUsers);
  }, []);

  // 🔥 LOAD USER DETAIL
  const loadUser = async (id) => {
    const res = await fetch(`/api/admin/user/${id}`, {
      credentials: "include",
    });
    const data = await res.json();
    setSelectedUser(id);
    setUserData(data);
  };

  return (
    <div className="p-6 text-white bg-[#020617] min-h-screen">

      {/* 🔥 DASHBOARD */}
      <div className="grid grid-cols-4 gap-4 mb-10">
        <div className="card">Users: {dashboard.users}</div>
        <div className="card">Projects: {dashboard.projects}</div>
        <div className="card">Communities: {dashboard.communities}</div>
        <div className="card">Posts: {dashboard.posts}</div>
      </div>

      {/* 🔥 USERS */}
      <h2 className="text-xl mb-3">Users</h2>

      <div className="grid grid-cols-3 gap-3 mb-10">
        {users.map(u => (
          <div
            key={u._id}
            className="bg-[#1e293b] p-3 rounded cursor-pointer"
            onClick={() => loadUser(u._id)}
          >
            {u.username}

            <button
              onClick={(e) => {
                e.stopPropagation();
                fetch(`/api/admin/user/${u._id}`, {
                  method: "DELETE",
                  credentials: "include",
                }).then(() =>
                  setUsers(prev => prev.filter(x => x._id !== u._id))
                );
              }}
              className="text-red-400 ml-2"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* 🔥 USER DETAIL */}
      {userData && (
        <div>

          {/* SOLO PROJECTS */}
          <h3 className="mb-2">Solo Projects</h3>
          {userData.soloProjects.map(p => (
            <div key={p._id} className="bg-[#1e293b] p-2 mb-2 rounded">
              {p.name}

              <button
                onClick={() =>
                  fetch(`/api/admin/project/${p._id}`, {
                    method: "DELETE",
                    credentials: "include",
                  })
                }
                className="text-red-400 ml-2"
              >
                Delete
              </button>
            </div>
          ))}

          {/* COMMUNITIES */}
          <h3 className="mt-6 mb-2">Communities</h3>
          {userData.communities.map(c => (
            <div key={c._id} className="bg-[#1e293b] p-3 mb-3 rounded">

              <div className="flex justify-between">
                <span>{c.name}</span>

                <button
                  onClick={() =>
                    fetch(`/api/admin/community/${c._id}`, {
                      method: "DELETE",
                      credentials: "include",
                    })
                  }
                  className="text-red-400"
                >
                  Delete
                </button>
              </div>

              {/* PROJECTS INSIDE COMMUNITY */}
              <div className="ml-4 mt-2">
                {c.projects.map(p => (
                  <div key={p._id} className="text-sm">
                    📁 {p.name}
                  </div>
                ))}
              </div>

            </div>
          ))}

          {/* POSTS */}
          <h3 className="mt-6 mb-2">Posts</h3>
          {userData.posts.map(p => (
            <div key={p._id} className="bg-[#1e293b] p-2 mb-2 rounded">
              {p.content}
            </div>
          ))}

        </div>
      )}

    </div>
  );
};

export default AdminPage;