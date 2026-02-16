import Navbar from "@/components/Navbar/Navbar"; 
import "./globals.css";
import WorkflowStepper from "@/components/WorkFlow/WorkflowStepper";
import TimeTracking from "@/components/TimeTracking/TimeTracking";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <WorkflowStepper/>
        <TimeTracking/>
        {children}
      </body>
    </html>
  );
}