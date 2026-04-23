import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useUser } from "../context/UserProvider";
import { Terminal, Box, Zap, Monitor, Code, Rocket, Database, Settings, Folder } from "lucide-react";

const Landing = () => {
  const { user } = useUser();
  const { scrollYProgress } = useScroll();
  const yPos = useTransform(scrollYProgress, [0, 1], [0, 200]);
  
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const features = [
    { title: "AI Assistant", desc: "Write prompts to generate full-stack components instantaneously.", icon: <Zap size={20} className="text-[#e53e3e]" /> },
    { title: "Real-time Editor", desc: "Live preview and zero-latency code execution within the IDE.", icon: <Code size={20} className="text-[#f0f0f0]" /> },
    { title: "One-Click Deploy", desc: "Instantly publish your application to production edge networks.", icon: <Rocket size={20} className="text-[#e53e3e]" /> },
    { title: "Project Explorer", desc: "Manage your complex file structures natively in the browser.", icon: <Box size={20} className="text-[#f0f0f0]" /> },
    { title: "Database Sync", desc: "Automatically hook up schemas with intelligent state handling.", icon: <Database size={20} className="text-[#e53e3e]" /> },
    { title: "Environment Config", desc: "Granular control over environment variables and build settings.", icon: <Settings size={20} className="text-[#f0f0f0]" /> }
  ];

  return (
    <div className="bg-[#111111] min-h-screen text-[#f0f0f0] font-sans selection:bg-[#e53e3e]/30 overflow-x-hidden relative">
      
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-[#1a1a1a]/80 backdrop-blur-md border-b border-[#2d2d2d] px-6 py-3 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-xl font-bold tracking-tight text-[#f0f0f0] flex items-center gap-2">
              <div className="w-8 h-8 flex items-center justify-center bg-[#252525] rounded-md border border-[#333] group-hover:border-[#e53e3e] transition-colors">
                <span className="text-white text-sm">AJ</span>
              </div>
              VibeCraft IDE
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <Link to="/ai" className="flex items-center gap-3 bg-[#252525] hover:bg-[#333] border border-[#333] transition-colors rounded-md px-4 py-1.5">
                <img
                  src={user.avatar || "https://via.placeholder.com/40"}
                  alt="profile"
                  className="w-6 h-6 rounded-full"
                />
                <span className="font-medium text-sm hidden sm:block">{user.name || 'Workspace'}</span>
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/signin" className="text-sm font-medium text-[#888] hover:text-[#f0f0f0] transition-colors hidden sm:block">
                  Sign In
                </Link>
                <Link to="/signup" className="bg-[#e53e3e] hover:bg-[#c53030] text-white text-sm font-medium py-1.5 px-4 rounded-md transition-colors">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 z-10 flex flex-col items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 bg-[#1a1a1a] border border-[#2d2d2d] rounded-full text-xs font-medium text-[#888]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e53e3e] animate-pulse"></span>
            VibeCraft Cloud is now available
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-6 leading-tight">
            Build Software <br />
            <span className="text-[#e53e3e]">Faster Than Ever</span>
          </h1>
          
          <p className="text-lg text-[#888] mb-10 max-w-2xl mx-auto leading-relaxed">
            A professional browser-based IDE powered by advanced AI. Write, edit, debug, and deploy enterprise-grade applications seamlessly.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/ai" className="bg-[#e53e3e] hover:bg-[#c53030] text-white font-medium px-8 py-3 rounded-md transition-colors w-full sm:w-auto text-center">
              Open Workspace
            </Link>
            <Link to="/community/explore/all" className="bg-[#252525] hover:bg-[#333] border border-[#333] text-[#f0f0f0] font-medium px-8 py-3 rounded-md transition-colors w-full sm:w-auto text-center">
              View Documentation
            </Link>
          </div>
        </motion.div>

        {/* Abstract UI Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ y: yPos }}
          className="mt-20 w-full max-w-5xl rounded-xl border border-[#2d2d2d] shadow-2xl bg-[#1a1a1a] overflow-hidden"
        >
          <div className="flex items-center px-4 py-2 bg-[#111111] border-b border-[#2d2d2d]">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#333]"></div>
              <div className="w-3 h-3 rounded-full bg-[#333]"></div>
              <div className="w-3 h-3 rounded-full bg-[#333]"></div>
            </div>
            <div className="mx-auto text-xs text-[#666] font-mono tracking-widest uppercase">
              vibecraft-workspace
            </div>
          </div>
          <div className="flex h-[400px]">
            {/* Sidebar Mock */}
            <div className="w-12 border-r border-[#2d2d2d] bg-[#111111] flex flex-col items-center py-4 gap-4 text-[#666]">
              <Box size={16} />
              <Terminal size={16} />
              <Monitor size={16} />
            </div>
            <div className="w-48 border-r border-[#2d2d2d] bg-[#1a1a1a] p-4 hidden sm:block">
              <div className="text-[10px] text-[#666] uppercase mb-4 tracking-widest font-semibold">Explorer</div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-[#888]"><Folder size={12} /> src</div>
                <div className="flex items-center gap-2 text-xs text-[#888]"><Folder size={12} /> public</div>
                <div className="flex items-center gap-2 text-xs text-[#e53e3e]"><Code size={12} /> main.py</div>
              </div>
            </div>
            <div className="flex-1 bg-[#1a1a1a] flex flex-col">
              <div className="flex h-10 border-b border-[#2d2d2d] bg-[#111111]">
                <div className="px-4 flex items-center border-t-2 border-[#e53e3e] bg-[#1a1a1a] border-r border-[#2d2d2d] text-xs font-mono text-[#f0f0f0]">
                  main.py
                </div>
              </div>
              <div className="p-6 font-mono text-sm">
                <div className="text-[#a855f7]">def <span className="text-[#e53e3e]">initialize_app</span>():</div>
                <div className="pl-4 text-[#888]">print(<span className="text-[#4ade80]">"VibeCraft Initialized"</span>)</div>
                <div className="pl-4 text-[#888]">return <span className="text-[#e53e3e]">True</span></div>
                
                <div className="mt-8 flex items-center gap-2 text-[#e53e3e] bg-[#252525] inline-flex px-3 py-1 rounded border border-[#333]">
                  <Zap size={14} /> <span>Generating auth routes...</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 relative z-10 border-t border-[#2d2d2d] bg-[#111111]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-4">Enterprise-grade Tooling</h2>
            <p className="text-[#888] max-w-2xl text-lg">A development environment built for scale, performance, and speed.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, i) => (
              <div key={i} className="p-6 rounded-lg bg-[#1a1a1a] border border-[#2d2d2d] hover:border-[#444] transition-colors">
                <div className="w-10 h-10 rounded bg-[#252525] flex items-center justify-center mb-4">
                  {feat.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feat.title}</h3>
                <p className="text-[#888] text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-24 px-6 relative z-10 bg-[#1a1a1a]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-6">From Idea to Production in Seconds</h2>
            <p className="text-[#888] text-lg mb-10 leading-relaxed">
              VibeCraft completely revolutionizes the development lifecycle by eliminating boilerplate, setup, and deployment configuration.
            </p>
            
            <div className="space-y-8">
              {[
                { num: "01", title: "Write a Prompt", desc: "Use natural language to describe the component, layout, or backend logic you need." },
                { num: "02", title: "AI Generates Code", desc: "Our models instantly write clean, production-ready React and Node.js code." },
                { num: "03", title: "Live Preview & Edit", desc: "Interact with the live application instantly and make manual tweaks in the code editor." },
                { num: "04", title: "Deploy Globally", desc: "Hit the deploy button to push your application to our edge network." }
              ].map((step, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="text-xl font-bold text-[#e53e3e] mt-1">{step.num}</div>
                  <div>
                    <h4 className="text-lg font-semibold text-[#f0f0f0] mb-1 group-hover:text-[#e53e3e] transition-colors">{step.title}</h4>
                    <p className="text-[#888]">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex-1 w-full relative">
            <div className="bg-[#111111] border border-[#2d2d2d] rounded-xl p-8 aspect-square flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
              <div className="w-48 h-48 rounded-full border border-[#e53e3e]/30 flex items-center justify-center relative z-10 animate-[spin_30s_linear_infinite]">
                <div className="w-32 h-32 rounded-full border border-[#a855f7]/30 flex items-center justify-center animate-[spin_20s_linear_infinite_reverse]">
                  <div className="w-16 h-16 bg-[#e53e3e] rounded-lg shadow-[0_0_30px_rgba(229,62,62,0.4)] flex items-center justify-center">
                    <Rocket size={32} className="text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By / Stats Section */}
      <section className="py-20 px-6 relative z-10 border-t border-[#2d2d2d] bg-[#111111]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-[#2d2d2d]">
            <div className="p-4">
              <div className="text-4xl font-bold text-[#e53e3e] mb-2">1M+</div>
              <div className="text-sm text-[#888] uppercase tracking-wider">Components Generated</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-bold text-[#f0f0f0] mb-2">50k+</div>
              <div className="text-sm text-[#888] uppercase tracking-wider">Active Developers</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-bold text-[#a855f7] mb-2">99.9%</div>
              <div className="text-sm text-[#888] uppercase tracking-wider">Edge Uptime</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-bold text-[#4ade80] mb-2">&lt;100ms</div>
              <div className="text-sm text-[#888] uppercase tracking-wider">Preview Latency</div>
            </div>
          </div>
        </div>
      </section>

      {/* Code Showcase Section */}
      <section className="py-24 px-6 relative z-10 bg-[#111111] overflow-hidden border-t border-[#2d2d2d]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-full bg-[#e53e3e]/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 order-2 lg:order-1 relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#e53e3e] to-[#a855f7] rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="bg-[#1a1a1a] rounded-xl border border-[#2d2d2d] shadow-2xl overflow-hidden relative">
              <div className="flex items-center px-4 py-3 bg-[#111111] border-b border-[#2d2d2d] gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                <span className="ml-2 text-xs text-[#888] font-mono">App.jsx</span>
              </div>
              <div className="p-6 font-mono text-sm leading-loose">
                <div className="text-[#a855f7]">import <span className="text-[#f0f0f0]">React, {`{ useState }`}</span> from <span className="text-[#4ade80]">'react'</span>;</div>
                <div className="text-[#a855f7]">import <span className="text-[#f0f0f0]">{`{ VibeIDE }`}</span> from <span className="text-[#4ade80]">'@vibecraft/core'</span>;</div>
                <br />
                <div className="text-[#e53e3e]">export default function <span className="text-[#f0f0f0]">App</span>() {`{`}</div>
                <div className="pl-4 text-[#888]">// AI completely handles the logic</div>
                <div className="pl-4 text-[#a855f7]">return <span className="text-[#f0f0f0]">(</span></div>
                <div className="pl-8 text-[#e53e3e]">&lt;VibeIDE</div>
                <div className="pl-12 text-[#f0f0f0]">theme=<span className="text-[#4ade80]">"dark-matter"</span></div>
                <div className="pl-12 text-[#f0f0f0]">aiAssistance=<span className="text-[#a855f7]">{`{true}`}</span></div>
                <div className="pl-12 text-[#f0f0f0]">autoDeploy=<span className="text-[#a855f7]">{`{true}`}</span></div>
                <div className="pl-8 text-[#e53e3e]">/&gt;</div>
                <div className="pl-4 text-[#f0f0f0]">);</div>
                <div className="text-[#f0f0f0]">{`}`}</div>
              </div>
            </div>
          </div>
          <div className="flex-1 order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 bg-[#252525] border border-[#333] rounded-full text-xs font-medium text-[#a855f7]">
              <Code size={14} /> Developer First
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">Write less code. <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e53e3e] to-[#a855f7]">Build more.</span></h2>
            <p className="text-[#888] text-lg mb-8 leading-relaxed">
              VibeCraft abstracts away configuration and infrastructure, allowing you to focus purely on business logic and beautiful UI. Everything you need is integrated directly into the browser.
            </p>
            <ul className="space-y-4">
              {['Zero configuration setup', 'Intelligent code auto-completion', 'Instant hot-module reloading', 'Integrated terminal & DB viewer'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-[#d1d1d1]">
                  <div className="w-5 h-5 rounded-full bg-[#e53e3e]/20 flex items-center justify-center text-[#e53e3e]">
                    ✓
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-24 px-6 relative z-10 bg-[#1a1a1a] border-t border-[#2d2d2d] overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-sm font-bold tracking-widest uppercase text-[#888] mb-12">Seamlessly integrates with your favorite stack</h2>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Tech logos represented by beautiful typographic treatments since we don't have images */}
            {['React', 'Node.js', 'MongoDB', 'Tailwind', 'Express', 'Vite', 'Next.js'].map((tech, i) => (
              <div key={i} className="text-2xl md:text-4xl font-black tracking-tighter text-[#555] hover:text-[#f0f0f0] transition-colors cursor-default">
                {tech}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-6 relative z-10 bg-[#111111] border-t border-[#2d2d2d]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-[#888] text-lg">Start for free, upgrade when you need more power.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <div className="p-8 rounded-2xl bg-[#1a1a1a] border border-[#2d2d2d] hover:border-[#444] transition-colors flex flex-col">
              <h3 className="text-xl font-semibold mb-2">Community</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-[#888]">/forever</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex gap-2 text-[#d1d1d1]"><span className="text-[#e53e3e]">✓</span> Unlimited public projects</li>
                <li className="flex gap-2 text-[#d1d1d1]"><span className="text-[#e53e3e]">✓</span> Community support</li>
                <li className="flex gap-2 text-[#d1d1d1]"><span className="text-[#e53e3e]">✓</span> 100 AI Generations / mo</li>
              </ul>
              <Link to="/signup" className="block text-center bg-[#252525] hover:bg-[#333] border border-[#333] text-white py-3 rounded-lg font-medium transition-colors">Get Started</Link>
            </div>
            
            {/* Pro */}
            <div className="p-8 rounded-2xl bg-[#1a1a1a] border border-[#e53e3e] shadow-[0_0_30px_rgba(229,62,62,0.1)] relative flex flex-col transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#e53e3e] text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">Most Popular</div>
              <h3 className="text-xl font-semibold mb-2 text-[#e53e3e]">Pro Developer</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold">$19</span>
                <span className="text-[#888]">/month</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex gap-2 text-[#d1d1d1]"><span className="text-[#e53e3e]">✓</span> Unlimited private projects</li>
                <li className="flex gap-2 text-[#d1d1d1]"><span className="text-[#e53e3e]">✓</span> Unlimited AI Generations</li>
                <li className="flex gap-2 text-[#d1d1d1]"><span className="text-[#e53e3e]">✓</span> Dedicated Database cluster</li>
                <li className="flex gap-2 text-[#d1d1d1]"><span className="text-[#e53e3e]">✓</span> Custom Domains</li>
              </ul>
              <Link to="/signup" className="block text-center bg-[#e53e3e] hover:bg-[#c53030] text-white py-3 rounded-lg font-medium transition-colors">Upgrade to Pro</Link>
            </div>
            
            {/* Enterprise */}
            <div className="p-8 rounded-2xl bg-[#1a1a1a] border border-[#2d2d2d] hover:border-[#444] transition-colors flex flex-col">
              <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold">Custom</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex gap-2 text-[#d1d1d1]"><span className="text-[#e53e3e]">✓</span> Everything in Pro</li>
                <li className="flex gap-2 text-[#d1d1d1]"><span className="text-[#e53e3e]">✓</span> SSO / SAML Authentication</li>
                <li className="flex gap-2 text-[#d1d1d1]"><span className="text-[#e53e3e]">✓</span> VPC Peering</li>
                <li className="flex gap-2 text-[#d1d1d1]"><span className="text-[#e53e3e]">✓</span> 24/7 Priority Support</li>
              </ul>
              <Link to="/contact" className="block text-center bg-[#252525] hover:bg-[#333] border border-[#333] text-white py-3 rounded-lg font-medium transition-colors">Contact Sales</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 relative z-10 bg-[#1a1a1a] border-t border-[#2d2d2d]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-16 text-center">Loved by engineers worldwide</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { quote: "VibeCraft completely changed how our team ships features. The AI integration feels like having a senior developer pairing with you 24/7.", author: "Sarah Jenkins", role: "Frontend Lead" },
              { quote: "I migrated my entire agency's workflow to VibeCraft. We build and deploy landing pages 10x faster now without managing infrastructure.", author: "Marcus Thorne", role: "Agency Owner" },
              { quote: "The zero-config environment is a game changer. I just open my browser and start writing React. No node_modules, no webpack errors.", author: "Alex Rivera", role: "Fullstack Developer" }
            ].map((t, i) => (
              <div key={i} className="p-8 rounded-xl bg-[#111111] border border-[#2d2d2d]">
                <div className="flex text-[#e53e3e] mb-4">
                  {[...Array(5)].map((_, j) => <span key={j}>★</span>)}
                </div>
                <p className="text-[#d1d1d1] leading-relaxed mb-6 italic">"{t.quote}"</p>
                <div>
                  <div className="font-semibold text-white">{t.author}</div>
                  <div className="text-xs text-[#888]">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* FAQ Section */}
      <section className="py-24 px-6 relative z-10 bg-[#111111] border-t border-[#2d2d2d]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-[#888]">Everything you need to know about the product and billing.</p>
          </div>
          
          <div className="space-y-4">
            {[
              { q: "Is VibeCraft free to use?", a: "Yes, our core IDE and AI generation features are completely free for individual developers. We offer premium tiers for team collaboration and extended compute." },
              { q: "Can I export my code?", a: "Absolutely. You maintain 100% ownership of your code. You can download your entire workspace as a zip file or connect your GitHub repository to sync changes automatically." },
              { q: "What frameworks are supported?", a: "Currently, VibeCraft natively supports React, Node.js, Express, and standard HTML/CSS/JS. We are rapidly expanding our language support." },
              { q: "How secure is my data?", a: "Enterprise-grade security is built-in. Your code is encrypted at rest and in transit. Private workspaces remain strictly private and are never used to train our AI models." }
            ].map((faq, i) => (
              <div key={i} className="bg-[#1a1a1a] border border-[#2d2d2d] rounded-lg p-6 hover:border-[#444] transition-colors">
                <h4 className="text-lg font-semibold text-[#f0f0f0] mb-3">{faq.q}</h4>
                <p className="text-[#888] leading-relaxed text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 relative z-10 bg-[#1a1a1a] border-t border-[#2d2d2d]">
        <div className="max-w-4xl mx-auto text-center border border-[#2d2d2d] rounded-2xl p-12 sm:p-20 relative overflow-hidden bg-[#111111]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#e53e3e]/5 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#a855f7]/5 blur-[100px] pointer-events-none" />
          
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 relative z-10">Start Building the Future</h2>
          <p className="text-xl text-[#888] mb-10 relative z-10">Join thousands of developers shipping faster with VibeCraft.</p>
          
          <Link to="/signup" className="inline-block bg-[#e53e3e] hover:bg-[#c53030] text-white font-semibold text-lg px-10 py-4 rounded-md transition-colors relative z-10 shadow-[0_0_20px_rgba(229,62,62,0.2)]">
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-[#2d2d2d] text-center text-[#666] text-sm bg-[#111111]">
        <p>© {new Date().getFullYear()} VibeCraft. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;