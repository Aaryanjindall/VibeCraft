

import { Outlet } from "react-router-dom"
import Sidebar from "../components/Sidebar";



const VibeLayout = () => {
    return(
        <div className="flex">
            <Sidebar/>

            <div className="ml-[220px] w-full bg-[#0f172a] min-h-screen text-white p-4">
                <Outlet/>
            </div>
        </div>
    )
}

export default VibeLayout;