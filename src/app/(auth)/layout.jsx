import { AuthShell } from "@/components/auth";

function AuthLayout({ children }) {
  return <AuthShell>{children}</AuthShell>;
}

export default AuthLayout;
