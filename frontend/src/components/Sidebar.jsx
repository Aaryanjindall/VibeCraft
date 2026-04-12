
import { useNavigate, useLocation } from "react-router-dom";
const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const tabs = [
    { name: "Builder", path: "/ai"},
    { name: "Projects" , path: "/ai/projects"},
    { name: "Communities" , path: "/ai/Mycommunity"},
  ];
  return(
    <div className="w-[220px] h-screen bg-[#020617] text-white p-4 border-r border-[#334155] fixed left-0 top-0">
      <h2 className="text-lg font-semibold mb-6">⚡ Vibe</h2>
      <div className="flex flex-col gap-3">
        {tabs.map((tab) => (
          <button
          key={tab.name}
          onClick={()=> navigate(tab.path)}
          className={`text-left px-3 py-2 rounded-lg transition
              ${
                location.pathname === tab.path
                  ? "bg-indigo-500"
                  : "hover:bg-[#1e293b]"
              }`}
          >{tab.name}</button>
        ))}

      </div>
    </div>
  );
};
export default Sidebar;