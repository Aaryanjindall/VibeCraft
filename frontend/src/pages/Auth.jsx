import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useUser } from "../context/UserProvider";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Box, Code, Rocket, Terminal } from "lucide-react";

export default function AuthPage() {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.pathname === "/signin");

  useEffect(() => {
    setIsLogin(location.pathname === "/signin");
  }, [location.pathname]);

  const handleSignin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }
    setIsSubmitting(true);
    
    try {
      const response = await fetch("https://vibecraft-sxyx.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    if (!username || !email || !password) {
      toast.error("Please fill all fields");
      return;
    }
    setIsSubmitting(true);
    const signupData = { username, email, password };
  
    try {
      const response = await fetch("https://vibecraft-sxyx.onrender.com/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
        credentials: "include",
      });
  
      const data = await response.json();
  
      if (response.ok) {
        toast.success("Signup Successful");
        if (data.user) {
          setUser(data.user);
        }
        navigate("/ai");
      } else {
        toast.error(`Signup failed: ${data.message}`);
      }
    } catch (error) {
      toast.warning("Something went wrong! Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] flex flex-col md:flex-row text-[#f0f0f0] font-sans selection:bg-[#e53e3e]/30 overflow-y-auto overflow-x-hidden">
      
      {/* LEFT PANEL - Branding */}
      <div className="hidden md:flex flex-1 relative bg-[#1a1a1a] border-r border-[#2d2d2d] flex-col p-12 overflow-hidden justify-center">
        
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="relative z-10 max-w-lg mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 mb-16 group">
            <div className="w-8 h-8 flex items-center justify-center bg-[#252525] rounded-md border border-[#333] group-hover:border-[#e53e3e] transition-colors">
              <span className="text-white text-sm font-bold tracking-tighter">VC</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-[#f0f0f0]">VibeCraft IDE</span>
          </Link>

          <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Build Software <br/>
            <span className="text-[#e53e3e]">Faster Than Ever</span>
          </h1>
          <p className="text-[#888] mb-12 text-lg leading-relaxed">
            {isLogin 
              ? "Welcome back. Authenticate to access your workspaces, projects, and community deployments." 
              : "Join the next generation of developers building the future with an intelligent, browser-based development environment."}
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-md bg-[#252525] border border-[#333] flex items-center justify-center shrink-0 mt-1 text-[#e53e3e]">
                <Code size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-[#f0f0f0] mb-1">AI-Powered Generation</h3>
                <p className="text-sm text-[#888] leading-relaxed">Instantly generate full-stack components and layouts using advanced natural language models.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-md bg-[#252525] border border-[#333] flex items-center justify-center shrink-0 mt-1 text-[#a855f7]">
                <Terminal size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-[#f0f0f0] mb-1">Native Workspace</h3>
                <p className="text-sm text-[#888] leading-relaxed">A robust file explorer, terminal, and code editor embedded directly in your browser.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-md bg-[#252525] border border-[#333] flex items-center justify-center shrink-0 mt-1 text-[#4ade80]">
                <Rocket size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-[#f0f0f0] mb-1">Instant Deployment</h3>
                <p className="text-sm text-[#888] leading-relaxed">Push your projects live to edge networks globally with zero configuration required.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-24 bg-[#111111] relative">
        <Link to="/" className="md:hidden inline-flex items-center gap-2 mb-12">
          <div className="w-8 h-8 flex items-center justify-center bg-[#252525] rounded-md border border-[#333]">
            <span className="text-white text-sm font-bold tracking-tighter">VC</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-[#f0f0f0]">VibeCraft IDE</span>
        </Link>

        <motion.div
          key={isLogin ? "login" : "signup"}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm mx-auto"
        >
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-[#888] text-sm">
              {isLogin ? "Enter your credentials to access your workspace." : "Get started with your free VibeCraft account."}
            </p>
          </div>

          <form className="space-y-4" onSubmit={isLogin ? handleSignin : handleSignup}>
            {!isLogin && (
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#666] font-semibold mb-2">Username</label>
                <input
                  type="text"
                  placeholder="johndoe"
                  className="input-ide w-full py-2.5 px-3"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label className="block text-xs uppercase tracking-widest text-[#666] font-semibold mb-2">Email Address</label>
              <input 
                type="email" 
                placeholder="name@company.com" 
                className="input-ide w-full py-2.5 px-3" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-xs uppercase tracking-widest text-[#666] font-semibold">Password</label>
                {isLogin && <a href="#" className="text-xs text-[#e53e3e] hover:text-[#c53030]">Forgot?</a>}
              </div>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="input-ide w-full py-2.5 px-3" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-ide btn-ide-primary w-full py-3 mt-4 text-sm">
              {isSubmitting ? "Authenticating..." : (isLogin ? "Sign In" : "Create Account")}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-[1px] bg-[#2d2d2d]"></div>
            <span className="text-[10px] text-[#666] font-semibold uppercase tracking-widest">Or continue with</span>
            <div className="flex-1 h-[1px] bg-[#2d2d2d]"></div>
          </div>

          {/* GOOGLE BUTTON */}
          <button
            onClick={() => window.open("https://vibecraft-sxyx.onrender.com/api/auth/google", "_self")}
            className="w-full btn-ide btn-ide-secondary py-3 flex items-center justify-center gap-2 text-sm bg-[#1a1a1a]"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </button>

          {/* SWITCH */}
          <p className="text-sm text-[#888] text-center mt-8">
            {isLogin ? "New to VibeCraft?" : "Already have an account?"}
            <button
              onClick={() => {
                navigate(isLogin ? "/signup" : "/signin");
              }}
              className="text-[#e53e3e] hover:text-[#c53030] font-medium ml-2 transition-colors"
            >
              {isLogin ? "Sign up for free" : "Sign in here"}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}