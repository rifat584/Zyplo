"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X, ChevronDown, Sun, Moon } from "lucide-react";
import ResourcesMenu from "./ResourcesMenu/ResourcesMenu";
import { useTheme } from "@/Context/ThemeContext";
import Logo from "@/components/Shared/Logo/Logo";
import { useSession, signOut } from "next-auth/react";
import { resources } from "@/lib/resources/resources";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const pathname = usePathname();
  const dropdownRef = useRef(null);
  const profileRef = useRef(null);

  const session = useSession();
  const isAuthenticated = session.status === "authenticated";
  const [profile, setProfile] = useState(null);

  // Theme state
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // --- UPDATED ACTIVE ROUTE STYLES (Bottom Border) ---
  const getLinkClass = (path) => {
    const baseStyles =
      "px-4 py-2 text-sm font-medium transition-all duration-200 border-b-2 border-transparent";

    if (pathname === path) {
      // ACTIVE: Text color and bottom border are both 'secondary'
      return `${baseStyles} text-secondary !border-secondary dark:text-secondary dark:!border-secondary`;
    }

    // INACTIVE / HOVER: Normal text with rounded-top hover background
    return `${baseStyles} rounded-t-lg text-gray-600 dark:text-gray-300 hover:bg-primary/10 hover:text-gray-900 dark:hover:text-gray-100 hover:shadow-sm dark:hover:bg-primary/20`;
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

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      if (!isAuthenticated) {
        setProfile(null);
        return;
      }
      try {
        const res = await fetch("/api/dashboard/profile", {
          cache: "no-store",
        });
        const text = await res.text();
        const data = text ? JSON.parse(text) : null;
        if (!res.ok || !data?.currentUser) return;
        if (!cancelled) setProfile(data.currentUser);
      } catch {
        // keep session fallback
      }
    }

    loadProfile();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  const closeAllMobile = () => {
    setIsOpen(false);
    setMobileResourcesOpen(false);
    setProfileOpen(false);
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // --- TRICK TO OPEN COMMAND PALETTE ---
  const openCommandPalette = () => {
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true }),
    );
  };

  const displayName = profile?.name || session.data?.user?.name || "User";
  const displayEmail = profile?.email || session.data?.user?.email || "";
  const displayAvatarUrl =
    profile?.avatarUrl || session.data?.user?.image || "";

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-card/80 dark:bg-[#0F1629]/80 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Logo size={50} />
        </Link>

        {/* Desktop Links */}
        <div
          className="hidden md:flex items-center gap-2 relative"
          ref={dropdownRef}
        >
          <Link href="/" className={getLinkClass("/")}>
            Home
          </Link>
          <Link href="/pricing" className={getLinkClass("/pricing")}>
            Pricing
          </Link>
          <Link href="/blog" className={getLinkClass("/blog")}>
            Blog
          </Link>

          {/* Resources Button (Click only) */}
          <button
            onClick={() => setResourcesOpen((p) => !p)}
            className={`${getLinkClass("/resources")} flex items-center gap-1 cursor-pointer outline-none`}
          >
            Resources
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${resourcesOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* Mega Menu */}
          <ResourcesMenu
            resources={resources}
            resourcesOpen={resourcesOpen}
            setResourcesOpen={setResourcesOpen}
            mobileResourcesOpen={false}
            setMobileResourcesOpen={() => {}}
            closeAll={() => {}}
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* --- Theme Toggle --- */}
          {mounted && (
            <button
              onClick={toggleTheme}
              className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:scale-105 cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon size={16} className="text-gray-600" />
              ) : (
                <Sun size={16} className="text-yellow-400" />
              )}
            </button>
          )}

          {/* Desktop Search Button */}
          <button
            onClick={openCommandPalette}
            className="hidden sm:flex items-center gap-2 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 transition hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
          >
            <Search size={16} />
            <span className="text-xs">Ctrl+K</span>
          </button>

          <div className="hidden md:flex items-center gap-4">
            {!isAuthenticated ? (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-secondary"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="flex items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 to-cyan-400 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-indigo-500/40 active:scale-95"
                >
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
                    <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-sm font-bold text-primary dark:bg-primary/20 dark:text-primary hover:ring-2 hover:ring-primary/50 transition-all cursor-pointer">
                      {displayAvatarUrl ? (
                        <img
                          src={displayAvatarUrl}
                          alt={displayName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span>
                          {(displayName?.charAt(0) || "U").toUpperCase()}
                        </span>
                      )}
                    </div>
                  </button>

                  {profileOpen ? (
                    <div className="absolute right-0 top-12 z-30 w-56 rounded-xl border border bg-card p-2 shadow-lg dark:border/10 dark:bg-card">
                      <div className="mb-2 border-b border pb-2 px-2 dark:border/10">
                        <p className="text-sm font-medium text-foreground dark:text-muted-foreground truncate">
                          {displayName}
                        </p>
                        <p className="text-xs text-muted-foreground dark:text-muted-foreground truncate">
                          {displayEmail}
                        </p>
                      </div>

                      <div className="flex flex-col gap-1">
                        <Link
                          href="/dashboard"
                          onClick={() => setProfileOpen(false)}
                          className="w-full rounded-lg px-2 py-2 text-left text-sm font-medium text-foreground hover:bg-muted dark:text-muted-foreground dark:hover:bg-card/5 transition-colors"
                        >
                          Dashboard
                        </Link>
                        <Link
                          href="/dashboard/profile"
                          onClick={() => setProfileOpen(false)}
                          className="w-full rounded-lg px-2 py-2 text-left text-sm font-medium text-foreground hover:bg-muted dark:text-muted-foreground dark:hover:bg-card/5 transition-colors"
                        >
                          Profile
                        </Link>

                        <button
                          type="button"
                          onClick={() => signOut({ callbackUrl: "/login" })}
                          className="w-full rounded-lg px-2 py-2 text-left text-sm font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10 transition-colors"
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
            className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Gradient line */}
      <div className="absolute bottom-0 left-0 h-px w-full bg-linear-to-r from-transparent via-indigo-500/30 dark:via-cyan-400/30 to-transparent" />

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-card dark:bg-[#0F1629] px-6 py-4 space-y-4 shadow-xl">
          {/* Top Links */}
          <div className="flex flex-col space-y-2">
            <Link
              href="/"
              onClick={closeAllMobile}
              className={getLinkClass("/")}
            >
              Home
            </Link>
            <Link
              href="/pricing"
              onClick={closeAllMobile}
              className={getLinkClass("/pricing")}
            >
              Pricing
            </Link>
            <Link
              href="/blog"
              onClick={closeAllMobile}
              className={getLinkClass("/blog")}
            >
              Blog
            </Link>

            {/* Resources Toggle */}
            <button
              onClick={() => setMobileResourcesOpen((p) => !p)}
              className="w-full flex items-center justify-between px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground dark:text-gray-300 hover:bg-secondary/20"
            >
              Resources
              <ChevronDown
                size={16}
                className={`${mobileResourcesOpen ? "rotate-180" : ""} transition-transform`}
              />
            </button>

            <ResourcesMenu
              resources={resources}
              resourcesOpen={false}
              setResourcesOpen={() => {}}
              mobileResourcesOpen={mobileResourcesOpen}
              setMobileResourcesOpen={setMobileResourcesOpen}
              closeAll={closeAllMobile}
            />
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 dark:border-gray-800 pt-4 flex flex-col gap-3">
            {/* Mobile Search Button */}
            <button
              onClick={() => {
                closeAllMobile();
                openCommandPalette();
              }}
              className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-500 dark:text-gray-300 cursor-pointer"
            >
              <Search size={16} />
              Search...
            </button>

            {!isAuthenticated ? (
              <>
                <Link
                  href="/login"
                  onClick={closeAllMobile}
                  className="flex w-full items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  onClick={closeAllMobile}
                  className="flex w-full items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 to-cyan-400 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-indigo-500/40 active:scale-95"
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
                  className="flex w-full items-center justify-center rounded-lg border border-primary/30 dark:border-primary/30 bg-primary/5 dark:bg-primary/10 py-2 text-sm font-medium text-primary dark:text-primary"
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/profile"
                  onClick={closeAllMobile}
                  className="flex w-full items-center justify-center rounded-lg border border-primary/30 dark:border-primary/30 bg-primary/5 dark:bg-primary/10 py-2 text-sm font-medium text-primary dark:text-primary"
                >
                  Profile
                </Link>

                {/* Mobile User Info & Logout */}
                <div className="mt-2 rounded-xl border border bg-muted p-3 dark:border/10 dark:bg-card/50">
                  <div className="mb-3 border-b border pb-3 dark:border/10 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-sm font-bold text-primary dark:bg-primary/20 dark:text-primary">
                      {displayAvatarUrl ? (
                        <img
                          src={displayAvatarUrl}
                          alt={displayName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span>
                          {(displayName?.charAt(0) || "U").toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-medium text-foreground dark:text-muted-foreground truncate">
                        {displayName}
                      </p>
                      <p className="text-xs text-muted-foreground dark:text-muted-foreground truncate">
                        {displayEmail}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="w-full rounded-lg py-2 text-center text-sm font-medium text-rose-600 hover:bg-rose-100 dark:text-rose-400 dark:hover:bg-rose-500/10 transition-colors"
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
