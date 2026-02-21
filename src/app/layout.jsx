import Navbar from "@/components/layout/Navbar/Navbar";
import "./globals.css";
// import ThemeProviders from "@/Context/ThemeProviders";
import Footer from "@/components/layout/Footer/Footer";

import { Poppins, Playfair_Display } from "next/font/google";

// Poppins (Sans - Body)
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

// Playfair Display (Serif - Headings)
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-playfair",
});

export const metadata = {
  title: "Zyplo",
  description: "Project management for web developers",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${playfair.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
