"use client";

import { ThemeProvider } from "@/Context/ThemeContext";

export default function ThemeProviders({ children }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
