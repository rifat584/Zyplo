import { AuthCard, BackToHomeLink, ResetPasswordForm } from "@/components/auth";

function ResetPasswordPage() {
  // In a real backend flow, read `searchParams.token` here and verify it server-side.
  return (
    <AuthCard title="Reset password" subtitle="Choose a new secure password for your account.">
      <BackToHomeLink />
      <ResetPasswordForm />
    </AuthCard>
  );
}

export default ResetPasswordPage;
