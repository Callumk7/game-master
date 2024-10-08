import { cva, type VariantProps } from "class-variance-authority";
import { type FormMethod, useFetcher } from "@remix-run/react";
import { type ReactNode, useState, useRef, useEffect } from "react";
import { flushSync } from "react-dom";
import { cn } from "callum-util";

const typographyVariants = cva("font-medium", {
	variants: {
		variant: {
			h1: "text-4xl font-bold",
			h2: "text-3xl font-semibold",
			h3: "text-2xl",
			h4: "text-xl",
			p: "text-base",
			label: "text-muted-foreground text-[0.8rem]",
		},
		weight: {
			normal: "font-normal",
      semi: "font-semibold",
			bold: "font-bold",
		},
		italic: {
			true: "italic",
		},
	},
	defaultVariants: {
		variant: "p",
		weight: "normal",
	},
});

interface TypographyProps
	extends React.HTMLAttributes<
			HTMLHeadingElement | HTMLParagraphElement | HTMLLabelElement
		>,
		VariantProps<typeof typographyVariants> {
	children: React.ReactNode;
}

export const Text: React.FC<TypographyProps> = ({
	variant,
	weight,
	italic,
	className,
	children,
	...props
}) => {
	const Component = variant || "p";

	return (
		<Component
			className={typographyVariants({ variant, weight, italic, className })}
			{...props}
		>
			{children}
		</Component>
	);
};

interface EditableTextProps extends VariantProps<typeof typographyVariants> {
	children?: ReactNode;
	fieldName: string;
	value: string | null;
	inputLabel: string;
	buttonLabel: string;
	action?: string;
	method?: FormMethod;
	className?: string;
}
export function EditableText({
	children,
	fieldName,
	value,
	inputLabel,
	buttonLabel,
	variant,
	weight,
	italic,
	className,
	action,
	method,
}: EditableTextProps) {
	const fetcher = useFetcher();
	const [edit, setEdit] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);

	// optimistic update
	if (fetcher.formData?.has(fieldName)) {
		value = String(fetcher.formData.get(fieldName));
	}

	// auto resize text area
	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.style.height = "auto";
			inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
			// Add a few pixels to the height to prevent vertical scrollbars from appearing
			const offset = 1.5; // pixels to add, adjust as necessary
			inputRef.current.style.height = `${inputRef.current.scrollHeight + offset}px`;
		}
	});

	return edit ? (
		<fetcher.Form
			method={method}
			action={action}
			onSubmit={(event) => {
				event.preventDefault();
				flushSync(() => {
					setEdit(false);
					fetcher.submit(event.currentTarget, { method: method });
				});
				buttonRef.current?.focus();
			}}
		>
			{children}
			<input
				required
				ref={inputRef}
				aria-label={inputLabel}
				name={fieldName}
				defaultValue={value ?? ""}
				className={cn(
					"bg-background text-foreground w-full p-2 pl-0 rounded-md focus:outline-none focus:ring-1 focus:ring-primary",
					typographyVariants({ variant, weight, italic, className }),
				)}
				onKeyDown={(event) => {
					if (event.key === "Escape") {
						flushSync(() => {
							setEdit(false);
						});
						buttonRef.current?.focus();
					}
				}}
				onBlur={(event) => {
					if (
						inputRef.current?.value !== value &&
						inputRef.current?.value.trim() !== ""
					) {
						fetcher.submit(event.currentTarget.form, { method: method });
					}
					setEdit(false);
				}}
			/>
		</fetcher.Form>
	) : (
		<button
			aria-label={buttonLabel}
			type="button"
			ref={buttonRef}
			onClick={() => {
				flushSync(() => {
					setEdit(true);
				});
				inputRef.current?.select();
			}}
			className={cn(
				"p-2 pl-0 w-full rounded-md text-left focus:outline-none focus:ring-1 focus:ring-primary",
				typographyVariants({ variant, weight, italic, className }),
			)}
		>
			{value || <span className="italic text-slate-400">Edit</span>}
		</button>
	);
}
