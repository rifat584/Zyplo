import { Suspense } from "react";
import { AuthCard, BackToHomeLink, LoginForm, SocialButtons } from "@/components/auth";

function LoginPage() {
  return (
    <AuthCard title="Sign in" subtitle="Continue where your team left off.">
      <BackToHomeLink />
      <Suspense fallback={<div className="p-4 text-center text-sm text-slate-500">Loading...</div>}>
        <SocialButtons />
        <LoginForm />
      </Suspense>
      
    </AuthCard>
  );
}

export default LoginPage;