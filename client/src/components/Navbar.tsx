import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Settings,
  Search,
  LogOut,
  Menu,
  CheckCircle2,
  Sparkles,
  Sliders,
  Moon,
  Volume2,
} from "lucide-react";
import toast from "react-hot-toast";

interface NavbarProps {
  onToggleMobileMenu?: () => void;
}

const Navbar = ({ onToggleMobileMenu }: NavbarProps) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { title: "Mock Interview Complete", time: "10m ago", desc: "Scored 88% on Frontend React Architecture." },
    { title: "Streak Extended!", time: "2h ago", desc: "12-day problem-solving streak milestone reached." },
    { title: "New DSA Questions", time: "1d ago", desc: "Added 15 latest Google & Amazon interview problems." },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Successfully logged out. See you soon!");
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-between mb-8 gap-3 sm:gap-4 relative z-30">
      {/* Mobile Hamburger + Search */}
      <div className="flex items-center gap-2 flex-1 max-w-lg">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2.5 rounded-xl border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 transition shrink-0 cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu size={19} />
          </button>
        )}

        <div className="flex items-center bg-zinc-900/60 border border-zinc-800/80 focus-within:border-violet-500/50 rounded-2xl px-4 py-2.5 flex-1 transition-all duration-200">
          <Search size={17} className="text-zinc-500 mr-2.5 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search problems, topics, system design..."
            className="bg-transparent outline-none text-sm text-zinc-200 placeholder-zinc-500 w-full"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-[11px] text-zinc-500 hover:text-zinc-300 font-mono px-1.5 py-0.5 rounded bg-zinc-800"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowSettings(false);
            }}
            className="relative p-2.5 sm:p-3 rounded-2xl border border-zinc-800/80 bg-zinc-900/70 hover:bg-zinc-800 text-zinc-300 hover:text-white transition cursor-pointer"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-zinc-950 border border-zinc-800/90 rounded-2xl p-4 z-50 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-zinc-900">
                <h3 className="text-white text-sm font-bold flex items-center gap-2">
                  <Bell size={15} className="text-violet-400" /> Notifications
                </h3>
                <span className="text-[11px] text-violet-400 font-medium cursor-pointer hover:underline">
                  Mark all read
                </span>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {notifications.map((note, idx) => (
                  <div
                    key={idx}
                    className="bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-850 p-3 rounded-xl transition cursor-pointer"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-xs font-semibold text-zinc-200">{note.title}</span>
                      <span className="text-[10px] text-zinc-500 font-mono shrink-0">{note.time}</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">{note.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Settings Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowSettings(!showSettings);
              setShowNotifications(false);
            }}
            className="p-2.5 sm:p-3 rounded-2xl border border-zinc-800/80 bg-zinc-900/70 hover:bg-zinc-800 text-zinc-300 hover:text-white transition cursor-pointer"
            aria-label="Preferences"
          >
            <Settings size={18} />
          </button>

          {showSettings && (
            <div className="absolute right-0 mt-3 w-72 bg-zinc-950 border border-zinc-800/90 rounded-2xl p-4 z-50 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-zinc-900">
                <Sliders size={15} className="text-violet-400" />
                <h3 className="text-white text-sm font-bold">Preferences</h3>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/60">
                  <span className="flex items-center gap-2 text-zinc-300">
                    <Moon size={14} className="text-violet-400" /> Dark Mode
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                    Enabled
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/60">
                  <span className="flex items-center gap-2 text-zinc-300">
                    <Volume2 size={14} className="text-cyan-400" /> Voice Feedback
                  </span>
                  <span className="text-[10px] font-bold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-md">
                    TTS Ready
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/60">
                  <span className="flex items-center gap-2 text-zinc-300">
                    <Sparkles size={14} className="text-amber-400" /> AI Engine
                  </span>
                  <span className="text-[10px] font-bold text-zinc-300 font-mono">
                    Gemini 1.5
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="p-2.5 sm:p-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition flex items-center gap-1.5 cursor-pointer"
          title="Log Out"
          aria-label="Log Out"
        >
          <LogOut size={18} />
          <span className="hidden sm:inline text-xs font-semibold">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;