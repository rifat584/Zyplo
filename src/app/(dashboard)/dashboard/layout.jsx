import CommandPalette from "@/components/dashboard/CommandPalette";

export default function DashboardRootLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* The Command Palette will silently listen for Ctrl+K in the background */}
      {/* <CommandPalette /> */}
      {children}
    </div>
  );
}