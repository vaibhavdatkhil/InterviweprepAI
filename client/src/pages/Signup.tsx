import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, ArrowRight, Cpu } from "lucide-react";
import toast from "react-hot-toast";

import AuthLayout from "../layouts/AuthLayout";
import { registerUser } from "../services/authService";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const data = await registerUser(formData);
      localStorage.setItem("token", data.token);
      toast.success("Account Created Successfully! Welcome.");
      navigate("/dashboard");
    } catch (error) {
      console.warn("Backend server connection failed, entering offline demo mode.", error);
      toast.success("Offline Demo Mode: Creating account...");
      localStorage.setItem("token", "demo-offline-jwt-token");
      setTimeout(() => {
        navigate("/dashboard");
      }, 800); // 800ms delay
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="text-center mb-8">
        <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 items-center justify-center shadow-lg shadow-violet-500/25 mb-4 mx-auto">
          <Cpu size={22} className="text-white" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
          Create Account
        </h1>
        <p className="text-zinc-400 text-sm mt-2">
          Join PrepAI and start acing your technical rounds.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-zinc-400 block mb-1.5 uppercase tracking-wider">
            Full Name
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
              <User size={16} />
            </span>
            <input
              type="text"
              name="name"
              placeholder="Alex Johnson"
              value={formData.name}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-zinc-950/80 border border-zinc-800 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10 rounded-xl outline-none text-sm text-zinc-200 transition-all duration-200"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-zinc-400 block mb-1.5 uppercase tracking-wider">
            Email Address
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
              <Mail size={16} />
            </span>
            <input
              type="email"
              name="email"
              placeholder="alex@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-zinc-950/80 border border-zinc-800 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10 rounded-xl outline-none text-sm text-zinc-200 transition-all duration-200"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-zinc-400 block mb-1.5 uppercase tracking-wider">
            Password
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
              <Lock size={16} />
            </span>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-zinc-950/80 border border-zinc-800 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10 rounded-xl outline-none text-sm text-zinc-200 transition-all duration-200"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-semibold py-3.5 rounded-xl shadow-lg shadow-violet-600/25 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center gap-1.5">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Account...
            </span>
          ) : (
            <>
              Sign Up <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center border-t border-zinc-800/80 pt-6">
        <p className="text-zinc-500 text-xs">
          Already have an account?{" "}
          <Link to="/login" className="text-violet-400 hover:text-violet-300 font-semibold transition duration-150">
            Sign In
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Signup;