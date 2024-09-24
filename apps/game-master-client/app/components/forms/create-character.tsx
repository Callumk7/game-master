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

interface CreateCharacterProps {
	gameId: string;
}

export function CreateCharacterSlideover({ gameId }: CreateCharacterProps) {
	return (
		<DialogTrigger>
			<Button variant="outline">Create Character</Button>
			<DialogOverlay>
				<DialogContent side="right" className="sm:max-w-[425px]">
					{({ close }) => (
						<div className="max-h-[95vh] overflow-y-auto">
							<DialogHeader>
								<DialogTitle>Create Character</DialogTitle>
							</DialogHeader>
							<CreateCharacterForm gameId={gameId} close={close} />
						</div>
					)}
				</DialogContent>
			</DialogOverlay>
		</DialogTrigger>
	);
}

interface CreateCharacterFormProps {
	gameId: string;
  close?: () => void;
}

export function CreateCharacterForm({ gameId, close }: CreateCharacterFormProps) {
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
			<div className="grid gap-4 py-4 px-1">
				<JollyTextField
					autoFocus
					value={name}
					onInput={(e) => setName(e.currentTarget.value)}
					label="Name"
					isRequired
				/>
				<EditorWithControls editor={editor} bordered label="Description" />
			</div>
			<DialogFooter>
				<Button onPress={close} type="submit">
					Save
				</Button>
			</DialogFooter>
		</Form>
	);
}
