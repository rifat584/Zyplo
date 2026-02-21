import { AuthCard, BackToHomeLink, RegisterForm, SocialButtons } from "@/components/auth";

function RegisterPage() {
  return (
    <AuthCard title="Create your account" subtitle="Start organizing work with Zyplo.">
      <BackToHomeLink />
      <SocialButtons />
      <RegisterForm />
    </AuthCard>
  );
}

export default RegisterPage;
