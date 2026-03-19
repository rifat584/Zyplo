
import Navbar from "@/components/layout/Navbar/Navbar";
import "../globals.css";
import Footer from "@/components/layout/Footer/Footer";

// import ThemeProviders from "@/Context/ThemeProviders";


export default function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900 dark:bg-background dark:text-slate-100">
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
