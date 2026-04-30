import { useState } from "react";
import { motion } from "framer-motion";
import { useUser } from "../context/UserProvider";
import { toast } from "react-toastify";

const AuthModal = ({ onClose ,onSuccess }) => {
  const { setUser } = useUser();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleAuth = async () => {
    try {
      const url = isLogin
        ? "https://vibecraft-sxyx.onrender.com/api/auth/login"
        : "https://vibecraft-sxyx.onrender.com/api/auth/signup";

      const body = isLogin
        ? { email, password }
        : { username, email, password };

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
        toast.success(isLogin ? "Login success" : "Signup success");
        
        onSuccess(); 
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#111827] w-[400px] p-6 rounded-xl border border-[#334155]"
      >

        <h2 className="text-xl mb-4">
          {isLogin ? "Login 🔐" : "Signup 🚀"}
        </h2>

        <div className="space-y-3">

          {!isLogin && (
            <input
              placeholder="Username"
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          )}

          <input
            placeholder="Email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            placeholder="Password"
            type="password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleAuth}
            className="w-full bg-indigo-500 py-2 rounded"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>

          {/* GOOGLE */}
          <button
            onClick={() =>
              window.open(
                 `https://vibecraft-sxyx.onrender.com/api/auth/google?redirect=${window.location.pathname}`,
  "_self"
              )
            }
            className="w-full bg-white text-black py-2 rounded flex items-center justify-center gap-2"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="w-4"
            />
            Google
          </button>

          <p className="text-sm text-center text-gray-400">
            {isLogin ? "No account?" : "Already have account?"}
            <span
              onClick={() => setIsLogin(!isLogin)}
              className="text-cyan-400 ml-1 cursor-pointer"
            >
              {isLogin ? "Signup" : "Login"}
            </span>
          </p>

          <button
            onClick={onClose}
            className="text-red-400 text-sm mt-2"
          >
            Close
          </button>

        </div>
      </motion.div>
    </div>
  );
};

export default AuthModal;