import { Card, CardContent, CardHeader } from "@/components/ui/card";

function AuthCard({ title, subtitle, children }) {
  return (
    <Card className="relative w-full overflow-hidden rounded-2xl border border-white/40 bg-white/60 shadow-[0_20px_60px_-25px_rgba(15,23,42,0.25)] backdrop-blur-xl animate-in fade-in slide-in-from-bottom-3 duration-700 dark:border-white/10 dark:bg-card/35 dark:backdrop-blur-2xl dark:shadow-[0_20px_60px_-25px_rgba(0,0,0,0.65)]">
      <div className="pointer-events-none absolute inset-0 ring-1 ring-white/25 dark:ring-white/10" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/35 to-transparent dark:from-white/10" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent dark:from-white/10" />
      <div className="pointer-events-none absolute inset-0 auth-noise opacity-[0.05] dark:opacity-[0.04]" />

      <div className="relative z-10">
        <CardHeader className="space-y-2 pb-5 pt-7">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground dark:text-muted-foreground">ZYPLO</p>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">{title}</h1>
            {subtitle ? <p className="mt-1 text-sm text-slate-700 dark:text-muted-foreground">{subtitle}</p> : null}
          </div>
        </CardHeader>
        <CardContent className="space-y-5 pb-7">{children}</CardContent>
      </div>
    </Card>
  );
}

export default AuthCard;
