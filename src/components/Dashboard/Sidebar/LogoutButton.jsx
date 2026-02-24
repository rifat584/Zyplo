"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LogoutButton({ collapsed, closeMobileSidebar }) {
  const router = useRouter();

  const handleLogout = () => {
    // Auto-close sidebar on mobile before redirecting
    if (closeMobileSidebar) closeMobileSidebar();
    
    // TODO: Add actual logout logic (JWT clearing, etc.)
    console.log("Logging out...");
    router.push("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="group relative flex items-center gap-3 w-full rounded-xl px-3 py-2.5 transition-all duration-300 text-gray-600 hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-500/10 dark:hover:text-red-400"
    >
      {/* Fixed width icon wrapper */}
      <div className="flex h-6 w-6 shrink-0 items-center justify-center">
        <LogOut 
          size={20} 
          className="transition-colors group-hover:text-red-500 dark:group-hover:text-red-400" 
        />
      </div>
      
      {/* Smooth Text Reveal */}
      <span 
        className={`whitespace-nowrap text-sm font-medium text-left transition-all duration-300 ease-in-out ${
          !collapsed ? "opacity-100 translate-x-0" : "w-0 overflow-hidden opacity-0 -translate-x-4 pointer-events-none"
        }`}
      >
        Log out
      </span>

      {/* Floating Tooltip (Only visible when sidebar is collapsed on Desktop) */}
      {collapsed && (
        <div className="absolute left-full ml-4 rounded-md bg-gray-900 px-3 py-1.5 text-xs font-medium text-white shadow-xl opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all dark:bg-white dark:text-gray-900 z-50 whitespace-nowrap pointer-events-none">
          Log out
        </div>
      )}
    </button>
  );
}