import { Form } from "@remix-run/react";
import { TextField } from "../ui/text-field";
import { Button } from "../ui/button";

interface NewFactionFormProps {
	action?: string;
	close?: () => void;
}
export function NewFactionForm({ action, close }: NewFactionFormProps) {
	return (
		<div className="mt-10">
			<Form
				method="POST"
				action={action ?? "/factions/new"}
				onSubmit={close ? () => close() : undefined}
			>
				<div className="flex flex-col gap-5">
					<TextField label="name" name="name" />
					<TextField textarea label="description" name="description" />
					<Button type="submit">Create</Button>
				</div>
			</Form>
		</div>
	);
}
