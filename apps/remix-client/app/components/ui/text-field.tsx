import {
	TextField as AriaTextField,
	TextFieldProps as AriaTextFieldProps,
	ValidationResult,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import {
	Description,
	FieldError,
	Input,
	TextArea,
	Label,
	fieldBorderStyles,
} from "./field";
import { composeTailwindRenderProps, focusRing } from "../utils";

const inputStyles = tv({
	extend: focusRing,
	base: "border rounded-md resize-none",
	variants: {
		isFocused: fieldBorderStyles.variants.isFocusWithin,
		...fieldBorderStyles.variants,
	}
});

export interface TextFieldProps extends AriaTextFieldProps {
	label?: string;
	description?: string;
	errorMessage?: string | ((validation: ValidationResult) => string);
	textarea?: boolean;
}

export function TextField({
	label,
	description,
	errorMessage,
	textarea = false,
	...props
}: TextFieldProps) {
	return (
		<AriaTextField
			{...props}
			className={composeTailwindRenderProps(props.className, "flex flex-col gap-1")}
		>
			{label && <Label>{label}</Label>}
			{textarea ? (
				<TextArea className={inputStyles} />
			) : (
				<Input className={inputStyles} />
			)}
			{description && <Description>{description}</Description>}
			<FieldError>{errorMessage}</FieldError>
		</AriaTextField>
	);
}
