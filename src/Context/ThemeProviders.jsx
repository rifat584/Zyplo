"use client";

import { ThemeProvider } from "@/context/ThemeContext";

export default function ThemeProviders({ children }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
