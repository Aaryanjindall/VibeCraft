import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useUser } from "../context/UserProvider";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
export default function AuthPage() {
  const navigate = useNavigate();
    const { setUser } = useUser();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [username,setUsername] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const location = useLocation();
    

  const handleSignin = async (e) => {
    e.preventDefault();
    setError("");
    if(!email || !password){
       setError("Please enter email and password");
       return;
    }
    setIsSubmitting(true);
    
      try {
        const response = await fetch(("http://localhost:5001/api/auth/login"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
          credentials: "include",
        });
    
        const data = await response.json();
    
        if (response.ok) {
          toast.success("Signin successful");
          if (data.user) {
            setUser(data.user);
          }
          navigate("/ai");
        } else {
          toast.error(data.message || "Signin failed");
        }
      } catch (err) {
        toast.error("Error signing in");
      } finally {
        setIsSubmitting(false);
      }
  };
  const handleSignup = async (e) => {
      e.preventDefault();
    
      const signupData = { username, email, password };
    
      try {
        const response = await fetch(("http://localhost:5001/api/auth/signup"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(signupData),
          credentials: "include",
        });
    
        const data = await response.json();
    
        if (response.ok) {
          console.log("Signup successful:", data);
          toast.success("Signup Successful");
          if (data.user) {
            setUser(data.user);
          }
          navigate("/ai"); // redirect after signup
        } else {
          console.error("Signup failed:", data.message);
          toast.error(`Signup failed: ${data.message}`)
        }
      } catch (error) {
        console.error("Error during signup:", error);
        toast.warning("Something went wrong! Please try again.");
      }
    };
  const [isLogin, setIsLogin] = useState(location.pathname === "/signin");
  useEffect(() => {
  setIsLogin(location.pathname === "/signin");
}, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center overflow-hidden relative text-white">

     
      <motion.div
        animate={{ x: [0, 50, -50, 0], y: [0, -50, 50, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute w-[600px] h-[600px] bg-purple-600/20 blur-[120px] rounded-full top-[-100px] left-[-100px]"
      />

      <motion.div
        animate={{ x: [0, -40, 40, 0], y: [0, 40, -40, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute w-[500px] h-[500px] bg-cyan-500/20 blur-[120px] rounded-full bottom-[-100px] right-[-100px]"
      />

      {/* MAIN CARD */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-[1000px] h-[600px] flex rounded-2xl overflow-hidden border border-gray-800 bg-white/5 backdrop-blur-xl shadow-2xl"
      >
        {/* LEFT PANEL */}
        <div className="flex-1 bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-500 p-12 flex flex-col justify-center">
          <h1 className="text-5xl font-bold mb-4">VibeCraft ⚡</h1>
          <p className="text-gray-200 mb-6">
            Build futuristic apps with AI. Create, share & scale ideas.
          </p>

          <div className="space-y-3 text-sm">
            <p>🚀 AI Powered Builder</p>
            <p>🌐 Community Driven</p>
            <p>⚡ Real-time Editor</p>
          </div>
        </div>
        {/* RIGHT PANEL */}
        <div className="flex-1 p-12 flex flex-col justify-center">

          <motion.h2
            key={isLogin}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-semibold mb-6"
          >
            {isLogin ? "Welcome Back 👋" : "Create Account 🚀"}
          </motion.h2>

          <div className="space-y-4">

            {!isLogin && (
              <motion.input
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                type="text"
                placeholder="Username"
                className="input"
                value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              />
            )}

            <input type="email" placeholder="Email" className="input" 
            value={email}
              onChange={(e) => setEmail(e.target.value)}
              required />
            <input type="password" placeholder="Password" className="input" 
            value={password}
              onChange={(e) => setPassword(e.target.value)}
              required/>

            <button className="btn-main" onClick={isLogin ? handleSignin : handleSignup}>
              {isLogin ? "Login" : "Sign Up"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <div className="flex-1 h-[1px] bg-gray-700"></div>
              OR
              <div className="flex-1 h-[1px] bg-gray-700"></div>
            </div>

            {/* GOOGLE BUTTON */}
            <button
              onClick={() =>
                window.open("http://localhost:5001/api/auth/google", "_self")
              }
              className="btn-google flex items-center justify-center gap-2"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="google"
                className="w-5 h-5"
              />
              Continue with Google
            </button>

            {/* SWITCH */}
            <p className="text-sm text-gray-400 text-center">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <span
                onClick={() => setIsLogin(!isLogin)}
                className="text-cyan-400 cursor-pointer ml-1"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </span>
            </p>

          </div>
        </div>
      </motion.div>
    </div>
  );
}