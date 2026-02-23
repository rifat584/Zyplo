import { cn } from "@/lib/utils";

const MainContainer = ({ children, className }) => {
  return <div className={cn("mx-auto w-7xl max-w-full dark:bg-[#0B0F19]", className)}>{children}</div>;
};

export default MainContainer;
