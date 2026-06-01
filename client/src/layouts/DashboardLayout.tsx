import type { ReactNode } from "react";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex bg-zinc-950 text-zinc-100 min-h-screen relative overflow-hidden font-sans">
      {/* Background radial glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Sidebar */}
      <Sidebar />

      {/* Main content body */}
      <div className="flex-grow flex flex-col min-w-0">
        <main className="flex-grow p-6 md:p-8 flex flex-col max-w-7xl w-full mx-auto">
          {/* Header/Navbar */}
          <Navbar />

          {/* Animating page container */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="flex-grow flex flex-col"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;