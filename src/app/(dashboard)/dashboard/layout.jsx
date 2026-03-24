import CommandPalette from "@/components/dashboard/CommandPalette";

export default function DashboardRootLayout({ children }) {
  return (
    <div className="min-h-screen bg-base">
      {/* The Command Palette will silently listen for Ctrl+K in the background */}
      {/* <CommandPalette /> */}
      {children}
    </div>
  );
}
