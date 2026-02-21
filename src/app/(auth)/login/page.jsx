import { AuthCard, BackToHomeLink, LoginForm, SocialButtons } from "@/components/auth";

function LoginPage() {
  return (
    <AuthCard title="Sign in" subtitle="Continue where your team left off.">
      <BackToHomeLink />
      <SocialButtons />
      <LoginForm />
    </AuthCard>
  );
}

export default LoginPage;
