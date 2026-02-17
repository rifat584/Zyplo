"use client";

import Link from "next/link";
import { Sun, Moon, Search } from "lucide-react";
// import { useTheme } from "@/context/ThemeContext";

const Navbar = () => {
  // const { theme, toggleTheme } = useTheme();

  const isClient = typeof window !== "undefined";

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-lg">
            Z
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            Zyplo
          </span>
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600 dark:text-gray-300">
          <Link href="#">Features</Link>
          <Link href="#">Workflow</Link>
          <Link href="#">Pricing</Link>
          <Link href="#">FAQ</Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <button className="hidden sm:flex items-center gap-2 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 text-sm text-gray-500 dark:text-gray-300 transition">
            <Search size={16} />
            Ctrl+K
          </button>

          {/* 🌙 Theme toggle */}
          {/* {isClient && (
            <button
              onClick={toggleTheme}
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:scale-105"
            >
              {theme === "light" ? (
                <Sun size={18} className="text-yellow-500" />
              ) : (
                <Moon size={18} className="text-blue-400" />
              )}
            </button>
          )} */}

          <Link
            href="#"
            className="text-sm font-medium text-gray-600 dark:text-gray-300"
          >
            Sign in
          </Link>

          <button className="rounded-lg bg-indigo-600 dark:bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 transition">
            Get started
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
