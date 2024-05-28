import {
	Menu as AriaMenu,
	MenuItem as AriaMenuItem,
	type MenuProps as AriaMenuProps,
	type MenuItemProps,
	Separator,
	type SeparatorProps,
	composeRenderProps,
} from "react-aria-components";
import {
	DropdownSection,
	type DropdownSectionProps,
	dropdownItemStyles,
} from "./list-box";
import { Popover, type PopoverProps } from "./popover";
import { CheckIcon } from "@radix-ui/react-icons";

interface MenuProps<T> extends AriaMenuProps<T> {
	placement?: PopoverProps["placement"];
}

export function Menu<T extends object>(props: MenuProps<T>) {
	return (
		<Popover placement={props.placement} className="min-w-[150px]">
			<AriaMenu
				{...props}
				className="max-h-[inherit] overflow-auto p-1 outline outline-0 [clip-path:inset(0_0_0_0_round_.75rem)]"
			/>
		</Popover>
	);
}

export function MenuItem(props: MenuItemProps) {
	return (
		<AriaMenuItem {...props} className={dropdownItemStyles}>
			{composeRenderProps(props.children, (children, { selectionMode, isSelected }) => (
				<>
					{selectionMode !== "none" && (
						<span className="flex items-center w-4">
							{isSelected && <CheckIcon aria-hidden className="w-4 h-4" />}
						</span>
					)}
					<span className="flex flex-1 gap-2 items-center font-normal group-selected:font-semibold truncate">
						{children}
					</span>
				</>
			))}
		</AriaMenuItem>
	);
}

export function MenuSeparator(props: SeparatorProps) {
	return (
		<Separator
			{...props}
			className="my-1 mx-3 border-b border-gray-300 dark:border-zinc-700"
		/>
	);
}

export function MenuSection<T extends object>(props: DropdownSectionProps<T>) {
	return <DropdownSection {...props} />;
}
