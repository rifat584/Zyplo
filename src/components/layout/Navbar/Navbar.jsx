"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; 
import { Sun, Moon, Search, Menu, X } from "lucide-react";
<<<<<<< HEAD
import Logo from "./Logo";
// import { useTheme } from "@/context/ThemeContext";
=======
>>>>>>> origin/development

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname(); 

  const getLinkClass = (path) => {
    const baseStyles = "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200";
    if (pathname === path) {
      return `${baseStyles} bg-primary/10 text-black font-semibold shadow-sm ring-1 ring-primary/20`;
    }
    return `${baseStyles} text-muted-foreground hover:bg-secondary/20 hover:text-primary transition-colors`;
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        
        {/* --- Logo --- */}
      <Logo/>
      
        {/* --- Desktop Links (Hidden on Mobile) --- */}
        <div className="hidden md:flex items-center gap-2">
          <Link href="/" className={getLinkClass("/")}>Home</Link>
          <Link href="/pricing" className={getLinkClass("/pricing")}>Pricing</Link>
          <Link href="/docs" className={getLinkClass("/docs")}>Docs</Link>
        </div>

        {/* --- Right Actions & Mobile Menu Toggle --- */}
        <div className="flex items-center gap-4">
          
          {/* --- Logo --- */}
          <Link href="/" className="flex items-center gap-2">
            <div className="group flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-white font-bold text-lg transition-transform duration-500 hover:rotate-[10deg] hover:scale-110 shadow-lg shadow-indigo-500/30">
              Z
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Zyplo
            </span>
          </Link>

          {/* --- Desktop Links (Hidden on Mobile) --- */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/" className={getLinkClass("/")}>Home</Link>
            <Link href="/pricing" className={getLinkClass("/pricing")}>Pricing</Link>
            <Link href="/docs" className={getLinkClass("/docs")}>Docs</Link>
          </div>

          {/* --- Right Actions & Mobile Menu Toggle --- */}
          <div className="flex items-center gap-4">
            
            {/* Search (Hidden on very small screens) */}
            <button className="hidden sm:flex items-center gap-2 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 text-sm text-gray-500 dark:text-gray-300 transition hover:bg-gray-100 dark:hover:bg-gray-700">
              <Search size={16} />
              <span className="text-xs">Ctrl+K</span>
            </button>

            {/* Desktop Sign In/Get Started */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-secondary"
              >
                Sign in
              </Link>
              <Link href="/register" className="flex items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 to-cyan-400 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-indigo-500/40 active:scale-95">
                Get started
              </Link>
            </div>

            {/* --- Mobile Menu Button --- */}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* ✨ THE PREMIUM GRADIENT LINE ✨ */}
        <div className="absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-indigo-500/30 dark:via-cyan-400/30 to-transparent" />
      </div>

      {/* --- Mobile Dropdown Menu --- */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 py-4 space-y-4 shadow-xl animate-in slide-in-from-top-5">
          <div className="flex flex-col space-y-2">
            <Link href="/" onClick={() => setIsOpen(false)} className={getLinkClass("/")}>Home</Link>
            <Link href="/pricing" onClick={() => setIsOpen(false)} className={getLinkClass("/pricing")}>Pricing</Link>
            <Link href="/docs" onClick={() => setIsOpen(false)} className={getLinkClass("/docs")}>Docs</Link>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-800 pt-4 flex flex-col gap-3">
             <button className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-500 dark:text-gray-300">
               <Search size={16} />
               Search...
            </button>
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="flex w-full items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 to-cyan-400 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-indigo-500/40 active:scale-95"
            >
              Get started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;