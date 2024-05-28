import {
	Popover as AriaPopover,
	type PopoverProps as AriaPopoverProps,
} from "react-aria-components";
import type { ReactNode } from "react";
import { cn } from "callum-util";

export interface PopoverProps extends Omit<AriaPopoverProps, "children"> {
	children: ReactNode;
}

export function Popover({ children, className, ...props }: PopoverProps) {
	return (
		<AriaPopover
			offset={8}
			{...props}
			className={(values) =>
				cn(
					"z-50 overflow-y-auto rounded-md border border-grade-6 backdrop-blur-2xl backdrop-saturate-200 bg-grade-1/10 text-grade-11 shadow-md outline-none data-[entering]:animate-in data-[exiting]:animate-out data-[entering]:fade-in-0 data-[exiting]:fade-out-0 data-[exiting]:zoom-out-95 data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2",
					typeof className === "function" ? className(values) : className,
				)
			}
		>
			{children}
		</AriaPopover>
	);
}
