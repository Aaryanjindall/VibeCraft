import React from "react";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#0f172a,#020617)",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "sans-serif",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <div>

        <h1
          style={{
            fontSize: "80px",
            margin: 0,
            fontWeight: "900",
            color: "#22d3ee",
          }}
        >
          404
        </h1>

        <h2
          style={{
            marginTop: "10px",
            fontSize: "28px",
          }}
        >
          Page Not Found
        </h2>

        <p
          style={{
            marginTop: "10px",
            color: "#cbd5e1",
          }}
        >
          The page you are looking for does not exist
          or you are not authorized.
        </p>

        <div style={{ marginTop: "20px" }}>

          <Link
            to="/"
            style={{
              padding: "12px 18px",
              borderRadius: "10px",
              background: "#22d3ee",
              color: "#000",
              fontWeight: "700",
              textDecoration: "none",
              marginRight: "10px",
            }}
          >
            Go Home
          </Link>

          <Link
            to="/signin"
            style={{
              padding: "12px 18px",
              borderRadius: "10px",
              border: "1px solid #aaa",
              color: "#fff",
              textDecoration: "none",
            }}
          >
            Login
          </Link>

        </div>

      </div>
    </div>
  );
};

export default ErrorPage;