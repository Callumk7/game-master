import { cn } from "callum-util";
import type { HTMLProps } from "react";

interface ContainerProps extends HTMLProps<HTMLDivElement> {}

export function Container({ children, className, ...props }: ContainerProps) {
  return (
    <div className={cn(className, "space-y-2 p-4")} {...props}>
      {children}
    </div>
  );
}
