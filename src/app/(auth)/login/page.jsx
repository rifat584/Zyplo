import { Suspense } from "react";
import { AuthCard, BackToHomeLink, LoginForm, SocialButtons } from "@/components/auth";
import ZyploLoader from "@/components/Shared/Loader/ZyploLoader";

function LoginPage() {
  return (
    <AuthCard title="Sign in" subtitle="Continue where your team left off.">
      <BackToHomeLink />
      <Suspense fallback={<ZyploLoader className="py-8" />}>
        <SocialButtons />
        <LoginForm />
      </Suspense>
      
    </AuthCard>
  );
}

export default LoginPage;