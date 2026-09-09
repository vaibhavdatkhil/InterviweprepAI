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
  Cpu,
  X,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

const Sidebar = ({ mobileOpen = false, onCloseMobile }: SidebarProps) => {
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
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar container */}
      <aside 
        className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-zinc-950/95 lg:bg-zinc-950/80 backdrop-blur-2xl border-r border-zinc-900 p-6 flex flex-col justify-between shrink-0 z-50 transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="flex items-center justify-between mb-8 px-2">
            <Link to="/dashboard" onClick={onCloseMobile} className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-500 flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:scale-105 transition-transform duration-300">
                <Cpu size={22} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
                  PrepAI
                </h1>
                <span className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase">
                  Interview Copilot
                </span>
              </div>
            </Link>

            {/* Mobile Close Button */}
            <button 
              onClick={onCloseMobile}
              className="lg:hidden p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition"
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1.5 overflow-y-auto max-h-[calc(100vh-220px)] pr-1">
            {navItems.map((item) => {
              const isActive =
                location.pathname === item.path ||
                (item.path !== "/dashboard" && location.pathname.startsWith(item.path));
              const Icon = item.icon;

              return (
                <Link 
                  key={item.path} 
                  to={item.path}
                  onClick={onCloseMobile}
                >
                  <div
                    className={`group flex items-center gap-3.5 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 relative ${
                      isActive
                        ? "bg-violet-600/15 text-violet-300 font-semibold shadow-sm shadow-violet-600/10"
                        : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60"
                    }`}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-violet-500 to-indigo-500 rounded-r-full shadow-sm shadow-violet-500" />
                    )}
                    <Icon
                      size={18}
                      className={`transition-transform duration-200 group-hover:scale-110 shrink-0 ${
                        isActive ? "text-violet-400" : "text-zinc-500 group-hover:text-zinc-200"
                      }`}
                    />
                    <span className="text-sm tracking-wide truncate">{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile Badge */}
        <div className="border-t border-zinc-900 pt-4 mt-4">
          <Link to="/progress" onClick={onCloseMobile} className="block">
            <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-zinc-900/60 transition group cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-fuchsia-600 flex items-center justify-center font-bold text-white shadow-md shadow-violet-500/20 group-hover:scale-105 transition-transform">
                AI
              </div>
              <div className="overflow-hidden flex-1">
                <h4 className="text-sm font-semibold text-zinc-200 truncate group-hover:text-white transition-colors">
                  Interview Ready
                </h4>
                <p className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Pro Member
                </p>
              </div>
            </div>
          </Link>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;