import type { BasicEntity } from "@repo/api";
import { LinkDialog } from "~/components/link-dialog";
import { Button } from "~/components/ui/button";
import { ListBox, ListBoxHeader, ListBoxItem } from "~/components/ui/list-box";
import { useIsRightSidebarOpen } from "~/store/selection";
import { useNoteData } from "../route";

export function NoteSidebar() {
	const { linkedNotes, linkedChars, linkedFactions } = useNoteData();

	const isRightSidebarOpen = useIsRightSidebarOpen();
	if (!isRightSidebarOpen) return null;

	return (
		<div className="w-64 h-full border-l fixed right-0 top-0 p-2 space-y-2 flex flex-col">
			<LinkDialog
				linkedNotes={[...linkedNotes.backLinks, ...linkedNotes.outgoingLinks]}
				linkedChars={linkedChars}
				linkedFactions={linkedFactions}
				trigger={
					<Button size={"sm"} className={"place-self-end"}>
						Link
					</Button>
				}
			/>
			<ListBox aria-label="Linked notes list">
				<ListBoxHeader>Backlinks</ListBoxHeader>
				{linkedNotes.backLinks.map((note) => (
					<ListBoxItem key={note.id} href={`games/${note.gameId}/notes/${note.id}`}>
						{note.name}
					</ListBoxItem>
				))}
				<ListBoxHeader>Outgoing</ListBoxHeader>
				{linkedNotes.outgoingLinks.map((note) => (
					<ListBoxItem key={note.id} href={`games/${note.gameId}/notes/${note.id}`}>
						{note.name}
					</ListBoxItem>
				))}
			</ListBox>
		</div>
	);
}
