import { cn } from "callum-util";
import type { ReactNode } from "react";
import { useIsRightSidebarOpen } from "~/store/selection";

export function RightSidebarLayout({ children }: { children: ReactNode }) {
  const isRightSidebarOpen = useIsRightSidebarOpen();
  return (
    <div className={cn("flex-1 ml-64 overflow-y-auto", { "mr-64": isRightSidebarOpen })}>
      {children}
    </div>
  );
}
