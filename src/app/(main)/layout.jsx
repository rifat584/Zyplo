
import Navbar from "@/components/layout/Navbar/Navbar";
import "../globals.css";
import Footer from "@/components/layout/Footer/Footer";

// import ThemeProviders from "@/Context/ThemeProviders";


export default function MainLayout({ children }) {
  return (
    <div className="marketing-shell flex min-h-screen flex-col bg-background text-foreground transition-colors duration-300">
      {/* <ThemeProviders> */}
      <Navbar />
      <div className="flex-1">
        {children}
      </div>
      {/* </ThemeProviders> */}
   
      <Footer />
    </div>
  );
}
