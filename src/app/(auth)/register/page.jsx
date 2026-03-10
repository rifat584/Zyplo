import { Suspense } from "react";
import { AuthCard, BackToHomeLink, RegisterForm, SocialButtons } from "@/components/auth";

function RegisterPage() {
  return (
    <AuthCard title="Create your account" subtitle="Start organizing work with Zyplo.">
      <BackToHomeLink />
      
      <Suspense fallback={<div className="p-4 text-center text-sm text-slate-500">Loading...</div>}>
        <SocialButtons />
        <RegisterForm />
      </Suspense>
      
    </AuthCard>
  );
}

export default RegisterPage;