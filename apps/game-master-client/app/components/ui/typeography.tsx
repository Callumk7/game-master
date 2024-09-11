import { cva, type VariantProps } from "class-variance-authority";

const typographyVariants = cva("", {
  variants: {
    variant: {
      h1: "text-4xl font-bold",
      h2: "text-3xl font-semibold",
      h3: "text-2xl font-medium",
      h4: "text-xl font-medium",
      p: "text-base",
    },
    weight: {
      normal: "font-normal",
      bold: "font-bold",
    },
    italic: {
      true: "italic",
    },
  },
  defaultVariants: {
    variant: "p",
    weight: "normal",
  },
});

interface TypographyProps
  extends React.HTMLAttributes<HTMLHeadingElement | HTMLParagraphElement>,
  VariantProps<typeof typographyVariants> {
  children: React.ReactNode;
}

export const Text: React.FC<TypographyProps> = ({
  variant,
  weight,
  italic,
  className,
  children,
  ...props
}) => {
  const Component = variant || "p";

  return (
    <Component
      className={typographyVariants({ variant, weight, italic, className })}
      {...props}
    >
      {children}
    </Component>
  );
};
