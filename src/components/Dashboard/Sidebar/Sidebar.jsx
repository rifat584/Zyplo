"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CheckSquare, FolderKanban, Clock, Users, Settings, CreditCard, X } from "lucide-react";

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
        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
          isActive
            ? "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-cyan-400"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-200"
        }`}
      >
        <item.icon size={18} className={isActive ? "text-blue-600 dark:text-cyan-400" : "text-gray-400 dark:text-gray-500"} />
        {item.name}
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
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-gray-200/80 bg-white/50 backdrop-blur-xl transition-transform duration-300 lg:static lg:translate-x-0 dark:border-white/10 dark:bg-[#0B0F19]/50 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        
        <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200/80 dark:border-white/10">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 text-white font-bold text-lg shadow-md">
              Z
            </div>
            <span className="text-xl font-heading font-bold text-gray-900 dark:text-white">Zyplo</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-500">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-6 p-4">
          <div className="flex flex-col gap-1">
            <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Your Work</p>
            {topLinks.map((item) => <NavLink key={item.name} item={item} />)}
          </div>

          {/* Render Admin links ONLY if role is admin */}
          {role === "admin" && (
            <div className="flex flex-col gap-1">
              <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Workspace</p>
              {adminLinks.map((item) => <NavLink key={item.name} item={item} />)}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}