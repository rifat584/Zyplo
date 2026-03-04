import { AuthShell } from "@/components/auth";
import NextAuthProvider from "@/Provider/NextAuthProvider";
import { Toaster } from "sonner";
function AuthLayout({ children }) {
  return (
    <NextAuthProvider>
      <AuthShell>
        {children}
        <Toaster position="top-right" richColors />
      </AuthShell>
    </NextAuthProvider>
  );
}

export default AuthLayout;
