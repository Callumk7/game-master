import { Form } from "@remix-run/react";
import { TextField } from "../ui/text-field";
import { Button } from "../ui/button";

interface NewLocationFormProps {
	action?: string;
	close?: () => void;
}

export function NewLocationForm({ action, close }: NewLocationFormProps) {
	return (
		<Form
			className="flex flex-col gap-4 p-4"
			action={action ?? "/locations/new"}
			method="POST"
			onSubmit={close ? () => close() : undefined}
		>
			<TextField name="name" label="Location Name" />
			<TextField textarea name="description" label="Description" />
			<Button type="submit">Submit</Button>
		</Form>
	);
}
