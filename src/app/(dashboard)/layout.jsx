import NextAuthProvider from "@/Provider/NextAuthProvider";

export default function DashboardLayout({ children }) {
  return <NextAuthProvider>{children}</NextAuthProvider>;
}
