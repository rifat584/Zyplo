
import Navbar from "@/components/layout/Navbar/Navbar";
import "../globals.css";
import Footer from "@/components/layout/Footer/Footer";
// import ThemeProviders from "@/Context/ThemeProviders";


export default function MainLayout({ children }) {
  return (
    <>
      {/* <ThemeProviders> */}
      <Navbar />

      <div className="min-h-screen">
        {children}
      </div>
      {/* </ThemeProviders> */}

      <Footer />
    </>
  );
}
