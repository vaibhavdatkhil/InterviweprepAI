import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">

      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-3xl" />

      <div className="relative w-full max-w-md bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 shadow-2xl">
        {children}
      </div>

    </div>
  );
};

export default AuthLayout;