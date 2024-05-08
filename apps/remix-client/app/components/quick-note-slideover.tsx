import { DialogTrigger, Group } from "react-aria-components";
import { Button } from "./ui/button";
import { Dialog } from "./ui/dialog";
import { useFetcher } from "@remix-run/react";
import { SlideOver } from "./slideover";
import { Input } from "./ui/field";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { TextEditor, useDefaultEditor } from "./tiptap";
import { Tooltip } from "./ui/tooltip";

interface QuickNoteSlideOverProps {
	action?: string;
	size?: "wide" | "half" | "narrow";
}

export function QuickNoteSlideOver({ action, size }: QuickNoteSlideOverProps) {
	return (
		<DialogTrigger>
			<Tooltip content="Add Note">
				<Button size="icon-sm">
					<Pencil2Icon />
				</Button>
			</Tooltip>
			<SlideOver isDismissable size={size}>
				<Dialog className="h-full">
					<AddNoteForm action={action} />
				</Dialog>
			</SlideOver>
		</DialogTrigger>
	);
}

interface AddNoteFormProps {
	action?: string;
}

// why do we need to provide the action if its always the same?
// The idea was to have different actions for notes that are associated
// to different entities I think
export function AddNoteForm({ action }: AddNoteFormProps) {
	const editor = useDefaultEditor("Start writing..");
	const fetcher = useFetcher();

	return (
		<fetcher.Form method="POST" action={action} className="h-full">
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
		</fetcher.Form>
	);
}
