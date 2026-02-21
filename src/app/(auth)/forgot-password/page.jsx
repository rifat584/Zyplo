import { AuthCard, BackToHomeLink, ForgotPasswordForm } from "@/components/auth";

function ForgotPasswordPage() {
  return (
    <AuthCard title="Forgot password" subtitle="We will email a secure reset link.">
      <BackToHomeLink />
      <ForgotPasswordForm />
    </AuthCard>
  );
}

export default ForgotPasswordPage;
