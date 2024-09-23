import { useState } from "react";
import { LinkDialog } from "~/components/link-dialog";
import { Button } from "~/components/ui/button";
import { ListBox, ListBoxHeader, ListBoxItem } from "~/components/ui/list-box";
import { useStateSync } from "~/hooks/state-sync";
import { useIsRightSidebarOpen } from "~/store/selection";
import type { BasicEntity } from "~/types/general";

interface NoteSidebarProps<T extends BasicEntity> {
	noteId: string;
	backlinks: T[];
	outgoingLinks: T[];
}
export function NoteSidebar<T extends BasicEntity>({
	noteId,
	backlinks,
	outgoingLinks,
}: NoteSidebarProps<T>) {
	const [bLinks, setBLinks] = useState(backlinks);
	const [oLinks, setOLinks] = useState(outgoingLinks);

	useStateSync(noteId, () => {
		setBLinks(backlinks);
		setOLinks(outgoingLinks);
	});

	const isRightSidebarOpen = useIsRightSidebarOpen();
	if (!isRightSidebarOpen) return null;

	return (
		<div className="w-64 h-full border-l fixed right-0 top-0 p-2 space-y-2 flex flex-col">
			<LinkDialog
				trigger={
					<Button size={"sm"} className={"place-self-end"}>
						Link
					</Button>
				}
				entityId={""}
				entityType={"note"}
				allNotes={[]}
				allChars={[]}
				allFactions={[]}
			/>
			<ListBox>
				<ListBoxHeader>Backlinks</ListBoxHeader>
				{bLinks.map((note) => (
					<ListBoxItem key={note.id} href={`games/${note.gameId}/notes/${note.id}`}>
						{note.name}
					</ListBoxItem>
				))}
				<ListBoxHeader>Outgoing</ListBoxHeader>
				{oLinks.map((note) => (
					<ListBoxItem key={note.id} href={`games/${note.gameId}/notes/${note.id}`}>
						{note.name}
					</ListBoxItem>
				))}
			</ListBox>
		</div>
	);
}
