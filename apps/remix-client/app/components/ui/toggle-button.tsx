import {
	ToggleButton as RACToggleButton,
	ToggleButtonProps as RACToggleButtonProps,
	composeRenderProps,
} from "react-aria-components";
import { VariantProps, tv } from "tailwind-variants";
import { focusRing } from "../utils";

const styles = tv({
	extend: focusRing,
	base: "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition rounded-lg cursor-default",
	variants: {
		size: {
			sm: "h-9 px-3",
			md: "h-10 px-4 py-2",
			icon: "w-10 h-10",
			"icon-sm": "w-8 h-8",
		},
		isSelected: {
			false:
				"hover:bg-grade-5 text-grade-10 hover:text-grade-11 border border-transparent",
			true: "bg-grade-3 hover:bg-grade-6 pressed:bg-primary-7 text-grade-12 border border-transparent",
		},
		isDisabled: {
			true: "bg-gray-100 dark:bg-zinc-800 forced-colors:!bg-[ButtonFace] text-gray-300 dark:text-zinc-600 forced-colors:!text-[GrayText] border-black/5 dark:border-white/5 forced-colors:border-[GrayText]",
		},
	},
	defaultVariants: {
		size: "md",
	},
});

export interface ToggleButtonProps
	extends RACToggleButtonProps,
		VariantProps<typeof styles> {}

export function ToggleButton(props: ToggleButtonProps) {
	return (
		<RACToggleButton
			{...props}
			className={composeRenderProps(props.className, (className, renderProps) =>
				styles({ ...renderProps, size: props.size, className }),
			)}
		/>
	);
}
