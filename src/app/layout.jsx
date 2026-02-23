import Navbar from "@/components/layout/Navbar/Navbar";
import "./globals.css";
import ThemeProviders from "@/Context/ThemeProviders";
import Footer from "@/components/layout/Footer/Footer";

import { Poppins, Playfair_Display, Creepster } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-playfair",
});

const creepster = Creepster({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-creepster",
});

export const metadata = {
  title: "Zyplo",
  description: "Project management for web developers",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${poppins.className} ${poppins.variable} ${playfair.variable} ${creepster.variable} min-h-screen bg-white text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100`}>
        <ThemeProviders>
        {children}
        </ThemeProviders>
      </body>
    </html>
  );
}
