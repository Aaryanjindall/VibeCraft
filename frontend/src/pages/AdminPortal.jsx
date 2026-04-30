import { useEffect, useState } from "react";
import { Users, Folder, Globe, MessageSquare, Trash2, Search, ArrowLeft, Activity, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const AdminPage = () => {
  const [dashboard, setDashboard] = useState({ users: 0, projects: 0, communities: 0, posts: 0 });
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Login State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const API_URL = "https://vibecraft-zodr.onrender.com/api/admin";

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include"
      });
      if (res.ok) {
        setIsAuthenticated(true);
        toast.success("Admin authenticated");
        fetchDashboard();
        fetchUsers();
      } else {
        toast.error("Invalid admin credentials");
        setLoading(false);
      }
    } catch (err) {
      toast.error("Login failed");
      setLoading(false);
    }
  };

  const fetchDashboard = () => {
    fetch(`${API_URL}/dashboard`, { credentials: "include" })
      .then(res => {
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) setIsAuthenticated(false);
          throw new Error("Unauthorized");
        }
        return res.json();
      })
      .then(data => setDashboard(data))
      .catch(err => console.error("Error fetching dashboard:", err));
  };

  const fetchUsers = () => {
    fetch(`${API_URL}/users`, { credentials: "include" })
      .then(res => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then(data => {
        setUsers(Array.isArray(data) ? data : []);
        setLoading(false);
        setIsAuthenticated(true);
      })
      .catch(err => {
        console.error("Error fetching users:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    // Try to fetch automatically, if it fails, show login
    fetchDashboard();
    fetchUsers();
  }, []);

  const loadUser = async (id) => {
    try {
      setUserData(null);
      const res = await fetch(`${API_URL}/user/${id}`, { credentials: "include" });
      const data = await res.json();
      setSelectedUser(id);
      setUserData(data);
    } catch (err) {
      toast.error("Failed to load user details");
    }
  };

  const deleteUser = async (e, u) => {
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to permanently delete user ${u.username}? This action is irreversible.`)) return;
    
    try {
      await fetch(`${API_URL}/user/${u._id}`, { method: "DELETE", credentials: "include" });
      setUsers(prev => prev.filter(x => x._id !== u._id));
      if (selectedUser === u._id) {
        setSelectedUser(null);
        setUserData(null);
      }
      toast.success(`Deleted user ${u.username}`);
      fetchDashboard();
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  const deleteResource = async (type, id, name) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
    
    try {
      await fetch(`${API_URL}/${type}/${id}`, { method: "DELETE", credentials: "include" });
      toast.success(`${type} deleted successfully`);
      loadUser(selectedUser); // Refresh selected user data
      fetchDashboard();
    } catch (err) {
      toast.error(`Failed to delete ${type}`);
    }
  };

  const filteredUsers = users.filter(u => u.username?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()));

  if (!isAuthenticated && !loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#111111] text-[#f0f0f0] p-4">
        <div className="bg-[#1a1a1a] p-8 rounded-xl border border-[#2d2d2d] w-full max-w-sm shadow-2xl">
          <div className="flex flex-col items-center mb-6">
            <div className="w-12 h-12 bg-[#252525] rounded-full flex items-center justify-center mb-3 border border-[#333]">
              <Lock size={20} className="text-[#e53e3e]" />
            </div>
            <h1 className="text-xl font-bold">Admin Portal</h1>
            <p className="text-xs text-[#888] mt-1">Authorized personnel only</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-[#666] font-semibold mb-1.5">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input-ide w-full py-2 px-3 text-sm" 
                placeholder="admin@aivibe.com"
                required
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-[#666] font-semibold mb-1.5">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input-ide w-full py-2 px-3 text-sm" 
                placeholder="••••••••"
                required
              />
            </div>
            <button type="submit" className="btn-ide btn-ide-primary w-full py-2.5 mt-2">
              Authenticate
            </button>
            <Link to="/" className="block text-center text-xs text-[#888] hover:text-white mt-4">Return to Landing</Link>
          </form>
        </div>
      </div>
    );
  }

  if (loading) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#111111] text-[#888]">
      <div className="w-8 h-8 rounded-full border-2 border-[#e53e3e] border-t-transparent animate-spin mb-4" />
      <span className="text-xs uppercase tracking-widest">Loading Admin Portal...</span>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#111111] text-[#f0f0f0] overflow-hidden">
      
      {/* LEFT SIDEBAR - Overview & Users */}
      <div className="w-[400px] shrink-0 border-r border-[#2d2d2d] flex flex-col bg-[#1a1a1a]">
        
        {/* Header */}
        <div className="p-6 border-b border-[#2d2d2d] bg-[#161616]">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-lg font-bold flex items-center gap-2">
              <Activity size={18} className="text-[#e53e3e]" />
              System Dashboard
            </h1>
            <Link to="/ai" className="text-xs text-[#888] hover:text-[#f0f0f0] flex items-center gap-1 transition-colors">
              <ArrowLeft size={12} /> Back to IDE
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#111111] p-3 rounded-lg border border-[#2d2d2d]">
              <div className="text-[10px] uppercase text-[#666] font-bold mb-1 flex items-center gap-1.5"><Users size={12}/> Users</div>
              <div className="text-2xl font-bold text-[#f0f0f0]">{dashboard.users || 0}</div>
            </div>
            <div className="bg-[#111111] p-3 rounded-lg border border-[#2d2d2d]">
              <div className="text-[10px] uppercase text-[#666] font-bold mb-1 flex items-center gap-1.5"><Folder size={12}/> Projects</div>
              <div className="text-2xl font-bold text-[#a855f7]">{dashboard.projects || 0}</div>
            </div>
            <div className="bg-[#111111] p-3 rounded-lg border border-[#2d2d2d]">
              <div className="text-[10px] uppercase text-[#666] font-bold mb-1 flex items-center gap-1.5"><Globe size={12}/> Communities</div>
              <div className="text-2xl font-bold text-[#4ade80]">{dashboard.communities || 0}</div>
            </div>
            <div className="bg-[#111111] p-3 rounded-lg border border-[#2d2d2d]">
              <div className="text-[10px] uppercase text-[#666] font-bold mb-1 flex items-center gap-1.5"><MessageSquare size={12}/> Posts</div>
              <div className="text-2xl font-bold text-[#3b82f6]">{dashboard.posts || 0}</div>
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="p-4 border-b border-[#2d2d2d]">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search users..."
                className="input-ide w-full pl-9 py-2 text-xs"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1">
            {filteredUsers.length === 0 ? (
              <p className="text-center text-xs text-[#666] mt-10">No users found.</p>
            ) : (
              filteredUsers.map(u => (
                <div
                  key={u._id}
                  onClick={() => loadUser(u._id)}
                  className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors border group ${
                    selectedUser === u._id 
                      ? "bg-[#252525] border-[#444]" 
                      : "bg-[#111111] border-[#2d2d2d] hover:border-[#444]"
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <img src={u.avatar || "https://via.placeholder.com/30"} alt="" className="w-8 h-8 rounded shrink-0 object-cover border border-[#333]" />
                    <div className="truncate">
                      <div className="text-sm font-semibold text-[#f0f0f0] truncate">{u.username}</div>
                      <div className="text-[10px] text-[#666] truncate">{u.email}</div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => deleteUser(e, u)}
                    className="p-1.5 text-[#666] hover:text-white hover:bg-[#e53e3e] rounded transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                    title="Delete User"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* RIGHT MAIN - User Details */}
      <div className="flex-1 bg-[#111111] overflow-y-auto custom-scrollbar">
        {!selectedUser ? (
          <div className="h-full flex flex-col items-center justify-center text-[#666] p-10">
            <Users size={48} className="mb-4 opacity-20" />
            <p className="text-lg">Select a user to view detailed telemetry</p>
            <p className="text-sm mt-2">Manage user projects, communities, and posts directly from the dashboard.</p>
          </div>
        ) : !userData ? (
          <div className="h-full flex items-center justify-center">
            <div className="w-6 h-6 rounded-full border-2 border-[#a855f7] border-t-transparent animate-spin" />
          </div>
        ) : (
          <div className="p-10 max-w-5xl mx-auto">
            
            {/* User Header */}
            <div className="flex items-center gap-5 mb-10 pb-6 border-b border-[#2d2d2d]">
              <img src={userData.user?.avatar || "https://via.placeholder.com/60"} className="w-16 h-16 rounded-xl border border-[#333]" />
              <div>
                <h2 className="text-2xl font-bold">{userData.user?.username}</h2>
                <p className="text-[#888]">{userData.user?.email}</p>
                <div className="flex items-center gap-3 mt-2 text-xs font-mono text-[#666]">
                  <span>ID: {userData.user?._id}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              
              {/* SOLO PROJECTS */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-[#888] flex items-center gap-2">
                    <Folder size={14} className="text-[#a855f7]" /> Personal Projects ({userData.soloProjects?.length || 0})
                  </h3>
                </div>
                <div className="space-y-2">
                  {userData.soloProjects?.length > 0 ? userData.soloProjects.map(p => (
                    <div key={p._id} className="bg-[#1a1a1a] border border-[#2d2d2d] rounded-lg p-4 flex items-center justify-between group hover:border-[#444] transition-colors">
                      <div className="overflow-hidden">
                        <div className="font-semibold text-sm truncate">{p.name}</div>
                        <div className="text-[10px] text-[#666] mt-1">{new Date(p.createdAt).toLocaleString()}</div>
                      </div>
                      <button
                        onClick={() => deleteResource("project", p._id, p.name)}
                        className="p-1.5 text-[#666] hover:text-white hover:bg-[#e53e3e] rounded transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete Project"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )) : (
                    <p className="text-xs text-[#666] italic bg-[#1a1a1a] p-4 rounded-lg border border-[#2d2d2d] border-dashed">No projects found.</p>
                  )}
                </div>
              </div>

              {/* COMMUNITIES */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-[#888] flex items-center gap-2">
                    <Globe size={14} className="text-[#4ade80]" /> Owned Communities ({userData.communities?.length || 0})
                  </h3>
                </div>
                <div className="space-y-3">
                  {userData.communities?.length > 0 ? userData.communities.map(c => (
                    <div key={c._id} className="bg-[#1a1a1a] border border-[#2d2d2d] rounded-lg p-4 group hover:border-[#444] transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-semibold text-sm">{c.name}</div>
                        <button
                          onClick={() => deleteResource("community", c._id, c.name)}
                          className="p-1 text-[#666] hover:text-white hover:bg-[#e53e3e] rounded transition-colors opacity-0 group-hover:opacity-100"
                          title="Delete Community"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="bg-[#111111] rounded p-2 text-xs border border-[#2d2d2d]">
                        <span className="text-[#666] mb-1 block">Included Projects:</span>
                        {c.projects?.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {c.projects.map(p => (
                              <span key={p._id} className="bg-[#252525] px-2 py-1 rounded border border-[#333] text-[#f0f0f0]">{p.name || p}</span>
                            ))}
                          </div>
                        ) : <span className="text-[#888] italic">No projects yet.</span>}
                      </div>
                    </div>
                  )) : (
                    <p className="text-xs text-[#666] italic bg-[#1a1a1a] p-4 rounded-lg border border-[#2d2d2d] border-dashed">No communities found.</p>
                  )}
                </div>
              </div>

              {/* POSTS */}
              <div className="xl:col-span-2 mt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-[#888] flex items-center gap-2">
                    <MessageSquare size={14} className="text-[#3b82f6]" /> Forum Posts ({userData.posts?.length || 0})
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {userData.posts?.length > 0 ? userData.posts.map(p => (
                    <div key={p._id} className="bg-[#1a1a1a] border border-[#2d2d2d] rounded-lg p-4 flex flex-col group hover:border-[#444] transition-colors">
                      <p className="text-sm text-[#d1d1d1] flex-1 line-clamp-3 mb-3">{p.content}</p>
                      <div className="flex items-center justify-between pt-3 border-t border-[#2d2d2d]">
                        <span className="text-[10px] text-[#666]">{new Date(p.createdAt).toLocaleString()}</span>
                        <button
                          onClick={() => deleteResource("post", p._id, "post")}
                          className="p-1 text-[#666] hover:text-white hover:bg-[#e53e3e] rounded transition-colors opacity-0 group-hover:opacity-100"
                          title="Delete Post"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  )) : (
                    <p className="text-xs text-[#666] italic bg-[#1a1a1a] p-4 rounded-lg border border-[#2d2d2d] border-dashed md:col-span-2">No posts found.</p>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminPage;