import { DialogTrigger } from "react-aria-components";
import { Button } from "./ui/button";
import { Dialog } from "./ui/dialog";
import { SlideOver } from "./slideover";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { Tooltip } from "./ui/tooltip";
import { AddNoteForm } from "./forms/new-note";

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
					{({ close }) => <AddNoteForm action={action} close={close} />}
				</Dialog>
			</SlideOver>
		</DialogTrigger>
	);
}
