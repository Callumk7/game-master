import type { HTMLAttributes, ReactNode } from "react";
import { tv } from "tailwind-variants";
import { EditableText } from "./editable-text";
import type { FormMethod } from "@remix-run/react";
import { INTENT } from "@repo/db";
import { cn } from "callum-util";

interface MainContainerProps extends HTMLAttributes<HTMLDivElement> {
	width?: "wide" | "max";
	top?: "none";
	bottom?: "none";
}

const containerStyles = tv({
	base: "mx-auto mt-12 mb-24",
	variants: {
		width: {
			default: "w-4/5",
			wide: "w-11/12",
			max: "w-full",
		},
		top: {
			gap: "mt-12",
			none: "mt-0",
		},
		bottom: {
			gap: "mb-24",
			none: "mb-0",
		},
	},
	defaultVariants: {
		width: "default",
		top: "gap",
		bottom: "gap",
	},
});

export function MainContainer({
	children,
	className,
	width,
	top,
	bottom,
	...props
}: MainContainerProps) {
	return (
		<main className={containerStyles({ width, top, bottom, className })} {...props}>
			{children}
		</main>
	);
}

export function Container({
	children,
	className,
	width,
	top,
	bottom,
	...props
}: MainContainerProps) {
	return (
		<div className={containerStyles({ width, top, bottom, className })} {...props}>
			{children}
		</div>
	);
}

interface EntityViewProps {
	children: ReactNode;
	menu?: ReactNode;
	margin?: boolean;
	top?: boolean;
	className?: string;
}

/**
 * This is simply adding vertical spacing. Nice.
 */
export function EntityView({ children, menu, margin, top, className }: EntityViewProps) {
	return (
		<>
			<div
				className={cn(
					`space-y-7 ${margin ? "w-11/12 mx-auto" : "w-full"} ${top && "mt-12"}`,
					className,
				)}
			>
				<div className="mb-6">{menu}</div>
				{children}
			</div>
		</>
	);
}

interface EntityHeaderProps {
	title: string;
	children?: ReactNode;
	updateTitleMethod?: FormMethod;
	updateTitleAction?: string;
	menu?: ReactNode;
}

/**
 * A component that has a pre-styled title, and room for children which
 * can be anything.
 */
export function EntityHeader({
	title,
	children,
	updateTitleMethod,
	updateTitleAction,
	menu,
}: EntityHeaderProps) {
	return (
		<div className="flex flex-col gap-1">
			<div className="flex gap-4 items-baseline">
				<EditableText
					fieldName={"name"}
					value={title}
					inputClassName={
						"text-5xl font-bold mb-5 font-tanker w-full focus:outline-none bg-inherit text-grade-12"
					}
					inputLabel={"note name input"}
					buttonClassName={"text-5xl font-bold font-tanker w-full mb-5 text-left"}
					buttonLabel={"note name button"}
					method={updateTitleMethod ? updateTitleMethod : "patch"}
					action={updateTitleAction}
				>
					<input type="hidden" name="intent" value={INTENT.UPDATE_NAME} />
				</EditableText>
				{menu}
			</div>
			{children}
		</div>
	);
}

interface EntityDescriptionProps {
	children: ReactNode;
}

/**
 * This is just some styling on a description that can be passed
 * to the heading (or anywhere).
 */
export function EntityDescription({ children }: EntityDescriptionProps) {
	return <p className="text-sm font-light leading-loose">{children}</p>;
}

interface SidebarLayoutProps {
	children: ReactNode;
	sidebar: ReactNode;
	isSidebarOpen: boolean;
}

export function SidebarLayout({ children, sidebar, isSidebarOpen }: SidebarLayoutProps) {
	return (
		<div className="flex">
			{isSidebarOpen && (
				<>
					<div className="w-full h-screen min-w-[15vw] max-w-56" />
					{sidebar}
				</>
			)}
			<div className="self-stretch w-full">{children}</div>
		</div>
	);
}

export function TwoColumnView({
	children,
	aside,
}: { children: ReactNode; aside: ReactNode }) {
	return (
		<div className="grid grid-cols-3 gap-4 w-full">
			<div className="col-span-2 space-y-4">{children}</div>
			<div className="pl-16 space-y-10 relative">{aside}</div>
		</div>
	);
}
