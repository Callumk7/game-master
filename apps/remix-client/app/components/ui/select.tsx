import {
	Select as AriaSelect,
	SelectProps as AriaSelectProps,
	Button,
	ListBox,
	ListBoxItemProps,
	SelectValue,
	ValidationResult,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { Description, FieldError, Label } from "./field";
import { DropdownItem, DropdownSection, DropdownSectionProps } from "./list-box";
import { Popover } from "./popover";
import { composeTailwindRenderProps, focusRing } from "~/utils";
import { ChevronDownIcon } from "@radix-ui/react-icons";

const styles = tv({
	extend: focusRing,
	base: "flex items-center text-start gap-4 w-full cursor-default border border-grade-6 rounded-lg pl-3 pr-2 py-2 min-w-[150px] transition bg-grade-4",
	variants: {
		isDisabled: {
			false:
				"text-grade-11 hover:bg-grade-3 pressed:bg-grade-2 group-invalid:border-destructive-8 forced-colors:group-invalid:border-[Mark]",
			true: "text-grade-10 forced-colors:text-[GrayText] forced-colors:border-[GrayText]",
		},
	},
});

export interface SelectProps<T extends object>
	extends Omit<AriaSelectProps<T>, "children"> {
	label?: string;
	description?: string;
	errorMessage?: string | ((validation: ValidationResult) => string);
	items?: Iterable<T>;
	children: React.ReactNode | ((item: T) => React.ReactNode);
}

export function Select<T extends object>({
	label,
	description,
	errorMessage,
	children,
	items,
	...props
}: SelectProps<T>) {
	return (
		<AriaSelect
			{...props}
			className={composeTailwindRenderProps(props.className, "group flex flex-col gap-1")}
		>
			{label && <Label>{label}</Label>}
			<Button className={styles}>
				<SelectValue className="flex-1 text-sm placeholder-shown:italic" />
				<ChevronDownIcon
					aria-hidden
					className="w-4 h-4 text-grade-9 forced-colors:text-[ButtonText] group-disabled:text-grade-9 forced-colors:group-disabled:text-[GrayText]"
				/>
			</Button>
			{description && <Description>{description}</Description>}
			<FieldError>{errorMessage}</FieldError>
			<Popover className="min-w-[--trigger-width]">
				<ListBox
					items={items}
					className="outline-none p-1 max-h-[inherit] overflow-auto [clip-path:inset(0_0_0_0_round_.75rem)]"
				>
					{children}
				</ListBox>
			</Popover>
		</AriaSelect>
	);
}

export function SelectItem(props: ListBoxItemProps) {
	return <DropdownItem {...props} />;
}

export function SelectSection<T extends object>(props: DropdownSectionProps<T>) {
	return <DropdownSection {...props} />;
}
