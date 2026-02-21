"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X, ChevronDown } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef(null);

  const getLinkClass = (path) => {
    const baseStyles = "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200";
    if (pathname === path) {
      return `${baseStyles} bg-primary/10 text-black font-semibold shadow-sm ring-1 ring-primary/20`;
    }
    return `${baseStyles} text-muted-foreground hover:bg-secondary/20 hover:text-primary transition-colors`;
  };

  // Close mega menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setResourcesOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const resources = [
    {
      title: "Zyplo Guide",
      desc: "Learn how to use Zyplo step by step",
      href: "/resources/guide",
    },
    {
      title: "Remote Work",
      desc: "Best practices for remote teams",
      href: "/resources/remote-work",
    },
    {
      title: "Webinars",
      desc: "Productivity and workflow sessions",
      href: "/resources/webinars",
    },
    {
      title: "Customer Stories",
      desc: "How teams use Zyplo",
      href: "/resources/customer-stories",
    },
    {
      title: "Developers",
      desc: "Build and extend Zyplo",
      href: "/resources/developers",
    },
    {
      title: "Help Center",
      desc: "FAQs and support resources",
      href: "/resources/help",
    },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="group flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-white font-bold text-lg transition-transform duration-500 hover:rotate-[10deg] hover:scale-110 shadow-lg shadow-indigo-500/30">
            Z
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">Zyplo</span>
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
          {resourcesOpen && (
            <div className="absolute top-14 -right-90 w-[720px] rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl p-6 grid grid-cols-3 gap-6">
              <div className="col-span-2 grid grid-cols-2 gap-4">
                {resources.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    onClick={() => setResourcesOpen(false)}
                    className="block rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    <p className="font-semibold mb-1">{item.title}</p>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </Link>
                ))}
              </div>

              <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-4 flex flex-col justify-between">
                <div>
                  <p className="font-semibold mb-2">Helping teams work better</p>
                  <p className="text-sm text-gray-500">
                    Guides, tips, and best practices for using Zyplo effectively.
                  </p>
                </div>
                <Link
                  href="/blog"
                  onClick={() => setResourcesOpen(false)}
                  className="mt-4 inline-flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm font-medium"
                >
                  Visit Zyplo Blog
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <button className="hidden sm:flex items-center gap-2 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 text-sm text-gray-500 dark:text-gray-300 transition hover:bg-gray-100 dark:hover:bg-gray-700">
            <Search size={16} />
            <span className="text-xs">Ctrl+K</span>
          </button>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-secondary">
              Sign in
            </Link>
            <Link href="/register" className="flex items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 to-cyan-400 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-indigo-500/40 active:scale-95">
              Get started
            </Link>
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
      <div className="absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-indigo-500/30 dark:via-cyan-400/30 to-transparent" />

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 py-4 space-y-4 shadow-xl">
          {/* Top Links */}
          <div className="flex flex-col space-y-2">
            <Link href="/" onClick={() => setIsOpen(false)} className={getLinkClass("/")}>Home</Link>
            <Link href="/pricing" onClick={() => setIsOpen(false)} className={getLinkClass("/pricing")}>Pricing</Link>

            {/* Resources Toggle */}
            <button
              onClick={() => setMobileResourcesOpen((p) => !p)}
              className="w-full flex items-center justify-between px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary/20"
            >
              Resources
              <ChevronDown size={16} className={`${mobileResourcesOpen ? "rotate-180" : ""} transition-transform`} />
            </button>

            {mobileResourcesOpen && (
              <div className="pl-4 space-y-2">
                {resources.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    onClick={() => {
                      setIsOpen(false);
                      setMobileResourcesOpen(false);
                    }}
                    className="block py-1 text-sm text-gray-600 dark:text-gray-300"
                  >
                    {item.title}
                  </Link>
                ))}
                <Link
                  href="/blog"
                  onClick={() => {
                    setIsOpen(false);
                    setMobileResourcesOpen(false);
                  }}
                  className="block py-1 text-sm font-medium"
                >
                  Zyplo Blog
                </Link>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 dark:border-gray-800 pt-4 flex flex-col gap-3">
            {/* Search */}
            <button className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-500 dark:text-gray-300">
              <Search size={16} />
              Search...
            </button>

            {/* Sign in */}
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Sign in
            </Link>

            {/* Get started */}
            <Link
              href="/register"
              onClick={() => setIsOpen(false)}
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
