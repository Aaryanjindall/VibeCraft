import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const UserContext = createContext(null);
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await fetch(
          "https://vibecraft-zodr.onrender.com/api/auth/me",
          {
            credentials: "include",
          }
        );
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (err) {

        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

  }, []);

  const handleLogout = async () => {
    try {
      await fetch(
        "https://vibecraft-zodr.onrender.com/api/auth/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );
      setUser(null);
    } catch (err) {
      console.log("Logout error");
    }
  };
  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        handleLogout,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);