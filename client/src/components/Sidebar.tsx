import {
  LayoutDashboard,
  Brain,
  Code2,
  FileText,
  Terminal,
  BarChart3,
  Sparkles,
  Flame,
  Mic,
  Cpu
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/mock-interview", label: "Mock Interview", icon: Brain },
    { path: "/dsa", label: "DSA Questions", icon: Code2 },
    { path: "/editor", label: "Code Editor", icon: Terminal },
    { path: "/progress", label: "Progress", icon: Flame },
    { path: "/resume-analyzer", label: "Resume Analyzer", icon: FileText },
    { path: "/analytics", label: "Analytics", icon: BarChart3 },
    { path: "/voice-interview", label: "Voice Interview", icon: Mic },
    { path: "/ai-review", label: "AI Code Review", icon: Sparkles },
  ];

  return (
    <aside className="w-72 h-screen bg-zinc-950/80 backdrop-blur-xl border-r border-zinc-900 p-6 flex flex-col justify-between shrink-0 sticky top-0">
      <div>
        {/* Brand Logo */}
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <Cpu size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              PrepAI
            </h1>
            <span className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase">
              AI Interview Suite
            </span>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== "/dashboard" && location.pathname.startsWith(item.path));
            const Icon = item.icon;
            
            return (
              <Link key={item.path} to={item.path}>
                <div
                  className={`group flex items-center gap-3.5 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 ${
                    isActive
                      ? "bg-violet-600/10 text-violet-400 border-l-2 border-violet-500 font-medium"
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50 border-l-2 border-transparent"
                  }`}
                >
                  <Icon 
                    size={19} 
                    className={`transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? "text-violet-400" : "text-zinc-400 group-hover:text-zinc-100"
                    }`}
                  />
                  <span className="text-sm tracking-wide">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Quick Info */}
      <div className="border-t border-zinc-900 pt-4 mt-6">
        <div className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-zinc-900/30 transition cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 flex items-center justify-center font-bold text-white shadow-md">
            V
          </div>
          <div className="overflow-hidden">
            <h4 className="text-sm font-semibold text-zinc-200 truncate">Vaibhav</h4>
            <p className="text-xs text-zinc-500 truncate">Premium Account</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;