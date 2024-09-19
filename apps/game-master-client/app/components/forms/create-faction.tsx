import { Form, useSubmit } from "@remix-run/react";
import { type FormEventHandler, useState } from "react";
import { EditorWithControls, useDefaultEditor } from "~/components/editor";
import { Button } from "~/components/ui/button";
import {
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogOverlay,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import { JollyTextField } from "~/components/ui/textfield";

interface CreateFactionSlideoverProps {
	gameId: string;
}

export function CreateFactionSlideover({ gameId }: CreateFactionSlideoverProps) {
	return (
		<DialogTrigger>
			<Button variant="outline">Create Faction</Button>
			<DialogOverlay>
				<DialogContent side="right" className="sm:max-w-[425px]">
					{({ close }) => (
						<div className="max-h-[95vh] overflow-y-auto">
							<DialogHeader>
								<DialogTitle>Create Faction</DialogTitle>
							</DialogHeader>
							<CreateFactionForm gameId={gameId} />
						</div>
					)}
				</DialogContent>
			</DialogOverlay>
		</DialogTrigger>
	);
}

interface CreateFactionFormProps {
	gameId: string;
  close?: () => void;
}

export function CreateFactionForm({ gameId, close }: CreateFactionFormProps) {
	const editor = useDefaultEditor();

	const [name, setName] = useState("");

	const submit = useSubmit();

	const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();
		if (!editor) {
			alert("No editor!"); // TODO: ????
			return null;
		}

		const content = editor.getText();
		const htmlContent = editor.getHTML();

		submit({ content, htmlContent, name, gameId }, { method: "post" });
	};

	return (
		<Form method="post" onSubmit={handleSubmit}>
			<div className="grid gap-4 py-4">
				<JollyTextField
					autoFocus
					value={name}
					onInput={(e) => setName(e.currentTarget.value)}
					label="Faction Name"
					isRequired
				/>
				<EditorWithControls editor={editor} bordered label="Background" />
			</div>
			<DialogFooter>
				<Button onPress={close} type="submit">
					Save
				</Button>
			</DialogFooter>
		</Form>
	);
}
