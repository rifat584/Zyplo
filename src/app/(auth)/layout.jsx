import { AuthShell } from "@/components/auth";
import { Toaster } from "sonner";
function AuthLayout({ children }) {
  return (
    <AuthShell>
      {children}
      <Toaster position="top-right" richColors />
    </AuthShell>
  );
}

export default AuthLayout;
