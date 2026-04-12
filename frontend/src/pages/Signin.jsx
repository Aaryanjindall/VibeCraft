import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"
import { toast } from "react-toastify";
import { useUser } from "../context/UserProvider";
const Signin = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // for error messages
  const [isSubmitting, setIsSubmitting] = useState(false);
const handleSignin = async (e) => {
  e.preventDefault();
  setError("");

  if (!email || !password) {
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

      navigate("/app");

    } else {
      toast.error(data.message || "Signin failed");
    }

  } catch (err) {

    toast.error("Error signing in");

  } finally {
    setIsSubmitting(false);
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
          background: "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(236,72,153,0.15))"
        }}>
          <span style={{ fontSize: "13px", letterSpacing: "0.08em", color: "#c7d2fe" }}>WELCOME BACK</span>
          <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 800, color: "#fff" }}>Sign in to keep building</h1>
          <p style={{ margin: 0, color: "#cbd5e1", lineHeight: 1.6 }}>
            Access your workspace, continue editing, and share with the community. Your session stays secure with cookies.
          </p>
          <div style={{ marginTop: "auto", color: "#cbd5e1" }}>
            <div>✅ Session cookies enabled</div>
            <div>✅ Community posting & comments</div>
            <div>✅ Admin portal (if you’re admin)</div>
          </div>
        </div>

        <div style={{ padding: "32px", background: "rgba(15,23,42,0.9)" }}>
          <h2 style={{ margin: "0 0 16px", color: "#fff" }}>Sign In</h2>
          {error && (
            <p style={{ color: "#fca5a5", background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.4)", padding: "10px", borderRadius: "10px", textAlign: "center", marginBottom: "14px" }}>
              {error}
            </p>
          )}
          <form onSubmit={handleSignin} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
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
            />
            <button
              type="submit"
              disabled={isSubmitting}
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
              {isSubmitting ? "Signing In..." : "Sign In"}
            </button>
          </form>
          <p style={{ marginTop: "20px",marginLeft: "50px", color: "#cbd5e1" }}>
            Don't have an account?{" "}
            <Link to="/signup" style={{ color: "#38bdf8", textDecoration: "underline",textDecorationLine: false }}>
              Sign Up
            </Link>
          </p>
          <button onClick={() => window.open("http://localhost:5001/api/auth/google", "_self")}>
  Login with Google
</button>
          <h4>Or</h4>
          <p style={{marginLeft: "50px"}}>Login as <Link to="/admin" style={{ color: "#38bdf8", textDecoration: "underline",textDecorationLine: false }}>Admin</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Signin;
