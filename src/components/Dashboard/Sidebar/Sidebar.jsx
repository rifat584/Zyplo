"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  CheckSquare, 
  FolderKanban, 
  Clock, 
  Users, 
  Settings, 
  CreditCard, 
  X, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";
import LogoutButton from "./LogoutButton";

export default function Sidebar({ role, sidebarOpen, setSidebarOpen }) {
  const pathname = usePathname();

  // Role-based Navigation logic
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

  const NavLink = ({ item }) => {
    const isActive = pathname === item.href;
    return (
      <Link
        href={item.href}
        // Tooltip added for when sidebar is collapsed
        title={!sidebarOpen ? item.name : undefined}
        className={`group flex items-center rounded-lg py-2 transition-all duration-200 ${
          sidebarOpen ? "px-3 gap-3" : "justify-center px-0"
        } ${
          isActive
            ? "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-cyan-400"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-200"
        }`}
      >
        <item.icon size={20} className={`shrink-0 ${isActive ? "text-blue-600 dark:text-cyan-400" : "text-gray-400 dark:text-gray-500"}`} />
        
        {/* Only show text if the sidebar is expanded */}
        {sidebarOpen && (
          <span className="truncate text-sm font-medium">{item.name}</span>
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
      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-gray-200/80 bg-white/50 backdrop-blur-xl transition-all duration-300 ease-in-out dark:border-white/10 dark:bg-[#0B0F19]/50 
          ${sidebarOpen 
            ? "w-64 translate-x-0" 
            : "-translate-x-full w-64 lg:translate-x-0 lg:w-20" // Mobile hides, Desktop shrinks to w-20
          }
        `}
      >
        
        {/* Logo Header */}
        <div className={`flex h-16 shrink-0 items-center border-b border-gray-200/80 dark:border-white/10 overflow-hidden ${sidebarOpen ? "justify-between px-6" : "justify-center px-0"}`}>
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 text-white font-bold text-lg shadow-md">
              Z
            </div>
            {sidebarOpen && (
              <span className="text-xl font-heading font-bold text-gray-900 dark:text-white transition-opacity">Zyplo</span>
            )}
          </Link>
          
          {/* Close button for Mobile only */}
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-500 hover:text-gray-800 dark:hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Links Area */}
        <div className="flex flex-1 flex-col gap-6 overflow-y-auto overflow-x-hidden p-4">
          
          {/* User Links */}
          <div className="flex flex-col gap-1">
            {sidebarOpen ? (
              <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 whitespace-nowrap">Your Work</p>
            ) : (
              <div className="mb-3 mx-auto h-px w-6 bg-gray-200 dark:bg-white/10" />
            )}
            {topLinks.map((item) => <NavLink key={item.name} item={item} />)}
          </div>

          {/* Admin Links */}
          {role === "admin" && (
            <div className="flex flex-col gap-1 mt-4">
              {sidebarOpen ? (
                <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 whitespace-nowrap">Workspace</p>
              ) : (
                <div className="mb-3 mx-auto h-px w-6 bg-gray-200 dark:bg-white/10" />
              )}
              {adminLinks.map((item) => <NavLink key={item.name} item={item} />)}
            </div>
          )}
        </div>

        {/* --- Desktop Collapse Toggle --- */}
        <div className="hidden lg:flex justify-center p-3 border-t border-gray-200/80 dark:border-white/10">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex w-full items-center justify-center rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/5 dark:hover:text-gray-300 transition-colors"
          >
            {sidebarOpen ? (
              <div className="flex items-center gap-2 w-full px-2 text-sm font-medium">
                <ChevronLeft size={16} /> <span className="mr-auto">Collapse</span>
              </div>
            ) : (
              <ChevronRight size={18} />
            )}
          </button>
        </div>

        {/* --- Logout Button Area --- */}
        <div className={`mt-auto border-t border-gray-200/80 dark:border-white/10 ${sidebarOpen ? "p-4" : "p-3 flex justify-center"}`}>
          {/* We pass the collapse state to hide the text inside the button */}
          <LogoutButton collapsed={!sidebarOpen} />
        </div>
        
      </aside>
    </>
  );
}