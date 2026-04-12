import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useUser } from "../context/UserProvider";
const Signup = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        navigate("/app"); // redirect after signup
      } else {
        console.error("Signup failed:", data.message);
        toast.error(`Signup failed: ${data.message}`)
      }
    } catch (error) {
      console.error("Error during signup:", error);
      toast.warning("Something went wrong! Please try again.");
    }
  };
  
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0b1224 0%, #0f172a 40%, #111827 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      color: "#e5e7eb",
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "960px",
        display: "grid",
        gridTemplateColumns: "1.1fr 0.9fr",
        gap: "20px",
        background: "rgba(15,23,42,0.7)",
        borderRadius: "18px",
        overflow: "hidden",
        border: "1px solid rgba(148,163,184,0.25)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.35)"
      }}>
        <div style={{
          padding: "32px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          background: "linear-gradient(135deg, rgba(14,165,233,0.15), rgba(99,102,241,0.18))"
        }}>
          <span style={{ fontSize: "13px", letterSpacing: "0.08em", color: "#c7d2fe" }}>JOIN THE BUILDER CLUB</span>
          <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 800, color: "#fff" }}>Create your account</h1>
          <p style={{ margin: 0, color: "#cbd5e1", lineHeight: 1.6 }}>
            Generate projects with AI, publish, and share with the community. Your session is secured via HTTP-only cookies.
          </p>
          <div style={{ marginTop: "auto", color: "#cbd5e1" }}>
            <div>🚀 Instant AI project generation</div>
            <div>👥 Community posts & comments</div>
            <div>🛡️ Admin portal (for admins)</div>
          </div>
        </div>

        <div style={{ padding: "32px", background: "rgba(15,23,42,0.9)" }}>
          <h2 style={{ margin: "0 0 16px", color: "#fff" }}>Sign Up</h2>
          <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                padding: "12px 14px",
                borderRadius: "10px",
                border: "1px solid rgba(148,163,184,0.35)",
                background: "rgba(15,23,42,0.8)",
                color: "#e5e7eb"
              }}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                padding: "12px 14px",
                borderRadius: "10px",
                border: "1px solid rgba(148,163,184,0.35)",
                background: "rgba(15,23,42,0.8)",
                color: "#e5e7eb"
              }}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                padding: "12px 14px",
                borderRadius: "10px",
                border: "1px solid rgba(148,163,184,0.35)",
                background: "rgba(15,23,42,0.8)",
                color: "#e5e7eb"
              }}
              required
            />
            <button
              type="submit"
              style={{
                marginTop: "6px",
                padding: "12px 14px",
                borderRadius: "10px",
                border: "none",
                background: "linear-gradient(135deg, #22d3ee, #6366f1)",
                color: "#0b1224",
                fontWeight: 800,
                cursor: "pointer",
                boxShadow: "0 10px 30px rgba(99,102,241,0.35)"
              }}
            >
              Sign Up
            </button>
          </form>
          <p style={{ marginTop: "20px",marginLeft: "50px", color: "#cbd5e1" }}>
            Already have an account?{" "}
            <Link to="/signin" style={{ color: "#38bdf8", textDecoration: "underline", textDecorationLine: false}}>
              Sign In
            </Link>
          </p>
          <button onClick={() => window.open("http://localhost:5001/api/auth/google", "_self")}>
  Login with Google
</button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
