import { FormMethod, useFetcher } from "@remix-run/react";
import { ReactNode, useState, useRef, useEffect } from "react";
import { flushSync } from "react-dom";

interface EditableTextProps {
	children: ReactNode;
	fieldName: string;
	value: string | null;
	inputClassName: string;
	inputLabel: string;
	buttonClassName: string;
	buttonLabel: string;
	action?: string;
	method?: FormMethod;
}
export function EditableText({
	children,
	fieldName,
	value,
	inputClassName,
	inputLabel,
	buttonClassName,
	buttonLabel,
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
				className={inputClassName}
				onKeyDown={(event) => {
					if (event.key === "Escape") {
						flushSync(() => {
							setEdit(false);
						});
						buttonRef.current?.focus();
					}
				}}
				onBlur={(event) => {
					console.log("blur has happened");
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
			className={buttonClassName}
		>
			{value || <span className="text-slate-400 italic">Edit</span>}
		</button>
	);
}
