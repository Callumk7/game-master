import {
	composeRenderProps,
	Button as RACButton,
	type ButtonProps as RACButtonProps,
} from "react-aria-components";
import { Link as RLink } from "@remix-run/react";
import { tv, type VariantProps } from "tailwind-variants";
import type { RemixLinkProps } from "@remix-run/react/dist/components";
import type { HTMLAttributes, ReactNode } from "react";
import { focusRing } from "../utils";

export interface ButtonProps extends RACButtonProps, VariantProps<typeof button> {}

const button = tv({
	extend: focusRing,
	base: "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition rounded-lg cursor-default",
	variants: {
		variant: {
			primary:
				"bg-primary-3 hover:bg-primary-6 pressed:bg-primary-7 text-grade-12 border border-primary-8 shadow-lg shadow-purple-800/10",
			secondary:
				"bg-grade-3 hover:bg-grade-6 pressed:bg-grade-7 text-grade-12 border border-grade-8",
			destructive:
				"bg-destructive-6 hover:bg-destructive-8 pressed:bg-destructive-9 text-grade-12 border border-destructive-8 shadow shadow-red-800/10",
			ghost:
				"hover:bg-grade-5 text-primary-11 hover:text-grade-12 border border-transparent pressed:text-primary-12 pressed:bg-grade-6",
			outline:
				"bg-grade-2 hover:bg-primary-3 pressed:bg-primary-4 text-grade-12 border border-grade-7",
			"hover-destructive":
				"bg-grade-2 hover:bg-destructive-6 pressed:bg-destructive-7 text-grade-12 border border-grade-7",
		},
		size: {
			sm: "h-9 px-3",
			md: "h-10 px-4 py-2",
			icon: "w-10 h-10",
			"icon-sm": "w-8 h-8",
		},
		isDisabled: {
			true: "bg-grade-6 text-grade-10 forced-colors:text-[GrayText] border-grade-3",
		},
	},
	defaultVariants: {
		variant: "primary",
		size: "md",
	},
});

export function Button(props: ButtonProps) {
	return (
		<RACButton
			{...props}
			className={composeRenderProps(props.className, (className, renderProps) =>
				button({ ...renderProps, variant: props.variant, size: props.size, className }),
			)}
		/>
	);
}

interface LinkProps
	extends RemixLinkProps,
		HTMLAttributes<HTMLAnchorElement>,
		VariantProps<typeof button> {
	children: ReactNode;
}
export function ButtonLink({ variant, className, ...props }: LinkProps) {
	return <RLink {...props} className={button({ variant: variant, className })} />;
}
