import Aurora from "@/components/Aurora";

function AuthBackground() {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-slate-100 dark:bg-[#070b16]" />

      <div className="absolute inset-0 opacity-65 dark:opacity-80">
        <Aurora colorStops={["#6366f1", "#22d3ee", "#4f46e5"]} amplitude={1.0} blend={0.45} speed={0.55} />
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(99,102,241,0.16),transparent_36%),radial-gradient(circle_at_78%_20%,rgba(34,211,238,0.14),transparent_36%),radial-gradient(circle_at_50%_85%,rgba(99,102,241,0.08),transparent_40%)] dark:bg-[radial-gradient(circle_at_12%_18%,rgba(99,102,241,0.24),transparent_38%),radial-gradient(circle_at_78%_20%,rgba(34,211,238,0.20),transparent_38%),radial-gradient(circle_at_50%_85%,rgba(99,102,241,0.10),transparent_44%)]" />

      <div className="absolute inset-0 bg-[radial-gradient(140%_90%_at_50%_50%,transparent_55%,rgba(248,250,252,0.60)_100%)] dark:bg-[radial-gradient(140%_90%_at_50%_50%,transparent_52%,rgba(2,6,23,0.72)_100%)]" />
    </div>
  );
}

export default AuthBackground;
