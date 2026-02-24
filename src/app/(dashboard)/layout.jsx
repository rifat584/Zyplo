"use client";

import { useState } from "react";
import Sidebar from "@/components/Dashboard/Sidebar/Sidebar";
import DashboardNavbar from "@/components/Dashboard/Navbar/Navbar";
import "@/app/globals.css"; // Ensure globals is imported!

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // NOTE: In the future, you will fetch this from your Database / Auth context.
  // We hardcode it to 'admin' right now so you can see all the design features.
  const [role, setRole] = useState("admin"); 

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#050505] transition-colors duration-500 font-sans">
      
      {/* 1. The Left Sidebar */}
      <Sidebar role={role} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* 2. The Main Column (Navbar + Content) */}
      <div className="flex flex-1 flex-col overflow-hidden">
        
        {/* Top Navbar */}
        <DashboardNavbar setSidebarOpen={setSidebarOpen} />

        {/* The Scrollable Canvas for your pages */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-8">
          
          {/* Quick toggle for you to test design switching */}
          <div className="mb-4 flex items-center justify-end gap-2 text-xs">
             <span className="text-gray-500">Preview View:</span>
             <button onClick={() => setRole("admin")} className={`px-2 py-1 rounded border ${role === 'admin' ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-500/20 dark:border-blue-500/30 dark:text-cyan-400' : 'border-gray-200 dark:border-white/10 dark:text-gray-400'}`}>Admin</button>
             <button onClick={() => setRole("user")} className={`px-2 py-1 rounded border ${role === 'user' ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-500/20 dark:border-blue-500/30 dark:text-cyan-400' : 'border-gray-200 dark:border-white/10 dark:text-gray-400'}`}>User</button>
          </div>

          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}