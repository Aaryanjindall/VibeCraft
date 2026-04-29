import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Folder, Users, Compass, LogOut, Settings, Copy, Search,NetworkIcon } from "lucide-react";
import { useUser } from "../context/UserProvider";

const Sidebar = ({setusermodal,usermodal}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useUser();

  const topTabs = [
    { icon: LayoutDashboard, path: "/ai", label: "Dashboard" },
    { icon: Folder, path: "/ai/projects", label: "Projects" },
    { icon: Search, path: "/ai/explore", label: "Explore" },
    { icon: Users, path: "/ai/Mycommunity", label: "Community" },
    { icon: NetworkIcon, path: "/ai/RealTime", label: "Collaboration" }
    
  ];

  const bottomTabs = [
    // { icon: Copy, path: "#", label: "Files" },
    { icon: Settings, path: "#", label: "Settings" }
  ];

  const handleLogout = () => {
    setUser(null);
    navigate("/");
  };

  return (
    <div className="fixed sm:left-0 sm:top-0 sm:w-[60px] sm:h-screen sm:border-r sm:border-t-0 sm:flex-col bottom-0 left-0 w-full h-[60px] border-t border-[#2d2d2d] bg-[#111111] flex flex-row items-center sm:py-4 px-2 sm:px-0 z-40 flex-shrink-0 justify-around sm:justify-start">
      {/* LOGO */}
      <div 
        onClick={() => navigate("/")}
        className="hidden sm:flex w-10 h-10 mb-6 items-center justify-center font-bold cursor-pointer hover:opacity-80 transition-opacity"
      >
        <span className="text-white text-lg">AJ</span>
      </div>

      {/* TOP TABS */}
      <div className="flex-1 flex sm:flex-col flex-row gap-1 sm:gap-2 w-full sm:w-auto h-full sm:h-auto items-center justify-around sm:justify-start">
        {topTabs.map((tab, index) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path || (tab.path !== '/ai' && location.pathname.startsWith(tab.path));

          return (
            <div key={index} className="relative group sm:w-full flex justify-center items-center h-full sm:h-auto">
              {isActive && (
                <>
                  <div className="hidden sm:block absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[#e53e3e] rounded-r-md" />
                  <div className="sm:hidden block absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[3px] bg-[#e53e3e] rounded-t-md" />
                </>
              )}
              <button
                onClick={() => navigate(tab.path)}
                className={`p-2 sm:p-3 w-full h-full flex justify-center items-center transition-colors
                ${isActive 
                  ? "text-white" 
                  : "text-[#888888] hover:text-[#d1d1d1]"
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </button>
            </div>
          );
        })}
      </div>

      {/* BOTTOM TABS */}
      <div className="hidden sm:flex w-full flex-col gap-2 mb-4">
        {bottomTabs.map((tab, index) => {
          const Icon = tab.icon;
          return (
            <div key={index} className="relative group w-full flex justify-center">
              <button 
              onClick={() => setusermodal(!usermodal)}
                className="p-3 w-full flex justify-center text-[#888888] hover:text-[#d1d1d1] transition-colors"
              >
                <Icon size={20} strokeWidth={2} />
              </button>
            </div>
          );
        })}
        <div className="relative group w-full flex justify-center mt-2">
          <button 
            onClick={handleLogout}
            className="p-3 w-full flex justify-center text-[#888888] hover:text-[#e53e3e] transition-colors"
          >
            <LogOut size={20} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;