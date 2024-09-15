import { TrashIcon } from "@radix-ui/react-icons";
import { useSubmit } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Toolbar } from "~/components/ui/toolbar";

interface NoteToolbarProps {
	noteId: string;
}

export function NoteToolbar({ noteId }: NoteToolbarProps) {
	const submit = useSubmit();
	return (
		<Toolbar>
			<Button
				variant={"destructive"}
				size={"sm"}
				onPress={() => submit({}, { method: "delete" })}
			>
				<TrashIcon />
			</Button>
		</Toolbar>
	);
}
