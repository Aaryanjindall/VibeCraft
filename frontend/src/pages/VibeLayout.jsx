
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
const VibeLayout = () => {
  return (
    <div className="flex">
<Sidebar/>
      {/* 🔥 MAIN CONTENT */}
      <div className="ml-[60px] w-full bg-[#0f172a] min-h-screen text-white p-4">
        <Outlet />
      </div>

    </div>
  );
};
export default VibeLayout;