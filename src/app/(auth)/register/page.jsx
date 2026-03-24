import { Suspense } from "react";
import { AuthCard, BackToHomeLink, RegisterForm, SocialButtons } from "@/components/auth";
import ZyploLoader from "@/components/Shared/Loader/ZyploLoader";

function RegisterPage() {
  return (
    <AuthCard title="Create your account" subtitle="Start organizing work with Zyplo.">
      <BackToHomeLink />
      
      <Suspense fallback={<ZyploLoader className="py-8" />}>
        <SocialButtons />
        <RegisterForm />
      </Suspense>
      
    </AuthCard>
  );
}

export default RegisterPage;