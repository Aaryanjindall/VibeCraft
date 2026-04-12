import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useUser } from "../context/UserProvider";

const Landing = () => {

  const blocks = [
    { title: "Generate", desc: "AI turns prompts into full code.", icon: "🤖" },
    { title: "Edit", desc: "Live editor with instant preview.", icon: "🧭" },
    { title: "Publish", desc: "Deploy instantly to web.", icon: "🚀" },
    { title: "Community", desc: "Share & explore projects.", icon: "👥" },
    { title: "Admin", desc: "Manage users & content.", icon: "🛡️" },
    { title: "Secure", desc: "Session-based authentication.", icon: "🔐" }
  ];

  const {user} = useUser();

  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-hidden">

      {/* 🔥 Animated Background */}
      <motion.div
        animate={{ x: [0, 60, -60, 0], y: [0, -60, 60, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
        className="absolute w-[600px] h-[600px] bg-purple-600/20 blur-[120px] rounded-full top-[-100px] left-[-100px]"
      />

      <motion.div
        animate={{ x: [0, -50, 50, 0], y: [0, 50, -50, 0] }}
        transition={{ duration: 18, repeat: Infinity }}
        className="absolute w-[500px] h-[500px] bg-cyan-500/20 blur-[120px] rounded-full bottom-[-100px] right-[-100px]"
      />

      {/* 🔝 NAVBAR */}
      <div className="flex justify-between items-center px-10 py-6 relative z-10">
        <h1 className="text-xl font-bold">VibeCraft ⚡</h1>

        <div className="flex gap-4">
          
          {user ? (
  <div className="flex items-center gap-3 cursor-pointer">
    <img
      src={user.avatar || "https://via.placeholder.com/40"}
      alt="profile"
      className="w-10 h-10 rounded-full border border-cyan-400"
    />
  </div>
) : (
  <Link
    to="/signin"
    className="px-4 py-2 rounded-lg bg-cyan-400 text-black font-bold"
  >
    Login
  </Link>
)}

        </div>
      </div>

      {/* 🚀 HERO */}
      <div className="text-center mt-20 relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-extrabold"
        >
          Build Full Stack Projects with AI ⚡
        </motion.h1>

        <p className="text-gray-400 mt-4">
          Generate, edit, preview & deploy — all in one platform.
        </p>

        <div className="mt-6 flex justify-center gap-4">
          <Link
            to="/ai"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 text-black font-bold hover:scale-105 transition"
          >
            Start Building
          </Link>

          <Link
            to="/signup"
            className="px-6 py-3 rounded-xl border border-gray-600 hover:border-cyan-400 transition"
          >
            Create Account
          </Link>
        </div>
      </div>

      {/* ⚡ FEATURES GRID */}
      <div className="max-w-5xl mx-auto mt-24 grid grid-cols-3 gap-6 px-6 relative z-10">
        {blocks.map((b, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="p-6 rounded-xl bg-white/5 backdrop-blur border border-gray-800 hover:border-cyan-400 transition"
          >
            <div className="text-2xl">{b.icon}</div>
            <h3 className="font-bold mt-2">{b.title}</h3>
            <p className="text-gray-400 text-sm">{b.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* 🔥 EXTRA SECTION */}
      <div className="max-w-4xl mx-auto mt-32 text-center px-6 relative z-10">
        <h2 className="text-3xl font-bold mb-4">Why VibeCraft?</h2>
        <p className="text-gray-400">
          VibeCraft lets you build complete applications using AI prompts.
          From idea to deployment — everything in one place.
        </p>
      </div>

      {/* 🧠 HOW IT WORKS */}
      <div className="max-w-5xl mx-auto mt-24 grid grid-cols-3 gap-6 px-6 relative z-10">

        {["Prompt AI", "Edit Code", "Deploy Project"].map((step, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -10 }}
            className="p-6 rounded-xl bg-[#020617] border border-gray-800 text-center"
          >
            <h3 className="font-bold text-lg">{step}</h3>
            <p className="text-gray-400 text-sm mt-2">
              {i === 0 && "Describe your idea and AI builds it."}
              {i === 1 && "Customize code with live editor."}
              {i === 2 && "Publish instantly to the web."}
            </p>
          </motion.div>
        ))}

      </div>

      {/* 🎯 CTA SECTION */}
      <div className="text-center mt-32 mb-20 relative z-10">
        <h2 className="text-3xl font-bold">Start your journey today 🚀</h2>

        <Link
          to="/signup"
          className="inline-block mt-6 px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 text-black font-bold hover:scale-110 transition"
        >
          Get Started Free
        </Link>
      </div>

    </div>
  );
};

export default Landing;