import type { Id, Note } from "@repo/shared-types";
import { ListBox, ListBoxItem } from "~/components/ui/list-box";

interface GameSidebarProps {
	gameId: Id;
	notes: Note[];
}

export function GameSidebar({ gameId, notes }: GameSidebarProps) {
	return (
		<ListBox items={notes}>{(item) => <ListBoxItem>{item.name}</ListBoxItem>}</ListBox>
	);
}
