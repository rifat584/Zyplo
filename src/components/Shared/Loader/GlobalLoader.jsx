"use client";

import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Loader2, CloudUpload, Trash2, RefreshCw } from "lucide-react";

export default function GlobalLoader() {
  const [loadingState, setLoadingState] = useState(null); // null | 'syncing' | 'saving' | 'deleting'
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. Clear loader on page navigation complete
  useEffect(() => {
    setLoadingState(null);
  }, [pathname, searchParams]);

  // 2. The Smart Fetch Interceptor
  useEffect(() => {
    const originalFetch = window.fetch;
    let activeRequests = 0;
    let fallbackTimer = null;

    window.fetch = async function (...args) {
      const [resource, config] = args;
      const url = typeof resource === "string" ? resource : resource?.url;
      const method = (config?.method || "GET").toUpperCase();

      // Silent fetches (like background timers) should not trigger the UI
      const isSilent = 
        config?.headers?.["x-silent-fetch"] === "true" || 
        url?.includes("/time/active");

      if (!isSilent) {
        activeRequests += 1;
        
        // Determine what kind of action is happening based on the HTTP Method
        if (method === "DELETE") {
          setLoadingState("deleting");
        } else if (method === "POST" || method === "PATCH" || method === "PUT") {
          setLoadingState("saving");
        } else {
          // If it's just a GET request, but not the first one, call it syncing
          setLoadingState(prev => prev || "syncing");
        }
      }

      try {
        const response = await originalFetch.apply(this, args);
        return response;
      } finally {
        if (!isSilent) {
          activeRequests = Math.max(0, activeRequests - 1);
          
          if (activeRequests === 0) {
            // Add a tiny delay before hiding so the user actually sees the success
            clearTimeout(fallbackTimer);
            fallbackTimer = setTimeout(() => {
              if (activeRequests === 0) setLoadingState(null);
            }, 400); // 400ms delay to let the animation finish smoothly
          }
        }
      }
    };

    return () => {
      window.fetch = originalFetch;
      clearTimeout(fallbackTimer);
    };
  }, []);

  if (!loadingState) return null;

  // --- Dynamic UI Configuration based on State ---
  const config = {
    syncing: {
      text: "Syncing data...",
      icon: <RefreshCw className="size-3.5 animate-spin text-indigo-500 dark:text-indigo-400" />,
      bg: "bg-white/90 dark:bg-slate-900/90",
      border: "border-indigo-200 dark:border-indigo-500/30",
    },
    saving: {
      text: "Saving changes...",
      icon: <CloudUpload className="size-3.5 animate-bounce text-emerald-500 dark:text-emerald-400" />,
      bg: "bg-emerald-50/90 dark:bg-emerald-950/40",
      border: "border-emerald-200 dark:border-emerald-500/30",
    },
    deleting: {
      text: "Deleting...",
      icon: <Trash2 className="size-3.5 animate-pulse text-rose-500 dark:text-rose-400" />,
      bg: "bg-rose-50/90 dark:bg-rose-950/40",
      border: "border-rose-200 dark:border-rose-500/30",
    }
  };

  const currentConfig = config[loadingState] || config.syncing;

  return (
    <>
      {/* 1. The Classic Top Progress Bar (Like YouTube/Vercel) */}
      <style>{`
        @keyframes loading-slide {
          0% { transform: translateX(-100%) scaleX(0.2); }
          50% { transform: translateX(0%) scaleX(0.5); }
          100% { transform: translateX(100%) scaleX(0.2); }
        }
        .animate-loading-slide {
          animation: loading-slide 1.2s infinite linear;
          transform-origin: left;
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translate(-50%, 10px) scale(0.95); }
          100% { opacity: 1; transform: translate(-50%, 0) scale(1); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <div className="fixed inset-x-0 top-0 z-[99999] h-1 w-full overflow-hidden bg-transparent">
        <div className={`h-full w-full animate-loading-slide ${
          loadingState === 'deleting' ? 'bg-gradient-to-r from-rose-500 via-red-400 to-rose-500' :
          loadingState === 'saving' ? 'bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-500' :
          'bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500'
        }`} />
      </div>

      {/* 2. The Contextual Floating Pill (Like Linear/Superhuman) */}
      <div className={`fixed bottom-8 left-1/2 z-[99999] flex -translate-x-1/2 items-center gap-2.5 rounded-full border px-4 py-2 shadow-xl backdrop-blur-md transition-all duration-300 animate-fade-in-up ${currentConfig.bg} ${currentConfig.border}`}>
        {currentConfig.icon}
        <span className="text-xs font-semibold tracking-wide text-slate-700 dark:text-slate-200">
          {currentConfig.text}
        </span>
      </div>
    </>
  );
}