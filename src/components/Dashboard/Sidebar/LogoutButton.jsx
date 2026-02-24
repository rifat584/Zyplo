"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LogoutButton({ collapsed }) {
  const router = useRouter();

  const handleLogout = () => {
    // TODO: Add actual logout logic (JWT clearing, etc.)
    console.log("Logging out...");
    router.push("/login");
  };

  return (
    <button
      onClick={handleLogout}
      title={collapsed ? "Log out" : undefined}
      className={`group flex items-center rounded-lg transition-all text-gray-600 hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-500/10 dark:hover:text-red-400
        ${collapsed ? "justify-center p-2" : "w-full gap-3 px-3 py-2 text-sm font-medium"}
      `}
    >
      <LogOut 
        size={20} 
        className="shrink-0 text-gray-400 transition-colors group-hover:text-red-500 dark:text-gray-500 dark:group-hover:text-red-400" 
      />
      
      {/* Only render text if the sidebar is fully expanded */}
      {!collapsed && <span className="truncate">Log out</span>}
    </button>
  );
}