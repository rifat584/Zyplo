"use client";

import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function GlobalLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. Automatically stop loading when the route finishes changing
  useEffect(() => {
    setIsLoading(false);
  }, [pathname, searchParams]);

  // 2. Intercept ALL window.fetch calls globally
  useEffect(() => {
    const originalFetch = window.fetch;
    let activeRequests = 0;

    window.fetch = async function (...args) {
      const [resource, config] = args;
      const url = typeof resource === "string" ? resource : resource?.url;

      // OPTIONAL: Prevent the loader from flashing for background polling.
      // (e.g., your GlobalTimerControl checking for active timers every 30s)
      const isSilent = 
        config?.headers?.["x-silent-fetch"] === "true" || 
        url?.includes("/time/active");

      if (!isSilent) {
        activeRequests += 1;
        setIsLoading(true);
      }

      try {
        const response = await originalFetch.apply(this, args);
        return response;
      } finally {
        if (!isSilent) {
          activeRequests = Math.max(0, activeRequests - 1);
          // Only stop loading if all requests have finished
          if (activeRequests === 0) {
            // Slight delay so the user actually sees the bar finish
            setTimeout(() => {
              if (activeRequests === 0) setIsLoading(false);
            }, 300);
          }
        }
      }
    };

    // Cleanup interceptor on unmount
    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  if (!isLoading) return null;

  return (
    <>
      {/* Inline CSS for the smooth indeterminate animation */}
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
      `}</style>

      {/* The Sleek Top Progress Bar */}
      <div className="fixed inset-x-0 top-0 z-[99999] h-1 w-full overflow-hidden bg-transparent">
        <div className="h-full w-full bg-linear-to-r from-blue-500 via-cyan-400 to-indigo-500 animate-loading-slide" />
        
        {/* Optional: Add a small glowing drop-shadow right under the bar */}
        <div className="absolute top-0 left-0 h-2 w-full animate-loading-slide bg-cyan-400/30 blur-md" />
      </div>
    </>
  );
}