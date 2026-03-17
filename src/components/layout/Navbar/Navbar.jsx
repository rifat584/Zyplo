"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X, ChevronDown, Sun, Moon } from "lucide-react";
import ResourcesMenu from "./ResourcesMenu/ResourcesMenu";
import { useTheme } from "@/Context/ThemeContext";
import Logo from "@/components/Shared/Logo/Logo";
import { useSession, signOut } from "next-auth/react"; // Added signOut

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false); // Added profile dropdown state
  
  const pathname = usePathname();
  const dropdownRef = useRef(null);
  const profileRef = useRef(null); // Added ref for profile dropdown
  
  const session = useSession();
  const isAuthenticated = session.status === "authenticated"; // Corrected auth check
  
  // Theme state
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const getLinkClass = (path) => {
    const baseStyles =
      "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200";

    if (pathname === path) {
      return `${baseStyles} bg-primary/10 text-foreground font-semibold shadow-sm ring-1 ring-primary/20 dark:bg-primary/20`;
    }

    return `${baseStyles} text-muted-foreground hover:text-secondary hover:border dark:hover:text-secondary transition-colors`;
  };

  // Close mega menu and profile menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setResourcesOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Prevent hydration mismatch for theme toggle
  useEffect(() => {
    setMounted(true);
  }, []);

  const closeAllMobile = () => {
    setIsOpen(false);
    setMobileResourcesOpen(false);
    setProfileOpen(false);
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const resources = [
    { title: "Zyplo Guide", desc: "Learn how to use Zyplo step by step", href: "/resources/guide" },
    { title: "Remote Work", desc: "Best practices for remote teams", href: "/resources/remote-work" },
    { title: "Webinars", desc: "Productivity and workflow sessions", href: "/resources/webinars" },
    { title: "Customer Stories", desc: "How teams use Zyplo", href: "/resources/customer-stories" },
    { title: "Developers", desc: "Build and extend Zyplo", href: "/resources/developers" },
    { title: "Help Center", desc: "FAQs and support resources", href: "/resources/help" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Logo size={50} />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-2 relative" ref={dropdownRef}>
          <Link href="/" className={getLinkClass("/")}>Home</Link>
          <Link href="/pricing" className={getLinkClass("/pricing")}>Pricing</Link>

          {/* Resources Button */}
          <button
            onClick={() => setResourcesOpen((p) => !p)}
            className={`${getLinkClass("/resources")} flex items-center gap-1 cursor-pointer`}
          >
            Resources <ChevronDown size={16} />
          </button>

          {/* Mega Menu */}
          <ResourcesMenu
            resources={resources}
            resourcesOpen={resourcesOpen}
            setResourcesOpen={setResourcesOpen}
            mobileResourcesOpen={false}
            setMobileResourcesOpen={() => { }}
            closeAll={() => { }}
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">

          {/* --- Theme Toggle --- */}
          {mounted && (
            <button
              onClick={toggleTheme}
              className="relative flex h-9 w-9 items-center justify-center rounded-full bg-surface dark:bg-surface border border-border dark:border-border transition-all duration-300 hover:scale-105 cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon size={16} className="text-muted-foreground" />
              ) : (
                <Sun size={16} className="text-secondary" />
              )}
            </button>
          )}

          <button className="hidden sm:flex items-center gap-2 rounded-md border border-border dark:border-border bg-surface dark:bg-surface px-3 py-1.5 text-sm text-muted-foreground transition hover:bg-muted dark:hover:bg-surface">
            <Search size={16} />
            <span className="text-xs">Ctrl+K</span>
          </button>

          <div className="hidden md:flex items-center gap-4">
            {!isAuthenticated ? (
              <>
                <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-secondary">
                  Sign in
                </Link>
                <Link href="/register" className="flex items-center justify-center rounded-lg bg-linear-to-br from-primary to-secondary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-secondary/25 active:scale-95">
                  Get started
                </Link>
              </>
            ) : (
              <>
                {/* --- Profile Dropdown (Desktop) --- */}
                <div className="relative" ref={profileRef}>
                  <button 
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 outline-none"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary hover:ring-2 hover:ring-primary/40 transition-all cursor-pointer">
                      {(session.data?.user?.name?.charAt(0) || "U").toUpperCase()}
                    </div>
                  </button>

                  {profileOpen ? (
                    <div className="absolute right-0 top-12 z-30 w-56 rounded-xl border border-border bg-card p-2 shadow-lg">
                      <div className="mb-2 border-b border-border pb-2 px-2">
                        <p className="text-sm font-medium text-foreground truncate">
                          {session.data?.user?.name || "User"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {session.data?.user?.email || ""}
                        </p>
                      </div>
                      
                      <div className="flex flex-col gap-1">
                        {/* Moved Dashboard Link inside the dropdown */}
                        <Link
                          href="/dashboard"
                          onClick={() => setProfileOpen(false)}
                          className="w-full rounded-lg px-2 py-2 text-left text-sm font-medium text-foreground hover:bg-muted transition-colors"
                        >
                          Dashboard
                        </Link>
                        
                        <button
                          type="button"
                          onClick={() => signOut({ callbackUrl: "/login" })}
                          className="w-full rounded-lg px-2 py-2 text-left text-sm font-medium text-destructive hover:bg-destructive/10 dark:text-destructive dark:hover:bg-destructive/10 transition-colors"
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-muted-foreground hover:bg-muted dark:hover:bg-accent/70 rounded-md transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Gradient line */}
      <div className="absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-card px-6 py-4 space-y-4 shadow-xl">
          {/* Top Links */}
          <div className="flex flex-col space-y-2">
            <Link href="/" onClick={closeAllMobile} className={getLinkClass("/")}>Home</Link>
            <Link href="/pricing" onClick={closeAllMobile} className={getLinkClass("/pricing")}>Pricing</Link>

            {/* Resources Toggle */}
            <button
              onClick={() => setMobileResourcesOpen((p) => !p)}
              className="w-full flex items-center justify-between px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground dark:text-muted-foreground hover:bg-secondary/20"
            >
              Resources
              <ChevronDown size={16} className={`${mobileResourcesOpen ? "rotate-180" : ""} transition-transform`} />
            </button>

            <ResourcesMenu
              resources={resources}
              resourcesOpen={false}
              setResourcesOpen={() => { }}
              mobileResourcesOpen={mobileResourcesOpen}
              setMobileResourcesOpen={setMobileResourcesOpen}
              closeAll={closeAllMobile}
            />
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 dark:border-gray-800 pt-4 flex flex-col gap-3">
            {/* Search */}
            <button className="flex w-full items-center justify-center gap-2 rounded-md border border-border dark:border-border bg-surface dark:bg-surface px-3 py-2 text-sm text-muted-foreground dark:text-muted-foreground">
              <Search size={16} />
              Search...
            </button>

            {!isAuthenticated ? (
              <>
                <Link
                  href="/login"
                  onClick={closeAllMobile}
                  className="flex w-full items-center justify-center rounded-lg border border-border dark:border-border py-2 text-sm font-medium text-muted-foreground hover:bg-surface dark:hover:bg-accent/70"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  onClick={closeAllMobile}
                  className="flex w-full items-center justify-center rounded-lg bg-linear-to-br from-primary to-secondary px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-indigo-500/40 active:scale-95"
                >
                  Get started
                </Link>
              </>
            ) : (
              <>
                {/* Dashboard (Mobile) */}
                <Link
                  href="/dashboard"
                  onClick={closeAllMobile}
                  className="flex w-full items-center justify-center rounded-lg border border-indigo-200 dark:border-indigo-500/30 bg-indigo-50 dark:bg-primary/10 py-2 text-sm font-medium text-primary dark:text-primary"
                >
                  Dashboard
                </Link>
                
                {/* Mobile User Info & Logout */}
                <div className="mt-2 rounded-xl border border-border bg-slate-50 p-3 dark:border-white/10 dark:bg-surface/50">
                  <div className="mb-3 border-b border-border pb-3 dark:border-white/10 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary dark:bg-primary/20 dark:text-primary">
                      {(session.data?.user?.name?.charAt(0) || "U").toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-medium text-foreground truncate">
                        {session.data?.user?.name || "User"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {session.data?.user?.email || ""}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="w-full rounded-lg py-2 text-center text-sm font-medium text-destructive hover:bg-destructive/10 dark:text-destructive dark:hover:bg-destructive/10 transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
