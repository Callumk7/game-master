import { cn } from "callum-util";
import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";

const pillVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow",
        secondary: "bg-secondary text-secondary-foreground",
      },
      size: {
        default: "text-sm h-7 px-3 py-1",
        xs: "text-xs h-5 px-2 py-1"
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

interface PillProps extends VariantProps<typeof pillVariants> {
  children: ReactNode;
  className?: string;
}

export function Pill({ children, variant, size, className }: PillProps) {
  return (
    <span
      className={cn(
        pillVariants({
          variant,
          size,
          className,
        }),
      )}
    >
      {children}
    </span>
  );
}
