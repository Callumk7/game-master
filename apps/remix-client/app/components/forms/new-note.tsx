import { Form } from "@remix-run/react";
import { TextEditor, useDefaultEditor } from "../tiptap";
import { Input } from "../ui/field";
import { Button } from "../ui/button";

interface AddNoteFormProps {
	action?: string;
	close?: () => void;
}
export function AddNoteForm({ action, close }: AddNoteFormProps) {
	const editor = useDefaultEditor("Start writing..");

	return (
		<Form
			method="POST"
			action={action}
			className="h-full"
			onSubmit={close ? () => close() : undefined}
		>
			<div className="relative flex flex-col gap-6 h-full">
				<Input
					defaultValue="Note Title.."
					type="text"
					name="name"
					className={"text-3xl font-semibold h-16 grow-0"}
				/>
				<TextEditor editor={editor} />
				{editor && <input type="hidden" value={editor.getHTML()} name="htmlContent" />}
				<Button type="submit" className={"absolute bottom-4"}>
					Create
				</Button>
			</div>
		</Form>
	);
}
