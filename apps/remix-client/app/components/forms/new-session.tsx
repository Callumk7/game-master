import { Form } from "@remix-run/react";
import { TextField } from "../ui/text-field";
import { NumberField } from "../ui/number-field";
import { Button } from "../ui/button";

interface NewSessionFormProps {
	action?: string;
	close?: () => void;
}

export function NewSessionForm({ action, close }: NewSessionFormProps) {
	return (
		<Form
			method="POST"
			action={action ?? "/sessions/new"}
			onSubmit={close ? () => close() : undefined}
		>
			<div className="flex flex-col gap-5">
				<TextField label="name" name="name" isRequired />
				<NumberField name="session_number" label="session number" />
				<TextField textarea label="description" name="description" />
				<Button type="submit">Create</Button>
			</div>
		</Form>
	);
}
