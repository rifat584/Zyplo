import AuthBackground from "@/components/auth/AuthBackground";

function AuthShell({ children }) {
  return (
    <div className="relative min-h-screen overflow-hidden text-slate-900 dark:text-slate-100">
      <AuthBackground />
      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 items-center px-4 py-8 lg:grid-cols-12 lg:py-10 lg:pr-14">
        <section className="relative w-full max-w-md justify-self-center lg:col-start-5 lg:col-span-5 lg:max-w-lg">
          <div className="pointer-events-none absolute -inset-6 rounded-[28px] bg-[radial-gradient(120%_90%_at_50%_45%,rgba(255,255,255,0.26),transparent_68%)] opacity-45 dark:bg-[radial-gradient(120%_90%_at_50%_45%,rgba(15,23,42,0.60),transparent_70%)] dark:opacity-70" />
          <div className="pointer-events-none absolute -inset-6 rounded-[28px] auth-noise opacity-[0.02] dark:opacity-[0.04]" />
          {children}
        </section>
      </div>
    </div>
  );
}

export default AuthShell;
