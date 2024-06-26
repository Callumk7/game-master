import { useLocation } from "@remix-run/react";
import {
	Link as AriaLink,
	type LinkProps as AriaLinkProps,
	composeRenderProps,
} from "react-aria-components";
import { type VariantProps, tv } from "tailwind-variants";
import { focusRing } from "../utils";

interface LinkProps extends AriaLinkProps, VariantProps<typeof styles> {}

const styles = tv({
	extend: focusRing,
	base: "disabled:cursor-default rounded-lg font-semibold forced-colors:disabled:text-[GrayText] transition",
	variants: {
		variant: {
			primary: "text-primary-11 hover:text-primary-12",
			secondary: "text-grade-11 hover:text-grade-12",
			note: "text-jade-9 hover:text-jade-11",
		},
		size: {
			xs: "text-xs",
			sm: "text-sm",
			md: "text-base",
		},
		isActive: {
			true: "text-grade-12 bg-grade-5",
		},
	},
	defaultVariants: {
		variant: "primary",
		size: "md",
	},
});

export function Link(props: LinkProps) {
	return (
		<AriaLink
			{...props}
			className={composeRenderProps(props.className, (className, renderProps) =>
				styles({
					...renderProps,
					className,
					variant: props.variant,
					size: props.size,
				}),
			)}
		/>
	);
}

const navStyles = tv({
	extend: focusRing,
	base: "disabled:cursor-default py-1 rounded-lg forced-colors:disabled:text-[GrayText] transition",
	variants: {
		variant: {
			primary: "text-primary-11 hover:text-primary-12 pressed:text-amber-11",
			secondary: "text-grade-11 hover:text-grade-12",
			note: "text-jade-9 hover:text-jade-11",
			ghost:
				"hover:bg-grade-5 text-primary-11 hover:text-grade-12 border border-transparent pressed:text-primary-12 pressed:bg-grade-6",
		},
		size: {
			sm: "text-sm",
			md: "text-md",
			xs: "text-xs",
		},
		isActive: {
			true: "text-amber-12 font-medium hover:text-amber-12",
		},
	},
	defaultVariants: {
    variant: "primary",
		size: "md",
	},
});

export function NavLink(props: LinkProps) {
	const location = useLocation();
	const isActive = location.pathname === props.href;
	return (
		<AriaLink
			{...props}
			className={composeRenderProps(props.className, (className, renderProps) =>
				navStyles({
					...renderProps,
					className,
					variant: props.variant,
					size: props.size,
					isActive,
				}),
			)}
		/>
	);
}
