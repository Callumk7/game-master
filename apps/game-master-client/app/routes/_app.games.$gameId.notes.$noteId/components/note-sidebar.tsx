import { LinkDialog } from "~/components/link-dialog";
import { Button } from "~/components/ui/button";
import { ListBox, ListBoxHeader, ListBoxItem } from "~/components/ui/list-box";
import { useNoteData } from "~/routes/_app.games.$gameId.notes.$noteId._index/route";
import { useIsRightSidebarOpen } from "~/store/selection";

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
					<ListBoxItem key={note.id} href={`/games/${note.gameId}/notes/${note.id}`}>
						{note.name}
					</ListBoxItem>
				))}
				<ListBoxHeader>Outgoing</ListBoxHeader>
				{linkedNotes.outgoingLinks.map((note) => (
					<ListBoxItem key={note.id} href={`/games/${note.gameId}/notes/${note.id}`}>
						{note.name}
					</ListBoxItem>
				))}
			</ListBox>
			<ListBox aria-label="Linked character list">
				<ListBoxHeader>Characters</ListBoxHeader>
				{linkedChars.map((char) => (
					<ListBoxItem key={char.id} href={`/games/${char.gameId}/characters/${char.id}`}>
						{char.name}
					</ListBoxItem>
				))}
			</ListBox>
			<ListBox aria-label="Linked faction list">
				<ListBoxHeader>Factions</ListBoxHeader>
				{linkedFactions.map((faction) => (
					<ListBoxItem
						key={faction.id}
						href={`/games/${faction.gameId}/faction/${faction.id}`}
					>
						{faction.name}
					</ListBoxItem>
				))}
			</ListBox>
		</div>
	);
}
