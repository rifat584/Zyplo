import "./globals.css";
import ThemeProviders from "@/Context/ThemeProviders";
import { Manrope, Poppins, Playfair_Display, Creepster } from "next/font/google";
import NextAuthProvider from "@/Provider/NextAuthProvider";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
});

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
      <body
        className={`${manrope.variable} ${poppins.variable} ${playfair.variable} ${creepster.variable} min-h-screen bg-background font-sans text-foreground antialiased`}
      >
        <NextAuthProvider>
          <ThemeProviders>
            {children}
          </ThemeProviders>
        </NextAuthProvider>
      </body>
    </html>
  );
}
