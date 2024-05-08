import {
	FieldErrorProps,
	Group,
	GroupProps,
	InputProps,
	LabelProps,
	FieldError as RACFieldError,
	Input as RACInput,
	TextArea as RACTextArea,
	Label as RACLabel,
	Text,
	TextAreaProps,
	TextProps,
	composeRenderProps,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";
import { composeTailwindRenderProps, focusRing } from "../utils";

export function Label(props: LabelProps) {
	return (
		<RACLabel
			{...props}
			className={twMerge(
				"text-sm text-grade-10 font-medium cursor-default w-fit",
				props.className,
			)}
		/>
	);
}

export function Description(props: TextProps) {
	return (
		<Text
			{...props}
			slot="description"
			className={twMerge("text-sm text-grade-10", props.className)}
		/>
	);
}

export function FieldError(props: FieldErrorProps) {
	return (
		<RACFieldError
			{...props}
			className={composeTailwindRenderProps(
				props.className,
				"text-sm text-destructive-9 forced-colors:text-[Mark]",
			)}
		/>
	);
}

export const fieldBorderStyles = tv({
	variants: {
		isFocusWithin: {
			false: "border-grade-6 forced-colors:border-[ButtonBorder]",
			true: "border-grade-10 forced-colors:border-[Highlight]",
		},
		isInvalid: {
			true: "border-destructive-9 forced-colors:border-[Mark]",
		},
		isDisabled: {
			true: "border-grade-4 forced-colors:border-[GrayText]",
		},
	},
});

export const fieldGroupStyles = tv({
	extend: focusRing,
	base: "group flex items-center h-9 bg-grade-1 forced-colors:bg-[Field] border border-grade-6 rounded-lg overflow-hidden",
	variants: fieldBorderStyles.variants,
});

export function FieldGroup(props: GroupProps) {
	return (
		<Group
			{...props}
			className={composeRenderProps(props.className, (className, renderProps) =>
				fieldGroupStyles({ ...renderProps, className }),
			)}
		/>
	);
}

export function Input(props: InputProps) {
	return (
		<RACInput
			{...props}
			className={composeTailwindRenderProps(
				props.className,
				"px-2 py-1.5 flex-1 min-w-0 outline outline-0 bg-grade-1 text-sm text-grade-12 disabled:text-grade-10",
			)}
		/>
	);
}

export function TextArea(props: TextAreaProps) {
	return (
		<RACTextArea
			{...props}
			className={composeTailwindRenderProps(
				props.className,
				"px-2 py-1.5 flex-1 min-w-0 outline outline-0 bg-grade-1 text-sm text-grade-12 disabled:text-grade-10",
			)}
		/>
	);
}
