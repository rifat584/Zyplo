"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  CheckSquare,
  FolderKanban,
  Clock,
  Users,
  Settings,
  CreditCard,
  X,
  ChevronLeft
} from "lucide-react";
import LogoutButton from "./LogoutButton";
import Logo from "@/components/Shared/Logo/Logo";

export default function Sidebar({ role, sidebarOpen, setSidebarOpen }) {
  const pathname = usePathname();

  const topLinks = [
    { name: "Overview", icon: LayoutDashboard, href: "/dashboard" },
    { name: "My Issues", icon: CheckSquare, href: "/dashboard/issues" },
    { name: "Projects", icon: FolderKanban, href: "/dashboard/projects" },
    { name: "Time Logs", icon: Clock, href: "/dashboard/time" },
  ];

  const adminLinks = [
    { name: "Manage Team", icon: Users, href: "/dashboard/team" },
    { name: "Billing", icon: CreditCard, href: "/dashboard/billing" },
    { name: "Settings", icon: Settings, href: "/dashboard/settings" },
  ];

  // Auto-close sidebar on mobile after clicking a link
  const handleMobileClose = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const NavLink = ({ item }) => {
    const isActive = pathname === item.href;

    return (
      <Link
        href={item.href}
        onClick={handleMobileClose}
        className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-300 ${isActive
            ? "bg-blue-50/80 text-blue-700 dark:bg-blue-500/10 dark:text-cyan-400"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-200"
          }`}
      >
        {/* Premium Active Left Border Indicator */}
        {isActive && (
          <motion.div
            layoutId="active-nav-indicator"
            className="absolute left-0 top-1/2 h-[60%] w-1 -translate-y-1/2 rounded-r-full bg-blue-600 dark:bg-cyan-400"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}

        {/* Fixed Width Icon Wrapper (Prevents snapping) */}
        <div className="flex h-6 w-6 shrink-0 items-center justify-center">
          <item.icon
            size={20}
            className={`transition-colors duration-200 ${isActive ? "text-blue-600 dark:text-cyan-400" : "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300"}`}
          />
        </div>

        {/* Smooth Text Reveal */}
        <span
          className={`whitespace-nowrap text-sm font-medium transition-all duration-300 ease-in-out ${sidebarOpen ? "opacity-100 translate-x-0" : "w-0 overflow-hidden opacity-0 -translate-x-4 pointer-events-none"
            }`}
        >
          {item.name}
        </span>

        {/* Floating Tooltip (Only visible when sidebar is collapsed on Desktop) */}
        {!sidebarOpen && (
          <div className="absolute left-full ml-4 rounded-md bg-gray-900 px-3 py-1.5 text-xs font-medium text-white shadow-xl opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all dark:bg-white dark:text-gray-900 z-50 whitespace-nowrap pointer-events-none">
            {item.name}
          </div>
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      {/* FIX: Replaced strict overflow-hidden with lg:overflow-visible so tooltips can escape the container on desktop! */}
      <aside
        className={`fixed lg:relative inset-y-0 left-0 z-50 flex flex-col shrink-0 border-r border-gray-200/80 bg-white/50 backdrop-blur-xl transition-[width] duration-300 ease-in-out overflow-hidden lg:overflow-visible dark:border-white/10 dark:bg-[#0B0F19]/50 
          ${sidebarOpen ? "w-64" : "w-0 lg:w-20"}
        `}
      >

        {/* Logo Header */}
        <div className="flex h-16 shrink-0 items-center px-4 border-b border-gray-200/80 dark:border-white/10">
          <Link href={"/"}>
          <Logo
            size={60}
            showText={sidebarOpen}
            className={`transition-all duration-300 ${sidebarOpen ? "-ml-2" : "ml-0"}`}
            onClick={handleMobileClose}
          />
          </Link>

          <button onClick={() => setSidebarOpen(false)} className={`lg:hidden ml-auto text-gray-500 transition-opacity ${sidebarOpen ? "opacity-100" : "opacity-0"}`}>
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Links Area */}
        <div className="flex flex-1 flex-col gap-6 py-6 px-4">

          {/* Your Work Section */}
          <div className="flex flex-col gap-1">
            <div className="h-6 flex items-center px-3 mb-1">
              <p className={`text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 whitespace-nowrap transition-all duration-300 ${sidebarOpen ? "opacity-100" : "opacity-0"}`}>
                Your Work
              </p>
              {/* Divider line replaces text when collapsed */}
              {!sidebarOpen && <div className="absolute left-6 w-6 h-px bg-gray-200 dark:bg-white/10 hidden lg:block" />}
            </div>
            {topLinks.map((item) => <NavLink key={item.name} item={item} />)}
          </div>

          {/* Workspace Section */}
          {role === "admin" && (
            <div className="flex flex-col gap-1">
              <div className="h-6 flex items-center px-3 mb-1 relative">
                <p className={`text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 whitespace-nowrap transition-all duration-300 ${sidebarOpen ? "opacity-100" : "opacity-0"}`}>
                  Workspace
                </p>
                {!sidebarOpen && <div className="absolute left-6 w-6 h-px bg-gray-200 dark:bg-white/10 hidden lg:block" />}
              </div>
              {adminLinks.map((item) => <NavLink key={item.name} item={item} />)}
            </div>
          )}
        </div>

        {/* --- Collapse Toggle --- */}
        <div className="hidden lg:flex justify-center p-3 border-t border-gray-200/80 dark:border-white/10">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="group flex w-full items-center justify-center rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/5 dark:hover:text-gray-300 transition-colors cursor-pointer"
          >
            <div className={`flex w-6 justify-center shrink-0 transition-transform duration-300 ${!sidebarOpen ? "rotate-180" : ""}`}>
              <ChevronLeft size={18} />
            </div>
            <div className={`overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out ${sidebarOpen ? "w-16 opacity-100 ml-2" : "w-0 opacity-0 ml-0"}`}>
              <span className="text-sm font-medium text-left block">Collapse</span>
            </div>
          </button>
        </div>

        {/* Logout Button Area */}
        <div className="mt-auto shrink-0 flex flex-col gap-2 p-4 border-t border-gray-200/80 dark:border-white/10">
          <LogoutButton collapsed={!sidebarOpen} closeMobileSidebar={handleMobileClose} />
        </div>

      </aside>
    </>
  );
}