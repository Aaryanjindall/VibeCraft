import { useState } from "react"
import { useUser } from "../context/UserProvider";


const UserProfile = () => {
    const [open, setOpen] = useState(false);
    const {user} = useUser();
  return (
    <div className="avatar-container">
      
      <img
      src={user?.avatar || "https://via.placeholder.com/40"}
      alt="profile"
      className="w-10 h-10 rounded-full border border-cyan-400"
    />

      {open && (
        <div className="dropdown">
          <p>Profile</p>
          <p>Settings</p>
          <p>Logout</p>
        </div>
      )}
    </div>
  );
}

export default UserProfile;