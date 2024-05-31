import { Form } from "@remix-run/react";
import { TextField } from "../ui/text-field";
import { Button } from "../ui/button";
import { useAppData } from "~/routes/_app/route";
import { ComboBox, ComboBoxItem } from "../ui/combobox";

interface NewCharacterFormProps {
	action?: string;
	close?: () => void;
}

export function NewCharacterForm({ action, close }: NewCharacterFormProps) {
	return (
		<Form
			className="flex flex-col gap-4 p-4"
			action={action ?? "/characters/new"}
			method="POST"
			onSubmit={close ? () => close() : undefined}
		>
			<TextField name="name" label="Character Name" />
			<RaceComboBox name="race" />
			<Button type="submit">Submit</Button>
		</Form>
	);
}

function RaceComboBox({ name }: { name: string }) {
	const { allRaces } = useAppData();
	return (
		<ComboBox items={allRaces} allowsCustomValue name={name} label="Race">
			{(item) => <ComboBoxItem>{item.name}</ComboBoxItem>}
		</ComboBox>
	);
}
