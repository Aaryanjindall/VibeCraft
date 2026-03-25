import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Landing = () => {

  const blocks = [
    { title: "Generate", desc: "AI turns prompts into HTML/CSS/JS.", icon: "🤖" },
    { title: "Edit", desc: "Live code editor with preview.", icon: "🧭" },
    { title: "Publish", desc: "Deploy to Netlify/GitHub quickly.", icon: "🚀" },
    { title: "Community", desc: "Share posts & get feedback.", icon: "👥" },
    { title: "Admin", desc: "Moderate users/posts easily.", icon: "🛡️" },
    { title: "Secure", desc: "Session-based auth with cookies.", icon: "🔐" }
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 20% 20%, rgba(59,130,246,0.2), transparent 35%), linear-gradient(135deg, #0b1224, #0f172a)",
        color: "#e0e4ed",
        fontFamily: "Inter, sans-serif",
        padding: "20px",
      }}
    >

      {/* ✅ TOP BAR */}

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "30px",
        }}
      >
        <Link
          to="/signin"
          style={{
            padding: "10px 16px",
            borderRadius: "10px",
            background: "#22d3ee",
            color: "#000",
            fontWeight: "700",
            textDecoration: "none",
          }}
        >
          Login
        </Link>
      </div>


      {/* ✅ CENTER CONTENT */}

      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "42px",
            fontWeight: "900",
            color: "#fff",
          }}
        >
          Ship full web projects with AI
        </h1>

        <p
          style={{
            color: "#cbd5e1",
            marginTop: "10px",
          }}
        >
          Generate, edit, preview, and publish in one place.
        </p>

        <div style={{ marginTop: "20px" }}>

          <Link
            to="/signin"
            style={{
              padding: "12px 18px",
              borderRadius: "12px",
              background:
                "linear-gradient(135deg,#22d3ee,#6366f1)",
              color: "#000",
              fontWeight: "800",
              textDecoration: "none",
              marginRight: "10px",
            }}
          >
            Start Building
          </Link>

          <Link
            to="/signup"
            style={{
              padding: "12px 18px",
              borderRadius: "12px",
              border: "1px solid #aaa",
              color: "#fff",
              textDecoration: "none",
            }}
          >
            Create Account
          </Link>

        </div>
      </div>


      {/* ✅ GRID CENTER */}

      <div
        style={{
          maxWidth: "900px",
          margin: "60px auto",
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: "14px",
        }}
      >
        {blocks.map((b, i) => (
          <div
            key={i}
            style={{
              padding: "16px",
              borderRadius: "12px",
              background: "rgba(15,23,42,0.9)",
              border: "1px solid rgba(148,163,184,0.2)",
            }}
          >
            <div style={{ fontSize: "20px" }}>{b.icon}</div>

            <div
              style={{
                fontWeight: "800",
                marginTop: "6px",
                color: "#fff",
              }}
            >
              {b.title}
            </div>

            <div
              style={{
                fontSize: "13px",
                color: "#cbd5e1",
              }}
            >
              {b.desc}
            </div>
          </div>
        ))}
      </div>


      {/* ✅ EXTRA CONTENT */}

      <div
        style={{
          maxWidth: "800px",
          margin: "40px auto",
          textAlign: "center",
          color: "#cbd5e1",
        }}
      >
        <h2>Why use this builder?</h2>

        <p>
          Build full stack projects using AI, publish instantly,
          share with community and manage users with session based auth.
        </p>

        <p>
          Perfect for college projects, portfolio, and real apps.
        </p>
      </div>

    </div>
  );
};

export default Landing;