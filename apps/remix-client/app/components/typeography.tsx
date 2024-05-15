import { Link } from "@remix-run/react";
import { ReactNode } from "react";
import { VariantProps, tv } from "tailwind-variants";

export const typeStyles = tv({
	variants: {
		style: {
			h1: "text-3xl font-bold mb-5",
			h2: "text-2xl font-semibold",
			h3: "text-lg font-semibold",
			h4: "font-semibold text-primary-11",
			h5: "text-sm font-semibold text-grade-11",
			label: "text-xs font-semibold text-grade-11",
			prose: "prose prose-invert max-w-none",
		},
		colour: {
			base: "text-grade-12",
			primary: "text-primary-12",
			amber: "text-amber-12",
			warning: "text-destructive-10",
			muted: "text-grade-10",
		},
		link: {
			primary: "text-primary-10 hover:text-primary-11",
		},
	},
	defaultVariants: {
		colour: "base",
		style: "h1",
	},
});

interface HeaderProps extends VariantProps<typeof typeStyles> {
	children: ReactNode;
	className?: string;
}

export function Header({ className, style, colour, children }: HeaderProps) {
	return <h1 className={typeStyles({ className, style, colour })}>{children}</h1>;
}

interface HeaderLinkProps extends HeaderProps {
	to: string;
}
export function HeaderLink({ className, style, link, children, to }: HeaderLinkProps) {
	return (
		<Link to={to} className={typeStyles({ className, style, link })}>
			{children}
		</Link>
	);
}
