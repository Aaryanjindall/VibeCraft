import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Welcome to the Dashboard</h1>
      <p>This is your main page after signing in/up.</p>
      <Link to="/signin">
        <button style={{ padding: "0.5rem 1rem", marginTop: "1rem" }}>Sign Out</button>
      </Link>
    </div>
  );
};

export default Dashboard;
