import NextAuthProvider from "@/Provider/NextAuthProvider";
import { Toaster } from "sonner";

export default function DashboardLayout({ children }) {
  return (
    <NextAuthProvider>
      {children}
      <Toaster position="top-right" richColors />
    </NextAuthProvider>
  );
}
