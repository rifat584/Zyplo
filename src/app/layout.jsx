import Navbar from "@/components/layout/Navbar/Navbar";
import "./globals.css";
import Footer from "@/components/layout/Footer/Footer";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}

        <Footer/>
      </body>
    </html>
  );
}