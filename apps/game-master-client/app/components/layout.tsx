import { HTMLAttributes, ReactNode } from "react";
import { tv } from "tailwind-variants";
import { EditableText } from "./editable-text";
import { FormMethod } from "@remix-run/react";
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
	margin?: boolean;
	top?: boolean;
	className?: string;
}

/**
 * This is simply adding vertical spacing.
 */
export function EntityView({ children, margin, top, className }: EntityViewProps) {
	return (
		<div
			className={cn(
				`space-y-7 ${margin ? "w-11/12 mx-auto" : "w-full"} ${top && "mt-12"}`,
				className,
			)}
		>
			{children}
		</div>
	);
}

interface EntityHeaderProps {
	title: string;
	children?: ReactNode;
	updateTitleMethod?: FormMethod;
	updateTitleAction?: string;
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
}: EntityHeaderProps) {
	return (
		<div className="flex flex-col gap-3">
			<EditableText
				fieldName={"name"}
				value={title}
				inputClassName={
					"text-3xl font-bold mb-5 focus:outline-none bg-inherit text-grade-12"
				}
				inputLabel={"note name input"}
				buttonClassName={"text-3xl font-bold mb-5 text-left"}
				buttonLabel={"note name button"}
				method={updateTitleMethod ? updateTitleMethod : "patch"}
				action={updateTitleAction}
			>
				<input type="hidden" name="intent" value={"UPDATE_NAME"} />
			</EditableText>
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
	return <p className="font-light text-sm leading-loose">{children}</p>;
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
					<div className="min-w-[15vw] max-w-56 h-screen w-full" />
					{sidebar}
				</>
			)}
			<div className="self-stretch w-full">{children}</div>
		</div>
	);
}
