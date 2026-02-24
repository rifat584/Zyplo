"use client";

import { useState, useEffect } from "react";
import { Search, Bell, Sun, Moon, Menu } from "lucide-react";
import { useTheme } from "@/Context/ThemeContext";
import { useSession } from "next-auth/react";

export default function DashboardNavbar({ setSidebarOpen }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => setMounted(true), []);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-gray-200/80 bg-white/80 px-4 backdrop-blur-md dark:border-white/10 dark:bg-[#0B0F19]/80 sm:px-6 transition-colors duration-300">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5 rounded-md"
        >
          <Menu size={20} />
        </button>

        {/* Breadcrumbs */}
        <div className="hidden sm:flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
          <span className="hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors">
            Zyplo
          </span>
          <span className="mx-2">/</span>
          <span className="text-gray-900 dark:text-gray-100">Dashboard</span>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        {/* Command Palette Trigger */}
        <button className="hidden sm:flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-1.5 text-sm text-gray-500 transition-colors hover:bg-gray-100 dark:border-white/10 dark:bg-black/20 dark:text-gray-400 dark:hover:bg-white/5">
          <Search size={16} />
          <span className="w-32 text-left">Search...</span>
          <span className="rounded-md border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] font-bold tracking-widest text-gray-500 shadow-sm dark:border-white/10 dark:bg-black dark:text-gray-400">
            Ctrl K
          </span>
        </button>

        {/* Theme Toggle */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition-all hover:scale-105 dark:border-white/10 dark:bg-[#0B0F19] dark:text-gray-300"
          >
            {theme === "light" ? (
              <Moon size={16} />
            ) : (
              <Sun size={16} className="text-cyan-400" />
            )}
          </button>
        )}

        {/* Notifications */}
        <button className="relative p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
          <Bell size={20} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-blue-500 ring-2 ring-white dark:ring-[#0B0F19]" />
        </button>

        {/* User Avatar */}
        {session && (
          <div className="h-8 w-8 cursor-pointer rounded-full bg-linear-to-br from-blue-600 to-cyan-500 p-[2px] shadow-sm hover:scale-105 transition-transform">
            <div className="h-full w-full rounded-full border-2 border-white dark:border-[#0B0F19] bg-gray-900 flex items-center justify-center text-xs font-bold text-white">
              {session.user.name}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
