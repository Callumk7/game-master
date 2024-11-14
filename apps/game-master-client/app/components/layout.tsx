import { cn } from "callum-util";
import { type VariantProps, cva } from "class-variance-authority";
import type { HTMLAttributes, ReactNode } from "react";

const layoutVariants = cva("mx-auto", {
  variants: {
    padding: {
      default: "p-2 pt-4",
      none: "p-0",
    },
    grid: {
      two: "grid grid-cols-2",
      four: "grid grid-cols-4",
      none: "",
    },
    width: {
      default: "max-w-4xl",
      wide: "w-11/12",
      mid: "w-4/5",
      full: "w-full",
    },
  },
  defaultVariants: {
    padding: "default",
    width: "default",
    grid: "none",
  },
});

interface LayoutProps
  extends HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof layoutVariants> { }

export function Layout({
  padding,
  className,
  children,
  grid,
  width,
  ...props
}: LayoutProps) {
  return (
    <div className={cn(className, layoutVariants({ padding, grid, width }))} {...props}>
      {children}
    </div>
  );
}

interface MainGridProps extends HTMLAttributes<HTMLDivElement> { }

export function MainGrid({ children, className, ...props }: MainGridProps) {
  return (
    <div className={cn(className, "col-span-3")} {...props}>
      {children}
    </div>
  );
}

interface SideGridProps extends HTMLAttributes<HTMLDivElement> { }

export function SideGrid({ children, className, ...props }: SideGridProps) {
  return (
    <div className={cn(className, "col-span-1")} {...props}>
      {children}
    </div>
  );
}

interface EntityLayoutProps {
  children: ReactNode;
  aside: ReactNode;
  asideWidth?: number;
}

export function EntityLayout({
  children,
  aside,
  asideWidth = 40,
}: EntityLayoutProps) {
  const asideMarginClass = `ml-${asideWidth + 4}`;
  const asideWidthClass = `w-${asideWidth}`;
  return (
    <div className="flex">
      <div className={`${asideWidthClass} fixed border-r`}>{aside}</div>
      <div className={`flex-1 ${asideMarginClass}`}>{children}</div>
    </div>
  );
}
