import { Form } from "@remix-run/react";
import { TextField } from "../ui/text-field";
import { Button } from "../ui/button";

interface NewCharacterFormProps {
	action?: string;
	close?: () => void;
}

export function NewCharacterForm({ action, close }: NewCharacterFormProps) {
	return (
		<Form
			className="flex flex-col gap-4 p-4"
			action={action ?? "characters/new"}
			method="POST"
			onSubmit={close ? () => close() : undefined}
		>
			<TextField name="name" label="Character Name" />
			<TextField name="raceId" label="Race" />
			<Button type="submit">Submit</Button>
		</Form>
	);
}
