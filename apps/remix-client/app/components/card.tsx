import { cn } from "callum-util";
import { HTMLAttributes } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { Link } from "@remix-run/react";

const card = tv({
	base: "border border-grade-6 p-3 rounded-md",
	variants: {
		size: {
			sm: "w-20",
			md: "w-36",
			lg: "w-44",
			xl: "w-80",
		},
	},
});

interface CardProps extends VariantProps<typeof card>, HTMLAttributes<HTMLAnchorElement> {
	href?: string;
}

export function Card({ children, size, className, href, ...props }: CardProps) {
	if (href) {
		return (
			<Link
				to={href}
				{...props}
				className={cn(
					card({ size, className }),
					"hover:bg-primary-4 transition-colors ease-in-out",
				)}
			>
				{children}
			</Link>
		);
	}
	return <div className={card({ size, className })}>{children}</div>;
}
