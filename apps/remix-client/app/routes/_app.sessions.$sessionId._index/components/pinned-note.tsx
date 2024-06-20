import { Form, useSubmit } from "@remix-run/react";
import { Card } from "~/components/card";
import { Header } from "~/components/typeography";
import { RenderHtml } from "~/components/render-html";
import { Select, SelectItem } from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { SewingPinIcon } from "@radix-ui/react-icons";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { useAppData } from "~/routes/_app/route";

export function PinnedNote({
	pinnedNoteId,
	sessionId,
}: { pinnedNoteId: string | null; sessionId: string }) {
	const { allNotes } = useAppData();
	const submit = useSubmit();
	const note = allNotes.find((note) => note.id === pinnedNoteId);

	if (!note) {
		return (
			<div className="max-w-md">
				<Form method="PATCH" className="flex gap-2 items-center">
					<Select name="pinnedNoteId" items={allNotes} placeholder="Select a note to pin">
						{(item) => <SelectItem>{item.name}</SelectItem>}
					</Select>
					<Button type="submit" size="icon-sm">
						<SewingPinIcon />
					</Button>
				</Form>
			</div>
		);
	}

	return (
		<div className="space-y-1">
			<p className="italic text-sm font-light text-amber-8">Pinned Note</p>
			<Card className="border-amber-6 relative">
				<Collapsible defaultOpen>
					<Button
						variant="secondary"
						size="sm"
						onPress={() => submit({ sessionId }, { method: "DELETE" })}
						className={"absolute top-2 right-2"}
					>
						Unlink
					</Button>
					<CollapsibleTrigger className="w-full">
						<div className="pb-6">
							<Header style="h2" tanker className="text-left">
								{note.name}
							</Header>
						</div>
					</CollapsibleTrigger>
					<CollapsibleContent>
						<RenderHtml content={note.htmlContent} />
					</CollapsibleContent>
				</Collapsible>
			</Card>
		</div>
	);
}
