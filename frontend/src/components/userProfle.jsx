import { useState } from "react"
import { useUser } from "../context/UserProvider";
import hacker from "../assets/hacker.png";
// import man from "../assets/man.png";
// import man2 from "../assets/man2.png";
// import user from "../assets/user.png";

const UserProfile = () => {
    const [open, setOpen] = useState(false);
    const {user} = useUser();
    
    const arr = [
      hacker
    ]
    const rand = Math.floor(Math.random() * arr.length);

  return (
    <div className="avatar-container">
      <img
      src={user?.avatar || arr[rand]}
      alt="profile"
      className="w-10 h-10 rounded-full border border-cyan-400"
      onClick={() => setOpen(!open)}
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