import { CheckIcon } from "@radix-ui/react-icons";
import {
	ListBox as AriaListBox,
	ListBoxItem as AriaListBoxItem,
	type ListBoxProps as AriaListBoxProps,
	Collection,
	Header,
	type ListBoxItemProps,
	Section,
	type SectionProps,
	composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { composeTailwindRenderProps, focusRing } from "../utils";

interface ListBoxProps<T> extends Omit<AriaListBoxProps<T>, "layout" | "orientation"> {}

export function ListBox<T extends object>({ children, ...props }: ListBoxProps<T>) {
	return (
		<AriaListBox
			{...props}
			className={composeTailwindRenderProps(
				props.className,
				"outline-0 p-1 border border-grade-6 rounded-lg",
			)}
		>
			{children}
		</AriaListBox>
	);
}

export const itemStyles = tv({
	extend: focusRing,
	base: "group relative flex items-center gap-8 cursor-default select-none py-1.5 px-2.5 rounded-md will-change-transform text-sm forced-color-adjust-none",
	variants: {
		isSelected: {
			false: "text-grade-12 hover:bg-primary-3 -outline-offset-2",
			true: "bg-primary-10 text-white forced-colors:bg-[Highlight] forced-colors:text-[HighlightText] [&:has(+[data-selected])]:rounded-b-none [&+[data-selected]]:rounded-t-none -outline-offset-4 outline-white dark:outline-white forced-colors:outline-[HighlightText]",
		},
		isDisabled: {
			true: "text-grade-9 forced-colors:text-[GrayText]",
		},
	},
});

export function ListBoxItem(props: ListBoxItemProps) {
	const textValue =
		props.textValue || (typeof props.children === "string" ? props.children : undefined);
	return (
		<AriaListBoxItem {...props} textValue={textValue} className={itemStyles}>
			{composeRenderProps(props.children, (children) => (
				<>
					{children}
					<div className="absolute left-4 right-4 bottom-0 h-px bg-grade-6 forced-colors:bg-[HighlightText] hidden [.group[data-selected]:has(+[data-selected])_&]:block" />
				</>
			))}
		</AriaListBoxItem>
	);
}

export const dropdownItemStyles = tv({
	base: "group flex items-center gap-4 cursor-default select-none py-2 pl-3 pr-1 rounded-lg outline outline-0 text-sm forced-color-adjust-none",
	variants: {
		isDisabled: {
			false: "text-grade-11",
			true: "text-grade-9 forced-colors:text-[GrayText]",
		},
		isFocused: {
			true: "bg-primary-10 text-white forced-colors:bg-[Highlight] forced-colors:text-[HighlightText]",
		},
	},
});

export function DropdownItem(props: ListBoxItemProps) {
	const textValue =
		props.textValue || (typeof props.children === "string" ? props.children : undefined);
	return (
		<AriaListBoxItem {...props} textValue={textValue} className={dropdownItemStyles}>
			{composeRenderProps(props.children, (children, { isSelected }) => (
				<>
					<span className="flex flex-1 gap-2 items-center font-normal truncate group-selected:font-semibold">
						{children}
					</span>
					<span className="flex items-center w-5">
						{isSelected && <CheckIcon className="w-4 h-4" />}
					</span>
				</>
			))}
		</AriaListBoxItem>
	);
}

export interface DropdownSectionProps<T> extends SectionProps<T> {
	title?: string;
}

export function DropdownSection<T extends object>(props: DropdownSectionProps<T>) {
	return (
		<Section className="after:content-[ first:-mt-[5px]''] after:block after:h-[5px]">
			<Header className="text-sm font-semibold text-grade-11 px-4 py-1 truncate sticky -top-[5px] -mt-px -mx-1 z-10 backdrop-blur-md border-y dark:border-y-grade-6 [&+*]:mt-1">
				{props.title}
			</Header>
			<Collection items={props.items}>{props.children}</Collection>
		</Section>
	);
}
