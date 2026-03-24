import { cn } from "@/lib/utils";

const MainContainer = ({ children, className }) => {
  return <div className={cn("mx-auto w-full max-w-7xl", className)}>{children}</div>;
};

export default MainContainer;
