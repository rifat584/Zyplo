"use client";

import { useEffect, useState } from "react";

const KEY = "dashBoardTest.sidebarCollapsed";

function readInitialCollapsed() {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export default function useSidebarState() {
  const [collapsed, setCollapsed] = useState(readInitialCollapsed);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, collapsed ? "1" : "0");
    } catch {
      // no-op
    }
  }, [collapsed]);

  return {
    collapsed,
    setCollapsed,
    toggleCollapsed: () => setCollapsed((v) => !v),
  };
}
