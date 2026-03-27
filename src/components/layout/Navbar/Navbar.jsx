"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Sun, Moon } from "lucide-react";
import ResourcesMenu from "./ResourcesMenu/ResourcesMenu";
import { useTheme } from "@/Context/ThemeContext";
import Logo from "@/components/Shared/Logo/Logo";
import { useSession, signOut } from "next-auth/react";
import { resources } from "@/lib/resources/resources";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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

  const isPathActive = (path) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const getDesktopLinkClass = (path) =>
    cn(
      "inline-flex h-10 items-center border-b-2 px-4 text-sm font-medium transition-colors",
      isPathActive(path)
        ? "border-secondary text-secondary"
        : "border-transparent text-muted-foreground hover:text-secondary",
    );

  const getMobileLinkClass = (path) =>
    cn(
      "flex w-full items-center rounded-md border-l-2 border-transparent px-3 py-2.5 text-sm font-medium transition-colors",
      isPathActive(path)
        ? "border-l-secondary text-secondary"
        : "text-foreground hover:text-secondary",
    );

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
    const frameId = requestAnimationFrame(() => {
      setMounted(true);
    });

    return () => cancelAnimationFrame(frameId);
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

  const toggleMobileMenu = () => {
    if (isOpen) {
      setMobileResourcesOpen(false);
    }
    setIsOpen((prev) => !prev);
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const displayName = profile?.name || session.data?.user?.name || "User";
  const displayEmail = profile?.email || session.data?.user?.email || "";
  const displayAvatarUrl =
    profile?.avatarUrl || session.data?.user?.image || "";

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/78 backdrop-blur-xl transition-colors duration-300 supports-[backdrop-filter]:bg-background/72">
      <div className="mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Logo
            textSize="2xl md:3xl"
            size={45}
            imageClassName="max-md:h-9 max-md:w-9"
          />
        </Link>

        {/* Desktop Links */}
        <div
          className="relative hidden items-center gap-1.5 md:flex"
          ref={dropdownRef}
        >
          <Link
            href="/"
            onClick={() => setResourcesOpen(false)}
            className={getDesktopLinkClass("/")}
          >
            Home
          </Link>
          <Link
            href="/pricing"
            onClick={() => setResourcesOpen(false)}
            className={getDesktopLinkClass("/pricing")}
          >
            Pricing
          </Link>
          <Link
            href="/blog"
            onClick={() => setResourcesOpen(false)}
            className={getDesktopLinkClass("/blog")}
          >
            Blog
          </Link>

          {/* Resources Button (Click only) */}
          <button
            onClick={() => setResourcesOpen((p) => !p)}
            className={cn(
              getDesktopLinkClass("/resources"),
              "flex cursor-pointer items-center gap-1 outline-none",
              resourcesOpen ? "border-secondary text-secondary" : null,
            )}
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
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* --- Theme Toggle --- */}
          {mounted && (
            <button
              onClick={toggleTheme}
              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border/75 bg-card/80 text-muted-foreground shadow-sm transition-colors duration-300 hover:border-primary/20 hover:bg-card hover:text-foreground cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon size={16} className="text-current" />
              ) : (
                <Sun size={16} className="text-current" />
              )}
            </button>
          )}

          <div className="hidden md:flex items-center gap-4">
            {!isAuthenticated ? (
              <>
                <Button
                  as={Link}
                  href="/login"
                  variant="marketing-outline"
                  size="sm"
                  className="min-w-[6.75rem] hover:translate-y-0"
                >
                  Sign in
                </Button>
                <Button
                  as={Link}
                  href="/register"
                  variant="marketing"
                  size="sm"
                  className="min-w-[8rem]"
                >
                  Get started
                </Button>
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
                    <div className="absolute right-0 top-12 z-30 w-56 rounded-xl border border-border bg-popover p-2 text-popover-foreground shadow-lg">
                      <div className="mb-2 border-b border-border pb-2 px-2">
                        <p className="text-sm font-medium text-foreground truncate">
                          {displayName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {displayEmail}
                        </p>
                      </div>

                      <div className="flex flex-col gap-1">
                        <Link
                          href="/dashboard"
                          onClick={() => setProfileOpen(false)}
                          className="flex w-full items-center rounded-md border-l-2 border-transparent px-2 py-2 text-left text-sm font-medium text-foreground transition-colors hover:border-l-secondary/45 hover:text-secondary"
                        >
                          Dashboard
                        </Link>
                        <Link
                          href="/dashboard/profile"
                          onClick={() => setProfileOpen(false)}
                          className="flex w-full items-center rounded-md border-l-2 border-transparent px-2 py-2 text-left text-sm font-medium text-foreground transition-colors hover:border-l-secondary/45 hover:text-secondary"
                        >
                          Profile
                        </Link>

                        <button
                          type="button"
                          onClick={() => signOut({ callbackUrl: "/login" })}
                          className="w-full rounded-lg border border-destructive/20 bg-destructive/6 px-2 py-2 text-left text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
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
            onClick={toggleMobileMenu}
            className="rounded-full border border-border/75 bg-card/75 p-2 text-muted-foreground shadow-sm transition-colors hover:border-secondary/20 hover:bg-card hover:text-foreground md:hidden"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 h-px w-full bg-border" />

      {/* Mobile Menu */}
      {isOpen && (
        <div className="max-h-[calc(100vh-4rem)] overflow-y-auto overscroll-contain border-t border-border/70 bg-background/96 px-6 py-4 shadow-xl backdrop-blur-xl md:hidden">
            {/* Top Links */}
            <div className="flex flex-col space-y-2">
              <Link
                href="/"
                onClick={closeAllMobile}
                className={getMobileLinkClass("/")}
              >
                Home
              </Link>
              <Link
                href="/pricing"
                onClick={closeAllMobile}
                className={getMobileLinkClass("/pricing")}
              >
                Pricing
              </Link>
              <Link
                href="/blog"
                onClick={closeAllMobile}
                className={getMobileLinkClass("/blog")}
              >
                Blog
              </Link>

              {/* Resources Toggle */}
              <button
                onClick={() => setMobileResourcesOpen((p) => !p)}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors",
                  mobileResourcesOpen || isPathActive("/resources")
                    ? "border-secondary/20 bg-secondary/10 text-secondary"
                    : "border-transparent text-foreground hover:border-border hover:bg-card/85 hover:text-secondary",
                )}
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
            <div className="flex flex-col gap-3 border-t border-border pt-4">
              {!isAuthenticated ? (
                <>
                  <Button
                    as={Link}
                    href="/login"
                    onClick={closeAllMobile}
                    variant="marketing-outline"
                    size="sm"
                    className="w-full hover:translate-y-0"
                  >
                    Sign in
                  </Button>
                  <Button
                    as={Link}
                    href="/register"
                    onClick={closeAllMobile}
                    variant="marketing"
                    size="sm"
                    className="w-full"
                  >
                    Get started
                  </Button>
                </>
              ) : (
                <>
                  {/* Dashboard (Mobile) */}
                  <Link
                    href="/dashboard"
                    onClick={closeAllMobile}
                    className="flex w-full items-center rounded-md border-l-2 border-transparent px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-l-secondary/45 hover:text-secondary"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    onClick={closeAllMobile}
                    className="flex w-full items-center rounded-md border-l-2 border-transparent px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-l-secondary/45 hover:text-secondary"
                  >
                    Profile
                  </Link>

                  {/* Mobile User Info & Logout */}
                  <div className="mt-2 px-3 py-2">
                    <div className="flex items-center gap-3">
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
                        <p className="truncate text-sm font-medium text-foreground">
                          {displayName}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {displayEmail}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => signOut({ callbackUrl: "/login" })}
                      className="mt-3 w-full rounded-lg border border-destructive/20 bg-destructive/6 py-2 text-center text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
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
