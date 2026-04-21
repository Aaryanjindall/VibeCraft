import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Folder, Users, Compass } from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { icon: LayoutDashboard, path: "/ai" },
    { icon: Folder, path: "/ai/projects" },
    { icon: Users, path: "/ai/Mycommunity" },
    { icon: Compass, path: "/ai/explore" }
  ];

  return (
    <div className="w-[60px] h-screen bg-[#020617] text-white border-r border-[#1e293b] fixed left-0 top-0 flex flex-col items-center py-4 gap-6">

      {/* LOGO */}
      <div className="text-xl font-bold mb-4">⚡</div>

      {/* ICON TABS */}
      {tabs.map((tab, index) => {
        const Icon = tab.icon;

        return (
          <button
            key={index}
            onClick={() => navigate(tab.path)}
            className={`p-3 rounded-lg transition
            ${
              location.pathname === tab.path
                ? "bg-indigo-500"
                : "hover:bg-[#1e293b]"
            }`}
          >
            <Icon size={20} />
          </button>
        );
      })}

    </div>
  );
};

export default Sidebar;